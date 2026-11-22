import json
import os
<<<<<<< HEAD
import secrets
import threading
import time
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
=======
from typing import List, Dict, Any
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
from backend.agents import (
    monitoring_agent,
    detection_agent,
    correlation_agent,
    investigation_agent,
    response_agent,
    verification_agent
)
from backend.database.db import reset_db, init_db

class MultiAgentOrchestrator:
    """Coordinates the 6-agent triage, correlation, investigation, and response pipeline."""

    def __init__(self) -> None:
        init_db()
<<<<<<< HEAD
        self._simulation_lock = threading.Lock()
        self._simulation_state: Dict[str, Any] = {
            "simulation_id": None,
            "status": "idle",
            "stage": "Ready",
            "scenario": None,
            "total_events": 0,
            "events_processed": 0,
            "alerts_detected": 0,
            "incidents_created": 0,
            "error": None,
        }

    def _set_simulation_state(self, **updates: Any) -> None:
        with self._simulation_lock:
            self._simulation_state.update(updates)

    def get_simulation_status(self) -> Dict[str, Any]:
        with self._simulation_lock:
            return dict(self._simulation_state)

    def _build_simulation_scenario(self) -> tuple[str, List[Dict[str, Any]]]:
        """Create a fresh, safe synthetic scenario. No generated command or address is executed."""
        scenario_id = f"SIM-{uuid.uuid4().hex[:8].upper()}"
        username = secrets.choice(["alex.chen", "jordan.lee", "morgan.patel", "taylor.reed", "casey.nguyen"])
        external_ip = f"198.51.100.{secrets.randbelow(200) + 20}"
        internal_ip = f"10.0.{secrets.randbelow(12) + 1}.{secrets.randbelow(220) + 20}"
        device_id = f"WS-SOC-{secrets.token_hex(2).upper()}"
        session_id = f"SESSION-{secrets.token_hex(4).upper()}"
        target_host = f"FS-CORP-{secrets.choice(['FIN', 'OPS', 'ENG'])}{secrets.randbelow(40) + 1:02d}"
        base_time = datetime.now(timezone.utc)
        common = {"source": "synthetic_simulation", "scenario_id": scenario_id}

        def event(offset: int, event_type: str, action: str, status: str, severity: str, resource: str, source_ip: str, destination_ip: str, device: str, details: Dict[str, Any]) -> Dict[str, Any]:
            return {
                "timestamp": (base_time + timedelta(seconds=offset)).isoformat(),
                "source_ip": source_ip,
                "destination_ip": destination_ip,
                "username": username,
                "device_id": device,
                "event_type": event_type,
                "action": action,
                "resource_accessed": resource,
                "status": status,
                "severity": severity,
                "details": {**common, **details},
            }

        logs: List[Dict[str, Any]] = []
        # Individual authentication records make the burst visible in telemetry.
        for attempt in range(1, 8):
            logs.append(event(
                attempt * 3, "AUTHENTICATION", "FAILED_LOGIN_ATTEMPT", "FAILURE", "HIGH",
                "SSO-GATEWAY", external_ip, "10.0.0.10", device_id,
                {"attempt_number": attempt, "attempt_count": secrets.randbelow(3) + 1,
                 "auth_method": secrets.choice(["password", "password", "legacy protocol"]), "simulation_only": True},
            ))

        logs.extend([
            event(24, "AUTHENTICATION", "SUCCESSFUL_LOGIN", "SUCCESS", "HIGH", "SSO-GATEWAY", external_ip, "10.0.0.10", device_id,
                  {"unfamiliar_ip": True, "asn": "SIMULATED-ASN", "auth_method": "password", "simulation_only": True}),
            event(27, "AUTHENTICATION", "MFA_CHALLENGE_DENIED", "FAILURE", "MEDIUM", "IDENTITY-PROVIDER", external_ip, "10.0.0.10", session_id,
                  {"challenge": "push", "simulation_only": True}),
            event(30, "GEOGRAPHIC_ANOMALY", "IMPOSSIBLE_TRAVEL_LOGIN", "ANOMALY", "CRITICAL", "VPN-CONCENTRATOR", external_ip, "10.0.0.20", session_id,
                  {"impossible_travel": True, "distance_km": secrets.randbelow(7000) + 2000, "elapsed_minutes": secrets.randbelow(50) + 10, "simulation_only": True}),
        ])

        for offset, resource in [(36, "/shares/finance/quarterly_forecast.xlsx"),
                                 (39, "/shares/engineering/product_roadmap.pdf"),
                                 (42, "/shares/finance/payroll_summary.csv")]:
            logs.append(event(offset, "FILE_ACCESS", "UNUSUAL_FILE_ACCESS", "ACCESSED", "HIGH", resource,
                              internal_ip, "10.0.0.30", target_host,
                              {"bytes_read": (secrets.randbelow(16) + 1) * 1024 * 1024,
                               "department_mismatch": "Synthetic access outside the account's usual profile.", "simulation_only": True}))

        for offset, process in [(48, "powershell.exe"), (51, "rundll32.exe")]:
            logs.append(event(offset, "PROCESS_EXECUTION", "SUSPICIOUS_COMMAND_EXECUTION", "SIMULATED", "CRITICAL", process,
                              internal_ip, "10.0.0.30", target_host,
                              {"command_line": "SIMULATION ONLY — no command executed",
                               "decoded_command": f"Synthetic {process} activity marker (not executed)", "simulation_only": True}))

        for offset in [57, 60, 63]:
            logs.append(event(offset, "NETWORK_TRAFFIC", "DATA_EXFILTRATION_BURST", "ALERTED", "CRITICAL", "SIMULATED_TLS_EGRESS",
                              internal_ip, f"203.0.113.{secrets.randbelow(200) + 20}", target_host,
                              {"bytes_transferred": (secrets.randbelow(28) + 4) * 1024 * 1024,
                               "destination_port": secrets.choice([443, 8443]),
                               "threat_intel_match": "Synthetic scenario indicator; no live reputation lookup was performed.",
                               "simulation_only": True}))

        for offset, domain in [(69, "updates.example.test"), (72, "telemetry.example.test")]:
            logs.append(event(offset, "DNS_QUERY", "LOOKUP", "SUCCESS", "INFORMATIONAL", domain,
                              "10.0.2.25", "10.0.0.1", "WS-OPS-01", {"simulation_only": True}))

        logs.extend([
            event(75, "CLOUD_ACTIVITY", "UNUSUAL_OAUTH_CONSENT", "REVIEW", "HIGH", "SIMULATED-CLOUD-APP",
                  external_ip, "10.0.0.40", username,
                  {"permission_scope": "Files.Read.All (simulated)", "simulation_only": True}),
            event(78, "NETWORK_TRAFFIC", "CONNECTION_BLOCKED", "BLOCKED", "LOW", "EDGE-FIREWALL",
                  external_ip, "10.0.0.10", "FW-SIM-01", {"rule": "training-policy", "simulation_only": True}),
        ])

        # Every run gets a fresh random amount of telemetry, inclusive of 10–25.
        target_count = secrets.randbelow(16) + 10
        # Keep a small, coherent attack progression in every run, then vary how
        # much surrounding telemetry is included.
        required_actions = {
            "FAILED_LOGIN_ATTEMPT", "SUCCESSFUL_LOGIN", "IMPOSSIBLE_TRAVEL_LOGIN",
            "UNUSUAL_FILE_ACCESS", "SUSPICIOUS_COMMAND_EXECUTION", "DATA_EXFILTRATION_BURST",
        }
        core_events = []
        for action in required_actions:
            core_events.append(next(item for item in logs if item["action"] == action))
        if target_count < len(logs):
            required_ids = {id(item) for item in core_events}
            optional_events = [item for item in logs if id(item) not in required_ids]
            logs = core_events + secrets.SystemRandom().sample(optional_events, target_count - len(core_events))
        else:
            for extra_index in range(target_count - len(logs)):
                device = f"WS-OPS-{secrets.randbelow(40) + 1:02d}"
                logs.append(event(
                    81 + extra_index * 3, "ENDPOINT_HEALTH", "HEARTBEAT", "SUCCESS", "INFORMATIONAL",
                    device, f"10.0.{secrets.randbelow(8) + 1}.{secrets.randbelow(200) + 20}",
                    "10.0.0.5", device, {"simulation_only": True, "activity": "routine endpoint check"},
                ))
        logs.sort(key=lambda item: item["timestamp"])
        return scenario_id, logs

    def start_live_simulation(self) -> tuple[str, List[Dict[str, Any]]]:
        """Reserves a new simulation run and returns its fresh event set for background processing."""
        with self._simulation_lock:
            if self._simulation_state.get("status") == "running":
                raise RuntimeError("A simulation is already running.")
            scenario_id, logs = self._build_simulation_scenario()
            self._simulation_state = {
                "simulation_id": scenario_id,
                "status": "running",
                "stage": "Starting telemetry stream",
                "scenario": "Synthetic account compromise exercise",
                "total_events": len(logs),
                "events_processed": 0,
                "alerts_detected": 0,
                "incidents_created": 0,
                "error": None,
                "seconds_remaining": 0,
            }
        return scenario_id, logs

    def run_live_simulation(self, simulation_id: str, raw_logs: List[Dict[str, Any]]) -> None:
        """Stream 10–25 synthetic events with randomized 1–3 second update gaps."""
        alerts: List[Dict[str, Any]] = []
        try:
            for index, raw_log in enumerate(raw_logs, start=1):
                self._set_simulation_state(stage=f"Ingesting event {index} of {len(raw_logs)}")
                normalized = monitoring_agent.process_logs([raw_log])
                self._set_simulation_state(stage=f"Analyzing event {index} of {len(raw_logs)}")
                alerts.extend(detection_agent.process_events(normalized))
                self._set_simulation_state(events_processed=index, alerts_detected=len(alerts))
                # Pace updates unpredictably but briefly so each arriving event
                # remains visible without making the exercise drag.
                pacing_seconds = secrets.randbelow(3) + 1
                for remaining in range(pacing_seconds, 0, -1):
                    self._set_simulation_state(
                        stage=f"Event {index} analyzed · next update in {remaining}s",
                        seconds_remaining=remaining,
                    )
                    time.sleep(1)

            self._set_simulation_state(seconds_remaining=0)
            self._set_simulation_state(stage="Correlating alerts")
            incidents = correlation_agent.correlate_alerts(alerts)
            investigations = []
            responses = []
            for incident in incidents:
                self._set_simulation_state(stage=f"Investigating {incident['id']}")
                report = investigation_agent.investigate_incident(incident["id"])
                if report:
                    investigations.append(report)
                responses.extend(response_agent.generate_recommendations(incident["id"]))

            result = {
                "events_processed": len(raw_logs),
                "alerts_detected": len(alerts),
                "incidents_created": len(incidents),
                "investigations_completed": len(investigations),
                "responses_formulated": len(responses),
                "incidents": incidents,
            }
            self._set_simulation_state(status="complete", stage="Complete", result=result)
        except Exception as error:
            self._set_simulation_state(status="failed", stage="Stopped", error=str(error))
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

    def run_pipeline(self, raw_logs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs the full 6-agent triage and investigation pipeline:
        DETECT (Monitoring + Detection) -> CORRELATE -> INVESTIGATE -> RESPOND (Recommendations)
        """
        # 1. Monitoring Agent
        events = monitoring_agent.process_logs(raw_logs)

        # 2. Threat Detection Agent
        alerts = detection_agent.process_events(events)

        # 3. Correlation Agent
        incidents = correlation_agent.correlate_alerts(alerts)

        # 4. Investigation Agent & 5. Response Agent for each incident
        investigations = []
        responses = []
        for inc in incidents:
            report = investigation_agent.investigate_incident(inc["id"])
            if report:
                investigations.append(report)
            recs = response_agent.generate_recommendations(inc["id"])
            responses.extend(recs)

        return {
            "events_processed": len(events),
            "alerts_detected": len(alerts),
            "incidents_created": len(incidents),
            "investigations_completed": len(investigations),
            "responses_formulated": len(responses),
            "incidents": incidents
        }

    def load_sample_attack_scenario(self) -> Dict[str, Any]:
        """Loads the Employee Account Compromise scenario from sample_data/security_logs.json."""
        sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "sample_data", "security_logs.json")
        sample_path = os.path.abspath(sample_path)
        
        with open(sample_path, "r", encoding="utf-8") as f:
            sample_logs = json.load(f)

        return self.run_pipeline(sample_logs)

    def reset_system(self) -> None:
        """Resets all data and reinitializes agent states."""
        reset_db()
<<<<<<< HEAD
        self._set_simulation_state(
            simulation_id=None, status="idle", stage="Ready", scenario=None,
            total_events=0, events_processed=0, alerts_detected=0,
            incidents_created=0, error=None, result=None
        )
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
        for agent in [monitoring_agent, detection_agent, correlation_agent, investigation_agent, response_agent, verification_agent]:
            agent.status = "IDLE"
            agent.current_task = "System ready / Awaiting input"
            agent.processed_count = 0
            agent.latest_output = "Reset to clean state"
            agent.execution_duration_ms = 0
            agent._sync_state()

orchestrator = MultiAgentOrchestrator()
