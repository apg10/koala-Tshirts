// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ redirectPath = "/login" }) {
  const { user } = useAuth();
  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to={redirectPath} replace />;
  }
  // Si está autenticado, renderiza las rutas hijas
  return <Outlet />;
}
