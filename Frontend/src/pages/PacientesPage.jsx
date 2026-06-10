import { useState, useEffect } from "react";
import client from "../api/axios";
import { UserPlus, Search, Trash2, Edit, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"; // Librería para manejar el formulario rápido

function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar ventana
  const [editando, setEditando] = useState(false); // ¿Estamos editando?
  const [pacienteId, setPacienteId] = useState(null); // ID del paciente a editar
  const { register, handleSubmit, reset } = useForm(); // Herramientas del formulario
  const navigate = useNavigate();

  // 1. CARGAR PACIENTES DEL BACKEND
  const cargarPacientes = async () => {
    try {
      const res = await client.get("/pacientes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPacientes(res.data.datos);
    } catch (error) {
      console.error("Error al traer pacientes", error);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  // 2. FUNCIÓN PARA GUARDAR (CREAR O EDITAR)
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Extraemos el token
      if (!token) return alert("Sesión expirada, vuelve a loguearte");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editando) {
        // Explicación: Si la variable 'editando' es verdadera, enviamos una petición PUT al ID del paciente
        await client.put(`/pacientes/${pacienteId}`, data, config);
        alert("¡Paciente actualizado con éxito!");
      } else {
        // Explicación: Si es falsa, seguimos enviando un POST para crear uno nuevo
        await client.post("/pacientes", data, config);
        alert("¡Paciente registrado con éxito!");
      }

      setIsModalOpen(false); // Cerramos la ventana
      setEditando(false); // Importante: devolvemos el estado a falso para la próxima vez
      reset(); // Limpiamos los campos del formulario
      cargarPacientes(); // Refrescamos la lista de la tabla
    } catch (error) {
      console.error("Error detallado:", error.response);
      if (error.response?.status === 401)
        alert("Tu sesión ha caducado. Sal y vuelve a entrar.");
      else alert("Error al guardar.");
    }
  };
  const eliminarPaciente = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este paciente?")) return;
    try {
      await client.delete(`/pacientes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      cargarPacientes(); // Refrescamos la lista después de borrar
      alert("Paciente eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("No se pudo eliminar el paciente.");
    }
  };

  const prepararEdicion = (p) => {
    setEditando(true);
    setPacienteId(p.id);
    reset({
      nombre: p.nombre,
      dni: p.dni,
      edad: p.edad,
      telefono: p.telefono,
      estadoPago: p.estadoPago, // <-- Añadimos esto
    }); // Esto rellena automáticamente los inputs del formulario
    setIsModalOpen(true);
  };

  // 3. FILTRO DE BÚSQUEDA
  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.dni.includes(busqueda),
  );

  return (
    <div className="p-8 animate-fadeIn relative">
      {/* Botón Volver */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Dashboard
      </button>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white italic">
            Gestión de <span className="text-emerald-500">Pacientes</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Administra tu base de datos clínica
          </p>
        </div>

        <button
          onClick={() => {
            setEditando(false);
            reset({
              nombre: "",
              dni: "",
              edad: "",
              telefono: "",
              estadoPago: "pendiente",
            }); // <-- añadimos estadoPago inicial
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Nuevo Paciente
        </button>
      </header>

      {/* Barra de Búsqueda */}
      <div className="relative mb-8 text-black">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-slate-900 border border-slate-800 text-white p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 transition-all"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-black">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">DNI / ID</th>
              <th className="p-4">Estado Pago</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-4 text-white font-medium">{p.nombre}</td>
                  <td className="p-4 text-slate-400 font-mono text-sm">
                    {p.dni}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.estadoPago === "pagado" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
                    >
                      {p.estadoPago}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => prepararEdicion(p)}
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => eliminarPaciente(p.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-slate-500 italic"
                >
                  No se encontraron pacientes...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VENTANA MODAL (EL FORMULARIO) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-zoomIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editando ? "Editar Paciente" : "Registrar Paciente"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Nombre Completo
                </label>
                <input
                  {...register("nombre", { required: true })}
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    DNI / ID
                  </label>
                  <input
                    {...register("dni", { required: true })}
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Edad
                  </label>
                  <input
                    {...register("edad")}
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                    placeholder="30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Teléfono / WhatsApp
                </label>
                <input
                  {...register("telefono")}
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  placeholder="+51 987..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">
                  Estado de Pago
                </label>
                <select
                  {...register("estadoPago")}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="pendiente">Pendiente (Por cobrar)</option>
                  <option value="pagado">Pagado (Completado)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all mt-6 active:scale-95"
              >
                {editando ? "Actualizar Paciente" : "Guardar Paciente"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PacientesPage;
