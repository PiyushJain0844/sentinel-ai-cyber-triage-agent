# SENTINEL AI
### Autonomous Cyber Threat Investigation & Response Platform
**"From Alert to Verified Resolution"**

> **Hackathon Track:** PS06: AI-Powered Cybersecurity Triage  
> **Repository Size:** ~370 KB (Strictly under 10 MB Hackathon Limit)  
> **Core Architecture:** 6 Specialized Autonomous Python Agents + React Flow + FastAPI + SQLite  

---

## 1. Executive Summary & Vision

Modern Security Operations Centers (SOCs) are overwhelmed by thousands of disconnected security alerts per day. Analysts suffer from alert fatigue, spending hours manually cross-referencing IP addresses, examining login timestamps, and piecing together attack chains.

**SENTINEL AI** replaces fragmented alert triage with an end-to-end, multi-agent autonomous investigation system that executes the complete cybersecurity triage lifecycle:

$$\text{DETECT} \longrightarrow \text{CORRELATE} \longrightarrow \text{INVESTIGATE} \longrightarrow \text{RESPOND} \longrightarrow \text{VERIFY}$$

---

## 2. Core Unique Selling Propositions (USPs)

### 🛡️ USP 1: Evidence-First Investigation Engine
* **Zero Fabrications / Zero Hallucinations:** Traditional LLM chatbots often invent security conclusions without audit trails. SENTINEL AI guarantees that every generated conclusion is cryptographically traceable back to immutable log events.
* **Inspectable Ground Truth:** Clicking any finding or evidence badge (e.g., `[EVT-2026-1002]`) instantly opens the **Evidence Telemetry Inspector**, showing raw timestamps, source/destination IPs, decoded command lines, and SHA256-verified normalized schemas.

### 🕸️ USP 2: Cross-Alert Attack Reconstruction
* **Interactive React Flow Kill-Chain:** Apparently independent security alerts (brute-force bursts, unfamiliar IP logins, impossible travel, sensitive file reads, PowerShell stagers, and outbound C2 beacons) are automatically clustered across shared entities (users, IP subnets, session tokens, host endpoints).
* Visualizes the complete adversary path with interactive node styling, animated directional edges, and MITRE ATT&CK technique tags.

### 🔄 USP 3: Closed-Loop Security Verification
* **Never Stop at Recommendation:** Other AI security tools stop after suggesting a remediation script. SENTINEL AI enforces **closed-loop verification**.
* Once an analyst approves and executes an action (e.g., *Revoke Active User Session*), the **Verification Agent** performs automated follow-up telemetry probes:
  1. Active Session Introspection (checks HTTP 401 Unauthorized token invalidation)
  2. Edge Firewall Packet Drop Rate (probes whether adversary IP packets are dropped)
  3. Host Telemetry Check (verifies terminated process tree)
  4. Exfiltration Stream Probe (checks active TCP sockets)
* If containment passes, the incident transitions to `THREAT_CONTAINED`.
* If a simulated failure or persistent threat is detected, the incident is **immediately reopened** (`REOPENED_INVESTIGATION_REQUIRED`) with an escalation trigger!

---

## 3. The 6-Agent Autonomous Architecture

SENTINEL AI utilizes a lightweight, modular Python agent architecture without heavy, black-box orchestration frameworks:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SENTINEL AI AGENT PIPELINE                       │
└────────────────────────────────────────────────────────────────────────┘

 [1. Log Monitoring Agent]
       │ Ingests, normalizes heterogeneous schemas, and flags suspicious indicators.
       ▼
 [2. Threat Detection Agent]
       │ Applies deterministic rules + heuristics (brute force, impossible travel, LOLBAS).
       ▼
 [3. Alert Correlation Agent]
       │ Clusters alerts across shared IPs, users, sessions; builds React Flow kill-chain.
       ▼
 [4. Investigation Agent]
       │ Synthesizes Evidence-First report (Gemini 1.5 Live or Deterministic Fallback).
       ▼
 [5. Response Agent]
       │ Formulates targeted mitigations; enforces Human-in-the-Loop approval gate.
       ▼
 [6. Verification Agent]
       │ Probes containment efficacy; marks THREAT_CONTAINED or REOPENS incident.
