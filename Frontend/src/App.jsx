// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

// IMPORTACIÓN DE PÁGINAS
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PacientesPage from "./pages/PacientesPage";
import AgendaPage from "./pages/AgendaPage"; // Importamos la nueva página de Agenda
import ArchivosPage from "./pages/ArchivosPage"; // Importamos la nueva página de Archivos

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white">
          <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* PRIVADAS (Protegidas) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pacientes" element={<PacientesPage />} />
              <Route path="/agenda" element={<AgendaPage />} />{" "}
              {/* Nueva ruta para el calendario */}
              <Route path="/archivos" element={<ArchivosPage />} />{" "}
              {/* Nueva ruta para finanzas/documentos */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
