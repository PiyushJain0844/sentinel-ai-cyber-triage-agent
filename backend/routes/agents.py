from typing import List
from fastapi import APIRouter
from backend.agents import ALL_AGENTS
from backend.schemas.schemas import AgentStatus

router = APIRouter(prefix="/api/agents", tags=["Agents"])

@router.get("/status", response_model=List[AgentStatus])
def get_agents_status():
    """Returns the operational status, current task, and telemetry for all 6 agents."""
    statuses = []
    for key, agent in ALL_AGENTS.items():
        state = agent.get_state()
        statuses.append(AgentStatus(**state))
    return statuses
