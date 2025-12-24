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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* =========================
         HEADER
      ========================= */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between">
        <div>
          <h1 className="text-lg font-semibold">Fleet Dashboard</h1>
          <p className="text-sm opacity-80">Live vehicle tracking</p>
        </div>

        <button onClick={onLogout} className="text-sm underline">
          Logout
        </button>
      </header>

      {/* =========================
         TABS
      ========================= */}
      <div className="flex gap-6 px-6 pt-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={activeTab === 'dashboard' ? 'text-blue-600 underline' : ''}
        >
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={activeTab === 'location' ? 'text-blue-600 underline' : ''}
        >
          Live Location
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={activeTab === 'settings' ? 'text-blue-600 underline' : ''}
        >
          Settings
        </button>
      </div>

      {/* =========================
         CONTENT
      ========================= */}
      <main className="flex-1 p-6">
        {activeTab === 'dashboard' && (
          <div className="max-w-md mx-auto text-center mt-20 space-y-4">
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
          <FleetMap user={{ vehicle_id: vehicle.vehicle_id }} />
        )}

        {activeTab === 'location' && !vehicle && (
          <div className="text-center text-gray-500 mt-20">
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
      </main>
    </div>
  );
}
