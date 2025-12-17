import { Navigate } from 'react-router-dom';

/**
 * RequireRole Component
 * Protects routes by checking user role
 */
export function RequireRole({ children, allowedRoles, userRole }) {
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
