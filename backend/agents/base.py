import time
import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from backend.database.db import get_db

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.status = "IDLE"
        self.current_task = "Awaiting events"
        self.processed_count = 0
        self.latest_output = "Agent initialized and ready"
        self.last_executed_at = None
        self.execution_duration_ms = 0
        self._sync_state()

    def _sync_state(self):
        """Persists or updates the agent's current operational state in the database."""
        try:
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO agent_activity_logs (
                        agent_name, status, current_task, processed_count, 
                        latest_output, execution_duration_ms, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    self.name,
                    self.status,
                    self.current_task,
                    self.processed_count,
                    self.latest_output,
                    self.execution_duration_ms,
                    datetime.now(timezone.utc).isoformat()
                ))
        except Exception:
            pass

    def update_status(self, status: str, task: str, latest_output: Optional[str] = None, processed_delta: int = 0):
        self.status = status
        self.current_task = task
        if latest_output:
            self.latest_output = latest_output
        self.processed_count += processed_delta
        self.last_executed_at = datetime.now(timezone.utc).isoformat()
        self._sync_state()

    def get_state(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "current_task": self.current_task,
            "processed_count": self.processed_count,
            "latest_output": self.latest_output,
            "last_executed_at": self.last_executed_at,
            "execution_duration_ms": self.execution_duration_ms
        }
