from backend.agents.monitoring import LogMonitoringAgent
from backend.agents.detection import ThreatDetectionAgent
from backend.agents.correlation import AlertCorrelationAgent
from backend.agents.investigation import InvestigationAgent
from backend.agents.response import ResponseAgent
from backend.agents.verification import VerificationAgent

monitoring_agent = LogMonitoringAgent()
detection_agent = ThreatDetectionAgent()
correlation_agent = AlertCorrelationAgent()
investigation_agent = InvestigationAgent()
response_agent = ResponseAgent()
verification_agent = VerificationAgent()

ALL_AGENTS = {
    "monitoring": monitoring_agent,
    "detection": detection_agent,
    "correlation": correlation_agent,
    "investigation": investigation_agent,
    "response": response_agent,
    "verification": verification_agent
}
