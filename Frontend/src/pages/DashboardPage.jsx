import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import client from "../api/axios";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  Bell,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    resumen: {
      totalPacientes: 0,
      ingresosTotales: "0.00",
      gastosTotales: "0.00", // <-- NUEVO
      balanceFinal: "0.00", // <-- NUEVO
      pagosPendientes: 0,
    },
    alertas: [],
    saludo: "",
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await client.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error al cargar dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Inicio",
      icon: <LayoutDashboard size={40} />,
      color: "bg-blue-600",
    },
    { title: "Pacientes", icon: <Users size={40} />, color: "bg-emerald-600" },
    { title: "Agenda", icon: <Calendar size={40} />, color: "bg-amber-600" },
    {
      title: "Archivos",
      icon: <FolderOpen size={40} />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white italic">
            {data.saludo || `Hola, ${user?.nombre || "Doctor"}`} 👋
          </h1>
          <p className="text-slate-400 text-sm italic">
            Hoy es{" "}
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 cursor-pointer transition-colors group">
            <Bell className="text-slate-300 group-hover:text-white" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white border-2 border-slate-900">
              {data.resumen?.pagosPendientes || 0}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl font-bold border border-red-500/20 transition-all active:scale-95"
          >
            <LogOut size={20} />
            <span className="hidden md:inline text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* BOTONES DE ACCESO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item.title === "Pacientes") navigate("/pacientes");
              if (item.title === "Inicio") navigate("/dashboard");
              if (item.title === "Agenda") navigate("/agenda");
              if (item.title === "Archivos") navigate("/archivos");
            }}
            className={`${item.color} p-8 rounded-3xl shadow-lg shadow-black/20 hover:scale-105 hover:brightness-110 transition-all flex flex-col items-center justify-center gap-4 text-white font-bold group`}
          >
            <div className="group-hover:animate-bounce">{item.icon}</div>
            <span className="text-xl">{item.title}</span>
            {item.title === "Pacientes" && (
              <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                {data.resumen?.totalPacientes || 0} registrados
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SECCIÓN FINANCIERA COMPACTA Y PRO */}
      <div className="mt-6 flex flex-wrap gap-4">
        {/* INGRESOS */}
        <div className="flex-1 min-w-[200px] bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold">
              Ingresos
            </p>
            <h3 className="text-xl font-bold text-white">
              ${data.resumen?.ingresosTotales}
            </h3>
          </div>
        </div>

        {/* GASTOS */}
        <div className="flex-1 min-w-[200px] bg-slate-900 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
            <TrendingUp size={20} className="rotate-180" />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold">
              Gastos
            </p>
            <h3 className="text-xl font-bold text-white">
              -${data.resumen?.gastosTotales}
            </h3>
          </div>
        </div>

        {/* BALANCE */}
        <div className="flex-1 min-w-[200px] bg-blue-600 p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-blue-600/20">
          <div className="bg-white/20 p-2 rounded-lg text-white">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <p className="text-blue-100 text-[10px] uppercase font-bold">
              Balance Neto
            </p>
            <h3 className="text-xl font-bold text-white">
              ${data.resumen?.balanceFinal}
            </h3>
          </div>
        </div>

        {/* POR COBRAR */}
        <div className="flex-1 min-w-[200px] bg-slate-900 border border-amber-500/30 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
            <Bell size={20} />
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold">
              Pendiente
            </p>
            <h3 className="text-xl font-bold text-white">
              {data.resumen?.pagosPendientes}{" "}
              <span className="text-xs opacity-50">Citas</span>
            </h3>
          </div>
        </div>
      </div>

      {/* RESUMEN DEL DÍA */}
      <section className="mt-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></span>
          Resumen Automático
        </h2>
        <div className="text-slate-400 italic space-y-3 pl-4">
          {data.alertas && data.alertas.length > 0 ? (
            data.alertas.map((alerta, i) => (
              <p
                key={i}
                className="border-l border-slate-800 pl-4 py-1 hover:text-white transition-colors"
              >
                "{alerta}"
              </p>
            ))
          ) : (
            <p className="opacity-50">"Analizando datos de la clínica..."</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
