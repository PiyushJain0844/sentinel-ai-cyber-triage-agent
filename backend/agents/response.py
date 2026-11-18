import json
import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.agents.base import BaseAgent
from backend.database.db import get_db

class ResponseAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Response Agent",
            role="Targeted remediation proposal, human approval gating & safe simulation execution"
        )

    def generate_recommendations(self, incident_id: str) -> List[Dict[str, Any]]:
        """Generates structured response recommendations for an investigated incident."""
        start_time = time.time()
        self.update_status("PROCESSING", f"Generating response recommendations for incident {incident_id}")

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
            inc = cursor.fetchone()
            if not inc:
                self.update_status("FAILED", f"Incident {incident_id} not found")
                return []

            username = inc["primary_entity_value"] or "Target User"

            # Check if actions already exist
            cursor.execute("SELECT * FROM response_actions WHERE incident_id = ?", (incident_id,))
            existing = cursor.fetchall()
            if existing:
                actions = []
                for row in existing:
                    r = dict(row)
                    r["supporting_evidence"] = json.loads(r["supporting_evidence_json"]) if r["supporting_evidence_json"] else []
                    r["simulation_result"] = json.loads(r["simulation_result_json"]) if r["simulation_result_json"] else None
                    actions.append(r)
                self.update_status("COMPLETED", "Retrieved existing response recommendations", f"{len(actions)} actions queued", 0)
                return actions

            # Recommend targeted mitigations
            recommendations = [
                {
                    "id": f"ACT-{uuid.uuid4().hex[:8].upper()}",
                    "incident_id": incident_id,
                    "action_type": "REVOKE_SESSION",
                    "title": f"Revoke Active Session & Invalidate Tokens (SESSION-TK-9921)",
                    "reason": "Immediate termination of hijacked session token stops active C2 exfiltration and unauthorized file read operations.",
                    "supporting_evidence": ["EVT-2026-1003", "EVT-2026-1005", "EVT-2026-1006"],
                    "expected_impact": "Active session token invalidated immediately. Legitimate user will be prompted to re-authenticate with MFA.",
                    "risk_level": "LOW",
                    "status": "PENDING_APPROVAL"
                },
                {
                    "id": f"ACT-{uuid.uuid4().hex[:8].upper()}",
                    "incident_id": incident_id,
                    "action_type": "BLOCK_IP",
                    "title": "Block Malicious IP at Perimeter Firewall (198.51.100.42)",
                    "reason": "Source IP responsible for 15 failed logins and subsequent brute-force session takeover.",
                    "supporting_evidence": ["EVT-2026-1002", "EVT-2026-1003", "EVT-2026-1004"],
                    "expected_impact": "All incoming and outgoing traffic to 198.51.100.42 dropped at edge firewall.",
                    "risk_level": "LOW",
                    "status": "PENDING_APPROVAL"
                },
                {
                    "id": f"ACT-{uuid.uuid4().hex[:8].upper()}",
                    "incident_id": incident_id,
                    "action_type": "DISABLE_ACCOUNT",
                    "title": f"Temporarily Quarantine Account ({username})",
                    "reason": "Account credentials compromised and used for unauthorized lateral file discovery.",
                    "expected_impact": "User unable to log into any enterprise systems until IT Security performs credential rotation.",
                    "supporting_evidence": ["EVT-2026-1004", "EVT-2026-1005"],
                    "risk_level": "MEDIUM",
                    "status": "PENDING_APPROVAL"
                },
                {
                    "id": f"ACT-{uuid.uuid4().hex[:8].upper()}",
                    "incident_id": incident_id,
                    "action_type": "ISOLATE_ENDPOINT",
                    "title": "Isolate Affected Endpoint (FS-CORP-FIN01)",
                    "reason": "Host executed obfuscated PowerShell stager payload and initiated outbound C2 burst.",
                    "expected_impact": "Host disconnected from internal network; retains management channel for forensics.",
                    "supporting_evidence": ["EVT-2026-1006", "EVT-2026-1007"],
                    "risk_level": "HIGH",
                    "status": "PENDING_APPROVAL"
                }
            ]

            for act in recommendations:
                cursor.execute("""
                    INSERT INTO response_actions (
                        id, incident_id, action_type, title, reason, 
                        supporting_evidence_json, expected_impact, risk_level, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    act["id"],
                    act["incident_id"],
                    act["action_type"],
                    act["title"],
                    act["reason"],
                    json.dumps(act["supporting_evidence"]),
                    act["expected_impact"],
                    act["risk_level"],
                    act["status"]
                ))

            # Update incident status to RESPONSE_PENDING
            cursor.execute("""
                UPDATE incidents 
                SET status = 'RESPONSE_PENDING', updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (incident_id,))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "WAITING_APPROVAL",
            "Awaiting analyst authorization for response actions",
            f"Formulated {len(recommendations)} response actions. Waiting for human approval in Response Center.",
            processed_delta=len(recommendations)
        )
        return recommendations

    def process_decision(self, action_id: str, decision: str, decision_by: str = "SOC Lead Analyst", rejection_reason: Optional[str] = None) -> Dict[str, Any]:
        """Handles human approval or rejection of a recommended remediation action."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM response_actions WHERE id = ?", (action_id,))
            row = cursor.fetchone()
            if not row:
                raise ValueError(f"Action {action_id} not found")

            act = dict(row)
            now_iso = datetime.now(timezone.utc).isoformat()

            if decision == "APPROVE":
                new_status = "APPROVED"
                rejection_reason = None
            elif decision == "REJECT":
                new_status = "REJECTED"
            else:
                raise ValueError("Invalid decision. Must be APPROVE or REJECT.")

            cursor.execute("""
                UPDATE response_actions 
                SET status = ?, approval_decision_by = ?, approval_decision_at = ?, rejection_reason = ? 
                WHERE id = ?
            """, (new_status, decision_by, now_iso, rejection_reason, action_id))

            act["status"] = new_status
            act["approval_decision_by"] = decision_by
            act["approval_decision_at"] = now_iso
            act["rejection_reason"] = rejection_reason

            self.update_status(
                "COMPLETED",
                f"Action {action_id} {new_status} by {decision_by}",
                f"Human-in-the-loop audit: Action '{act['title']}' was {new_status}."
            )
            return act

    def simulate_execution(self, action_id: str) -> Dict[str, Any]:
        """Simulates the authorized execution in a safe, controlled sandbox."""
        start_time = time.time()
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM response_actions WHERE id = ?", (action_id,))
            row = cursor.fetchone()
            if not row:
                raise ValueError(f"Action {action_id} not found")

            act = dict(row)
            if act["status"] not in ["APPROVED", "EXECUTED"]:
                raise ValueError("Cannot execute action that has not been approved by an analyst.")

            self.update_status("PROCESSING", f"Simulating execution of {act['title']}")

            action_type = act["action_type"]
            execution_timestamp = datetime.now(timezone.utc).isoformat()
            
            # Safe simulation details
            if action_type == "REVOKE_SESSION":
                simulation_result = {
                    "action_executed": "TOKEN_REVOCATION_BROADCAST",
                    "target_session": "SESSION-TK-9921",
                    "revocation_method": "OAuth/OIDC Introspection Blacklist",
                    "tokens_blacklisted": 2,
                    "simulated_latency_ms": 38,
                    "status": "SUCCESS",
                    "audit_log": f"[{execution_timestamp}] SESSION-TK-9921 revoked across all identity gateways."
                }
            elif action_type == "BLOCK_IP":
                simulation_result = {
                    "action_executed": "FIREWALL_ACL_UPDATE",
                    "target_ip": "198.51.100.42",
                    "firewall_rule_id": "FW-RULE-DENY-9024",
                    "applied_to": ["Edge-PaloAlto-01", "WAF-Cloudflare-Enterprise"],
                    "simulated_latency_ms": 64,
                    "status": "SUCCESS",
                    "audit_log": f"[{execution_timestamp}] DROP rule injected for 198.51.100.42 on ingress/egress."
                }
            elif action_type == "DISABLE_ACCOUNT":
                simulation_result = {
                    "action_executed": "AD_ACCOUNT_LOCK",
                    "target_account": "sarah.connor",
                    "account_status": "DISABLED_PENDING_FORENSICS",
                    "active_tokens_purged": True,
                    "simulated_latency_ms": 52,
                    "status": "SUCCESS",
                    "audit_log": f"[{execution_timestamp}] Account sarah.connor locked in Active Directory domain."
                }
            else: # ISOLATE_ENDPOINT
                simulation_result = {
                    "action_executed": "EDR_NETWORK_ISOLATION",
                    "target_endpoint": "FS-CORP-FIN01",
                    "isolation_type": "CONTAINMENT_VLAN_APPLIED",
                    "management_ip_preserved": True,
                    "simulated_latency_ms": 110,
                    "status": "SUCCESS",
                    "audit_log": f"[{execution_timestamp}] Host FS-CORP-FIN01 isolated via EDR agent."
                }

            cursor.execute("""
                UPDATE response_actions 
                SET status = 'EXECUTED', simulation_result_json = ? 
                WHERE id = ?
            """, (json.dumps(simulation_result), action_id))

            # Update incident status to RESPONSE_EXECUTED
            cursor.execute("""
                UPDATE incidents 
                SET status = 'RESPONSE_EXECUTED', updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (act["incident_id"],))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "COMPLETED",
            f"Simulated execution of {act['title']} completed successfully",
            f"Execution telemetry recorded. Safe simulation completed in {duration_ms}ms.",
            processed_delta=1
        )

        act["status"] = "EXECUTED"
        act["simulation_result"] = simulation_result
        return act
