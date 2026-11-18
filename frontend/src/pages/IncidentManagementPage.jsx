import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge, IncidentStatusBadge } from '../components/StatusBadge';
import { 
  AlertOctagon, 
  Search, 
  ArrowRight, 
  Clock, 
  User, 
  Layers, 
  Activity,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const IncidentManagementPage = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useSentinel();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadIncidents() {
      setLoading(true);
      try {
        const data = await api.getIncidents();
        if (isMounted) {
          setIncidents(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadIncidents();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const filtered = incidents.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151F30]/90 backdrop-blur-md border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Incident Management
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20">
              AGENT 3: ALERT CORRELATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated multi-stage attack campaigns correlated across user accounts, endpoints, and threat vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-white font-bold">{incidents.length}</span> Total Incidents
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-4 border border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-[#101827] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#101827] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="THREAT_DETECTED">Threat Detected</option>
            <option value="INVESTIGATION_COMPLETED">Investigation Completed</option>
            <option value="RESPONSE_PENDING">Response Pending</option>
            <option value="RESPONSE_EXECUTED">Response Executed</option>
            <option value="THREAT_CONTAINED">Threat Contained</option>
            <option value="REOPENED_INVESTIGATION_REQUIRED">Reopened</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} correlated incident(s)
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading correlated incidents...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#151F30]/60 rounded-2xl border border-[#1E293B]">
            <AlertOctagon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No incidents found</p>
            <p className="text-xs text-slate-500 mt-1">Run the attack simulation to generate correlated incidents.</p>
          </div>
        ) : (
          filtered.map((inc) => (
            <div 
              key={inc.id}
              onClick={() => navigate(`/investigation?id=${inc.id}`)}
              className="group bg-[#151F30]/90 hover:bg-[#1A273D]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] hover:border-sky-500/40 transition-all cursor-pointer shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-400">{inc.id}</span>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {inc.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IncidentStatusBadge status={inc.status} />
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Score</span>
                    <span className="text-base font-black font-mono text-red-400">{inc.risk_score}/100</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {inc.summary}
              </p>

              {/* Badges / Metrics Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <User className="w-3.5 h-3.5" /> {inc.primary_entity_value}
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-300">
                    <Layers className="w-3.5 h-3.5" /> {inc.alert_count} Correlated Alerts
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <Activity className="w-3.5 h-3.5" /> Confidence: {inc.confidence_level}%
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {inc.first_detected_at?.substring(11, 19)} → {inc.last_activity_at?.substring(11, 19)} UTC
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sky-400 group-hover:text-sky-300 font-semibold text-xs">
                  <span>Open Deep Investigation</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
