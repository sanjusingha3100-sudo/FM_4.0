import { useState, useEffect } from 'react';
import { LoginPage } from './components/pages/LoginPage.jsx';

import { OwnerLayout } from './owner/OwnerLayout.jsx';
import { SupervisorLayout } from './supervisor/SupervisorLayout.jsx';
import FleetLayout from './Fleet/FleetLayout.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // dev mode
  const [userRole, setUserRole] = useState('OWNER');
  const [user, setUser] = useState(null);

  /* =========================
     SET USER BASED ON ROLE
  ========================= */
  useEffect(() => {
    if (userRole === 'OWNER') {
      const owner = {
        owner_id: '204ef1b2-a937-442e-abd0-b9a75110c7ec',
        owner_name: 'Azad',
      };
      localStorage.setItem('owner', JSON.stringify(owner));
      setUser(owner);
    }

    if (userRole === 'SUPERVISOR') {
      setUser({
        supervisor_id: '22222222-2222-2222-2222-222222222222',
      });
    }

    if (userRole === 'FLEET') {
      setUser({
        fleet_id: '11111111-1111-1111-1111-111111111111',
      });
    }
  }, [userRole]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('owner');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <>
      {/* =========================
         DEV ROLE SWITCH (TEMP)
      ========================= */}
      <div
        style={{
          padding: 10,
          display: 'flex',
          gap: 10,
          background: '#eee',
          borderBottom: '1px solid #ccc',
        }}
      >
        <button onClick={() => setUserRole('OWNER')}>OWNER</button>
        <button onClick={() => setUserRole('SUPERVISOR')}>SUPERVISOR</button>
        <button onClick={() => setUserRole('FLEET')}>FLEET</button>
      </div>

      {/* =========================
         EXACTLY ONE PORTAL OPENS
      ========================= */}
      {userRole === 'OWNER' && (
        <OwnerLayout onLogout={handleLogout} user={user} />
      )}

      {userRole === 'SUPERVISOR' && (
        <SupervisorLayout onLogout={handleLogout} user={user} />
      )}

      {userRole === 'FLEET' && (
        <FleetLayout onLogout={handleLogout} user={user} />
      )}
    </>
  );
}
