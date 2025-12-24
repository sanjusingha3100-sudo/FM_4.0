import { useEffect, useRef, useState } from 'react';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5002';

const API_BASE_URL = BASE_URL.endsWith('/api')
  ? BASE_URL
  : `${BASE_URL}/api`;

export default function FleetMap({ user }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);
  const hasInitialZoomRef = useRef(false);

  const [error, setError] = useState('');
  const [initialLocation, setInitialLocation] = useState(null);

  /* =========================
     TRY FETCH LAST DB LOCATION
  ========================= */
  useEffect(() => {
    if (!user?.vehicle_id) return;

    fetch(`${API_BASE_URL}/fleet/last-location/${user.vehicle_id}`, {
      headers: {
        'x-role': 'FLEET',
        'x-vehicle-id': user.vehicle_id,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.latitude && data?.longitude) {
          setInitialLocation({
            lat: data.latitude,
            lng: data.longitude,
          });
        }
      })
      .catch(() => {});
  }, [user]);

  /* =========================
     INIT MAP + GPS
  ========================= */
  useEffect(() => {
    if (!window.mappls) {
      setError('MapmyIndia SDK not loaded');
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    if (mapRef.current) return;

    requestAnimationFrame(() => {
      const container = document.getElementById('fleet-map');
      if (!container || mapRef.current) return;

      // 🔥 FALLBACK CENTER (India)
      const fallback = initialLocation || { lat: 28.6139, lng: 77.2090 };

      const map = new window.mappls.Map(container, {
        center: [fallback.lat, fallback.lng],
        zoom: initialLocation ? 18 : 6,
      });

      mapRef.current = map;

      markerRef.current = new window.mappls.Marker({
        map,
        position: fallback,
      });

      // 🌍 LIVE GPS
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed } = pos.coords;

          if (
            latitude == null ||
            longitude == null ||
            latitude === 0 ||
            longitude === 0
          ) return;

          markerRef.current?.setPosition({ lat: latitude, lng: longitude });

          if (!hasInitialZoomRef.current) {
            map.setCenter([latitude, longitude]);
            map.setZoom(18);
            hasInitialZoomRef.current = true;
          }

          if (!user?.vehicle_id) return;

          const now = Date.now();
          if (now - lastSentRef.current > 5000) {
            lastSentRef.current = now;

            fetch(`${API_BASE_URL}/fleet/location`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-role': 'FLEET',
                'x-vehicle-id': user.vehicle_id,
              },
              body: JSON.stringify({
                latitude,
                longitude,
                speed: speed || 0,
                ignition: true,
              }),
            }).catch(() => {});
          }
        },
        () => setError('Unable to fetch GPS location'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      markerRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialLocation, user]);

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div
      id="fleet-map"
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
