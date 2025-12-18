import { useEffect, useRef } from 'react';
import api from '@/services/api';

export default function LiveLocation() {
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('GPS not supported');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed } = pos.coords;

        // SEND EVERY UPDATE (≈ 1 sec)
        await api.post('/gps/log', {
          latitude,
          longitude,
          speed: speed || 0
        });
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold text-green-600">
        Live Location Sharing ON
      </h2>
      <p className="text-sm text-gray-600">
        Your movement is tracked in real-time
      </p>
    </div>
  );
}
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useEffect, useState } from 'react';

export default function LiveFleetMap() {
  const [position, setPosition] = useState([28.6139, 77.2090]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full"
        whenCreated={(map) =>
          setTimeout(() => map.invalidateSize(), 200)
        }
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={position} />
      </MapContainer>
    </div>
  );
}
