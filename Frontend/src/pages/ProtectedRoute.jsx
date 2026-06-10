// src/pages/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AQUÍ SÍ VAN LOS DOS PUNTOS

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Mientras el sistema verifica si hay token, mostramos un mensaje de carga
  if (loading) return <h1 className="text-white">Cargando seguridad...</h1>;

  // Si no está autenticado y ya terminó de cargar, lo mandamos al login
  if (!isAuthenticated && !loading) return <Navigate to="/login" replace />;

  // Si todo está bien, lo dejamos pasar a las páginas internas (Dashboard, etc.)
  return <Outlet />;
}

export default ProtectedRoute;
