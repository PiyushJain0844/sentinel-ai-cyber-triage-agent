import json
from typing import List
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db
from backend.schemas.schemas import (
    IncidentSummaryResponse,
    IncidentDetailResponse,
    SecurityAlertResponse,
    InvestigationReportResponse,
    AttackGraphData
)

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentSummaryResponse])
def get_incidents() -> List[IncidentSummaryResponse]:
    """Retrieves all correlated security incidents ordered by risk score."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM incidents ORDER BY risk_score DESC, created_at DESC")
        rows = cursor.fetchall()
        
        incidents = []
        for r in rows:
            incidents.append(IncidentSummaryResponse(**dict(r)))
        return incidents

@router.get("/{incident_id}", response_model=IncidentDetailResponse)
def get_incident_detail(incident_id: str) -> IncidentDetailResponse:
    """Retrieves comprehensive incident details including attack graph, alerts, and report."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Incident
        cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
        inc_row = cursor.fetchone()
        if not inc_row:
            raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
        
        incident_dict = dict(inc_row)
        attack_graph_raw = incident_dict.get("attack_graph_json")
        attack_graph = AttackGraphData(**json.loads(attack_graph_raw)) if attack_graph_raw else None

        # 2. Alerts
        cursor.execute("""
            SELECT * FROM security_alerts 
            WHERE correlated_incident_id = ? 
            ORDER BY timestamp ASC
        """, (incident_id,))
        alerts = [SecurityAlertResponse(**dict(r)) for r in cursor.fetchall()]

        # 3. Investigation Report
        cursor.execute("SELECT * FROM investigation_reports WHERE incident_id = ? ORDER BY created_at DESC LIMIT 1", (incident_id,))
        rpt_row = cursor.fetchone()
        investigation_report = None
        if rpt_row:
            rpt = dict(rpt_row)
            investigation_report = InvestigationReportResponse(
                id=rpt["id"],
                incident_id=rpt["incident_id"],
                summary=rpt["summary"],
                threat_category=rpt["threat_category"],
                severity=rpt["severity"],
                risk_score=rpt["risk_score"],
                confidence_level=rpt["confidence_level"],
                findings=json.loads(rpt["findings_json"]) if rpt["findings_json"] else [],
                attack_timeline=json.loads(rpt["attack_timeline_json"]) if rpt["attack_timeline_json"] else [],
                possible_attack_sequence=json.loads(rpt["possible_attack_sequence_json"]) if rpt["possible_attack_sequence_json"] else [],
                missing_information=json.loads(rpt["missing_information_json"]) if rpt["missing_information_json"] else [],
                recommended_next_steps=json.loads(rpt["recommended_next_steps_json"]) if rpt["recommended_next_steps_json"] else [],
                is_ai_generated=bool(rpt["is_ai_generated"]),
                ai_model_used=rpt["ai_model_used"],
                created_at=rpt["created_at"]
            )

        # 4. Response Actions
        cursor.execute("SELECT * FROM response_actions WHERE incident_id = ?", (incident_id,))
        response_rows = cursor.fetchall()
        response_actions = []
        for ra in response_rows:
            rad = dict(ra)
            response_actions.append({
                "id": rad["id"],
                "incident_id": rad["incident_id"],
                "action_type": rad["action_type"],
                "title": rad["title"],
                "reason": rad["reason"],
                "supporting_evidence": json.loads(rad["supporting_evidence_json"]) if rad["supporting_evidence_json"] else [],
                "expected_impact": rad["expected_impact"],
                "risk_level": rad["risk_level"],
                "status": rad["status"],
                "approval_decision_by": rad["approval_decision_by"],
                "approval_decision_at": rad["approval_decision_at"],
                "rejection_reason": rad["rejection_reason"],
                "simulation_result": json.loads(rad["simulation_result_json"]) if rad["simulation_result_json"] else None,
                "created_at": rad["created_at"]
            })

        # 5. Verification Records
        cursor.execute("SELECT * FROM verification_records WHERE incident_id = ? ORDER BY verified_at DESC", (incident_id,))
        verif_rows = cursor.fetchall()
        verification_records = []
        for vr in verif_rows:
            vrd = dict(vr)
            verification_records.append({
                "id": vrd["id"],
                "response_action_id": vrd["response_action_id"],
                "incident_id": vrd["incident_id"],
                "verification_status": vrd["verification_status"],
                "checks_performed": json.loads(vrd["checks_performed_json"]) if vrd["checks_performed_json"] else [],
                "analyst_notes": vrd["analyst_notes"],
                "verified_at": vrd["verified_at"]
            })

        return IncidentDetailResponse(
            incident=IncidentSummaryResponse(**incident_dict),
            alerts=alerts,
            investigation_report=investigation_report,
            attack_graph=attack_graph,
            response_actions=response_actions,
            verification_records=verification_records
        )
