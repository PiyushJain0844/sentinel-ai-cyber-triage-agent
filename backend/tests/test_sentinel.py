import pytest
import os
import json

os.environ["DATABASE_PATH"] = "test_sentinel.db"

from backend.database.db import init_db, reset_db
from backend.services.orchestrator import orchestrator
from backend.agents import (
    monitoring_agent,
    detection_agent,
    correlation_agent,
    investigation_agent,
    response_agent,
    verification_agent,
    ALL_AGENTS
)
from backend.routes import auth, dashboard, events, incidents, investigation, responses, verification, simulation, settings as settings_route
from backend.schemas.schemas import ActionApprovalRequest, VerificationRequest, SecurityEventCreate

@pytest.fixture(autouse=True)
def clean_db():
    init_db()
    reset_db()
    yield
    reset_db()

def test_settings_status():
    status = settings_route.get_system_settings_status()
    assert status["project_name"] == "SENTINEL AI"
    assert status["agents"]["count"] == 6

def test_log_monitoring_normalization():
    raw_log = {
        "timestamp": "2026-11-18T10:02:00Z",
        "source_ip": "198.51.100.42",
        "username": "sarah.connor",
        "action": "FAILED_LOGIN_BURST",
        "status": "FAILURE",
        "severity": "HIGH",
        "details": {"attempt_count": 15}
    }
    evts = monitoring_agent.process_logs([raw_log])
    assert len(evts) == 1
    assert evts[0]["is_suspicious"] is True
    assert evts[0]["username"] == "sarah.connor"
    assert evts[0]["source_ip"] == "198.51.100.42"

def test_threat_detection_rules_and_scoring():
    event = {
        "id": "EVT-TEST-01",
        "timestamp": "2026-11-18T10:02:00Z",
        "source_ip": "198.51.100.42",
        "username": "sarah.connor",
        "device_id": "WS-01",
        "action": "FAILED_LOGIN_BURST",
        "status": "FAILURE",
        "severity": "HIGH",
        "details": {"attempt_count": 15}
    }
    alerts = detection_agent.process_events([event])
    assert len(alerts) >= 1
    assert alerts[0]["category"] == "Credential Access"
    assert alerts[0]["risk_score"] >= 70
    assert "T1110" in alerts[0]["mitre_technique"]

def test_alert_correlation_and_attack_graph():
    alerts = [
        {
            "id": "ALT-01",
            "title": "Failed Logins",
            "description": "15 failed logins",
            "severity": "HIGH",
            "risk_score": 80,
            "category": "Credential Access",
            "mitre_technique": "T1110",
            "event_id": "EVT-01",
            "source_ip": "198.51.100.42",
            "username": "sarah.connor",
            "device_id": "WS-01",
            "timestamp": "2026-11-18T10:02:00Z"
        },
        {
            "id": "ALT-02",
            "title": "Unfamiliar IP Login",
            "description": "Login from Europe",
            "severity": "HIGH",
            "risk_score": 85,
            "category": "Initial Access",
            "mitre_technique": "T1078",
            "event_id": "EVT-02",
            "source_ip": "198.51.100.42",
            "username": "sarah.connor",
            "device_id": "WS-01",
            "timestamp": "2026-11-18T10:05:00Z"
        }
    ]
    incs = correlation_agent.correlate_alerts(alerts)
    assert len(incs) == 1
    inc = incs[0]
    assert inc["primary_entity_value"] == "sarah.connor"
    assert inc["alert_count"] == 2
    assert "nodes" in inc["attack_graph"]
    assert "edges" in inc["attack_graph"]
    assert len(inc["attack_graph"]["nodes"]) >= 3
    # Verify node data contains event_id for interactive inspection
    assert any("event_id" in n["data"] for n in inc["attack_graph"]["nodes"])

