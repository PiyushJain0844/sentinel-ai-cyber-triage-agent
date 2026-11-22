import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge } from '../components/StatusBadge';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Play, 
  Clock, 
  ArrowRight, 
  Database, 
  Terminal, 
  RotateCw 
} from 'lucide-react';

export const ResponseCenterPage = () => {
  const navigate = useNavigate();
  const { refreshTrigger, triggerRefresh, openEvidenceViewer, showNotification } = useSentinel();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getResponses().then((data) => {
      if (isMounted) {
        setResponses(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleApprove = async (actionId) => {
    setProcessingId(actionId);
    try {
      await api.approveResponse(actionId, 'SOC Lead Analyst');
      showNotification(`Action ${actionId} approved. Authorized for safe execution simulation.`, 'success');
      triggerRefresh();
    } catch (err) {
      showNotification(`Approval failed: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (actionId) => {
    const reason = window.prompt("Enter analyst rejection justification:", "Operational impact exceeds current threat tolerance.");
    if (!reason) return;

    setProcessingId(actionId);
    try {
      await api.rejectResponse(actionId, 'SOC Lead Analyst', reason);
      showNotification(`Action ${actionId} rejected.`, 'info');
      triggerRefresh();
    } catch (err) {
      showNotification(`Rejection failed: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleExecute = async (actionId) => {
    setProcessingId(actionId);
    try {
      const res = await api.executeResponse(actionId);
      showNotification(`Action executed in safe simulation! Telemetry recorded. Ready for verification.`, 'success');
      triggerRefresh();
    } catch (err) {
      showNotification(`Execution failed: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
              Remediation & Response Center
            </h1>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-xs font-mono font-semibold border border-sky-500/20 tracking-wider">
              REMEDIATION QUEUE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Zero unauthorized destructive commands: sensitive remediation actions require explicit human analyst authorization.
          </p>
        </div>

        <button
          onClick={() => triggerRefresh()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0D1422] hover:bg-[#192538] border border-[#1E2B42] transition self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Response Action Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading remediation actions...
          </div>
        ) : responses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#141E2E] rounded-2xl border border-[#1E2B42]">
            <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No active response recommendations queued</p>
            <p className="text-xs text-slate-500 mt-1">Trigger attack simulation from the navbar to formulate response actions.</p>
          </div>
        ) : (
          responses.map((action) => {
            const isPending = action.status === 'PENDING_APPROVAL';
            const isApproved = action.status === 'APPROVED';
            const isExecuted = action.status === 'EXECUTED';
            const isRejected = action.status === 'REJECTED';
            const isVerified = action.status === 'VERIFIED';
            const isFailed = action.status === 'FAILED';
            const isWorking = processingId === action.id;

            return (
              <div 
                key={action.id}
                className="bg-[#141E2E] rounded-2xl p-5 border border-[#1E2B42] shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2B42]">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 sm:mt-0 ${
                      isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      isExecuted ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                      isApproved ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      isRejected ? 'bg-slate-800 text-slate-400 border-slate-700' :
                      isFailed ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-sky-400">{action.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {action.action_type}
                        </span>
                        <SeverityBadge severity={action.risk_level === 'HIGH' ? 'CRITICAL' : action.risk_level === 'MEDIUM' ? 'HIGH' : 'LOW'} />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5 break-words">
                        {action.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isVerified && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        CLOSED-LOOP VERIFIED
                      </span>
                    )}
                    {isExecuted && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        SIMULATION EXECUTED
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        APPROVED BY ANALYST
                      </span>
                    )}
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        PENDING HUMAN APPROVAL
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                        REJECTED
                      </span>
                    )}
                    {isFailed && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        VERIFICATION FAILED: REOPENED
                      </span>
                    )}
                  </div>
                </div>

                {/* Rationale & Operational Impact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1E2B42] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold">
                      Reason & Rationale:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {action.reason}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1E2B42] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      Expected Operational Impact:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {action.expected_impact}
                    </p>
                  </div>
                </div>

                {/* Evidence Citing Row */}
                {action.supporting_evidence?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono text-slate-400">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Supporting Evidence:</span>
                    {action.supporting_evidence.map((eid) => (
                      <button
                        key={eid}
                        onClick={() => openEvidenceViewer(eid)}
                        className="px-2 py-0.5 rounded bg-[#0D1422] hover:bg-sky-500/20 text-sky-400 border border-[#1E2B42] text-[11px] transition flex items-center gap-1"
                      >
                        <Database className="w-3 h-3" />
                        <span>{eid}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Simulation Output Telemetry if Executed */}
                {action.simulation_result && (
                  <div className="p-3 rounded-xl bg-[#080D18] border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Terminal className="w-3.5 h-3.5" /> Simulation Execution Result
                      </span>
                      <span>Latency: {action.simulation_result.simulated_latency_ms}ms</span>
                    </div>
                    <p className="text-xs font-mono text-slate-300">
                      {action.simulation_result.audit_log}
                    </p>
                  </div>
                )}

                {/* Human Approval / Execution Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#1E2B42]">
                  <div className="text-xs text-slate-400 font-mono">
                    Incident: <span className="text-white font-semibold">{action.incident_id}</span>
                    {action.approval_decision_by && (
                      <span className="block sm:inline sm:ml-3 text-slate-400">
                        Authorized By: <span className="text-sky-300">{action.approval_decision_by}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleReject(action.id)}
                          disabled={isWorking}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => handleApprove(action.id)}
                          disabled={isWorking}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Approve Action</span>
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleExecute(action.id)}
                        disabled={isWorking}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 transition shadow-md shadow-sky-500/20 disabled:opacity-50"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Simulate Safe Execution</span>
                      </button>
                    )}

                    {isExecuted && (
                      <button
                        onClick={() => navigate('/verification')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition shadow-md shadow-sky-600/20"
                      >
                        <span>Verify Resolution</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}

                    {isVerified && (
                      <button
                        onClick={() => navigate('/verification')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition"
                      >
                        <span>Inspect Verification Proof</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {isFailed && (
                      <button
                        onClick={() => navigate('/verification')}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition"
                      >
                        <span>Inspect Failure & Reopening</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
