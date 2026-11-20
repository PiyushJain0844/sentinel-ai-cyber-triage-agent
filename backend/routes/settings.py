from typing import Dict, Any
from fastapi import APIRouter
from backend.config import settings
from backend.services.gemini_service import gemini_service
from backend.database.db import get_db

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("/status")
def get_system_settings_status() -> Dict[str, Any]:
    """Returns runtime telemetry, model status, and database connectivity."""
    ai_status = "Gemini API Active (Live Model: " + settings.GEMINI_MODEL + ")" if gemini_service.is_configured() else "Deterministic Rule-Based Engine (Fallback Mode)"
    
    # Check DB status
    db_status = "Operational (SQLite)"
    record_counts = {}
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM security_events")
            record_counts["events"] = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM security_alerts")
            record_counts["alerts"] = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM incidents")
            record_counts["incidents"] = cursor.fetchone()[0]
            cursor.execute("SELECT COUNT(*) FROM response_actions")
            record_counts["responses"] = cursor.fetchone()[0]
    except Exception as e:
        db_status = f"Error: {str(e)}"

    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "ai_integration": {
            "status": ai_status,
            "is_configured": gemini_service.is_configured(),
            "model": settings.GEMINI_MODEL,
            "mode": "Live AI" if gemini_service.is_configured() else "Deterministic Engine (No API key needed)"
        },
        "database": {
            "status": db_status,
            "engine": "SQLite3 (PRAGMA foreign_keys = ON)",
            "records": record_counts
        },
        "threat_intel": {
            "virustotal": "Active" if settings.VIRUSTOTAL_API_KEY else "Simulated / Synthetic Feeds",
            "abuseipdb": "Active" if settings.ABUSEIPDB_API_KEY else "Simulated / Synthetic Feeds"
        },
        "agents": {
            "count": 6,
            "names": [
                "Log Monitoring Agent",
                "Threat Detection Agent",
                "Alert Correlation Agent",
                "Investigation Agent",
                "Response Agent",
                "Verification Agent"
            ]
        }
    }
