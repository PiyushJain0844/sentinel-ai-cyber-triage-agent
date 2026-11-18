import json
import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any
from backend.agents.base import BaseAgent
from backend.database.db import get_db

class ThreatDetectionAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Threat Detection Agent",
            role="Rule-based & heuristic detection of malicious patterns, risk scoring & MITRE mapping"
        )

    def evaluate_event(self, event: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluates an event using deterministic rules and heuristic threat analysis."""
        alerts = []
        action = event.get("action", "").upper()
        event_type = event.get("event_type", "").upper()
        resource = str(event.get("resource_accessed") or "")
        details = event.get("details") or {}
        source_ip = event.get("source_ip")
        username = event.get("username")
        device_id = event.get("device_id")
        evt_id = event.get("id")
        timestamp = event.get("timestamp")

        # Rule 1: Brute Force / Repeated Failed Logins
        if "FAILED_LOGIN" in action or details.get("attempt_count", 0) >= 3 or ("LOGIN" in action and event.get("status") == "FAILURE"):
            attempts = details.get("attempt_count", 1)
            risk = min(85, 45 + (attempts * 3))
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": f"Credential Brute-Force Activity ({attempts} Failed Attempts)",
                "description": f"Multiple consecutive failed authentication attempts detected targeting user '{username}' from IP {source_ip}.",
                "severity": "HIGH",
                "risk_score": risk,
                "category": "Credential Access",
                "mitre_technique": "T1110.001 - Password Guessing",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        # Rule 2: Unfamiliar External IP Login following Brute Force / Anomaly
        if ("SUCCESSFUL_LOGIN" in action or (action == "LOGIN" and event.get("status") == "SUCCESS")) and (details.get("unfamiliar_ip") or details.get("asn")):
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": "Authentication From Unfamiliar External IP",
                "description": f"Successful login for user '{username}' originated from unfamiliar external IP {source_ip} (ASN: {details.get('asn', 'External')}).",
                "severity": "HIGH",
                "risk_score": 80,
                "category": "Initial Access",
                "mitre_technique": "T1078.002 - Valid Accounts: Domain Accounts",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        # Rule 3: Impossible Travel / Geographic Anomaly
        if event_type == "GEOGRAPHIC_ANOMALY" or details.get("impossible_travel") or "IMPOSSIBLE_TRAVEL" in action:
            distance = details.get("distance_km", "Unknown")
            elapsed = details.get("elapsed_minutes", "Unknown")
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": f"Impossible Travel Anomaly Detected ({distance} km in {elapsed} min)",
                "description": f"User '{username}' authenticated from two distant geographical locations within an impossible timeframe ({details.get('previous_login_location')} -> {details.get('current_login_location')}).",
                "severity": "CRITICAL",
                "risk_score": 92,
                "category": "Initial Access",
                "mitre_technique": "T1078 - Valid Accounts",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        # Rule 4: Unusual Sensitive File Access
        if "FILE_ACCESS" in event_type or "UNUSUAL_FILE" in action or any(keyword in resource.lower() for keyword in ["salary", "finance", "blueprint", "secret", "confidential", "exec"]):
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": "Unauthorized Access to Sensitive Enterprise Shares",
                "description": f"Account '{username}' performed bulk read on restricted file '{resource}'. {details.get('department_mismatch', 'Access pattern is anomalous for user role.')}",
                "severity": "HIGH",
                "risk_score": 85,
                "category": "Collection / Discovery",
                "mitre_technique": "T1083 - File and Directory Discovery",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        # Rule 5: Suspicious Command / PowerShell Execution
        cmd_text = str(details.get("command_line", "")).lower() + " " + resource.lower()
        if "powershell" in cmd_text or "cmd.exe" in cmd_text or details.get("decoded_command") or "SUSPICIOUS_COMMAND" in action:
            decoded = details.get("decoded_command", "Encoded Base64 Payload")
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": "Suspicious Obfuscated PowerShell Process Execution",
                "description": f"Obfuscated PowerShell invocation detected on {device_id} executing '{decoded}'. Known LOLBAS stager pattern.",
                "severity": "CRITICAL",
                "risk_score": 96,
                "category": "Execution",
                "mitre_technique": "T1059.001 - PowerShell",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        # Rule 6: Data Exfiltration / C2 Outbound Traffic
        if "NETWORK" in event_type or "EXFILTRATION" in action or details.get("threat_intel_match") or details.get("bytes_transferred", 0) > 10000000:
            mb = round(details.get("bytes_transferred", 0) / (1024 * 1024), 2)
            alerts.append({
                "id": f"ALT-{uuid.uuid4().hex[:8].upper()}",
                "title": f"High-Volume Data Exfiltration to Suspicious External IP ({mb} MB)",
                "description": f"High volume outbound burst ({mb} MB) directed to external IP {event.get('destination_ip')} on port {details.get('destination_port', 8443)}. {details.get('threat_intel_match', '')}",
                "severity": "CRITICAL",
                "risk_score": 98,
                "category": "Exfiltration",
                "mitre_technique": "T1041 - Exfiltration Over C2 Channel",
                "event_id": evt_id,
                "source_ip": source_ip,
                "username": username,
                "device_id": device_id,
                "timestamp": timestamp
            })

        return alerts

    def process_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Processes events and writes detected alerts to database."""
        start_time = time.time()
        self.update_status("PROCESSING", f"Evaluating {len(events)} security events against detection rules")
        
        all_alerts = []
        with get_db() as conn:
            cursor = conn.cursor()
            for event in events:
                # Ensure event exists in security_events to satisfy foreign key integrity
                cursor.execute("SELECT id FROM security_events WHERE id = ?", (event.get("id"),))
                if not cursor.fetchone():
                    cursor.execute("""
                        INSERT OR IGNORE INTO security_events (
                            id, timestamp, source_ip, destination_ip, username, 
                            device_id, event_type, action, resource_accessed, 
                            status, severity, details_json, is_suspicious
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        event.get("id", f"EVT-{uuid.uuid4().hex[:8].upper()}"),
                        event.get("timestamp", datetime.now(timezone.utc).isoformat()),
                        event.get("source_ip"),
                        event.get("destination_ip"),
                        event.get("username"),
                        event.get("device_id"),
                        event.get("event_type", "SECURITY_EVENT"),
                        event.get("action", "UNKNOWN"),
                        event.get("resource_accessed"),
                        event.get("status", "SUCCESS"),
                        event.get("severity", "INFORMATIONAL"),
                        json.dumps(event.get("details", {})),
                        1
                    ))

                alerts = self.evaluate_event(event)
                for alert in alerts:
                    all_alerts.append(alert)
                    cursor.execute("""
                        INSERT OR REPLACE INTO security_alerts (
                            id, title, description, severity, risk_score, 
                            category, mitre_technique, event_id, source_ip, 
                            username, device_id, timestamp
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        alert["id"],
                        alert["title"],
                        alert["description"],
                        alert["severity"],
                        alert["risk_score"],
                        alert["category"],
                        alert["mitre_technique"],
                        alert["event_id"],
                        alert["source_ip"],
                        alert["username"],
                        alert["device_id"],
                        alert["timestamp"]
                    ))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "COMPLETED",
            "Threat detection analysis complete",
            f"Evaluated {len(events)} events. Discovered {len(all_alerts)} security alerts matching active threat signatures.",
            processed_delta=len(events)
        )
        return all_alerts