```

### Detailed Agent Breakdown:
| Agent | Responsibility | Core Metrics & Outputs |
| :--- | :--- | :--- |
| **1. Log Monitoring Agent** | Ingests raw telemetry, parses timestamps, normalizes IP/User/Device fields, evaluates baseline filters. | Parsed event count, suspicious flag count, latency ms. |
| **2. Threat Detection Agent** | Detects brute-force logins, geographic anomalies (impossible travel), unauthorized file access, obfuscated PowerShell, and exfiltration bursts. | Risk scores (0–100), MITRE ATT&CK IDs (T1110, T1078, T1059.001, T1041). |
| **3. Alert Correlation Agent** | Correlates independent alerts by shared principal account, source IP, or session token. Builds the React Flow graph. | Unified Incidents, Attack Graph Nodes & Directed Edges. |
| **4. Investigation Agent** | Synthesizes an Evidence-First investigation report where every finding cites exact event IDs. | Severity, Composite Risk, Confidence %, Findings Array, Attack Timeline. |
| **5. Response Agent** | Recommends targeted remediations (Token Revocation, Firewall Drop, Account Quarantine, Host Isolation). Enforces human approval. | `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `EXECUTED` audit telemetry. |
| **6. Verification Agent** | Performs closed-loop active probes to verify containment. | `VERIFIED_CONTAINED` or `VERIFICATION_FAILED` (triggers automated Incident Reopen). |

---

## 4. Complete Technology Stack

### Frontend
* **React 18** with **Vite**
* **Tailwind CSS** (Custom SOC Dark Theme: `#080D18`, `#101827`, `#151F30`, `#38BDF8`)
* **React Flow** (`reactflow`) for the interactive cross-alert attack graph
* **Recharts** for real-time telemetry burst graphs and severity distribution
* **Lucide React** for SOC operations iconography
* **React Router v6** for modular SPA navigation

### Backend
* **Python 3.10+ / 3.14**
* **FastAPI** & **Uvicorn**
* **Pydantic v2** for request/response schema validation
* **SQLite3** with foreign key constraints enabled (`PRAGMA foreign_keys = ON`)
* **Pytest** for test automation suite

### AI & Reasoning Engine
* **Google Gemini 1.5 Flash API** for deep narrative reasoning & contextual threat actor profiling.
* **Deterministic Fallback Engine:** If an API key is missing or offline, the platform seamlessly runs on its built-in rule-based intelligence engine. It explicitly labels outputs as `Deterministic Engine` or `Gemini Live` to avoid simulated deception.

---

## 5. 8 Modular Website Pages

1. **Dashboard (`/`):** Summary metric cards, autonomous 6-agent active status bar, telemetry volume area chart, severity pie chart, live-style activity feed with evidence inspector links.
2. **Live Threat Monitoring (`/monitoring`):** Real-time event feed, multi-filter search (severity, event type, free-text keywords), "Inject Telemetry Event" action.
3. **Incident Management (`/incidents`):** Comprehensive registry of all correlated attack incidents with risk scores, alert counts, and status filters.
4. **Attack Investigation (`/investigation`):** Core USP view with the interactive React Flow attack graph, evidence-first findings citing concrete log IDs, and chronological attack timeline.
5. **AI Agent Activity (`/agents`):** Live telemetry for each of the 6 agents showing execution state, current task, latency, and latest outputs.
6. **Response Center (`/responses`):** Human-in-the-loop approval center. SOC analysts approve or reject recommendations with custom justifications and trigger safe simulated execution.
7. **Verification Center (`/verification`):** Closed-loop verification records, containment probes, and the **"Simulate Failed Verification"** button to demonstrate threat reopening.
8. **Settings (`/settings`):** System status, Gemini AI mode, database table counts, and threat intelligence configurations without exposing secrets.

---

## 6. End-to-End Sample Attack Scenario

### Scenario: *Employee Account Compromise & Data Exfiltration*
The platform includes a repeatable, end-to-end attack simulation:

