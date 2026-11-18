import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSentinel } from '../context/SentinelContext';
import { IncidentStatusBadge } from '../components/StatusBadge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  Terminal, 
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const VerificationCenterPage = () => {
  const { refreshTrigger, triggerRefresh, showNotification } = useSentinel();
  const [verificationRecords, setVerificationRecords] = useState([]);
  const [executedActions, setExecutedActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getVerificationRecords(),
      api.getResponses()
    ]).then(([vRecords, rActions]) => {
      if (isMounted) {
        setVerificationRecords(vRecords);
        // Actions that are EXECUTED
        setExecutedActions(rActions.filter(a => a.status === 'EXECUTED'));
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleRunVerification = async (actionId, simulateFailure = false) => {
    setVerifyingId(actionId);
    try {
      const res = await api.performVerification(
        actionId, 
        simulateFailure,
        simulateFailure ? "Simulated test: Persistent C2 probe detected during closed-loop probe" : "Verified: All 4 closed-loop endpoint checks confirmed session termination"
      );
      if (simulateFailure) {
        showNotification('Verification probe triggered: Persistent adversary activity detected! Incident REOPENED.', 'error');
      } else {
        showNotification('Closed-loop verification succeeded: Threat confirmed contained!', 'success');
      }
      triggerRefresh();
    } catch (err) {
      showNotification(`Verification error: ${err.message}`, 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#141E2E] border border-[#1E2B42] shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight">
              Closed-Loop Security Verification
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20 tracking-wider">
              CONTAINMENT AUDIT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Never assume containment without active verification: probe session status, perimeter drops, and telemetry to verify threat cessation.
          </p>
        </div>

        <button
          onClick={() => triggerRefresh()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#0D1422] hover:bg-[#192538] border border-[#1E2B42] transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Executed Actions Ready For Verification */}
      {executedActions.length > 0 ? (
        <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-sky-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2B42]">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Executed Actions Awaiting Verification ({executedActions.length})
              </h3>
            </div>
            <span className="text-xs font-mono text-sky-400">
              READY FOR VERIFICATION PROBE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {executedActions.map((action) => (
              <div 
                key={action.id}
                className="bg-[#0D1422] rounded-xl p-4 border border-[#1E2B42] space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400">{action.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {action.incident_id}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 break-words">{action.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 break-words">{action.expected_impact}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#1E2B42]">
                  {/* Simulate Failure Button for Interactive Testing */}
                  <button
                    onClick={() => handleRunVerification(action.id, true)}
                    disabled={verifyingId === action.id}
                    className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    title="Simulates failed session invalidation, reopening the incident for investigation"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Simulate Failed Verification</span>
                  </button>

                  {/* Standard Verified Containment */}
                  <button
                    onClick={() => handleRunVerification(action.id, false)}
                    disabled={verifyingId === action.id}
                    className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify Containment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#141E2E] border border-[#1E2B42] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <span>All executed remediation actions currently have active verification checks recorded.</span>
          <span className="font-mono text-emerald-400">ACTIVE CLOSED-LOOP MONITORING</span>
        </div>
      )}

      {/* Verification Audit Records Log */}
      <div className="bg-[#141E2E] rounded-2xl p-4 sm:p-5 border border-[#1E2B42] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2B42]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Verification Audit Records ({verificationRecords.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            CONTINUOUS VERIFICATION LOG
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            Loading verification history...
          </div>
        ) : verificationRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#0D1422] rounded-xl border border-[#1E2B42]">
            <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No verification checks recorded yet</p>
            <p className="text-xs text-slate-500 mt-1">Approve and execute a remediation action in Response Center to run verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRecords.map((record) => {
              const isContained = record.verification_status === 'VERIFIED_CONTAINED';

              return (
                <div 
                  key={record.id}
                  className={`rounded-2xl p-5 border transition-all ${
                    isContained 
                      ? 'bg-[#0D1422] border-emerald-500/30' 
                      : 'bg-[#0D1422] border-rose-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2B42]">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`p-2 rounded-xl border shrink-0 mt-0.5 sm:mt-0 ${
                        isContained ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {isContained ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 animate-pulse" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs text-sky-400">{record.id}</span>
                          <span className="text-xs font-mono text-slate-400">Action: {record.response_action_id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5 break-words">
                          {isContained ? 'Threat Successfully Contained & Verified' : 'Verification Failed: Unresolved Adversary Channel Detected'}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E2B42]">
                      <IncidentStatusBadge status={record.incident_status} />
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleRunVerification(record.response_action_id, true)}
                          disabled={verifyingId === record.response_action_id}
                          className="px-2 py-1 sm:py-0.5 rounded bg-[#141E2E] hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-[10px] font-mono transition flex items-center gap-1"
                          title="Test incident reopening by probing for persistent threat activity"
                        >
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>Simulate Failure</span>
                        </button>
                        <button
                          onClick={() => handleRunVerification(record.response_action_id, false)}
                          disabled={verifyingId === record.response_action_id}
                          className="px-2 py-1 sm:py-0.5 rounded bg-[#141E2E] hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[10px] font-mono transition flex items-center gap-1"
                          title="Re-verify containment across all 4 checks"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Re-Verify</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Analyst Notes */}
                  {record.analyst_notes && (
                    <div className={`mt-3 p-3 rounded-xl border text-xs font-mono ${
                      isContained ? 'bg-[#080D18] border-slate-800 text-slate-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    }`}>
                      <span className="font-bold">Analyst Assessment: </span>
                      {record.analyst_notes}
                    </div>
                  )}

                  {/* Verification Checks Performed */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                      Automated Containment Checks Executed:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {record.checks_performed?.map((chk, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-[#080D18] border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="font-semibold text-slate-200">{chk.check_name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              chk.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300' :
                              chk.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {chk.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{chk.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
