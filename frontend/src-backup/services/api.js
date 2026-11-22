function resolveApiBase() {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)) || '';
  if (!envUrl || envUrl.trim() === '') {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
}

const API_BASE = resolveApiBase();

function getAuthHeaders() {
  const token = localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  async login(email, password, rememberMe = false) {
    let res;
    try {
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember_me: rememberMe })
      });
    } catch (networkErr) {
      throw new Error(`Unable to reach the security backend (${API_BASE}). Please verify the backend service is running and CORS is configured.`);
    }

    if (!res.ok) {
      let errDetail = '';
      try {
        const errJson = await res.json();
        errDetail = errJson.detail || errJson.message;
      } catch (parseErr) {
        if (res.status === 404) {
          errDetail = `Authentication endpoint not found (HTTP 404 at ${API_BASE}/auth/login). Verify VITE_API_URL is configured in your deployment.`;
        } else if (res.status >= 500) {
          errDetail = `Backend server error (HTTP ${res.status}). Please check backend server logs.`;
        }
      }
      throw new Error(errDetail || 'Authentication failed. Please check credentials.');
    }
    return res.json();
  },

  async verifySession(token) {
    const authToken = token || localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token');
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        ...getAuthHeaders()
      }
    });
    if (!res.ok) throw new Error('Session invalid or expired');
    return res.json();
  },

  async logout() {
    const token = localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token');
    try {
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            ...getAuthHeaders()
          }
        });
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('sentinel_auth_token');
      localStorage.removeItem('sentinel_auth_user');
      sessionStorage.removeItem('sentinel_auth_token');
      sessionStorage.removeItem('sentinel_auth_user');
    }
  },

  // Dashboard
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: { ...getAuthHeaders() }
    });
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

    const res = await fetch(`${API_BASE}/events?${params.toString()}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load security events');
    return res.json();
  },

  async getEventById(id) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error(`Failed to load event ${id}`);
    return res.json();
  },

  async ingestEvents(eventsList) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(eventsList)
    });
    if (!res.ok) throw new Error('Failed to ingest events');
    return res.json();
  },

<<<<<<< HEAD
  async importEvents(eventsList, sourceName = 'uploaded log file') {
    const res = await fetch(`${API_BASE}/events/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ events: eventsList, source_name: sourceName })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || 'Failed to import log events');
    }
    return res.json();
  },

=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
  // Incidents
  async getIncidents() {
    const res = await fetch(`${API_BASE}/incidents`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load incidents');
    return res.json();
  },

  async getIncidentDetail(id) {
    const res = await fetch(`${API_BASE}/incidents/${id}`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error(`Failed to load incident details for ${id}`);
    return res.json();
  },

  // Investigation
  async triggerInvestigation(incidentId) {
    const res = await fetch(`${API_BASE}/investigation/${incidentId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error(`Failed to trigger investigation for ${incidentId}`);
    return res.json();
  },

  // Agents Status
  async getAgentsStatus() {
    const res = await fetch(`${API_BASE}/agents/status`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load agent statuses');
    return res.json();
  },

  // Responses
  async getResponses() {
    const res = await fetch(`${API_BASE}/responses`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load response recommendations');
    return res.json();
  },

  async approveResponse(id, decisionBy = 'SOC Lead Analyst') {
    const res = await fetch(`${API_BASE}/responses/${id}/approve`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ decision_by: decisionBy })
    });
    if (!res.ok) throw new Error(`Failed to approve response ${id}`);
    return res.json();
  },

  async rejectResponse(id, decisionBy = 'SOC Lead Analyst', rejectionReason = '') {
    const res = await fetch(`${API_BASE}/responses/${id}/reject`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ decision_by: decisionBy, rejection_reason: rejectionReason })
    });
    if (!res.ok) throw new Error(`Failed to reject response ${id}`);
    return res.json();
  },

  async executeResponse(id) {
    const res = await fetch(`${API_BASE}/responses/${id}/execute`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error(`Failed to execute response ${id}`);
    return res.json();
  },

  // Verification
  async getVerificationRecords() {
    const res = await fetch(`${API_BASE}/verification`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load verification records');
    return res.json();
  },

  async performVerification(actionId, simulateFailure = false, notes = '') {
    const res = await fetch(`${API_BASE}/verification/${actionId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ simulate_failure: simulateFailure, analyst_notes: notes })
    });
    if (!res.ok) throw new Error(`Failed to perform verification for action ${actionId}`);
    return res.json();
  },

  // Simulation
  async startSimulation() {
    const res = await fetch(`${API_BASE}/simulation/start`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
<<<<<<< HEAD
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || 'Failed to start simulation');
    }
    return res.json();
  },

  async getSimulationStatus() {
    const res = await fetch(`${API_BASE}/simulation/status`, { headers: { ...getAuthHeaders() } });
    if (!res.ok) throw new Error('Failed to read simulation progress');
=======
    if (!res.ok) throw new Error('Failed to start sample attack simulation');
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    return res.json();
  },

  async resetSimulation() {
    const res = await fetch(`${API_BASE}/simulation/reset`, {
      method: 'POST',
      headers: { ...getAuthHeaders() }
    });
<<<<<<< HEAD
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || 'Failed to reset simulation environment');
    }
=======
    if (!res.ok) throw new Error('Failed to reset simulation environment');
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    return res.json();
  },

  // Settings
  async getSettingsStatus() {
    const res = await fetch(`${API_BASE}/settings/status`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) throw new Error('Failed to load system settings');
    return res.json();
  }
};
