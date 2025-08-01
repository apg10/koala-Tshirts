// src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();
  // Si no hay usuario o no es admin, redirige a Home
  if (!user || !user.is_admin) {
    return <Navigate to="/" replace />;
  }
  // Si es admin, renderiza las rutas hijas
  return <Outlet />;
}
