// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 text-center">
        Clinical Manager Pro
      </h1>
      <p className="text-slate-400 text-lg">
        Motor de Seguridad y Citas Conectado 🔑
      </p>
      <div className="flex gap-4 mt-8">
        {/* Usamos Link para que React cambie la página sin recargar */}
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          Ir al Login
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-lg font-bold transition-all"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
