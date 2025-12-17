import { useState } from 'react';
import { LoginPage } from './components/pages/LoginPage.jsx';

// Auth & Layouts
import { RequireRole } from './auth/RequireRole.jsx';
import { OwnerLayout } from './layouts/OwnerLayout.jsx';
import { SupervisorLayout } from './layouts/SupervisorLayout.jsx';

// Owner Pages
import { Dashboard as OwnerDashboard } from './owner/Dashboard.jsx';
import { FuelAnalysis } from './owner/FuelAnalysis.jsx';
import { SLAReports } from './owner/SLAReports.jsx';
import { RiskInsights } from './owner/RiskInsights.jsx';
import { Penalties } from './owner/Penalties.jsx';

// Supervisor Pages
import { Dashboard as SupervisorDashboard } from './supervisor/Dashboard.jsx';
import { FuelEntry } from './supervisor/FuelEntry.jsx';
import { LiveTracking } from './supervisor/LiveTracking.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState('owner-dashboard');

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage(role === 'owner' ? 'owner-dashboard' : 'supervisor-dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('owner-dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render Owner Pages
  if (userRole === 'owner') {
    const renderOwnerPage = () => {
      switch (currentPage) {
        case 'owner-dashboard':
          return <OwnerDashboard />;
        case 'owner-fuel-analysis':
          return <FuelAnalysis />;
        case 'owner-sla-reports':
          return <SLAReports />;
        case 'owner-risk-insights':
          return <RiskInsights />;
        case 'owner-penalties':
          return <Penalties />;
        default:
          return <OwnerDashboard />;
      }
    };

    return (
      <OwnerLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderOwnerPage()}
      </OwnerLayout>
    );
  }

  // Render Supervisor Pages
  if (userRole === 'supervisor') {
    const renderSupervisorPage = () => {
      switch (currentPage) {
        case 'supervisor-dashboard':
          return <SupervisorDashboard />;
        case 'supervisor-fuel-entry':
          return <FuelEntry />;
        case 'supervisor-live-tracking':
          return <LiveTracking />;
        default:
          return <SupervisorDashboard />;
      }
    };

    return (
      <SupervisorLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderSupervisorPage()}
      </SupervisorLayout>
    );
  }

  return null;
}
