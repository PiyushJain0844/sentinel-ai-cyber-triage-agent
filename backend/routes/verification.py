import json
from typing import List
from fastapi import APIRouter, HTTPException
from backend.database.db import get_db
from backend.agents import verification_agent
from backend.schemas.schemas import VerificationResponse, VerificationRequest

router = APIRouter(prefix="/api/verification", tags=["Verification"])

@router.get("", response_model=List[VerificationResponse])
def get_verification_records() -> List[VerificationResponse]:
    """Retrieves historical closed-loop verification records and posture telemetry."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT v.*, i.status as incident_status 
            FROM verification_records v
            JOIN incidents i ON v.incident_id = i.id
            ORDER BY v.verified_at DESC
        """)
        rows = cursor.fetchall()
        
        results = []
        for r in rows:
            rd = dict(r)
            rd["checks_performed"] = json.loads(rd["checks_performed_json"]) if rd["checks_performed_json"] else []
            results.append(VerificationResponse(**rd))
        return results

@router.post("/{response_id}", response_model=VerificationResponse)
def perform_verification(response_id: str, request: VerificationRequest = VerificationRequest()) -> VerificationResponse:
    """Executes closed-loop verification check with optional failure simulation."""
    try:
        result = verification_agent.verify_action(
            action_id=response_id,
            simulate_failure=request.simulate_failure,
            analyst_notes=request.analyst_notes
        )
        return VerificationResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
