const API_BASE = '/api';

export const api = {
  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    return res.json();
  },

  // Events
  async getEvents({ severity, eventType, search, limit = 100 } = {}) {
    const params = new URLSearchParams();
    if (severity && severity !== 'ALL') params.append('severity', severity);
    if (eventType && eventType !== 'ALL') params.append('event_type', eventType);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);

    const res = await fetch(`${API_BASE}/events?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load security events');
    return res.json();
  },

  async getEventById(id) {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (!res.ok) throw new Error(`Failed to load event ${id}`);
    return res.json();
  },

  async ingestEvents(eventsList) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventsList)
    });
    if (!res.ok) throw new Error('Failed to ingest events');
    return res.json();
  },

  // Incidents
  async getIncidents() {
    const res = await fetch(`${API_BASE}/incidents`);
    if (!res.ok) throw new Error('Failed to load incidents');
    return res.json();
  },

  async getIncidentDetail(id) {
    const res = await fetch(`${API_BASE}/incidents/${id}`);
    if (!res.ok) throw new Error(`Failed to load incident details for ${id}`);
    return res.json();
  },

  // Investigation
  async triggerInvestigation(incidentId) {
    const res = await fetch(`${API_BASE}/investigation/${incidentId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to trigger investigation for ${incidentId}`);
    return res.json();
  },

  // Agents Status
  async getAgentsStatus() {
    const res = await fetch(`${API_BASE}/agents/status`);
    if (!res.ok) throw new Error('Failed to load agent statuses');
    return res.json();
  },

  // Responses
  async getResponses() {
    const res = await fetch(`${API_BASE}/responses`);
    if (!res.ok) throw new Error('Failed to load response recommendations');
    return res.json();
  },

  async approveResponse(id, decisionBy = 'SOC Lead Analyst') {
    const res = await fetch(`${API_BASE}/responses/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision_by: decisionBy })
    });
    if (!res.ok) throw new Error(`Failed to approve response ${id}`);
    return res.json();
  },

  async rejectResponse(id, decisionBy = 'SOC Lead Analyst', rejectionReason = '') {
    const res = await fetch(`${API_BASE}/responses/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision_by: decisionBy, rejection_reason: rejectionReason })
    });
    if (!res.ok) throw new Error(`Failed to reject response ${id}`);
    return res.json();
  },

  async executeResponse(id) {
    const res = await fetch(`${API_BASE}/responses/${id}/execute`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to execute response ${id}`);
    return res.json();
  },

  // Verification
  async getVerificationRecords() {
    const res = await fetch(`${API_BASE}/verification`);
    if (!res.ok) throw new Error('Failed to load verification records');
    return res.json();
  },

  async performVerification(actionId, simulateFailure = false, notes = '') {
    const res = await fetch(`${API_BASE}/verification/${actionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulate_failure: simulateFailure, analyst_notes: notes })
    });
    if (!res.ok) throw new Error(`Failed to perform verification for action ${actionId}`);
    return res.json();
  },

  // Simulation
  async startSimulation() {
    const res = await fetch(`${API_BASE}/simulation/start`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to start sample attack simulation');
    return res.json();
  },

  async resetSimulation() {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset simulation environment');
    return res.json();
  },

  // Settings
  async getSettingsStatus() {
    const res = await fetch(`${API_BASE}/settings/status`);
    if (!res.ok) throw new Error('Failed to load system settings');
    return res.json();
  }
};
