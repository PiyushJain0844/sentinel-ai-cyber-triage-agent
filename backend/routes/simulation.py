from typing import Dict, Any
<<<<<<< HEAD
from fastapi import APIRouter, BackgroundTasks, HTTPException
=======
from fastapi import APIRouter
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
from backend.services.orchestrator import orchestrator

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])

@router.post("/start")
<<<<<<< HEAD
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
=======
def start_simulation() -> Dict[str, Any]:
    """Runs the Employee Account Compromise end-to-end multi-agent scenario."""
    result = orchestrator.load_sample_attack_scenario()
    return {
        "status": "success",
        "message": "Sample attack scenario successfully processed through all 6 AI agents",
        "details": result
    }
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d

@router.post("/reset")
def reset_simulation() -> Dict[str, Any]:
    """Resets the demo environment to clean state."""
<<<<<<< HEAD
    if orchestrator.get_simulation_status().get("status") == "running":
        raise HTTPException(status_code=409, detail="Wait for the current simulation to finish before resetting.")
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    orchestrator.reset_system()
    return {
        "status": "success",
        "message": "SENTINEL AI database and agent states reset to initial baseline"
    }