def test_evidence_first_investigation_report():
    res = orchestrator.load_sample_attack_scenario()
    assert res["events_processed"] > 0
    assert res["incidents_created"] >= 1
    
    incident_id = res["incidents"][0]["id"]
    report = investigation.trigger_investigation(incident_id)
    assert report is not None
    assert report.incident_id == incident_id
    assert len(report.findings) > 0
    # USP 1: Traceable evidence event_ids
    for finding in report.findings:
        assert len(finding.event_ids) > 0
        assert finding.event_ids[0].startswith("EVT-")
    assert len(report.attack_timeline) > 0

def test_response_approval_rejection_and_simulation():
    res = orchestrator.load_sample_attack_scenario()
    incident_id = res["incidents"][0]["id"]
    actions = responses.get_responses()
    assert len(actions) >= 2
    
    act1 = actions[0]
    act2 = actions[1]

    # Test rejection with default and explicit reason
    rej_res = responses.reject_response(act2.id, ActionApprovalRequest(decision_by="Test Analyst", rejection_reason="Not needed"))
    assert rej_res.status == "REJECTED"

    # Test approval
    app_res = responses.approve_response(act1.id, ActionApprovalRequest(decision_by="Senior Analyst"))
    assert app_res.status == "APPROVED"

    # Test execution simulation
    exec_res = responses.execute_response(act1.id)
    assert exec_res.status == "EXECUTED"
    assert exec_res.simulation_result is not None

def test_closed_loop_verification_success():
    res = orchestrator.load_sample_attack_scenario()
    incident_id = res["incidents"][0]["id"]
    actions = responses.get_responses()
    act1 = actions[0]

    # Approve & execute
    responses.approve_response(act1.id, ActionApprovalRequest(decision_by="Lead SOC"))
    responses.execute_response(act1.id)

    # Verify successfully
    vdata = verification.perform_verification(act1.id, VerificationRequest(simulate_failure=False))
    assert vdata.verification_status == "VERIFIED_CONTAINED"
    assert vdata.incident_status == "THREAT_CONTAINED"

    # Verify that response_actions was updated to VERIFIED in database
    refreshed_actions = responses.get_responses()
    refreshed_act1 = next(a for a in refreshed_actions if a.id == act1.id)
    assert refreshed_act1.status == "VERIFIED"

def test_closed_loop_verification_failure_reopening():
    res = orchestrator.load_sample_attack_scenario()
    incident_id = res["incidents"][0]["id"]
    actions = responses.get_responses()
    act1 = actions[0]

    # Approve & execute
    responses.approve_response(act1.id, ActionApprovalRequest(decision_by="Lead SOC"))
    responses.execute_response(act1.id)

    # Verify with simulated failure
    vdata = verification.perform_verification(act1.id, VerificationRequest(simulate_failure=True, analyst_notes="Adversary beacon still pulsing"))
    assert vdata.verification_status == "VERIFICATION_FAILED"
    # USP 3: Incident reopened
    assert vdata.incident_status == "REOPENED_INVESTIGATION_REQUIRED"

    # Verify that response_actions was updated to FAILED in database
    refreshed_actions = responses.get_responses()
    refreshed_act1 = next(a for a in refreshed_actions if a.id == act1.id)
    assert refreshed_act1.status == "FAILED"

def test_all_six_agents_status():
    agents = ALL_AGENTS
    assert len(agents) == 6
    names = [a.name for a in agents.values()]
    assert "Log Monitoring Agent" in names
    assert "Threat Detection Agent" in names
    assert "Alert Correlation Agent" in names
    assert "Investigation Agent" in names
    assert "Response Agent" in names
    assert "Verification Agent" in names

def test_dashboard_stats_endpoint():
    orchestrator.load_sample_attack_scenario()
    stats = dashboard.get_dashboard_stats()
    assert stats.total_events > 0
    assert stats.active_incidents >= 1
    assert len(stats.events_over_time) > 0
    assert len(stats.severity_distribution) > 0
    assert len(stats.recent_activity) > 0

