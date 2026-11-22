import json
<<<<<<< HEAD
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Body
=======
from typing import List, Optional, Union
from fastapi import APIRouter, HTTPException
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
from backend.database.db import get_db
from backend.schemas.schemas import SecurityEventResponse, SecurityEventCreate
from backend.services.orchestrator import orchestrator

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("", response_model=List[SecurityEventResponse])
def get_events(
    severity: Optional[str] = None,
    event_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100
) -> List[SecurityEventResponse]:
    """Retrieves normalized security events with optional filtering and search."""
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM security_events WHERE 1=1"
        params = []

        if isinstance(severity, str) and severity.upper() != "ALL":
            query += " AND severity = ?"
            params.append(severity.upper())

        if isinstance(event_type, str) and event_type.upper() != "ALL":
            query += " AND event_type = ?"
            params.append(event_type.upper())

        if isinstance(search, str) and search.strip():
            search_param = f"%{search.strip()}%"
            query += " AND (id LIKE ? OR username LIKE ? OR source_ip LIKE ? OR destination_ip LIKE ? OR resource_accessed LIKE ? OR action LIKE ?)"
            params.extend([search_param] * 6)

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

@router.get("/{event_id}", response_model=SecurityEventResponse)
def get_event_by_id(event_id: str) -> SecurityEventResponse:
    """Retrieves an exact event record by its primary key ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM security_events WHERE id = ?", (event_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
        d = dict(row)
        d["details"] = json.loads(d["details_json"]) if d["details_json"] else {}
        d["is_suspicious"] = bool(d["is_suspicious"])
        return SecurityEventResponse(**d)

@router.post("", response_model=dict)
def ingest_events(events: Union[SecurityEventCreate, List[SecurityEventCreate]]) -> dict:
    """Ingests one or more security logs into the pipeline."""
    if not isinstance(events, list):
        events = [events]
    if not events:
        raise HTTPException(status_code=400, detail="No events provided")
    
    raw_dicts = [e.model_dump() for e in events]
    result = orchestrator.run_pipeline(raw_dicts)
    return {
        "status": "success",
        "message": f"Processed {len(events)} events through SENTINEL AI pipeline",
        "pipeline_result": result
    }
<<<<<<< HEAD

@router.post("/import", response_model=dict)
def import_events(payload: Dict[str, Any] = Body(...)) -> dict:
    """Import a JSON/CSV-converted log export through the same live pipeline."""
    events = payload.get("events")
    source_name = str(payload.get("source_name") or "uploaded log file")[:160]
    if not isinstance(events, list) or not events:
        raise HTTPException(status_code=400, detail="The import must contain an events array with at least one record.")
    if len(events) > 5000:
        raise HTTPException(status_code=413, detail="Import up to 5,000 events at a time.")
    if not all(isinstance(event, dict) for event in events):
        raise HTTPException(status_code=400, detail="Every imported event must be a JSON object.")
    imported_at = datetime.now(timezone.utc).isoformat()
    prepared = []
    for event in events:
        item = dict(event)
        details = item.get("details")
        details = dict(details) if isinstance(details, dict) else {}
        details.update({"ingestion_method": "file_import", "ingestion_source": source_name, "imported_at": imported_at})
        item["details"] = details
        prepared.append(item)
    result = orchestrator.run_pipeline(prepared)
    return {"status": "success", "source_name": source_name, "imported_at": imported_at, **result}
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
