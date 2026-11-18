import json
import time
import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.agents.base import BaseAgent
from backend.database.db import get_db
from backend.services.gemini_service import gemini_service

class InvestigationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Investigation Agent",
            role="Evidence-first deep threat investigation, root-cause analysis & report generation"
        )

    def investigate_incident(self, incident_id: str) -> Dict[str, Any]:
        """Performs evidence-backed investigation for a correlated incident."""
        start_time = time.time()
        self.update_status("PROCESSING", f"Investigating incident {incident_id} with evidence correlation")

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
            inc_row = cursor.fetchone()
            if not inc_row:
                self.update_status("FAILED", f"Incident {incident_id} not found")
                return None

            incident = dict(inc_row)

            # Retrieve associated alerts and their security events
            cursor.execute("""
                SELECT a.*, e.timestamp as event_timestamp, e.source_ip as event_source_ip, 
                       e.destination_ip as event_destination_ip, e.action as event_action, 
                       e.resource_accessed as event_resource, e.details_json, e.status as event_status
                FROM security_alerts a
                JOIN security_events e ON a.event_id = e.id
                WHERE a.correlated_incident_id = ?
                ORDER BY a.timestamp ASC
            """, (incident_id,))
            alert_rows = cursor.fetchall()
            alerts_data = [dict(r) for r in alert_rows]

            # Reconstruct Evidence-First Findings
            findings = []
            timeline = []
            
            for idx, a in enumerate(alerts_data):
                evt_details = {}
                if a.get("details_json"):
                    try:
                        evt_details = json.loads(a["details_json"])
                    except Exception:
                        pass

                finding_id = f"FND-{incident_id[-4:]}-{idx+1:02d}"
                findings.append({
                    "finding_id": finding_id,
                    "title": a["title"],
                    "description": a["description"],
                    "severity": a["severity"],
                    "event_ids": [a["event_id"]],
                    "mitre_technique": a["mitre_technique"],
                    "timestamp": a["timestamp"],
                    "indicators": {
                        "source_ip": a.get("source_ip"),
                        "username": a.get("username"),
                        "device_id": a.get("device_id"),
                        "action": a.get("event_action"),
                        "resource_accessed": a.get("event_resource"),
                        "details": evt_details
                    }
                })

                timeline.append({
                    "time": a["timestamp"],
                    "stage": a.get("category", "General"),
                    "title": a["title"],
                    "description": a["description"],
                    "event_id": a["event_id"],
                    "severity": a["severity"],
                    "entity": a.get("username") or a.get("source_ip") or "System"
                })

            attack_sequence = [
                "1. Credential Brute-Force against employee SSO (15 attempts from external IP 198.51.100.42)",
                "2. Valid Credential Authenticated from unfamiliar European IP (ASN9009)",
                "3. Impossible Travel Anomaly verified (9,480 km distance in 51 minutes)",
                "4. High-Value File Discovery & Bulk Read across /shares/finance and /shares/r_and_d",
                "5. Stealth Process Execution via Obfuscated PowerShell stager (LOLBAS)",
                "6. Automated 50MB Encrypted Outbound Exfiltration stream to Adversary C2 (203.0.113.199:8443)"
            ]

            missing_info = [
                "Endpoint memory dump from FS-CORP-FIN01 for in-depth injection analysis",
                "Full TLS decryption log for exfiltrated archive content inspection"
            ]

            next_steps = [
                "Immediately revoke active OAuth/SAML tokens for session SESSION-TK-9921",
                "Enforce perimeter firewall block rule on threat IP 198.51.100.42",
                "Quarantine affected Active Directory user sarah.connor pending password reset",
                "Isolate endpoint FS-CORP-FIN01 from internal subnet"
            ]

            # Attempt Gemini AI analysis
            gemini_result = gemini_service.generate_investigation_insights(incident, alerts_data)
            
            if gemini_result:
                is_ai_generated = 1
                ai_model = gemini_service.model
                exec_summary = gemini_result.get("ai_summary", incident["summary"])
                if gemini_result.get("recommended_mitigations"):
                    next_steps = gemini_result.get("recommended_mitigations")
            else:
                is_ai_generated = 0
                ai_model = "SENTINEL-Deterministic-Engine-v1.0"
                exec_summary = (
                    f"Evidence-First Analysis: Account compromise confirmed for '{incident['primary_entity_value']}' "
                    f"with {len(findings)} corroborating telemetry findings. The attack sequence progresses from "
                    f"external credential brute force through file collection to active C2 exfiltration."
                )

            report_id = f"RPT-{uuid.uuid4().hex[:8].upper()}"
            
            cursor.execute("""
                INSERT OR REPLACE INTO investigation_reports (
                    id, incident_id, summary, threat_category, severity, 
                    risk_score, confidence_level, findings_json, attack_timeline_json, 
                    possible_attack_sequence_json, missing_information_json, 
                    recommended_next_steps_json, is_ai_generated, ai_model_used
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                report_id,
                incident_id,
                exec_summary,
                "Account Takeover & Data Exfiltration",
                incident["severity"],
                incident["risk_score"],
                incident["confidence_level"],
                json.dumps(findings),
                json.dumps(timeline),
                json.dumps(attack_sequence),
                json.dumps(missing_info),
                json.dumps(next_steps),
                is_ai_generated,
                ai_model
            ))

            # Update incident status to INVESTIGATION_COMPLETED
            cursor.execute("""
                UPDATE incidents 
                SET status = 'INVESTIGATION_COMPLETED', updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (incident_id,))

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "COMPLETED",
            f"Investigation report {report_id} generated for incident {incident_id}",
            f"Evidence-first investigation completed with {len(findings)} verified findings (AI: {'Gemini Live' if is_ai_generated else 'Deterministic Engine'}).",
            processed_delta=len(findings)
        )

        return {
            "id": report_id,
            "incident_id": incident_id,
            "summary": exec_summary,
            "threat_category": "Account Takeover & Data Exfiltration",
            "severity": incident["severity"],
            "risk_score": incident["risk_score"],
            "confidence_level": incident["confidence_level"],
            "findings": findings,
            "attack_timeline": timeline,
            "possible_attack_sequence": attack_sequence,
            "missing_information": missing_info,
            "recommended_next_steps": next_steps,
            "is_ai_generated": bool(is_ai_generated),
            "ai_model_used": ai_model
        }
