import { useState } from 'react';
import {
  LayoutDashboard,
  Truck,
  Droplet,
  Navigation,
  AlertCircle,
  MapPin,
  LogOut,
  User,
  Wrench,
  UserCheck,
  Map,
  Menu,
  X,
} from 'lucide-react';

import { Button } from '../components/ui/button.jsx';

/* =========================
   SUPERVISOR PAGES
========================= */
import SupervisorDashboard from './SupervisorDashboard.jsx';
import { FuelEntry } from './FuelEntry.jsx';
import { LiveTracking } from './LiveTracking.jsx';
//import { VehicleTracking } from './VehicleTracking.jsx';
//import { ComplaintsPanel } from './ComplaintsPanel.jsx';
import GeofencingPage  from './GeofencingPage.jsx';
import { Maintenance } from './Maintenance.jsx';
import { AssignDriver } from './AssignDriver.jsx';
import { Companyroutesmanagemnt } from './Companyroutesmanagemnt.jsx';

/**
 * SupervisorLayout (TOP HEADER)
 * - Header navigation
 * - Page state
 * - Page rendering
 */
export function SupervisorLayout({ onLogout, user }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fuel-entry', label: 'Fuel Entry', icon: Droplet },
    { id: 'live-tracking', label: 'Live Tracking', icon: Navigation },
   // { id: 'vehicle-tracking', label: 'Vehicle Tracking', icon: Truck },
  //  { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'geofencing', label: 'Geofencing', icon: MapPin },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'assign-driver', label: 'Assign Driver', icon: UserCheck },
    { id: 'company-routes', label: 'Company Routes', icon: Map },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <SupervisorDashboard />;
      case 'fuel-entry':
        return <FuelEntry />;
      case 'live-tracking':
        return <LiveTracking />;
      //case 'vehicle-tracking':
       // return <VehicleTracking />;
    //  case 'complaints':
      //  return <ComplaintsPanel />;
      case 'geofencing':
        return <GeofencingPage />;
      case 'maintenance':
        return <Maintenance />;
      case 'assign-driver':
        return <AssignDriver />;
      case 'company-routes':
        return <Companyroutesmanagemnt />;
      default:
        return <SupervisorDashboard />;
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-slate-100">
      {/* ================= TOP HEADER ================= */}
      <div className="relative">
        <header className="sticky top-0 z-50 bg-slate-900/95 text-white backdrop-blur flex items-center px-4 sm:px-6 shadow-lg border-b border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-3 mr-4 sm:mr-6 min-w-0">
            <div className="bg-white/10 p-2 rounded-lg ring-1 ring-white/10 shrink-0">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold leading-tight truncate">
                FleetMaster Pro
              </h1>
              <p className="text-[10px] text-white/80 truncate">Supervisor Portal</p>
            </div>
          </div>

          {/* Navigation (centered on desktop, hidden on small screens) */}
          <nav className="flex-1 hidden sm:flex items-center justify-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`inline-flex items-center gap-2 h-10 px-3 rounded-md text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    isActive
                      ? 'bg-emerald-500/95 text-white shadow-md ring-1 ring-emerald-200/60'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="sm:hidden flex-1 flex items-center justify-center">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
              className="inline-flex items-center justify-center h-11 w-11 rounded-md text-slate-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center ring-1 ring-white/10">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium leading-none text-white">
                  {user?.name || 'Supervisor'}
                </p>
                <p className="text-[10px] text-white/80">Operations</p>
              </div>
            </div>

            <Button
              onClick={onLogout}
              variant="ghost"
              className="text-white bg-white/5 hover:bg-emerald-600/90 hover:text-white px-3 h-10 rounded-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Mobile dropdown nav (shown when hamburger open) */}
        {mobileOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-slate-900/95 text-white shadow-md z-40 border-t border-white/5 backdrop-blur-sm">
            <div className="flex flex-col p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-md text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                      isActive
                        ? 'bg-emerald-500/95 text-white shadow-md'
                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 min-h-0 overflow-auto bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="rounded-lg bg-white/90 shadow-sm p-4 sm:p-6">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
}
