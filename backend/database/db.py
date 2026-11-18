import sqlite3
import json
import os
from contextlib import contextmanager
from backend.config import settings

DB_FILE = settings.DATABASE_PATH

def get_db_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@contextmanager
def get_db():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initializes tables for SENTINEL AI."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Raw / Normalized Security Events Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_events (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            source_ip TEXT,
            destination_ip TEXT,
            username TEXT,
            device_id TEXT,
            event_type TEXT NOT NULL,
            action TEXT NOT NULL,
            resource_accessed TEXT,
            status TEXT NOT NULL,
            severity TEXT NOT NULL,
            details_json TEXT,
            is_suspicious INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        # 2. Detected Alerts Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_alerts (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            severity TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            category TEXT NOT NULL,
            mitre_technique TEXT,
            event_id TEXT NOT NULL,
            source_ip TEXT,
            username TEXT,
            device_id TEXT,
            timestamp TEXT NOT NULL,
            correlated_incident_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES security_events (id)
        );
        """)
        
        # 3. Correlated Incidents Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            summary TEXT NOT NULL,
            severity TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            confidence_level INTEGER NOT NULL,
            status TEXT NOT NULL, -- THREAT_DETECTED, INVESTIGATION_COMPLETED, RESPONSE_PENDING, RESPONSE_EXECUTED, THREAT_CONTAINED, VERIFICATION_FAILED, REOPENED_INVESTIGATION_REQUIRED
            primary_entity_type TEXT, -- USER, IP, ENDPOINT
            primary_entity_value TEXT,
            alert_count INTEGER DEFAULT 0,
            first_detected_at TEXT NOT NULL,
            last_activity_at TEXT NOT NULL,
            attack_graph_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        
        # 4. Investigation Reports Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS investigation_reports (
            id TEXT PRIMARY KEY,
            incident_id TEXT NOT NULL,
            summary TEXT NOT NULL,
            threat_category TEXT NOT NULL,
            severity TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            confidence_level INTEGER NOT NULL,
            findings_json TEXT NOT NULL, -- Array of evidence-backed findings
            attack_timeline_json TEXT NOT NULL,
            possible_attack_sequence_json TEXT NOT NULL,
            missing_information_json TEXT,
            recommended_next_steps_json TEXT,
            is_ai_generated INTEGER DEFAULT 0,
            ai_model_used TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents (id)
        );
        """)
        
        # 5. Response Recommendations & Approvals Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS response_actions (
            id TEXT PRIMARY KEY,
            incident_id TEXT NOT NULL,
            action_type TEXT NOT NULL, -- REVOKE_SESSION, BLOCK_IP, DISABLE_ACCOUNT, ISOLATE_ENDPOINT
            title TEXT NOT NULL,
            reason TEXT NOT NULL,
            supporting_evidence_json TEXT,
            expected_impact TEXT NOT NULL,
            risk_level TEXT NOT NULL,
            status TEXT NOT NULL, -- PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED, FAILED
            approval_decision_by TEXT,
            approval_decision_at TEXT,
            rejection_reason TEXT,
            simulation_result_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (incident_id) REFERENCES incidents (id)
        );
        """)
        
        # 6. Verification Results Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS verification_records (
            id TEXT PRIMARY KEY,
            response_action_id TEXT NOT NULL,
            incident_id TEXT NOT NULL,
            verification_status TEXT NOT NULL, -- VERIFIED_CONTAINED, VERIFICATION_FAILED
            checks_performed_json TEXT NOT NULL,
            analyst_notes TEXT,
            verified_at TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (response_action_id) REFERENCES response_actions (id),
            FOREIGN KEY (incident_id) REFERENCES incidents (id)
        );
        """)
        
        # 7. Agent Audit & Activity Logs Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_name TEXT NOT NULL,
            status TEXT NOT NULL, -- IDLE, PROCESSING, COMPLETED, FAILED, WAITING_APPROVAL
            current_task TEXT NOT NULL,
            processed_count INTEGER DEFAULT 0,
            latest_output TEXT,
            execution_duration_ms INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

def reset_db():
    """Resets all data back to clean state."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM verification_records;")
        cursor.execute("DELETE FROM response_actions;")
        cursor.execute("DELETE FROM investigation_reports;")
        cursor.execute("DELETE FROM security_alerts;")
        cursor.execute("DELETE FROM incidents;")
        cursor.execute("DELETE FROM security_events;")
        cursor.execute("DELETE FROM agent_activity_logs;")
