import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Layers,
  FileCheck
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target redirect destination
  const from = location.state?.from?.pathname || '/';

  const validateInputs = () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your enterprise email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid enterprise email format (e.g., analyst@sentinel.cyber).');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your security password.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateInputs()) return;

    setLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid enterprise credentials. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoType = 'analyst') => {
    if (demoType === 'analyst') {
      setEmail('analyst@sentinel.cyber');
      setPassword('Sentinel@2026!');
    } else {
      setEmail('admin@sentinel.cyber');
      setPassword('SentinelAdmin#1');
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-[#080D18] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-sky-500 selection:text-slate-900">
      {/* Container Box with 2 Columns on Desktop */}
      <div className="w-full max-w-5xl bg-[#0D1422] border border-[#1E2B42] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Enterprise Security Branding & Live Threat Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#101A2B] to-[#0A101C] p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E2B42] relative overflow-hidden">
          {/* Subtle Cyber Grid Background Elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-md shadow-sky-500/10">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider font-mono">
                  SENTINEL<span className="text-sky-400">.AI</span>
                </span>
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  Autonomous Threat Operations
                </p>
              </div>
            </div>

            {/* Platform Tagline */}
            <div className="space-y-2 pt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                From Alert to Verified Resolution.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Continuous multi-agent triage, automated cross-alert attack reconstruction, and closed-loop containment verification for modern SOC teams.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141E2E]/80 border border-[#1E2B42]">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Evidence-Backed Investigation</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Every security conclusion is cryptographically traceable back to raw telemetry logs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141E2E]/80 border border-[#1E2B42]">
                <Layers className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Cross-Alert Kill-Chain</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dynamic attack sequence reconstruction correlating users, IP origins, and stagers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#141E2E]/80 border border-[#1E2B42]">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Closed-Loop Verification</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automated post-remediation probes confirm threat cessation prior to resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Status Pill */}
          <div className="relative z-10 pt-6 mt-6 border-t border-[#1E2B42]/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SOC Telemetry: Active
            </span>
            <span className="text-[11px] text-slate-500">v1.2 Enterprise</span>
          </div>
        </div>

        {/* Right Column: Clean Enterprise Sign-In Form */}
        <div className="lg:col-span-7 bg-[#0D1422] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            {/* Form Heading */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-400 text-xs font-mono border border-sky-500/20">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE SOC AUTHENTICATION</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Authenticate with your corporate credentials to access the security operations command center.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Enterprise Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                    placeholder="analyst@sentinel.cyber"
                    className="w-full bg-[#141E2E] border border-[#1E2B42] focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono font-medium text-slate-300">
                    Security Password
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Min. 6 chars</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                    placeholder="••••••••••••"
                    className="w-full bg-[#141E2E] border border-[#1E2B42] focus:border-sky-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#141E2E] border-[#1E2B42] text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-sky-500"
                  />
                  <span>Remember this terminal for 7 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 active:bg-sky-500 transition shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to SOC Console</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Demo One-Click Login Section */}
            <div className="pt-4 border-t border-[#1E2B42]/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Demo Evaluation Access:
                </span>
                <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-mono">
                  ONE-CLICK FILL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('analyst')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#141E2E] hover:bg-[#192538] border border-[#1E2B42] hover:border-sky-500/40 transition text-left group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                      Lead SOC Analyst
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      analyst@sentinel.cyber
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
                </button>

                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#141E2E] hover:bg-[#192538] border border-[#1E2B42] hover:border-sky-500/40 transition text-left group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                      SecOps Director
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      admin@sentinel.cyber
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>

          </div>

          {/* Compliance & Security Guarantee Footer */}
          <div className="pt-6 border-t border-[#1E2B42]/60 text-center text-[11px] text-slate-500 font-mono">
            Protected by enterprise zero-trust policy. All login attempts are recorded in the security audit log.
          </div>
        </div>

      </div>
    </div>
  );
};
