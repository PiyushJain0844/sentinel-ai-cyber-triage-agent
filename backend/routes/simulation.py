from fastapi import APIRouter
from backend.services.orchestrator import orchestrator

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/start")
def start_simulation():
    """Runs the Employee Account Compromise end-to-end multi-agent scenario."""
    result = orchestrator.load_sample_attack_scenario()
    return {
        "status": "success",
        "message": "Sample attack scenario successfully processed through all 6 AI agents",
        "details": result
    }

@router.post("/reset")
def reset_simulation():
    """Resets the demo environment to clean state."""
    orchestrator.reset_system()
    return {
        "status": "success",
        "message": "SENTINEL AI database and agent states reset to initial baseline"
    }
