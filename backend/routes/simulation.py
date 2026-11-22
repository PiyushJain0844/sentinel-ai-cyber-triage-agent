from typing import Dict, Any
from fastapi import APIRouter, BackgroundTasks, HTTPException
from backend.services.orchestrator import orchestrator

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/start")
def start_simulation(background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Starts a fresh synthetic telemetry stream and processes it asynchronously."""
    try:
        simulation_id, events = orchestrator.start_live_simulation()
    except RuntimeError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    background_tasks.add_task(orchestrator.run_live_simulation, simulation_id, events)
    return orchestrator.get_simulation_status()

@router.get("/status")
def simulation_status() -> Dict[str, Any]:
    return orchestrator.get_simulation_status()

@router.post("/reset")
def reset_simulation() -> Dict[str, Any]:
    """Resets the demo environment to clean state."""
    if orchestrator.get_simulation_status().get("status") == "running":
        raise HTTPException(status_code=409, detail="Wait for the current simulation to finish before resetting.")
    orchestrator.reset_system()
    return {
        "status": "success",
        "message": "SENTINEL AI database and agent states reset to initial baseline"
    }
