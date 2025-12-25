import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation, RefreshCw, Clock3, Activity } from 'lucide-react';
import VehicleMap from '../components/map/VehicleMap.jsx';
import { getLatestTelemetry } from '../services/api.js';
import { Button } from '../components/ui/button.jsx';

const FALLBACK_VEHICLES = [
  { id: 'HR55AN2175', number: 'HR55AN2175', status: 'moving', statusText: 'Active', speed: 42, lat: 28.4595, lng: 77.0266, rotation: 90, address: 'Gurugram, HR', lastUpdated: 'just now' },
  { id: 'HR47E2573', number: 'HR47E2573', status: 'stopped', statusText: 'Stopped', speed: 0, lat: 28.4289, lng: 77.0319, rotation: 0, address: 'IFFCO Chowk, HR', lastUpdated: '2 min ago' },
  { id: 'UP32BN9021', number: 'UP32BN9021', status: 'idling', statusText: 'Idle', speed: 3, lat: 28.4744, lng: 77.504, rotation: 180, address: 'Greater Noida, UP', lastUpdated: '4 min ago' },
  { id: 'MP04CE7712', number: 'MP04CE7712', status: 'moving', statusText: 'Active', speed: 38, lat: 22.6243, lng: 75.5632, rotation: 45, address: 'Pithampur, MP', lastUpdated: '1 min ago' },
  { id: 'MH12RK5521', number: 'MH12RK5521', status: 'stopped', statusText: 'Stopped', speed: 0, lat: 18.6298, lng: 73.7997, rotation: 0, address: 'Pune, MH', lastUpdated: '6 min ago' },
];

const statusColor = {
  moving: 'text-green-600 bg-green-50 border-green-100',
  idling: 'text-amber-600 bg-amber-50 border-amber-100',
  stopped: 'text-red-600 bg-red-50 border-red-100',
};

function mapTelemetryPayload(payload = []) {
  return payload
    .map((item, index) => {
      const lat = item.latitude ?? item.lat;
      const lng = item.longitude ?? item.lng;
      if (lat === undefined || lng === undefined) return null;

      const speed = Number(item.speed || 0);
      const status = item.status || (speed > 1 ? 'moving' : speed === 0 ? 'stopped' : 'idling');

      return {
        id: item.vehicleId || item.id || `veh-${index}`,
        number: item.vehicleNumber || item.number || item.vehicleId || `Vehicle ${index + 1}`,
        status,
        statusText: item.statusText || status,
        speed: Math.round(speed),
        lat: Number(lat),
        lng: Number(lng),
        rotation: item.heading || item.bearing || 0,
        address: item.location || item.address,
        lastUpdated: item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString() : 'just now',
      };
    })
    .filter(Boolean);
}

export function VehicleTracking() {
  const [vehicles, setVehicles] = useState(FALLBACK_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState(FALLBACK_VEHICLES[0]?.id);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchTelemetry = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getLatestTelemetry();
      const mapped = mapTelemetryPayload(data?.vehicles || data || []);
      if (mapped.length > 0) {
        setVehicles(mapped);
        setSelectedVehicleId((prev) => prev || mapped[0]?.id);
      }
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      setError(err?.message || 'Unable to load live telemetry. Showing recent data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
    const intervalId = setInterval(fetchTelemetry, 8000);
    return () => clearInterval(intervalId);
  }, [fetchTelemetry]);

  const summary = useMemo(() => {
    const total = vehicles.length;
    const moving = vehicles.filter((v) => v.status === 'moving').length;
    const idling = vehicles.filter((v) => v.status === 'idling').length;
    const stopped = vehicles.filter((v) => v.status === 'stopped').length;
    return { total, moving, idling, stopped };
  }, [vehicles]);

  return (
    <div className="flex flex-col min-h-0 w-full">
      <div className="flex flex-col lg:flex-row min-h-0 gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 truncate">
                Live Fleet Tracking
              </h2>
              <p className="text-sm text-slate-500">
                Location, speed, and status in real time
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 h-11 text-xs text-slate-600">
                <Clock3 className="h-4 w-4 text-slate-500" />
                <span className="tabular-nums">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Updating...'}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={fetchTelemetry}
                disabled={isLoading}
                className="h-11"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="relative mt-3">
            <VehicleMap
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleClick={(v) => setSelectedVehicleId(v.id)}
              center={[28.6139, 77.209]}
              zoom={6}
            />

            {/* Legend */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Status
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="tabular-nums">Moving ({summary.moving})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="tabular-nums">Idle ({summary.idling})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="tabular-nums">Stopped ({summary.stopped})</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 rounded-lg shadow max-w-[18rem]">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right rail */}
        <aside className="w-full lg:w-80 lg:shrink-0 min-h-0 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 backdrop-blur sticky top-0 z-10">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Vehicles</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                {summary.total}
              </p>
              <Button
                variant="outline"
                onClick={fetchTelemetry}
                disabled={isLoading}
                className="h-11 px-3"
                title="Refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="lg:h-[60svh] lg:min-h-[360px] lg:max-h-[650px] overflow-y-auto">
            <div className="space-y-3 p-4">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    selectedVehicleId === vehicle.id
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{vehicle.number}</p>
                      <p className="text-[11px] text-slate-500 truncate">{vehicle.address || 'No address'}</p>
                    </div>
                    <Navigation className="h-4 w-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-600 gap-3">
                    <span className={`px-2 py-1 rounded-full border capitalize ${statusColor[vehicle.status] || statusColor.stopped}`}>
                      {vehicle.statusText || vehicle.status}
                    </span>
                    <span className="tabular-nums">{vehicle.speed || 0} km/h</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">Updated {vehicle.lastUpdated}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
