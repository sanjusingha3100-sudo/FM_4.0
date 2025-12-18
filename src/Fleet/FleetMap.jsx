import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';

export default function FleetMap({ user }) {
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0); // throttle backend calls

  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    // START LIVE TRACKING
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const speed = pos.coords.speed || 0;

        const coords = [latitude, longitude];
        setPosition(coords);

        // Move map smoothly
        if (mapRef.current) {
          mapRef.current.setView(coords, mapRef.current.getZoom(), {
            animate: true,
          });
        }

        // 🔥 SEND LOCATION TO BACKEND (every 5 sec)
        const now = Date.now();
        if (now - lastSentRef.current > 5000) {
          lastSentRef.current = now;

          fetch('http://localhost:5000/api/fleet/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-role': 'FLEET',
              'x-vehicle-id': user?.vehicle_id, // IMPORTANT
            },
            body: JSON.stringify({
              latitude,
              longitude,
              speed,
              ignition: true,
            }),
          }).catch((err) => {
            console.error('Failed to send GPS', err);
          });
        }
      },
      (err) => {
        console.error(err);
        setError('Please allow location access');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // CLEANUP on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [user]);

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex items-center justify-center h-[500px] text-gray-500">
        Fetching live location...
      </div>
    );
  }

  return (
    <div
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
          setTimeout(() => map.invalidateSize(), 300);
        }}
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
