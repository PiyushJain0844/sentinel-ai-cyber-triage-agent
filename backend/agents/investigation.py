import json
import time
import uuid
from typing import Optional, Dict, Any
from backend.agents.base import BaseAgent
from backend.database.db import get_db
from backend.services.gemini_service import gemini_service

class InvestigationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Investigation Agent",
            role="Evidence-first deep threat investigation, root-cause analysis & report generation"
        )

    def investigate_incident(self, incident_id: str) -> Optional[Dict[str, Any]]:
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
                f"{idx}. {alert.get('category', 'Observed activity')}: {alert.get('title', 'Alert')} "
                f"(event {alert.get('event_id', 'unknown')}, {alert.get('timestamp', 'time unavailable')})"
                for idx, alert in enumerate(alerts_data, start=1)
            ] or ["No linked alert events are available for this incident."]
            missing_info = []
            if not any(alert.get("event_source_ip") for alert in alerts_data):
                missing_info.append("Source address is not present in linked events.")
            if not any(alert.get("device_id") for alert in alerts_data):
                missing_info.append("Endpoint identity is not present in linked events.")
            next_steps = [
                f"Review the linked evidence for {incident.get('primary_entity_value') or 'the affected entity'} before containment.",
                "Confirm account, endpoint, and network context with the relevant system owners.",
                "Choose an approved response only after validating the evidence and operational impact."
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
                    f"Evidence-first analysis found {len(findings)} linked alert findings for "
                    f"'{incident.get('primary_entity_value') or 'the affected entity'}'. Treat each finding as an indicator "
                    "for analyst review; this report does not establish compromise on its own."
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
                (alerts_data[0].get("category") or "Security investigation") if alerts_data else "Security investigation",
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
            "threat_category": (alerts_data[0].get("category") or "Security investigation") if alerts_data else "Security investigation",
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