def test_events_filtering_and_ingestion():
    orchestrator.load_sample_attack_scenario()
    
    # Filter by severity
    critical_events = events.get_events(severity="CRITICAL", event_type="ALL", search=None, limit=50)
    assert len(critical_events) > 0
    assert all(e.severity == "CRITICAL" for e in critical_events)

    # Search keyword by username
    searched = events.get_events(severity="ALL", event_type="ALL", search="sarah", limit=50)
    assert len(searched) > 0
    assert any("sarah" in (e.username or "").lower() for e in searched)

    # Search by event ID directly
    first_id = critical_events[0].id
    by_search_id = events.get_events(search=first_id, limit=10)
    assert len(by_search_id) > 0
    assert any(e.id == first_id for e in by_search_id)

    # Direct primary key lookup by ID
    exact_evt = events.get_event_by_id(first_id)
    assert exact_evt.id == first_id

    # Ingest new custom single event (test single object ingestion)
    new_evt = SecurityEventCreate(
        timestamp="2026-11-18T10:20:00Z",
        source_ip="192.168.1.50",
        username="john.doe",
        event_type="NETWORK_FLOW",
        action="CONNECT",
        status="SUCCESS",
        severity="LOW"
    )
    res = events.ingest_events(new_evt)
    assert res["status"] == "success"

def test_authentication_flow():
    # 1. Valid login with demo analyst (Role: Senior SOC Lead Analyst)
    login_req = auth.LoginRequest(
        email="analyst@sentinel.cyber",
        password="Sentinel@2026!",
        remember_me=True
    )
    login_res = auth.login(login_req)
    assert login_res.token.startswith("stnl_")
    assert login_res.user.email == "analyst@sentinel.cyber"
    assert login_res.user.role == "Senior SOC Lead Analyst"
    assert "Level 4" in login_res.user.clearance

    # 2. Valid login with demo director (Role: SecOps Director)
    admin_req = auth.LoginRequest(
        email="admin@sentinel.cyber",
        password="SentinelAdmin#1",
        remember_me=False
    )
    admin_res = auth.login(admin_req)
    assert admin_res.token.startswith("stnl_")
    assert admin_res.user.email == "admin@sentinel.cyber"
    assert admin_res.user.role == "SecOps Director"
    assert "Level 5" in admin_res.user.clearance

    # 3. Verify SQLite persistence of users and sessions
    with init_db_conn() if False else auth.get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT email, password_hash, salt, role FROM users WHERE email = 'analyst@sentinel.cyber'")
        user_db = cursor.fetchone()
        assert user_db is not None
        assert user_db["email"] == "analyst@sentinel.cyber"
        assert len(user_db["password_hash"]) == 64  # SHA-256 hex string
        assert len(user_db["salt"]) > 0

        # Verify session is persisted in SQLite
        cursor.execute("SELECT token, user_id FROM user_sessions WHERE token = ?", (login_res.token,))
        session_db = cursor.fetchone()
        assert session_db is not None

    # 4. Verify session from database across serverless restarts (wipe in-memory cache)
    auth.ACTIVE_SESSIONS.clear()
    auth_header = f"Bearer {login_res.token}"
    verify_res = auth.verify_session(authorization=auth_header)
    assert verify_res["status"] == "valid"
    assert verify_res["user"]["name"] == "Sarah Connor"
    assert verify_res["user"]["role"] == "Senior SOC Lead Analyst"

    # 5. Invalid credentials test
    bad_req = auth.LoginRequest(
        email="analyst@sentinel.cyber",
        password="WrongPassword123"
    )
    with pytest.raises(Exception) as exc_info:
        auth.login(bad_req)
    assert "Invalid credentials" in str(exc_info.value)

    # 6. Logout test (clears both memory and SQLite session)
    logout_res = auth.logout(authorization=auth_header)
    assert logout_res["status"] == "logged_out"
    
    # Verify session is gone from database
    with auth.get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_sessions WHERE token = ?", (login_res.token,))
        assert cursor.fetchone() is None
