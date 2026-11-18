import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database.db import init_db, get_db
from backend.services.orchestrator import orchestrator
from backend.routes import (
    dashboard,
    events,
    incidents,
    investigation,
    agents,
    responses,
    verification,
    simulation,
    settings as settings_route
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables
    init_db()
    
    # Check if empty, load baseline sample scenario automatically
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM security_events")
        count = cursor.fetchone()[0]
        if count == 0:
            try:
                orchestrator.load_sample_attack_scenario()
            except Exception as e:
                print(f"Warning: could not seed sample logs: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Cyber Threat Investigation & Response Platform - PS06 AI-Powered Cybersecurity Triage",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all modular routers
app.include_router(dashboard.router)
app.include_router(events.router)
app.include_router(incidents.router)
app.include_router(investigation.router)
app.include_router(agents.router)
app.include_router(responses.router)
app.include_router(verification.router)
app.include_router(simulation.router)
app.include_router(settings_route.router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "From Alert to Verified Resolution",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main.py:app", host=settings.HOST, port=settings.PORT, reload=True)
