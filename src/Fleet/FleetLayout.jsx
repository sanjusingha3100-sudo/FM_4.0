import { useState, useEffect } from 'react';
import FleetMap from './FleetMap';
import FleetSettings from './FleetSettings';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
const API_BASE_URL = BASE_URL.endsWith('/api')
  ? BASE_URL
  : `${BASE_URL}/api`;

export default function FleetLayout({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vehicle, setVehicle] = useState(null);
  const [distance, setDistance] = useState(0);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState('');


  /* =========================
     RESTORE VEHICLE
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem('assignedVehicle');
    if (saved) {
      try {
        setVehicle(JSON.parse(saved));
      } catch {}
    }
  }, []);


  
  /* =========================
     FETCH DISTANCE
  ========================= */
/* =========================
   FETCH DISTANCE (AUTO REFRESH)
========================= */
useEffect(() => {
  if (!vehicle?.vehicle_id) return;

  let isMounted = true;

  const fetchDistance = async () => {
    try {
      setDistanceLoading(true);
      setDistanceError('');

      const res = await fetch(
        `${API_BASE_URL}/fleet/distance-today?vehicle_id=${vehicle.vehicle_id}`,
        {
          headers: {
            'x-role': 'FLEET',
            'x-vehicle-id': vehicle.vehicle_id,
          },
        }
      );

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      if (isMounted) {
        setDistance(Number(data?.distance_km || 0));
      }
    } catch {
      if (isMounted) {
        setDistanceError('Unable to calculate distance');
      }
    } finally {
      if (isMounted) {
        setDistanceLoading(false);
      }
    }
  };

  // ⏱ fetch immediately
  fetchDistance();

  // 🔁 refresh every 30 seconds
  const interval = setInterval(fetchDistance, 30000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, [vehicle]);

  return (
    <div className="min-h-svh bg-slate-100 flex flex-col">
      {/* =========================
         HEADER
      ========================= */}
      <header className="bg-blue-600 text-white border-b border-white/10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">Fleet Dashboard</h1>
            <p className="text-sm opacity-80 truncate">Live vehicle tracking</p>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center h-11 px-4 rounded-md bg-white/10 hover:bg-white/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* =========================
         TABS
      ========================= */}
      <div className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl">
          <div className="overflow-x-auto">
            <div className="flex gap-2 px-4 sm:px-6 py-3 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center justify-center h-11 px-4 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('location')}
                className={`inline-flex items-center justify-center h-11 px-4 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  activeTab === 'location'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Live Location
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`inline-flex items-center justify-center h-11 px-4 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
         CONTENT
      ========================= */}
      <main className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {activeTab === 'dashboard' && (
            <div className="max-w-md mx-auto text-center mt-10 sm:mt-16 space-y-4">
              <h2 className="text-xl font-semibold">Today Distance</h2>

            {vehicle?.vehicle_number && (
              <div className="text-sm text-gray-600">
                Vehicle:{' '}
                <span className="font-semibold">
                  {vehicle.vehicle_number}
                </span>
              </div>
            )}

            {distanceLoading && <div>Calculating distance…</div>}

            {!distanceLoading && !distanceError && (
              <div className="text-3xl font-bold text-blue-600">
                {distance.toFixed(2)} km
              </div>
            )}

            {distanceError && (
              <div className="text-sm text-red-600">{distanceError}</div>
            )}

              <p className="text-gray-500">
                Distance covered by assigned vehicle
              </p>
            </div>
          )}

          {activeTab === 'location' && vehicle && (
            <div className="w-full">
              <FleetMap user={{ vehicle_id: vehicle.vehicle_id }} />
            </div>
          )}

          {activeTab === 'location' && !vehicle && (
            <div className="text-center text-gray-500 mt-10 sm:mt-16">
              Please assign a vehicle in Settings first
            </div>
          )}

          {activeTab === 'settings' && (
            <FleetSettings
              onVehicleAssigned={(v) => {
                setVehicle(v);
                localStorage.setItem('assignedVehicle', JSON.stringify(v));
              }}
              onLogout={onLogout}
            />
          )}
        </div>
      </main>
    </div>
  );
}
