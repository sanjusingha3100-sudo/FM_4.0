import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  Clock3,
  Activity,
} from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import VehicleMap from '../components/map/VehicleMap.jsx';
import { getLatestTelemetry } from '../services/api.js';

/**
 * SupervisorDashboard
 * Live operations view (MAP + VEHICLE STATUS)
 */

const FALLBACK_VEHICLES = [
  {
    id: 'HR55AN2175',
    number: 'HR55AN2175',
    status: 'moving',
    speed: 42,
    lat: 28.4595,
    lng: 77.0266,
    address: 'Gurugram, HR',
    lastUpdated: 'just now',
  },
  {
    id: 'HR47E2573',
    number: 'HR47E2573',
    status: 'stopped',
    speed: 0,
    lat: 28.4289,
    lng: 77.0319,
    address: 'IFFCO Chowk, HR',
    lastUpdated: '2 min ago',
  },
];

const statusBadge = {
  moving: 'bg-green-100 text-green-700',
  idling: 'bg-amber-100 text-amber-700',
  stopped: 'bg-red-100 text-red-700',
};

export default function SupervisorDashboard({ onNavigate }) {
  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    FALLBACK_VEHICLES[0]?.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTelemetry = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLatestTelemetry();
      if (Array.isArray(data) && data.length) {
        setVehicles(data);
        setSelectedVehicleId(data[0]?.id);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Telemetry error', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const id = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(id);
  }, [fetchTelemetry]);

  const summary = useMemo(() => {
    return {
      total: vehicles.length,
      moving: vehicles.filter(v => v.status === 'moving').length,
      stopped: vehicles.filter(v => v.status === 'stopped').length,
      idling: vehicles.filter(v => v.status === 'idling').length,
    };
  }, [vehicles]);

  return (
    <div className="flex flex-col min-h-0 w-full">
      <div className="flex flex-col lg:flex-row min-h-0 gap-4">
        {/* ================= MAP ================= */}
        <section className="flex-1 min-w-0 min-h-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 truncate">
                Live Vehicle Monitoring
              </h2>
              <p className="text-sm text-slate-500">
                Real-time operations overview
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 h-11 text-xs text-slate-600">
                <Clock3 className="h-4 w-4 text-slate-500" />
                <span className="tabular-nums">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Updating'}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={fetchTelemetry}
                disabled={isLoading}
                className="h-11 px-3"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <VehicleMap
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleClick={(v) => setSelectedVehicleId(v.id)}
              center={[28.6139, 77.209]}
              zoom={6}
            />
          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}
        <aside className="w-full lg:w-80 lg:shrink-0 min-h-0 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 backdrop-blur sticky top-0 z-10">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Live Vehicles
            </p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                {summary.total}
              </p>
              <div className="text-xs text-slate-500 text-right">
                Moving {summary.moving}
                <br />
                Stopped {summary.stopped}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <Button
                className="h-11 w-full"
                onClick={() => onNavigate('fuel-entry')}
              >
                + Fuel Entry
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={() => onNavigate('complaints')}
              >
                Report Issue
              </Button>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="lg:max-h-[70svh] lg:overflow-y-auto">
            <div className="space-y-3 p-4">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    selectedVehicleId === v.id
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {v.number}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {v.address}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize shrink-0 ${
                        statusBadge[v.status]
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-slate-600 gap-3">
                    <span className="tabular-nums">Speed: {v.speed} km/h</span>
                    <span className="truncate">{v.lastUpdated}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
