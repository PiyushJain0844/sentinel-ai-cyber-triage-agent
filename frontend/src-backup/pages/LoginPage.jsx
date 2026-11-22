import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
<<<<<<< HEAD
  Check, 
  ArrowRight,
  AlertCircle
=======
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
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

<<<<<<< HEAD
  const [email, setEmail] = useState('analyst@sentinel.cyber');
  const [password, setPassword] = useState('Sentinel@2026!');
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
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
<<<<<<< HEAD
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
=======
      setErrorMessage(err.message || 'Invalid enterprise credentials. Please check your credentials.');
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleFillDemo = (role = 'analyst') => {
    if (role === 'analyst') {
=======
  const handleFillDemo = (demoType = 'analyst') => {
    if (demoType === 'analyst') {
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
      setEmail('analyst@sentinel.cyber');
      setPassword('Sentinel@2026!');
    } else {
      setEmail('admin@sentinel.cyber');
      setPassword('SentinelAdmin#1');
    }
    setErrorMessage('');
  };

  return (
<<<<<<< HEAD
    <div className="login-page relative min-h-screen w-full bg-[#F7F0EC] text-[#202020] font-sans selection:bg-[#95613F] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* =========================================================================
          BACKGROUND DECORATION (Quiet, Warm, Subtle Ambient Canvas Glow)
          ========================================================================= */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft radial ambient milk wash behind content */}
        <div 
          className="absolute top-[10%] left-[15%] w-[85vw] h-[75vw] max-w-[1300px] max-h-[1100px] rounded-full opacity-65"
          style={{
            background: 'radial-gradient(ellipse at 40% 40%, rgba(251, 246, 242, 0.95) 0%, rgba(247, 240, 236, 0.25) 70%)'
          }}
        />

        {/* Quiet, warm subtle organic wave entering from top-left */}
        <svg 
          className="absolute -top-[12%] -left-[10%] w-[55vw] max-w-[850px] h-auto opacity-35"
          viewBox="0 0 1000 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-50 140 C 220 -40, 450 60, 520 280 C 590 500, 420 700, 250 740 C 90 780, -70 660, -50 140 Z" 
            fill="url(#quietWaveGrad)" 
          />
          <defs>
            <linearGradient id="quietWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EAD8CE" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#F4EAE3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F7F0EC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Quiet, warm subtle organic wave entering from bottom-right */}
        <svg 
          className="absolute -bottom-[15%] -right-[10%] w-[60vw] max-w-[950px] h-auto opacity-40" 
          viewBox="0 0 1100 850" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M360 850 C 380 580, 640 370, 870 340 C 990 320, 1100 390, 1150 470 C 1170 700, 810 890, 360 850 Z" 
            fill="url(#quietLowerGrad)" 
          />
          <defs>
            <linearGradient id="quietLowerGrad" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E5D2C5" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#F3E9E2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F7F0EC" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* =========================================================================
          TOP HEADER: Brand Lockup (Left) + SOC Command Center Status (Right)
          ========================================================================= */}
      <header className="page-enter page-enter-1 relative z-10 w-full max-w-[1580px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-7 pb-3 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Slender Outlined Shield Icon */}
          <div className="shrink-0 flex items-center justify-center">
            <svg 
              className="w-9 h-11 sm:w-10 sm:h-12" 
              viewBox="0 0 34 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Sentinel Shield Logo"
            >
              <path 
                d="M17 2.5L4 7.8V18C4 26.8 9.5 33.8 17 37.2C24.5 33.8 30 26.8 30 18V7.8L17 2.5Z" 
                stroke="#75482D" 
                strokeWidth="1.9" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Thin Vertical Divider */}
          <div className="h-9 sm:h-10 w-[1px] bg-[#D4C3B5] shrink-0" />

          {/* Wordmark and Descriptor */}
          <div className="flex flex-col">
            <div className="flex items-baseline text-2xl sm:text-[30px] font-bold tracking-tight leading-none text-[#1F1B18]">
              <span>SENTINEL</span>
              <span className="text-[#95613F]">.AI</span>
            </div>
            <div className="text-[10px] sm:text-[10.5px] font-medium tracking-[0.22em] text-[#635C56] uppercase mt-1">
              THREAT OPERATIONS
            </div>
          </div>
        </div>

        {/* SOC Command Center Status Pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F5ECE5]/75 backdrop-blur-sm shadow-[0_2px_8px_rgba(112,76,54,0.04)] border border-white/70">
          <span className="status-pulse w-2.5 h-2.5 rounded-full bg-[#35A91B] shadow-[0_0_6px_rgba(53,169,27,0.35)] shrink-0" />
          <span className="text-xs sm:text-[13px] font-medium text-[#38312B] tracking-wide">
            SOC Command Center
          </span>
        </div>
      </header>

      {/* =========================================================================
          MAIN WORKSPACE: 65% HERO & WORKFLOW COMPOSITION + 35% LOGIN PANEL
          ========================================================================= */}
      <main className="relative z-10 w-full max-w-[1580px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 py-4 lg:py-8 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* ---------------------------------------------------------------------
              LEFT REGION: 65% HERO IDENTITY & INTEGRATED WORKFLOW VISUALIZATION
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 xl:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* HERO CONTENT: Headline & Feature List (Left 7 cols of region) */}
            <div className="page-enter page-enter-2 md:col-span-8 flex flex-col justify-center space-y-6 xl:space-y-7">
              
              {/* Bronze Accent Dash */}
              <div className="w-12 h-2 bg-[#95613F] rounded-full" />

              {/* Editorial Headline */}
              <div className="space-y-0.5">
                <h1 className="text-4xl sm:text-5xl lg:text-[66px] xl:text-[70px] font-normal tracking-[-0.035em] leading-[1.08] text-[#1E1916]">
                  <span>From Alert to</span>
                  <br />
                  <span className="title-sheen italic text-[#95613F] whitespace-nowrap">Verified Resolution.</span>
                </h1>
              </div>

              {/* Process Vocabulary Row */}
              <div className="text-[11.5px] sm:text-[12.5px] font-medium tracking-[0.24em] text-[#635A52] uppercase flex items-center flex-wrap gap-x-2.5 gap-y-1 font-mono">
                <span>DETECT</span>
                <span className="text-[#95613F]">·</span>
                <span>CORRELATE</span>
                <span className="text-[#95613F]">·</span>
                <span>CONTAIN</span>
                <span className="text-[#95613F]">·</span>
                <span>VERIFY</span>
              </div>

              {/* Three Feature Rows */}
              <div className="features-enter space-y-4 pt-1">
                {/* Feature 1: Evidence-Backed Investigation */}
                <div className="flex items-center gap-4">
                  <div className="feature-tile w-14 h-14 sm:w-[68px] sm:h-[64px] rounded-[16px] bg-[#EFE3DB] shadow-[0_4px_12px_-2px_rgba(115,75,48,0.06)] flex items-center justify-center shrink-0">
                    <svg 
                      className="w-7 h-7" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#8A5738" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-[18px] font-medium text-[#221B17] tracking-tight">
                    Evidence-Backed Investigation
                  </span>
                </div>

                {/* Feature 2: Cross-Alert Kill-Chain */}
                <div className="flex items-center gap-4">
                  <div className="feature-tile w-14 h-14 sm:w-[68px] sm:h-[64px] rounded-[16px] bg-[#EFE3DB] shadow-[0_4px_12px_-2px_rgba(115,75,48,0.06)] flex items-center justify-center shrink-0">
                    <svg 
                      className="w-7 h-7" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#8A5738" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 12 12 17 22 12" />
                      <polyline points="2 17 12 22 22 17" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-[18px] font-medium text-[#221B17] tracking-tight">
                    Cross-Alert Kill-Chain
                  </span>
                </div>

                {/* Feature 3: Closed-Loop Verification */}
                <div className="flex items-center gap-4">
                  <div className="feature-tile w-14 h-14 sm:w-[68px] sm:h-[64px] rounded-[16px] bg-[#EFE3DB] shadow-[0_4px_12px_-2px_rgba(115,75,48,0.06)] flex items-center justify-center shrink-0">
                    <svg 
                      className="w-7 h-7" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#8A5738" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="8 12 11 15 16 9" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-[18px] font-medium text-[#221B17] tracking-tight">
                    Closed-Loop Verification
                  </span>
                </div>
              </div>

            </div>

            {/* INTEGRATED WORKFLOW: Floating Alternating Stages (Right 5 cols of region) */}
            <div className="page-enter page-enter-3 md:col-span-4 flex justify-center items-center py-2">
              <div className="workflow-motion relative w-full max-w-[290px] flex flex-col items-center select-none">
                
                {/* Organic S-Curve Connector Behind Pills */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 290 476" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Fluid Organic S-curve Line */}
                  <path 
                    id="workflow-connector"
                    d="M 150 37
                       C 150 70, 172 82, 172 104
                       C 172 156, 138 184, 138 238
                       C 138 292, 158 318, 158 372
                       C 158 405, 150 417, 150 439" 
                    stroke="#C59876" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle className="connector-traveler" r="4" fill="#E7AD7D">
                    <animateMotion dur="8s" repeatCount="indefinite">
                      <mpath href="#workflow-connector" />
                    </animateMotion>
                  </circle>

                  {/* Transition Connection Beads */}
                  <circle cx="150" cy="37" r="5.5" fill="#E3A56F" />
                  <circle cx="172" cy="104" r="5.5" fill="#E3A56F" />
                  <circle cx="138" cy="238" r="5.5" fill="#E3A56F" />
                  <circle cx="158" cy="372" r="5.5" fill="#E3A56F" />
                </svg>

                {/* Alternating Floating Stage Pills */}
                <div className="relative z-10 w-full flex flex-col items-center gap-8 sm:gap-[76px] py-2">
                  
                  {/* Stage 1: Alert Detected */}
                  <div 
                    className="workflow-pill reflective-surface w-[240px] sm:w-[265px] h-[54px] sm:h-[58px] rounded-full px-5 flex items-center gap-3 shadow-[0_12px_28px_-4px_rgba(115,75,48,0.11),0_4px_10px_-2px_rgba(115,75,48,0.04)] border border-white/60"
                    style={{
                      background: 'linear-gradient(135deg, #FDECE1 0%, #F8DFD0 100%)',
                      '--tilt': '-6deg'
                    }}
                  >
                    <div className="shrink-0 text-[#95613F]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-[14.5px] font-medium text-[#251F1B] tracking-tight">
                      Alert Detected
                    </span>
                  </div>

                  {/* Stage 2: Attack Correlated (Shifted right) */}
                  <div 
                    className="workflow-pill reflective-surface w-[248px] sm:w-[272px] h-[54px] sm:h-[58px] rounded-full px-5 flex items-center gap-3 shadow-[0_12px_28px_-4px_rgba(115,75,48,0.11),0_4px_10px_-2px_rgba(115,75,48,0.04)] border border-white/65 ml-5 sm:ml-7"
                    style={{
                      background: 'linear-gradient(135deg, #FCF2EB 0%, #FBECE2 100%)',
                      '--tilt': '-5deg'
                    }}
                  >
                    <div className="shrink-0 text-[#95613F]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-[14.5px] font-medium text-[#251F1B] tracking-tight">
                      Attack Correlated
                    </span>
                  </div>

                  {/* Stage 3: Containment Applied (Shifted left) */}
                  <div 
                    className="workflow-pill reflective-surface w-[250px] sm:w-[276px] h-[54px] sm:h-[58px] rounded-full px-5 flex items-center gap-3 shadow-[0_12px_28px_-4px_rgba(115,75,48,0.11),0_4px_10px_-2px_rgba(115,75,48,0.04)] border border-white/65 -ml-2 sm:-ml-3"
                    style={{
                      background: 'linear-gradient(135deg, #FCF2EB 0%, #FBECE2 100%)',
                      '--tilt': '-5deg'
                    }}
                  >
                    <div className="shrink-0 text-[#95613F]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-[14.5px] font-medium text-[#251F1B] tracking-tight">
                      Containment Applied
                    </span>
                  </div>

                  {/* Stage 4: Resolution Verified (Distinguished Dark Mocha) */}
                  <div 
                    className="workflow-pill workflow-pill-final reflective-surface w-[245px] sm:w-[270px] h-[54px] sm:h-[58px] rounded-full px-5 flex items-center gap-3 shadow-[0_14px_30px_-3px_rgba(75,42,22,0.30)] border border-[#75482D]/20 ml-3 sm:ml-5"
                    style={{
                      background: 'linear-gradient(135deg, #6B4631 0%, #5B3824 100%)',
                      '--tilt': '-4.5deg'
                    }}
                  >
                    <div className="shrink-0 text-[#E5A16B]">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="8 12 11 15 16 9" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-[14.5px] font-medium text-white tracking-tight">
                      Resolution Verified
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* ---------------------------------------------------------------------
              RIGHT REGION: 35% AUTHENTICATION PANEL (400-430px wide, comfortable)
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="page-enter page-enter-4 w-full max-w-[485px] rounded-[28px] sm:rounded-[30px] bg-[#FFFBF7]/42 backdrop-blur-md shadow-[0_24px_55px_-10px_rgba(115,75,48,0.09),0_8px_20px_-4px_rgba(115,75,48,0.04)] border border-white/70 p-7 sm:p-8 xl:p-8 space-y-4">
              
              {/* Panel Header */}
              <div className="space-y-1.5">
                {/* Eyebrow */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-[6px] bg-[#EFE3DB] flex items-center justify-center text-[#75482D] shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-[10.5px] font-medium tracking-[0.20em] text-[#6E645D] uppercase font-mono">
                    SECURE SOC AUTHENTICATION
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[27px] sm:text-[29px] font-semibold tracking-tight text-[#201A16]">
                  <span>Welcome </span>
                  <span className="text-[#95613F]">Back</span>
                </h2>
              </div>

              {/* Error Message Alert (if present) */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Enterprise Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-medium text-[#38312B]">
                    Enterprise Email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-[#95613F]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
                      placeholder="analyst@sentinel.cyber"
                      className="w-full h-[44px] rounded-[12px] bg-[#F5ECE5]/65 border border-[#E2D2C6]/70 pl-10 pr-4 text-xs sm:text-[13.5px] text-[#807873] placeholder-[#9C9188] focus:outline-none focus:border-[#95613F] focus:ring-1 focus:ring-[#95613F]/25 transition"
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>

                {/* Security Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-[13px] font-medium text-[#38312B]">
                    Security Password
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none text-[#95613F]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21 2-2 2m-1.5 1.5L20 8l-2 2-2-2-4 4a6.5 6.5 0 1 1-7-7l4-4 2 2 2-2 2.5 2.5Z" />
                        <circle cx="8" cy="16" r="1" />
                      </svg>
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                      placeholder="••••••••••••"
                      className="w-full h-[44px] rounded-[12px] bg-[#F5ECE5]/65 border border-[#E2D2C6]/70 pl-10 pr-10 text-xs sm:text-[13.5px] text-[#807873] placeholder-[#9C9188] focus:outline-none focus:border-[#95613F] focus:ring-1 focus:ring-[#95613F]/25 transition tracking-wider"
                      autoComplete="current-password"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-[#958A82] hover:text-[#95613F] transition p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" y1="2" x2="22" y2="22" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember for 7 days Checkbox */}
                <div className="pt-0.5">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={rememberMe}
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`w-[16px] h-[16px] rounded-[4px] flex items-center justify-center transition ${
                        rememberMe 
                          ? 'bg-[#75482D] text-white shadow-sm' 
                          : 'bg-[#F5ECE5] border border-[#95613F]/30 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="text-[12.5px] sm:text-[13px] font-normal text-[#453D37]">
                      Remember for 7 days
                    </span>
                  </label>
                </div>

                {/* Primary Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="signin-button reflective-surface w-full h-[46px] rounded-[12px] bg-[#75482D] hover:bg-[#805234] active:bg-[#5E361D] text-white font-medium text-sm sm:text-[14.5px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(115,70,42,0.25)] hover:shadow-[0_6px_18px_rgba(112,76,54,0.3)] transition duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to SOC Console'}</span>
                    <ArrowRight className="button-arrow w-4 h-4 stroke-[2.2]" />
                  </button>
                </div>
              </form>

              {/* Demo Access Divider */}
              <div className="relative flex items-center justify-center pt-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#95613F]/15" />
                </div>
                <div className="relative px-2.5 bg-[#FFFBF7] text-[10px] font-medium tracking-[0.20em] text-[#80766E] uppercase font-mono">
                  DEMO ACCESS
                </div>
              </div>

              {/* Demo Role Action Buttons (Compact, comfortable, with full untruncated labels) */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {/* Role 1: Lead SOC Analyst */}
                <button
                  type="button"
                  onClick={() => handleFillDemo('analyst')}
                  className="demo-card reflective-surface h-[42px] rounded-[12px] bg-[#F5ECE5]/65 hover:bg-[#EFE3DB] border border-[#E2D2C6]/70 px-3 flex items-center justify-between transition text-[#2E2824] hover:border-[#95613F]/35 shadow-[0_2px_8px_-2px_rgba(115,75,48,0.05)]"
                  title="Fill Lead SOC Analyst Credentials"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <svg className="w-4 h-4 text-[#75482D] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[11.5px] font-medium whitespace-nowrap">
                      Lead SOC Analyst
                    </span>
                  </div>
                  <ArrowRight className="demo-arrow w-3.5 h-3.5 text-[#75482D] shrink-0 ml-1" />
                </button>

                {/* Role 2: SecOps Director */}
                <button
                  type="button"
                  onClick={() => handleFillDemo('director')}
                  className="demo-card reflective-surface h-[42px] rounded-[12px] bg-[#F5ECE5]/65 hover:bg-[#EFE3DB] border border-[#E2D2C6]/70 px-3 flex items-center justify-between transition text-[#2E2824] hover:border-[#95613F]/35 shadow-[0_2px_8px_-2px_rgba(115,75,48,0.05)]"
                  title="Fill SecOps Director Credentials"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <svg className="w-4 h-4 text-[#75482D] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="text-[11.5px] font-medium whitespace-nowrap">
                      SecOps Director
                    </span>
                  </div>
                  <ArrowRight className="demo-arrow w-3.5 h-3.5 text-[#75482D] shrink-0 ml-1" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* =========================================================================
          BOTTOM FOOTER: Telemetry Status & Version Label (Lower-Left)
          ========================================================================= */}
      <footer className="relative z-10 w-full max-w-[1580px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-3 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs sm:text-[13.5px]">
          {/* Status Dot */}
          <span className="status-pulse w-2.5 h-2.5 rounded-full bg-[#35A91B] shadow-[0_0_6px_rgba(53,169,27,0.35)] shrink-0" />
          
          {/* Status Text */}
          <span className="font-medium text-[#2B231D]">
            SOC Telemetry: Active
          </span>

          {/* Thin Divider */}
          <span className="text-[#D0C2B6] mx-1">|</span>

          {/* Version Text */}
          <span className="text-[#6E6761] text-xs font-mono">
            v1.2 Enterprise
          </span>
        </div>
      </footer>

=======
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
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
    </div>
  );
};
