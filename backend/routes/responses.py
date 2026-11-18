import json
from typing import List
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db
from backend.agents import response_agent
from backend.schemas.schemas import ResponseActionResponse, ActionApprovalRequest

router = APIRouter(prefix="/api/responses", tags=["Responses"])

@router.get("", response_model=List[ResponseActionResponse])
def get_responses():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM response_actions ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        results = []
        for r in rows:
            rd = dict(r)
            rd["supporting_evidence"] = json.loads(rd["supporting_evidence_json"]) if rd["supporting_evidence_json"] else []
            rd["simulation_result"] = json.loads(rd["simulation_result_json"]) if rd["simulation_result_json"] else None
            results.append(ResponseActionResponse(**rd))
        return results

@router.post("/{response_id}/approve", response_model=ResponseActionResponse)
def approve_response(response_id: str, request: ActionApprovalRequest = ActionApprovalRequest()):
    try:
        updated = response_agent.process_decision(
            action_id=response_id,
            decision="APPROVE",
            decision_by=request.decision_by
        )
        updated["supporting_evidence"] = json.loads(updated["supporting_evidence_json"]) if updated.get("supporting_evidence_json") else []
        updated["simulation_result"] = json.loads(updated["simulation_result_json"]) if updated.get("simulation_result_json") else None
        return ResponseActionResponse(**updated)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{response_id}/reject", response_model=ResponseActionResponse)
def reject_response(response_id: str, request: ActionApprovalRequest):
    try:
        updated = response_agent.process_decision(
            action_id=response_id,
            decision="REJECT",
            decision_by=request.decision_by,
            rejection_reason=request.rejection_reason or "Analyst rejected action based on operational impact."
        )
        updated["supporting_evidence"] = json.loads(updated["supporting_evidence_json"]) if updated.get("supporting_evidence_json") else []
        updated["simulation_result"] = json.loads(updated["simulation_result_json"]) if updated.get("simulation_result_json") else None
        return ResponseActionResponse(**updated)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{response_id}/execute", response_model=ResponseActionResponse)
def execute_response(response_id: str):
    try:
        executed = response_agent.simulate_execution(action_id=response_id)
        executed["supporting_evidence"] = json.loads(executed["supporting_evidence_json"]) if executed.get("supporting_evidence_json") else []
        return ResponseActionResponse(**executed)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
