import sqlite3
import json
import os
import hashlib
import secrets
from typing import Optional, Tuple
from contextlib import contextmanager
from backend.config import settings

DB_FILE = settings.DATABASE_PATH

def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return hashed, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verifies a plain password against the stored PBKDF2 hash using timing-safe comparison."""
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, stored_hash)

DEMO_USERS = [
    {
        "id": "USR-SEC-091",
        "name": "Sarah Connor",
        "email": "analyst@sentinel.cyber",
        "password": "Sentinel@2026!",
        "role": "Senior SOC Lead Analyst",
        "clearance": "Level 4 (Top Secret / SCI)"
    },
    {
        "id": "USR-SEC-001",
        "name": "Marcus Vance",
        "email": "admin@sentinel.cyber",
        "password": "SentinelAdmin#1",
        "role": "SecOps Director",
        "clearance": "Level 5 (Directorate Access)"
    }
]

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

def seed_demo_users(conn):
    """Ensures authorized enterprise demo users are seeded and up to date in SQLite."""
    cursor = conn.cursor()
    for user_info in DEMO_USERS:
        cursor.execute("SELECT id, password_hash, salt FROM users WHERE email = ?", (user_info["email"],))
        existing = cursor.fetchone()
        if not existing:
            pwd_hash, salt = hash_password(user_info["password"])
            cursor.execute(
                """
                INSERT INTO users (id, name, email, password_hash, salt, role, clearance)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (user_info["id"], user_info["name"], user_info["email"], pwd_hash, salt, user_info["role"], user_info["clearance"])
            )
        else:
            # Re-verify and sync hash if needed
            if not verify_password(user_info["password"], existing["password_hash"], existing["salt"]):
                pwd_hash, salt = hash_password(user_info["password"])
                cursor.execute(
                    """
                    UPDATE users 
                    SET password_hash = ?, salt = ?, role = ?, clearance = ?, name = ?
                    WHERE id = ?
                    """,
                    (pwd_hash, salt, user_info["role"], user_info["clearance"], user_info["name"], existing["id"])
                )

def init_db():
    """Initializes tables for SENTINEL AI."""
    with get_db() as conn:
        cursor = conn.cursor()

        # 0. Enterprise Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            role TEXT NOT NULL,
            clearance TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 0b. Persistent User Sessions Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            remember_me INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
        """)
        
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

        # Ensure demo accounts exist in database
        seed_demo_users(conn)

def reset_db():
    """Resets all data back to clean state while preserving demo credentials."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM verification_records;")
        cursor.execute("DELETE FROM response_actions;")
        cursor.execute("DELETE FROM investigation_reports;")
        cursor.execute("DELETE FROM security_alerts;")
        cursor.execute("DELETE FROM incidents;")
        cursor.execute("DELETE FROM security_events;")
        cursor.execute("DELETE FROM agent_activity_logs;")
        cursor.execute("DELETE FROM user_sessions;")
        seed_demo_users(conn)
