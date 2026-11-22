import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from backend.database.db import get_db

logger = logging.getLogger("sentinel.agents.base")

class BaseAgent:
    """Base class for all autonomous agents in the SENTINEL AI pipeline.
    
    Provides standardized operational state tracking, database telemetry synchronization,
    and runtime performance instrumentation across all specialized agents.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.status = "IDLE"
        self.current_task = "Awaiting events"
        self.processed_count = 0
        self.latest_output = "Agent initialized and ready"
        self.last_executed_at: Optional[str] = None
        self.execution_duration_ms: int = 0
        self._sync_state()

    def _sync_state(self) -> None:
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
        except Exception as err:
            logger.debug("Failed to synchronize agent %s state: %s", self.name, err)

    def update_status(
        self, 
        status: str, 
        task: str, 
        latest_output: Optional[str] = None, 
        processed_delta: int = 0
    ) -> None:
        """Updates the agent's operational status and synchronizes with the telemetry store.
        
        Args:
            status: New state (e.g., 'IDLE', 'PROCESSING', 'COMPLETED', 'FAILED').
            task: Human-readable description of current task or activity.
            latest_output: Diagnostic output or summary message.
            processed_delta: Number of newly processed items to increment counter.
        """
        self.status = status
        self.current_task = task
        if latest_output:
            self.latest_output = latest_output
        self.processed_count += processed_delta
        self.last_executed_at = datetime.now(timezone.utc).isoformat()
        self._sync_state()

    def get_state(self) -> Dict[str, Any]:
        """Returns a serialized dictionary of the agent's current operational telemetry."""
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
