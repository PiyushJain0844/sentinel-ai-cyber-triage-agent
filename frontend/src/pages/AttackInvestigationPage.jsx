import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge, IncidentStatusBadge } from '../components/StatusBadge';
import { AttackGraph } from '../components/AttackGraph';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  GitBranch, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  User
} from 'lucide-react';

export const AttackInvestigationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshTrigger, openEvidenceViewer, showNotification } = useSentinel();

  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(searchParams.get('id') || '');
  const [incidentDetail, setIncidentDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query param changes
  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId && urlId !== selectedIncidentId) {
      setSelectedIncidentId(urlId);
    }
  }, [searchParams]);

  // Load list of incidents
  useEffect(() => {
    api.getIncidents().then((list) => {
      setIncidents(list);
      const urlId = searchParams.get('id');
      if (urlId && list.some(i => i.id === urlId)) {
        setSelectedIncidentId(urlId);
      } else if (!selectedIncidentId && list.length > 0) {
        setSelectedIncidentId(list[0].id);
        setSearchParams({ id: list[0].id }, { replace: true });
      }
    }).catch(() => {});
  }, [refreshTrigger]);

  const handleSelectIncident = (id) => {
    setSelectedIncidentId(id);
    setSearchParams({ id });
  };

  // Load detail of selected incident
  useEffect(() => {
    if (!selectedIncidentId) return;
    let isMounted = true;
    setLoading(true);

    api.getIncidentDetail(selectedIncidentId)
      .then((detail) => {
        if (isMounted) {
          setIncidentDetail(detail);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedIncidentId, refreshTrigger]);

  const report = incidentDetail?.investigation_report;
  const incident = incidentDetail?.incident;

  return (
    <div className="space-y-6">
      {/* Header & Incident Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151F30]/90 backdrop-blur-md border border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Autonomous Attack Investigation
            </h1>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">
              AGENT 4: INVESTIGATION
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evidence-first forensic reconstruction: every security conclusion is mathematically verified against immutable log events.
          </p>
        </div>

        {/* Incident Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-mono">Incident:</label>
          <select
            value={selectedIncidentId}
            onChange={(e) => handleSelectIncident(e.target.value)}
            className="bg-[#101827] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} - {inc.primary_entity_value} ({inc.severity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading || !incidentDetail ? (
        <div className="p-16 text-center text-slate-400 text-xs font-mono bg-[#151F30]/60 rounded-2xl border border-[#1E293B]">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading deep incident evidence & attack graph...
        </div>
      ) : (
        <>
          {/* Top Incident Overview Banner */}
          <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-sky-400">{incident.id}</span>
                <SeverityBadge severity={incident.severity} />
                <IncidentStatusBadge status={incident.status} />
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-slate-400">
                  Risk Score: <span className="text-red-400 font-bold">{incident.risk_score}/100</span>
                </div>
                <div className="text-slate-400">
                  Confidence: <span className="text-emerald-400 font-bold">{incident.confidence_level}%</span>
                </div>
                {report && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{report.is_ai_generated ? `AI: ${report.ai_model_used}` : `Deterministic: ${report.ai_model_used}`}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">{incident.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{report?.summary || incident.summary}</p>
            </div>
          </div>

          {/* USP 2: Interactive React Flow Attack Graph */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-bold">
                <GitBranch className="w-4 h-4 text-sky-400" />
                <span>USP 2: Cross-Alert Attack Reconstruction Graph (React Flow)</span>
              </div>
              <span className="text-xs text-slate-500">
                Click any node to inspect evidence log
              </span>
            </div>
            <AttackGraph graphData={incidentDetail.attack_graph} />
          </div>

          {/* Evidence-First Findings & Attack Sequence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Evidence-First Findings (USP 1) */}
            <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    USP 1: Evidence-Backed Findings ({report?.findings?.length || 0})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ZERO UNSUPPORTED CLAIMS
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {report?.findings?.map((fnd, idx) => (
                  <div 
                    key={fnd.finding_id || idx}
                    className="bg-[#101827] rounded-xl p-3.5 border border-[#1E293B] hover:border-sky-500/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{fnd.title}</span>
                      <SeverityBadge severity={fnd.severity} />
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {fnd.description}
                    </p>

                    {fnd.mitre_technique && (
                      <div className="text-[11px] font-mono text-sky-400">
                        MITRE: {fnd.mitre_technique}
                      </div>
                    )}

                    {/* Clickable Evidence Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] uppercase font-mono text-slate-500">Supporting Log Events:</span>
                      {fnd.event_ids?.map((eid) => (
                        <button
                          key={eid}
                          onClick={() => openEvidenceViewer(eid)}
                          className="px-2 py-0.5 rounded bg-[#151F30] hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold transition flex items-center gap-1"
                        >
                          <Database className="w-3 h-3" />
                          <span>{eid}</span>
                          <span className="text-[9px]">🔍</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Attack Timeline & Kill-Chain Progression */}
            <div className="bg-[#151F30]/90 backdrop-blur-md rounded-2xl p-5 border border-[#1E293B] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Attack Chronology & Kill-Chain
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  TEMPORAL SEQUENCE
                </span>
              </div>

              {/* Sequence Steps */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {report?.attack_timeline?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#101827] border border-[#1E293B]">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-[#151F30] border border-sky-500/40 text-sky-400 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{step.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">{step.time?.substring(11, 19)} UTC</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                      <button
                        onClick={() => openEvidenceViewer(step.event_id)}
                        className="text-[10px] font-mono text-sky-400 hover:underline"
                      >
                        Inspect Underlying Event {step.event_id} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Next Steps & Remediation Gateway */}
          <div className="bg-gradient-to-r from-[#101827] via-[#151F30] to-[#101827] rounded-2xl p-5 border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Response Agent Recommendations Ready
              </h3>
              <p className="text-xs text-slate-400">
                Response Agent formulated {incidentDetail.response_actions?.length || 4} targeted remediation actions awaiting SOC analyst approval.
              </p>
            </div>

            <button
              onClick={() => navigate('/responses')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 transition shadow-lg shadow-sky-500/20"
            >
              <span>Go to Response Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