| Event ID | Time (UTC) | Action | Technique | Details |
| :--- | :--- | :--- | :--- | :--- |
| `EVT-2026-1002` | 10:02 AM | `FAILED_LOGIN_BURST` | T1110.001 | 15 rapid failed logins targeting `sarah.connor` from `198.51.100.42`. |
| `EVT-2026-1003` | 10:05 AM | `SUCCESSFUL_LOGIN` | T1078.002 | Valid credential login immediately following brute-force from unfamiliar European IP. |
| `EVT-2026-1004` | 10:06 AM | `IMPOSSIBLE_TRAVEL` | T1078 | Authentication from Bucharest, RO 51 minutes after NYC login (9,480 km). |
| `EVT-2026-1005` | 10:08 AM | `UNUSUAL_FILE_ACCESS` | T1083 | Bulk unauthorized read of confidential payroll & executive R&D files. |
| `EVT-2026-1006` | 10:10 AM | `SUSPICIOUS_COMMAND` | T1059.001 | Obfuscated hidden PowerShell process spawned to invoke remote stager. |
| `EVT-2026-1007` | 10:12 AM | `DATA_EXFILTRATION` | T1041 | 50 MB outbound encrypted stream burst to adversary C2 IP `203.0.113.199:8443`. |

---

## 7. Installation & Quick Start

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/sentinel-ai-cyber-triage-agent.git
cd sentinel-ai-cyber-triage-agent
```

### Step 2: Backend Setup
```bash
# Optional: Set up virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# (Optional) Configure Gemini API Key
copy .env.example .env
# Edit .env and paste your GEMINI_API_KEY (or leave blank for Deterministic Fallback Mode)

# Run Backend Server (Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 3: Frontend Setup
```bash
cd frontend

# Install frontend dependencies
npm install

# Run Frontend Development Server (Port 5173)
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 8. Running the Backend Test Suite

SENTINEL AI includes 11 automated pytest test cases covering normalization, threat detection, correlation, investigation, approval/rejection, simulation, verification, and failure reopening:

```bash
pytest backend/tests/test_sentinel.py -v
```

Expected output:
```text
backend/tests/test_sentinel.py::test_settings_status PASSED
backend/tests/test_sentinel.py::test_log_monitoring_normalization PASSED
backend/tests/test_sentinel.py::test_threat_detection_rules_and_scoring PASSED
backend/tests/test_sentinel.py::test_alert_correlation_and_attack_graph PASSED
backend/tests/test_sentinel.py::test_evidence_first_investigation_report PASSED
backend/tests/test_sentinel.py::test_response_approval_rejection_and_simulation PASSED
backend/tests/test_sentinel.py::test_closed_loop_verification_success PASSED
backend/tests/test_sentinel.py::test_closed_loop_verification_failure_reopening PASSED
backend/tests/test_sentinel.py::test_all_six_agents_status PASSED
backend/tests/test_sentinel.py::test_dashboard_stats_endpoint PASSED
backend/tests/test_sentinel.py::test_events_filtering_and_ingestion PASSED

============================= 11 passed in 2.3s =============================
```

---

## 9. Hackathon Repository Size Verification

The project strictly abides by the hackathon requirement of **< 10 MB total repository size**:
* Total source code size: **~370 KB**
* Comprehensive `.gitignore` excludes `node_modules/`, `dist/`, `.venv/`, `*.db`, and cache files.
* Only clean source files, sample JSON, and configs are tracked.

---

## 10. Security & Ethical Development

1. **Human-in-the-Loop Safety:** Destructive operations (network drops, account locks) are never executed automatically. They require explicit analyst approval.
2. **Safe Simulation:** For hackathon demonstration, remediation actions are executed in a safe simulation layer recording realistic telemetry, latency, and rule IDs.
3. **No Secret Leaks:** API keys reside exclusively in backend environment variables and are never surfaced to the browser client.

---

## 11. License & Credits

Developed for **PS06: AI-Powered Cybersecurity Triage**.  
Engineered with precision for autonomous cyber defense.
