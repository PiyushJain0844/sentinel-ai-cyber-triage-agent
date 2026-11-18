import json
import os
from typing import List, Dict, Any
from backend.agents import (
    monitoring_agent,
    detection_agent,
    correlation_agent,
    investigation_agent,
    response_agent,
    verification_agent
)
from backend.database.db import reset_db, init_db

class MultiAgentOrchestrator:
    def __init__(self):
        init_db()

    def run_pipeline(self, raw_logs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs the full 6-agent triage and investigation pipeline:
        DETECT (Monitoring + Detection) -> CORRELATE -> INVESTIGATE -> RESPOND (Recommendations)
        """
        # 1. Monitoring Agent
        events = monitoring_agent.process_logs(raw_logs)

        # 2. Threat Detection Agent
        alerts = detection_agent.process_events(events)

        # 3. Correlation Agent
        incidents = correlation_agent.correlate_alerts(alerts)

        # 4. Investigation Agent & 5. Response Agent for each incident
        investigations = []
        responses = []
        for inc in incidents:
            report = investigation_agent.investigate_incident(inc["id"])
            if report:
                investigations.append(report)
            recs = response_agent.generate_recommendations(inc["id"])
            responses.extend(recs)

        return {
            "events_processed": len(events),
            "alerts_detected": len(alerts),
            "incidents_created": len(incidents),
            "investigations_completed": len(investigations),
            "responses_formulated": len(responses),
            "incidents": incidents
        }

    def load_sample_attack_scenario(self) -> Dict[str, Any]:
        """Loads the Employee Account Compromise scenario from sample_data/security_logs.json."""
        sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "sample_data", "security_logs.json")
        sample_path = os.path.abspath(sample_path)
        
        with open(sample_path, "r", encoding="utf-8") as f:
            sample_logs = json.load(f)

        return self.run_pipeline(sample_logs)

    def reset_system(self):
        """Resets all data and reinitializes agent states."""
        reset_db()
        for agent in [monitoring_agent, detection_agent, correlation_agent, investigation_agent, response_agent, verification_agent]:
            agent.status = "IDLE"
            agent.current_task = "System ready / Awaiting input"
            agent.processed_count = 0
            agent.latest_output = "Reset to clean state"
            agent.execution_duration_ms = 0
            agent._sync_state()

orchestrator = MultiAgentOrchestrator()
