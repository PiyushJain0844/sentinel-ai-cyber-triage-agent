import os
import logging
import uvicorn
from typing import Dict, Any
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database.db import init_db, get_db, seed_demo_users
from backend.services.orchestrator import orchestrator
from backend.routes import (
    auth,
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

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan hook initializing SQLite schema, demo accounts, and baseline scenario."""
    # Initialize SQLite tables and seed authorized demo users
    init_db()
    with get_db() as conn:
        seed_demo_users(conn)
    
    # Check if empty, load baseline sample scenario automatically
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM security_events")
        count = cursor.fetchone()[0]
        if count == 0:
            try:
                orchestrator.load_sample_attack_scenario()
            except Exception as e:
                logger.warning(f"Could not seed sample logs on startup: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Cyber Threat Investigation & Response Platform - PS06 AI-Powered Cybersecurity Triage",
    lifespan=lifespan
)

# CORS Middleware supporting local development, Vercel preview/production domains, and custom origins
cors_origins_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]
if cors_origins_env:
    allowed_origins.extend([o.strip() for o in cors_origins_env.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if cors_origins_env else ["*"],
    allow_origin_regex=r"^https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include all modular routers
app.include_router(auth.router)
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
def root() -> Dict[str, Any]:
    """Root health and platform metadata endpoint."""
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "From Alert to Verified Resolution",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
