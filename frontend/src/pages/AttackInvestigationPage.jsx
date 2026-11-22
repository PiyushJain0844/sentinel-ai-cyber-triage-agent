import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge, IncidentStatusBadge } from '../components/StatusBadge';
import { AttackGraph } from '../components/AttackGraph';
import { 
  ShieldCheck, 
  Clock, 
  GitBranch, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Database
} from 'lucide-react';

export const AttackInvestigationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshTrigger, openEvidenceViewer } = useSentinel();

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-lg">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Attack Investigation
            </h1>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs font-mono border border-purple-500/20">
              FORENSIC ANALYSIS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Forensic attack reconstruction: every security conclusion is verifiable against immutable log telemetry.
          </p>
        </div>

        {/* Incident Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <label className="text-xs text-slate-400 font-mono shrink-0">Select Incident:</label>
          <select
            value={selectedIncidentId}
            onChange={(e) => handleSelectIncident(e.target.value)}
            className="w-full sm:w-auto max-w-full sm:max-w-xs bg-[#0D1422] border border-[#1E2B42] focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono truncate transition"
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
        <div className="p-16 text-center text-slate-400 text-xs font-mono bg-[#141E2E] rounded-2xl border border-[#1E2B42]">
          <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading deep incident evidence & attack graph...
        </div>
      ) : (
        <>
          {/* Top Incident Overview Banner */}
          <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2B42]">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-sm font-mono font-bold text-sky-400">{incident.id}</span>
                <SeverityBadge severity={incident.severity} />
                <IncidentStatusBadge status={incident.status} />
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
                <div className="text-slate-400">
                  Risk: <span className="text-red-400 font-bold">{incident.risk_score}/100</span>
                </div>
                <div className="text-slate-400">
                  Confidence: <span className="text-emerald-400 font-bold">{incident.confidence_level}%</span>
                </div>
                {report && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>{report.is_ai_generated ? `AI: ${report.ai_model_used}` : `${report.ai_model_used}`}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{incident.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words">{report?.summary || incident.summary}</p>
            </div>
          </div>

          {/* Interactive React Flow Attack Graph */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-bold">
                <GitBranch className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Evidence timeline</span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
                Groups are ordered by first alert · links show order, not proven cause
              </span>
            </div>
            <AttackGraph graphData={incidentDetail.attack_graph} />
          </div>

          {/* Evidence-First Findings & Attack Sequence Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Corroborated Security Findings */}
            <div className="bg-[#141E2E] rounded-2xl p-5 border border-[#1E2B42] shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2B42]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Corroborated Security Findings ({report?.findings?.length || 0})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  TELEMETRY BACKED
                </span>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {report?.findings?.map((fnd, idx) => (
                  <div 
                    key={fnd.finding_id || idx}
                    className="bg-[#0D1422] rounded-xl p-3.5 border border-[#1E2B42] hover:border-sky-500/40 transition space-y-2"
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
                        MITRE ATT&CK: {fnd.mitre_technique}
                      </div>
                    )}

                    {/* Supporting Evidence Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#1E2B42]/70">
                      <span className="text-[10px] uppercase font-mono text-slate-500">Supporting Events:</span>
                      {fnd.event_ids?.map((eid) => (
                        <button
                          key={eid}
                          onClick={() => openEvidenceViewer(eid)}
                          className="px-2 py-0.5 rounded bg-[#141E2E] hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/30 text-[11px] font-mono font-bold transition flex items-center gap-1"
                        >
                          <Database className="w-3 h-3" />
                          <span>{eid}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Attack Chronology & Progression */}
            <div className="bg-[#141E2E] rounded-2xl p-5 border border-[#1E2B42] shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2B42]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Attack Chronology & Progression
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  TEMPORAL SEQUENCE
                </span>
              </div>

              {/* Sequence Steps */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {report?.attack_timeline?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#0D1422] border border-[#1E2B42]">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-[#141E2E] border border-sky-500/40 text-sky-400 font-mono text-xs font-bold flex items-center justify-center">
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
          <div className="bg-[#141E2E] rounded-2xl p-5 border border-[#1E2B42] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Response Actions Formulated
              </h3>
              <p className="text-xs text-slate-400">
                Response Agent formulated {incidentDetail.response_actions?.length || 4} targeted containment actions awaiting SOC analyst approval.
              </p>
            </div>

            <button
              onClick={() => navigate('/responses')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 transition shadow-md shadow-sky-500/10"
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
