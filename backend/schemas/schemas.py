from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SecurityEventCreate(BaseModel):
    id: Optional[str] = None
    timestamp: str
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    username: Optional[str] = None
    device_id: Optional[str] = None
    event_type: str
    action: str
    resource_accessed: Optional[str] = None
    status: str
    severity: str = "INFORMATIONAL"
    details: Optional[Dict[str, Any]] = None

class SecurityEventResponse(BaseModel):
    id: str
    timestamp: str
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    username: Optional[str] = None
    device_id: Optional[str] = None
    event_type: str
    action: str
    resource_accessed: Optional[str] = None
    status: str
    severity: str
    details: Optional[Dict[str, Any]] = None
    is_suspicious: bool = False
    created_at: Optional[str] = None

class SecurityAlertResponse(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    risk_score: int
    category: str
    mitre_technique: Optional[str] = None
    event_id: str
    source_ip: Optional[str] = None
    username: Optional[str] = None
    device_id: Optional[str] = None
    timestamp: str
    correlated_incident_id: Optional[str] = None
    created_at: Optional[str] = None

class AttackGraphNode(BaseModel):
    id: str
    type: str # 'ip', 'user', 'device', 'alert', 'action', 'file'
    data: Dict[str, Any]
    position: Dict[str, float]

class AttackGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: Optional[bool] = False
    style: Optional[Dict[str, Any]] = None

class AttackGraphData(BaseModel):
    nodes: List[AttackGraphNode]
    edges: List[AttackGraphEdge]

class IncidentSummaryResponse(BaseModel):
    id: str
    title: str
    summary: str
    severity: str
    risk_score: int
    confidence_level: int
    status: str
    primary_entity_type: Optional[str] = None
    primary_entity_value: Optional[str] = None
    alert_count: int
    first_detected_at: str
    last_activity_at: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class EvidenceFinding(BaseModel):
    finding_id: str
    title: str
    description: str
    severity: str
    event_ids: List[str]
    mitre_technique: Optional[str] = None
    timestamp: str
    indicators: Dict[str, Any]

class AttackTimelineEvent(BaseModel):
    time: str
    stage: str
    title: str
    description: str
    event_id: str
    severity: str
    entity: str

class InvestigationReportResponse(BaseModel):
    id: str
    incident_id: str
    summary: str
    threat_category: str
    severity: str
    risk_score: int
    confidence_level: int
    findings: List[EvidenceFinding]
    attack_timeline: List[AttackTimelineEvent]
    possible_attack_sequence: List[str]
    missing_information: Optional[List[str]] = None
    recommended_next_steps: Optional[List[str]] = None
    is_ai_generated: bool
    ai_model_used: Optional[str] = None
    created_at: Optional[str] = None

class IncidentDetailResponse(BaseModel):
    incident: IncidentSummaryResponse
    alerts: List[SecurityAlertResponse]
    investigation_report: Optional[InvestigationReportResponse] = None
    attack_graph: Optional[AttackGraphData] = None
    response_actions: List[Any] = []
    verification_records: List[Any] = []

class ResponseActionResponse(BaseModel):
    id: str
    incident_id: str
    action_type: str
    title: str
    reason: str
    supporting_evidence: List[str]
    expected_impact: str
    risk_level: str
    status: str # PENDING_APPROVAL, APPROVED, REJECTED, EXECUTED, FAILED
    approval_decision_by: Optional[str] = None
    approval_decision_at: Optional[str] = None
    rejection_reason: Optional[str] = None
    simulation_result: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None

class ActionApprovalRequest(BaseModel):
    decision_by: str = "SOC Lead Analyst"
    rejection_reason: Optional[str] = None

class VerificationRequest(BaseModel):
    simulate_failure: bool = False
    analyst_notes: Optional[str] = None

class VerificationResponse(BaseModel):
    id: str
    response_action_id: str
    incident_id: str
    verification_status: str # VERIFIED_CONTAINED, VERIFICATION_FAILED
    checks_performed: List[Dict[str, Any]]
    analyst_notes: Optional[str] = None
    verified_at: str
    incident_status: str

class AgentStatus(BaseModel):
    name: str
    role: str
    status: str # IDLE, PROCESSING, COMPLETED, FAILED, WAITING_APPROVAL
    current_task: str
    processed_count: int
    latest_output: str
    last_executed_at: Optional[str] = None
    execution_duration_ms: int = 0

class DashboardStatsResponse(BaseModel):
    total_events: int
    active_incidents: int
    critical_threats: int
    resolved_incidents: int
    pending_approvals: int
    false_positives: int
    events_over_time: List[Dict[str, Any]]
    severity_distribution: List[Dict[str, Any]]
    incident_categories: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
