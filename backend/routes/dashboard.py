import json
from fastapi import APIRouter
from backend.database.db import get_db
from backend.schemas.schemas import DashboardStatsResponse

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Total events
        cursor.execute("SELECT COUNT(*) as count FROM security_events")
        total_events = cursor.fetchone()["count"]

        # Active Incidents (not contained)
        cursor.execute("SELECT COUNT(*) as count FROM incidents WHERE status != 'THREAT_CONTAINED'")
        active_incidents = cursor.fetchone()["count"]

        # Critical Threats
        cursor.execute("SELECT COUNT(*) as count FROM incidents WHERE severity = 'CRITICAL'")
        critical_threats = cursor.fetchone()["count"]

        # Resolved Incidents
        cursor.execute("SELECT COUNT(*) as count FROM incidents WHERE status = 'THREAT_CONTAINED'")
        resolved_incidents = cursor.fetchone()["count"]

        # Pending Approvals
        cursor.execute("SELECT COUNT(*) as count FROM response_actions WHERE status = 'PENDING_APPROVAL'")
        pending_approvals = cursor.fetchone()["count"]

        # False Positive Alerts (e.g. informational/benign)
        cursor.execute("SELECT COUNT(*) as count FROM security_events WHERE is_suspicious = 0")
        false_positives = cursor.fetchone()["count"]

        # Events over time (grouped by 5-min or hourly bucket)
        cursor.execute("""
            SELECT strftime('%H:%M', timestamp) as time_bucket, COUNT(*) as count 
            FROM security_events 
            GROUP BY time_bucket 
            ORDER BY time_bucket ASC 
            LIMIT 12
        """)
        time_rows = cursor.fetchall()
        events_over_time = [{"time": r["time_bucket"] or "UTC", "events": r["count"]} for r in time_rows]

        # Severity distribution
        cursor.execute("SELECT severity, COUNT(*) as count FROM security_events GROUP BY severity")
        sev_rows = cursor.fetchall()
        severity_distribution = [{"name": r["severity"], "value": r["count"]} for r in sev_rows]

        # Incident Categories
        cursor.execute("SELECT category as name, COUNT(*) as value FROM security_alerts GROUP BY category")
        cat_rows = cursor.fetchall()
        incident_categories = [{"name": r["name"], "value": r["value"]} for r in cat_rows]

        # Recent activity feed
        cursor.execute("""
            SELECT id, timestamp, event_type, severity, source_ip, username, action, is_suspicious
            FROM security_events 
            ORDER BY timestamp DESC 
            LIMIT 10
        """)
        recent_rows = cursor.fetchall()
        recent_activity = [
            {
                "id": r["id"],
                "timestamp": r["timestamp"],
                "event_type": r["event_type"],
                "severity": r["severity"],
                "source_ip": r["source_ip"] or "Internal",
                "username": r["username"] or "System",
                "action": r["action"],
                "status": "Suspicious" if r["is_suspicious"] else "Normal"
            }
            for r in recent_rows
        ]

        return DashboardStatsResponse(
            total_events=total_events,
            active_incidents=active_incidents,
            critical_threats=critical_threats,
            resolved_incidents=resolved_incidents,
            pending_approvals=pending_approvals,
            false_positives=false_positives,
            events_over_time=events_over_time,
            severity_distribution=severity_distribution,
            incident_categories=incident_categories,
            recent_activity=recent_activity
        )
