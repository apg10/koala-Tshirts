// src/components/AdminRoute.jsx
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects /admin/* routes so that only signed-in admins can access them.
 * If not signed in, redirects to /login, preserving the attempted URL.
 * If signed in but not an admin, redirects to the home page.
 */
export default function AdminRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in → send to login, but remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.is_admin) {
    // Logged in but not an admin → send to home
    return <Navigate to="/" replace />;
  }

  // OK → render the nested routes (<Outlet/>)
  return <Outlet />;
}
