import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SentinelProvider } from './context/SentinelContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { EvidenceViewerModal } from './components/EvidenceViewerModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { AttackInvestigationPage } from './pages/AttackInvestigationPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { ResponseCenterPage } from './pages/ResponseCenterPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SentinelProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#080D18] text-[#F8FAFC] flex flex-col font-sans selection:bg-sky-500 selection:text-slate-900">
          {/* Top Navbar */}
          <Navbar 
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            isMobileMenuOpen={isMobileMenuOpen}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar 
              isMobileOpen={isMobileMenuOpen} 
              onCloseMobile={() => setIsMobileMenuOpen(false)} 
            />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/monitoring" element={<LiveMonitoringPage />} />
                <Route path="/incidents" element={<IncidentManagementPage />} />
                <Route path="/investigation" element={<AttackInvestigationPage />} />
                <Route path="/agents" element={<AgentActivityPage />} />
                <Route path="/responses" element={<ResponseCenterPage />} />
                <Route path="/verification" element={<VerificationCenterPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Global Evidence Inspector Modal */}
          <EvidenceViewerModal />
        </div>
      </BrowserRouter>
    </SentinelProvider>
  );
}
