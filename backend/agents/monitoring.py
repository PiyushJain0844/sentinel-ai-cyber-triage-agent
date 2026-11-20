import json
import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from backend.agents.base import BaseAgent
from backend.database.db import get_db

class LogMonitoringAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Log Monitoring Agent",
            role="Ingestion, parsing, schema normalization & initial anomaly flagging of raw telemetry"
        )

    def normalize_event(self, raw_event: Dict[str, Any]) -> Dict[str, Any]:
        """Normalizes heterogeneous incoming security logs into standard schema."""
        evt_id = raw_event.get("id") or f"EVT-{uuid.uuid4().hex[:8].upper()}"
        timestamp = raw_event.get("timestamp") or datetime.now(timezone.utc).isoformat()
        source_ip = raw_event.get("source_ip") or raw_event.get("src_ip") or raw_event.get("client_ip")
        destination_ip = raw_event.get("destination_ip") or raw_event.get("dst_ip") or raw_event.get("server_ip")
        username = raw_event.get("username") or raw_event.get("user") or raw_event.get("account")
        device_id = raw_event.get("device_id") or raw_event.get("host") or raw_event.get("hostname")
        event_type = (raw_event.get("event_type") or raw_event.get("type") or "SECURITY_EVENT").upper()
        action = (raw_event.get("action") or raw_event.get("operation") or "UNKNOWN").upper()
        resource_accessed = raw_event.get("resource_accessed") or raw_event.get("target") or raw_event.get("resource")
        status = (raw_event.get("status") or raw_event.get("outcome") or "INFORMATIONAL").upper()
        severity = (raw_event.get("severity") or "INFORMATIONAL").upper()
        details = raw_event.get("details") or {}
        
        # Initial anomaly heuristic
        is_suspicious = False
        if severity in ["HIGH", "CRITICAL"]:
            is_suspicious = True
        elif status in ["FAILURE", "ANOMALY", "ALERTED"]:
            is_suspicious = True
        elif "failed" in action.lower() or "powershell" in str(resource_accessed).lower() or "powershell" in str(details).lower():
            is_suspicious = True
        elif details.get("impossible_travel") or details.get("unfamiliar_ip"):
            is_suspicious = True

        return {
            "id": evt_id,
            "timestamp": timestamp,
            "source_ip": source_ip,
            "destination_ip": destination_ip,
            "username": username,
            "device_id": device_id,
            "event_type": event_type,
            "action": action,
            "resource_accessed": resource_accessed,
            "status": status,
            "severity": severity,
            "details": details,
            "is_suspicious": is_suspicious
        }

    def process_logs(self, raw_logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Processes and stores logs, returning normalized events and identifying suspicious ones."""
        start_time = time.time()
        self.update_status("PROCESSING", f"Ingesting and parsing {len(raw_logs)} raw security logs")
        
        normalized_events = []
        suspicious_events = []

        with get_db() as conn:
            cursor = conn.cursor()
            for raw in raw_logs:
                event = self.normalize_event(raw)
                normalized_events.append(event)
                if event["is_suspicious"]:
                    suspicious_events.append(event)

                cursor.execute("""
                    INSERT OR REPLACE INTO security_events (
                        id, timestamp, source_ip, destination_ip, username, 
                        device_id, event_type, action, resource_accessed, 
                        status, severity, details_json, is_suspicious
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    event["id"],
                    event["timestamp"],
                    event["source_ip"],
                    event["destination_ip"],
                    event["username"],
                    event["device_id"],
                    event["event_type"],
                    event["action"],
                    event["resource_accessed"],
                    event["status"],
                    event["severity"],
                    json.dumps(event["details"]),
                    1 if event["is_suspicious"] else 0
                ))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "COMPLETED",
            "Log ingestion and normalization complete",
            f"Parsed {len(normalized_events)} logs. Flagged {len(suspicious_events)} suspicious events for threat detection.",
            processed_delta=len(normalized_events)
        )
        return normalized_events
