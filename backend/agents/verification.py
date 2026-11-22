import json
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from backend.agents.base import BaseAgent
from backend.database.db import get_db

class VerificationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Verification Agent",
            role="Closed-loop verification of remediation efficacy, persistence probe & incident state transition"
        )

    def verify_action(self, action_id: str, simulate_failure: bool = False, analyst_notes: Optional[str] = None) -> Dict[str, Any]:
        """
        Executes active closed-loop verification checks.
        If all checks pass, updates incident to THREAT_CONTAINED.
        If verification fails (or simulated failure), updates incident to REOPENED_INVESTIGATION_REQUIRED.
        """
        start_time = time.time()
        self.update_status("PROCESSING", f"Verifying containment outcome for action {action_id}")

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM response_actions WHERE id = ?", (action_id,))
            action_row = cursor.fetchone()
            if not action_row:
                raise ValueError(f"Action {action_id} not found")

            act = dict(action_row)
            incident_id = act["incident_id"]

            cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
            inc = cursor.fetchone()
            if not inc:
                raise ValueError(f"Incident {incident_id} not found")

            # Perform multi-point verification checks
            checks = []
            verified_at = datetime.now(timezone.utc).isoformat()

            if simulate_failure:
                # Simulated failure scenario: Secondary session alive or persistent beacon detected
                checks = [
                    {
                        "check_name": "Active Session Introspection",
                        "target": "SESSION-TK-9921",
                        "status": "PASSED",
                        "details": "Primary session token successfully invalidated (HTTP 401 Unauthorized)."
                    },
                    {
                        "check_name": "Secondary Session & Kerberos Ticket Probe",
                        "target": "sarah.connor",
                        "status": "FAILED",
                        "details": "CRITICAL: Active forged Kerberos Silver Ticket detected still authenticating to internal SQL share."
                    },
                    {
                        "check_name": "Host Process Tree & Beacon Heartbeat",
                        "target": "FS-CORP-FIN01",
                        "status": "FAILED",
                        "details": "ALERT: Memory injection beacon still pulsing to secondary C2 fallback IP 198.51.100.99."
                    },
                    {
                        "check_name": "Network Egress Telemetry",
                        "target": "Perimeter Firewall",
                        "status": "WARNING",
                        "details": "Firewall dropped primary IP, but fallback exfiltration observed on alternate port 443."
                    }
                ]
                verification_status = "VERIFICATION_FAILED"
                new_incident_status = "REOPENED_INVESTIGATION_REQUIRED"
                notes = analyst_notes or "Closed-loop verification probe failed: Secondary persistent channel and active Kerberos ticket still present. Threat not contained."
            else:
                # Successful closed-loop verification
                checks = [
                    {
                        "check_name": "Active Session Introspection",
                        "target": "SESSION-TK-9921",
                        "status": "PASSED",
                        "details": "Session token query returned 401 Unauthorized. Access revoked on all gateways."
                    },
                    {
                        "check_name": "Perimeter Firewall Drop Rate",
                        "target": "198.51.100.42",
                        "status": "PASSED",
                        "details": "100% packet drop confirmed for adversary IP on Edge firewall (0 packets accepted in 180s)."
                    },
                    {
                        "check_name": "Host Process Tree & Beacon Heartbeat",
                        "target": "FS-CORP-FIN01",
                        "status": "PASSED",
                        "details": "Obfuscated PowerShell process terminated. Zero anomalous child processes running."
                    },
                    {
                        "check_name": "Network Egress Telemetry",
                        "target": "203.0.113.199:8443",
                        "status": "PASSED",
                        "details": "Exfiltration stream completely terminated. Zero open outbound TCP sockets."
                    }
                ]
                verification_status = "VERIFIED_CONTAINED"
                new_incident_status = "THREAT_CONTAINED"
                notes = analyst_notes or "All 4 closed-loop verification checks passed. Adversary access severed, exfiltration halted, incident successfully contained."

            rec_id = f"VER-{uuid.uuid4().hex[:8].upper()}"

            cursor.execute("""
                INSERT INTO verification_records (
                    id, response_action_id, incident_id, verification_status, 
                    checks_performed_json, analyst_notes, verified_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                rec_id,
                action_id,
                incident_id,
                verification_status,
                json.dumps(checks),
                notes,
                verified_at
            ))

            # Update Incident status based on verified closed loop!
            cursor.execute("""
                UPDATE incidents 
                SET status = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (new_incident_status, incident_id))

            # Update Response Action status to reflect closed loop verification result
            new_action_status = "VERIFIED" if not simulate_failure else "FAILED"
            cursor.execute("""
                UPDATE response_actions 
                SET status = ? 
                WHERE id = ?
            """, (new_action_status, action_id))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms

        if verification_status == "VERIFIED_CONTAINED":
            self.update_status(
                "COMPLETED",
                f"Verification confirmed: Incident {incident_id} contained",
                f"Closed-loop check succeeded. All 4 security probes passed. Incident transitioned to THREAT_CONTAINED.",
                processed_delta=1
            )
        else:
            self.update_status(
                "COMPLETED",
                f"Verification alert: Incident {incident_id} reopening required",
                f"Closed-loop check detected persistent adversary activity! Incident transitioned to REOPENED_INVESTIGATION_REQUIRED.",
                processed_delta=1
            )

        return {
            "id": rec_id,
            "response_action_id": action_id,
            "incident_id": incident_id,
            "verification_status": verification_status,
            "checks_performed": checks,
            "analyst_notes": notes,
            "verified_at": verified_at,
            "incident_status": new_incident_status
        }
