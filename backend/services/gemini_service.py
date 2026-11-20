import os
import json
import requests
from typing import Dict, Any, Optional
from backend.config import settings

class GeminiService:
    """Service wrapper for Google Gemini LLM API with graceful offline fallback."""

    def __init__(self) -> None:
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model = settings.GEMINI_MODEL or "gemini-1.5-flash"
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    def is_configured(self) -> bool:
        """Returns True only if a non-empty, non-placeholder API key is set."""
        return bool(self.api_key and not self.api_key.startswith("your_") and len(self.api_key) > 10)

    def generate_investigation_insights(self, incident: Dict[str, Any], events: list) -> Optional[Dict[str, Any]]:
        """
        Calls Gemini API for deep narrative reasoning when configured.
        Returns None if not configured or call fails, prompting graceful fallback.
        """
        if not self.is_configured():
            return None

        prompt = f"""
You are SENTINEL AI's autonomous Cyber Threat Investigation Lead.
Analyze this correlated security incident and its supporting security events.

INCIDENT:
Title: {incident.get('title')}
Summary: {incident.get('summary')}
Severity: {incident.get('severity')}
Entity: {incident.get('primary_entity_value')}

EVIDENCE EVENTS:
{json.dumps(events, indent=2)}

Provide your response in strictly valid JSON format with this exact schema:
{{
  "ai_summary": "Comprehensive 2-3 sentence executive threat briefing explaining the attack progression",
  "threat_actor_profile": "Assessment of threat actor tactics, likely intent, and sophistication",
  "attack_narrative": "Step-by-step narrative of the compromise kill-chain",
  "critical_evidence_cited": ["Array of specific event IDs and what they prove"],
  "recommended_mitigations": ["Prioritized immediate containment actions"],
  "confidence_reasoning": "Why confidence is high based on empirical telemetry"
}}
Do not include any markdown fences (no ```json or ```). Return pure JSON only.
"""

        try:
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 1024
                }
            }

            response = requests.post(
                f"{self.api_url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=12
            )

            if response.status_code == 200:
                result = response.json()
                text_content = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean any accidental markdown backticks
                if text_content.startswith("```json"):
                    text_content = text_content[7:]
                if text_content.startswith("```"):
                    text_content = text_content[3:]
                if text_content.endswith("```"):
                    text_content = text_content[:-3]
                parsed = json.loads(text_content.strip())
                return parsed
        except Exception as e:
            # Fall back gracefully to deterministic engine
            return None

        return None

gemini_service = GeminiService()
