import json
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from backend.database.db import get_db
from backend.schemas.schemas import SecurityEventResponse, SecurityEventCreate
from backend.services.orchestrator import orchestrator

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=List[SecurityEventResponse])
def get_events(
    severity: Optional[str] = Query(None, description="Filter by severity (CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL)"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    search: Optional[str] = Query(None, description="Search in username, IP, resource or action"),
    limit: int = Query(100, ge=1, le=500)
):
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM security_events WHERE 1=1"
        params = []

        if severity and severity.upper() != "ALL":
            query += " AND severity = ?"
            params.append(severity.upper())

        if event_type and event_type.upper() != "ALL":
            query += " AND event_type = ?"
            params.append(event_type.upper())

        if search:
            search_param = f"%{search}%"
            query += " AND (username LIKE ? OR source_ip LIKE ? OR destination_ip LIKE ? OR resource_accessed LIKE ? OR action LIKE ?)"
            params.extend([search_param] * 5)

        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)

        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        events = []
        for r in rows:
            d = dict(r)
            d["details"] = json.loads(d["details_json"]) if d["details_json"] else {}
            d["is_suspicious"] = bool(d["is_suspicious"])
            events.append(SecurityEventResponse(**d))
        return events

@router.post("", response_model=dict)
def ingest_events(events: List[SecurityEventCreate]):
    """Ingests one or more security logs into the pipeline."""
    if not events:
        raise HTTPException(status_code=400, detail="No events provided")
    
    raw_dicts = [e.model_dump() for e in events]
    result = orchestrator.run_pipeline(raw_dicts)
    return {
        "status": "success",
        "message": f"Processed {len(events)} events through SENTINEL AI pipeline",
        "pipeline_result": result
    }
