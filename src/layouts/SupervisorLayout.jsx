import { useState } from 'react';
import {
  LayoutDashboard,
  Truck,
  Droplet,
  Navigation,
  LogOut,
  User,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';

/**
 * SupervisorLayout Component
 * Layout wrapper for supervisor role pages
 * Includes role-specific navigation and sidebar
 */
export function SupervisorLayout({ children, onLogout, onNavigate, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'supervisor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'supervisor-fuel-entry', label: 'Fuel Entry', icon: Droplet },
    { id: 'supervisor-live-tracking', label: 'Live Tracking', icon: Navigation },
    { id: 'supervisor-settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="relative z-10 w-72 bg-[#0a0f1e] text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-[#10b981] p-2 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight">FleetMaster Pro</h1>
              <p className="text-xs text-slate-400">Supervisor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs text-slate-400 px-4 mb-3">MAIN MENU</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-[#10b981] flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Supervisor</p>
              <p className="text-xs text-slate-400 truncate">supervisor@fleet.com</p>
            </div>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
