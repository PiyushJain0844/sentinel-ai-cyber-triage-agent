from fastapi import APIRouter, HTTPException
from backend.agents import investigation_agent
from backend.schemas.schemas import InvestigationReportResponse

router = APIRouter(prefix="/api/investigation", tags=["Investigation"])

@router.post("/{incident_id}", response_model=InvestigationReportResponse)
def trigger_investigation(incident_id: str):
    """Triggers or updates deep evidence-first investigation for an incident."""
    report = investigation_agent.investigate_incident(incident_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return InvestigationReportResponse(**report)
