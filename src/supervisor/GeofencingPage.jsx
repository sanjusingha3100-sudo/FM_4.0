import { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api.js';

/* =========================
   MAP CLICK
========================= */
function MapClick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function GeofencingPage() {
  const mapRef = useRef(null);

  const [tab, setTab] = useState('GEOFENCE');

  const [vehicles, setVehicles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [reports, setReports] = useState([]);

  /* ---------- Geofence ---------- */
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [radius, setRadius] = useState(500);
  const [point, setPoint] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  /* ---------- Shift ---------- */
  const [shiftName, setShiftName] = useState('');
  const [expectedMinutes, setExpectedMinutes] = useState(30);
  const [shiftVehicles, setShiftVehicles] = useState([]);

  /* =========================
     LOAD INITIAL DATA
  ========================= */
  useEffect(() => {
    api.getLatestTelemetry().then(setVehicles);

    fetch(`${import.meta.env.VITE_API_URL}/api/companies`)
      .then((r) => r.json())
      .then(setCompanies);

    fetch(`${import.meta.env.VITE_API_URL}/api/arrival-reports`)
      .then((r) => r.json())
      .then(setReports);
  }, []);

  /* =========================
     SEARCH AUTOCOMPLETE
  ========================= */
  useEffect(() => {
    if (searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          searchText
        )}`
      );
      setSuggestions(await res.json());
    }, 400);

    return () => clearTimeout(t);
  }, [searchText]);

  const selectSuggestion = (s) => {
    const lat = +s.lat;
    const lng = +s.lon;
    setPoint({ lat, lng });
    setCompanyName(s.display_name);
    setSearchText(s.display_name);
    setSuggestions([]);
    mapRef.current?.flyTo([lat, lng], 15);
  };

  /* =========================
     CREATE COMPANY
  ========================= */
  const createCompany = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: companyName,
        center_lat: point.lat,
        center_lng: point.lng,
        radius_meters: radius,
      }),
    });

    alert('Company created');
    window.location.reload();
  };

  /* =========================
     LOAD SHIFTS
  ========================= */
  const loadShifts = async (company) => {
    setSelectedCompany(company);
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/company-shifts/${company.company_id}`
    );
    setShifts(await res.json());
  };

  /* =========================
     CREATE SHIFT
  ========================= */
  const createShift = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/company-shifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: selectedCompany.company_id,
        shift_name: shiftName,
        expected_time_minutes: expectedMinutes,
        vehicle_ids: shiftVehicles,
      }),
    });

    alert('Shift created');
    loadShifts(selectedCompany);
  };

  return (
    <div className="h-screen grid grid-cols-3">
      {/* ================= MAP ================= */}
      <div className="col-span-2 h-full">
        <MapContainer
          className="h-full w-full"
          center={[28.61, 77.2]}
          zoom={6}
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClick onPick={setPoint} />

          {vehicles.map((v) => (
            <Marker key={v.id} position={[v.lat, v.lng]}>
              <Popup>{v.number}</Popup>
            </Marker>
          ))}

          {companies.map((c) => {
            const m = c.center
              ?.toString()
              .match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
            if (!m) return null;

            return (
              <Circle
                key={c.company_id}
                center={[+m[2], +m[1]]}
                radius={c.radius_meters}
                pathOptions={{ color: '#16a34a' }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="border-l bg-white p-4 overflow-y-auto space-y-4">
        {/* TABS */}
        <div className="flex gap-2">
          {['GEOFENCE', 'SHIFTS', 'REPORTS'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded ${
                tab === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ================= TAB CONTENT ================= */}
        {tab === 'GEOFENCE' && (
          <>
            <h2 className="font-semibold">Create Company</h2>

            <input
              className="w-full border p-2"
              placeholder="Search address"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => selectSuggestion(s)}
                className="cursor-pointer p-2 text-sm hover:bg-slate-100"
              >
                {s.display_name}
              </div>
            ))}

            <input
              className="w-full border p-2"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <input
              type="number"
              className="w-full border p-2"
              placeholder="Radius (m)"
              value={radius}
              onChange={(e) => setRadius(+e.target.value)}
            />

            <button
              onClick={createCompany}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save Company
            </button>

            <h3 className="font-semibold mt-4">All Companies</h3>
            {companies.map((c) => (
              <button
                key={c.company_id}
                onClick={() => loadShifts(c)}
                className="block w-full text-left p-2 border rounded"
              >
                {c.company_name}
              </button>
            ))}
          </>
        )}

        {tab === 'SHIFTS' && selectedCompany && (
          <>
            <h2 className="font-semibold">
              Shifts – {selectedCompany.company_name}
            </h2>

            <input
              className="w-full border p-2"
              placeholder="Shift Name"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
            />

            <input
              type="number"
              className="w-full border p-2"
              placeholder="Expected arrival (minutes)"
              value={expectedMinutes}
              onChange={(e) => setExpectedMinutes(+e.target.value)}
            />

            <select
              multiple
              className="w-full border p-2"
              onChange={(e) =>
                setShiftVehicles(
                  [...e.target.selectedOptions].map(
                    (o) => o.value
                  )
                )
              }
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.number}
                </option>
              ))}
            </select>

            <button
              onClick={createShift}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Add Shift
            </button>

            {shifts.map((s) => (
              <div key={s.shift_id} className="p-2 border rounded">
                {s.shift_name} – {s.expected_time_minutes} min
              </div>
            ))}
          </>
        )}

        {tab === 'REPORTS' && (
          <>
            <h2 className="font-semibold">Arrival Reports</h2>

            {reports.map((r) => (
              <div
                key={r.id}
                className="p-2 border rounded text-sm"
              >
                <b>{r.company_name}</b> – {r.vehicle_number}
                <br />
                Status: {r.status} | Delay: {r.delay_minutes} min
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
