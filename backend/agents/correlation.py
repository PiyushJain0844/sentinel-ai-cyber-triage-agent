import json
import time
import uuid
from typing import List, Dict, Any
from backend.agents.base import BaseAgent
from backend.database.db import get_db

class AlertCorrelationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Alert Correlation Agent",
            role="Cross-alert correlation, attack sequence reconstruction & interactive graph generation"
        )

    def correlate_alerts(self, alerts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Groups alerts by shared entities (user, IP, device, timeframe) into unified incidents."""
        start_time = time.time()
        self.update_status("PROCESSING", f"Correlating {len(alerts)} security alerts across attack vectors")

        if not alerts:
            self.update_status("COMPLETED", "No alerts to correlate", "Zero active alerts", 0)
            return []

        # Group by shared user or shared IP
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for alert in alerts:
            user = alert.get("username")
            src_ip = alert.get("source_ip")
            
            # Primary cluster key
            cluster_key = user if user else (src_ip or "unassigned_entity")
            if cluster_key not in groups:
                groups[cluster_key] = []
            groups[cluster_key].append(alert)

        incidents = []
        with get_db() as conn:
            cursor = conn.cursor()
            
            for key, group_alerts in groups.items():
                if not group_alerts:
                    continue
                
                # Sort by timestamp
                group_alerts.sort(key=lambda a: a.get("timestamp", ""))
                
                first_time = group_alerts[0].get("timestamp")
                last_time = group_alerts[-1].get("timestamp")
                
                # Calculate aggregated risk score and severity
                max_risk = max(a.get("risk_score", 50) for a in group_alerts)
                avg_risk = sum(a.get("risk_score", 50) for a in group_alerts) / len(group_alerts)
                composite_risk = min(99, int(max_risk * 0.7 + avg_risk * 0.3 + (len(group_alerts) * 2)))
                
                if composite_risk >= 85:
                    severity = "CRITICAL"
                elif composite_risk >= 70:
                    severity = "HIGH"
                elif composite_risk >= 40:
                    severity = "MEDIUM"
                else:
                    severity = "LOW"

                incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"
                
                # Determine title & summary
                user_target = next((a.get("username") for a in group_alerts if a.get("username")), "Multiple Users")
                ip_target = next((a.get("source_ip") for a in group_alerts if a.get("source_ip")), "Unknown IP")
                observed = ", ".join(dict.fromkeys(a.get("category", "Security activity") for a in group_alerts))
                title = f"{observed or 'Security activity'}: {user_target}"
                summary = (f"{len(group_alerts)} alerts share the entity {user_target}"
                           f"{f' and source address {ip_target}' if ip_target != 'Unknown IP' else ''}. "
                           "Review the linked evidence to confirm whether these events represent a coordinated threat.")
                
                # Build React Flow graph structure
                graph_data = self._build_attack_graph(group_alerts, user_target, ip_target)

                # Confidence score based on corroborating independent alert types
                categories = set(a.get("category") for a in group_alerts)
                confidence = min(98, 70 + (len(categories) * 6))

                # Update alerts with correlated incident id
                for alert in group_alerts:
                    cursor.execute("""
                        UPDATE security_alerts 
                        SET correlated_incident_id = ? 
                        WHERE id = ?
                    """, (incident_id, alert.get("id")))

                # Insert incident
                cursor.execute("""
                    INSERT OR REPLACE INTO incidents (
                        id, title, summary, severity, risk_score, confidence_level, 
                        status, primary_entity_type, primary_entity_value, alert_count, 
                        first_detected_at, last_activity_at, attack_graph_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    incident_id,
                    title,
                    summary,
                    severity,
                    composite_risk,
                    confidence,
                    "THREAT_DETECTED",
                    "USER",
                    user_target,
                    len(group_alerts),
                    first_time,
                    last_time,
                    json.dumps(graph_data)
                ))

                incidents.append({
                    "id": incident_id,
                    "title": title,
                    "summary": summary,
                    "severity": severity,
                    "risk_score": composite_risk,
                    "confidence_level": confidence,
                    "status": "THREAT_DETECTED",
                    "primary_entity_type": "USER",
                    "primary_entity_value": user_target,
                    "alert_count": len(group_alerts),
                    "first_detected_at": first_time,
                    "last_activity_at": last_time,
                    "attack_graph": graph_data,
                    "alerts": group_alerts
                })

        duration_ms = int((time.time() - start_time) * 1000)
        self.execution_duration_ms = duration_ms
        self.update_status(
            "COMPLETED",
            "Cross-alert correlation & attack sequence reconstruction complete",
            f"Successfully correlated {len(alerts)} alerts into {len(incidents)} unified high-priority incident(s).",
            processed_delta=len(alerts)
        )
        return incidents

    def _build_attack_graph(self, alerts: List[Dict[str, Any]], username: str, source_ip: str) -> Dict[str, Any]:
        """Summarize observed alerts by category in chronological order; never infer causal links."""
        colors = ["#A66D47", "#D8955C", "#BD5A4A", "#5F806B", "#8A6B9C"]
        nodes = []
        edges = []
        groups: Dict[str, List[Dict[str, Any]]] = {}
        for alert in sorted(alerts, key=lambda item: item.get("timestamp") or ""):
            groups.setdefault(alert.get("category") or "Other activity", []).append(alert)

        categories = list(groups.items())
        for index, (category, category_alerts) in enumerate(categories):
            representative = category_alerts[0]
            node_id = f"category-{index}"
            row = index // 3
            col = index % 3 if row % 2 == 0 else 2 - (index % 3)
            severity_order = {"CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1}
            highest_severity = max((item.get("severity", "LOW") for item in category_alerts), key=lambda value: severity_order.get(value, 0))
            nodes.append({
                "id": node_id,
                "type": "customNode",
                "data": {
                    "label": f"{category}\n{len(category_alerts)} related alert{'s' if len(category_alerts) != 1 else ''}",
                    "category": category,
                    "entity": representative.get("username") or representative.get("source_ip") or username,
                    "badge": highest_severity,
                    "color": colors[index % len(colors)],
                    "event_id": representative.get("event_id"),
                    "event_ids": [alert.get("event_id") for alert in category_alerts],
                    "first_seen": representative.get("timestamp"),
                    "latest_title": category_alerts[-1].get("title"),
                },
                "position": {"x": 50 + col * 370, "y": 55 + row * 240}
            })
            if index:
                edges.append({"id": f"edge-{index}", "source": nodes[index - 1]["id"], "target": node_id, "type": "smoothstep",
                              "animated": True,
                              "style": {"stroke": colors[index % len(colors)], "strokeWidth": 2, "strokeDasharray": "6 5"}})
        return {"nodes": nodes, "edges": edges, "observed_source_ip": source_ip, "observed_user": username,
                "relationship_note": "Categories are ordered by first observed alert time. Connections show sequence, not proven causality."}
