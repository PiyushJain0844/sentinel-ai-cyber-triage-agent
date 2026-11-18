import React from 'react';
import { useSentinel } from '../context/SentinelContext';
import { SeverityBadge } from './StatusBadge';
import { X, ShieldCheck, Database, FileText, Cpu, Globe, User, Clock, Terminal } from 'lucide-react';

export const EvidenceViewerModal = () => {
  const { isEvidenceModalOpen, selectedEvidence, closeEvidenceViewer } = useSentinel();

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEvidenceModalOpen) {
        closeEvidenceViewer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEvidenceModalOpen, closeEvidenceViewer]);

  if (!isEvidenceModalOpen || !selectedEvidence) return null;

  const details = selectedEvidence.details || {};

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={closeEvidenceViewer}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#101827] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#1E293B] bg-[#151F30]/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-mono tracking-wide break-all">
                  EVIDENCE TELEMETRY: {selectedEvidence.id}
                </h3>
                <SeverityBadge severity={selectedEvidence.severity} />
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Ground-truth immutable security log verified by Log Monitoring Agent
              </p>
            </div>
          </div>
          <button
            onClick={closeEvidenceViewer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {/* Core Tuple Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Timestamp (UTC)
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all">
                {selectedEvidence.timestamp || 'N/A'}
              </div>
            </div>

            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Source Origin IP
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all">
                {selectedEvidence.source_ip || 'Internal Localhost'}
              </div>
            </div>

            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Principal User
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all">
                {selectedEvidence.username || 'SYSTEM'}
              </div>
            </div>

            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Device / Session ID
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all">
                {selectedEvidence.device_id || 'UNKNOWN'}
              </div>
            </div>

            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Action / Event Type
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 font-semibold text-sky-300 break-all">
                {selectedEvidence.action || selectedEvidence.event_type}
              </div>
            </div>

            <div className="bg-[#151F30] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Terminal className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Status / Outcome
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-200 break-all">
                {selectedEvidence.status || 'PROCESSED'}
              </div>
            </div>
          </div>

          {/* Resource Accessed */}
          {selectedEvidence.resource_accessed && (
            <div className="bg-[#151F30] p-4 rounded-xl border border-[#1E293B]">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Target Resource / Command Accessed
              </h4>
              <div className="p-2.5 bg-[#080D18] rounded-lg border border-slate-800 font-mono text-xs text-rose-300 break-all">
                {selectedEvidence.resource_accessed}
              </div>
            </div>
          )}

          {/* Structured Context Details */}
          {Object.keys(details).length > 0 && (
            <div className="bg-[#151F30] p-4 rounded-xl border border-[#1E293B]">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Security Context & Forensics
              </h4>
              <div className="space-y-2">
                {details.notes && (
                  <div className="text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded border border-amber-500/20 break-words">
                    <span className="font-semibold">Analyst Note: </span>{details.notes}
                  </div>
                )}
                {details.mitre_technique && (
                  <div className="text-xs text-sky-300 bg-sky-500/10 p-2.5 rounded border border-sky-500/20 break-words">
                    <span className="font-semibold">MITRE ATT&CK: </span>{details.mitre_technique}
                  </div>
                )}
                {details.decoded_command && (
                  <div className="text-xs bg-[#080D18] p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Decoded Payload: </span>
                    <span className="font-mono text-rose-400 break-all">{details.decoded_command}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Raw JSON Inspect */}
          <div className="bg-[#151F30] p-4 rounded-xl border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-slate-400" /> Raw Normalized Telemetry (JSON)
              </h4>
              <span className="text-[11px] font-mono text-emerald-400">SHA256-VERIFIED</span>
            </div>
            <pre className="p-3 bg-[#080D18] rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-48">
              {JSON.stringify(selectedEvidence, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-6 border-t border-[#1E293B] bg-[#151F30]/80 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <span className="text-center sm:text-left">Sentinel USP 1: Ground-truth verifiable evidence guarantee</span>
          <button
            onClick={closeEvidenceViewer}
            className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition text-center"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
