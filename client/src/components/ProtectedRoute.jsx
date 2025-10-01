import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Lightweight JWT payload decoder without external deps.
 * Returns { exp, role, ... } or null if decode fails.
 */
function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return payload || null;
  } catch {
    return null;
  }
}

/**
 * Validates token presence and expiry (exp in seconds).
 */
function isTokenValid(token) {
  const payload = decodeJwt(token);
  if (!payload) return !!token; // fallback: treat any non-empty token as valid
  const { exp } = payload;
  if (typeof exp !== 'number') return !!token;
  return exp * 1000 > Date.now();
}

/**
 * Props:
 * - children: protected content
 * - redirectTo: path to redirect when unauthenticated (default /login)
 * - allowRoles: optional array of roles allowed (e.g., ['admin', 'manager'])
 */
export default function ProtectedRoute({ children, redirectTo = '/login', allowRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Auth check
  const authed = isTokenValid(token);

  // Role check (optional)
  let roleAllowed = true;
  if (authed && Array.isArray(allowRoles) && allowRoles.length > 0) {
    const payload = decodeJwt(token);
    const userRole = payload?.role;
    roleAllowed = allowRoles.includes(userRole);
  }

  if (!authed) {
    // Preserve where user tried to go; useful to navigate back after login
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (!roleAllowed) {
    // If role not allowed, you can route to a 403 page or back to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
