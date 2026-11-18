import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SentinelProvider } from './context/SentinelContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { EvidenceViewerModal } from './components/EvidenceViewerModal';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { AttackInvestigationPage } from './pages/AttackInvestigationPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { ResponseCenterPage } from './pages/ResponseCenterPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { SettingsPage } from './pages/SettingsPage';

// Authenticated SOC Shell Layout
const AuthenticatedLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#080D18] text-[#F8FAFC] flex flex-col font-sans selection:bg-sky-500 selection:text-slate-900 overflow-x-hidden">
        {/* Top SOC Command Bar */}
        <Navbar 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          isMobileMenuOpen={isMobileMenuOpen} 
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Collapsible Left Navigation Drawer */}
          <Sidebar 
            isMobileOpen={isMobileMenuOpen} 
            onCloseMobile={() => setIsMobileMenuOpen(false)} 
          />

          {/* Main SOC Content Workspace */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>

        {/* Global Evidence Inspector Modal */}
        <EvidenceViewerModal />
      </div>
    </ProtectedRoute>
  );
};

// Login Route Guard: redirects to dashboard if already authenticated
const LoginRouteHandler = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/';

  if (!isLoading && isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  return <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <SentinelProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Dedicated Authentication Route */}
            <Route path="/login" element={<LoginRouteHandler />} />

            {/* Protected Enterprise SOC Routes */}
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/monitoring" element={<LiveMonitoringPage />} />
              <Route path="/incidents" element={<IncidentManagementPage />} />
              <Route path="/investigation" element={<AttackInvestigationPage />} />
              <Route path="/agents" element={<AgentActivityPage />} />
              <Route path="/responses" element={<ResponseCenterPage />} />
              <Route path="/verification" element={<VerificationCenterPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SentinelProvider>
    </AuthProvider>
  );
}
