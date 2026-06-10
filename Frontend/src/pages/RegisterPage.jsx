import client from "../api/axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();
  const { signup, isAuthenticated, errors: serverErrors } = useAuth();
  const navigate = useNavigate();

  // Si ya estás autenticado, te mando al dashboard (no tiene sentido registrarse si ya estás logueado)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    console.log("Intentando registrar directamente...", values);
    try {
      // Importa client si no lo tienes: import client from "../api/axios";
      const res = await client.post("/auth/registrar", values);
      console.log("¡SERVIDOR RESPONDIÓ!", res.data);
      alert("¡REGISTRO EXITOSO EN NEON! Ahora intenta loguearte.");
      navigate("/login");
    } catch (error) {
      console.error("EL SERVIDOR REBOTÓ LA PETICIÓN:", error);
      alert(
        "ERROR: " + (error.response?.data?.message || "Servidor no responde"),
      );
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        {/* LOGO E IMAGEN DE MARCA */}
        <h1 className="text-3xl font-bold text-white mb-2 text-center italic">
          Clinical Manager <span className="text-blue-500 font-black">PRO</span>
        </h1>
        <h2 className="text-sm text-slate-400 mb-6 text-center">
          La tecnología al servicio de tu salud
        </h2>

        {/* 🚨 ZONA DE ERRORES DEL SERVIDOR 🚨 */}
        {/* Si el backend nos devuelve errores, los mapeamos aquí en rojo brillante */}
        {serverErrors &&
          serverErrors.map((error, i) => (
            <div
              key={i}
              className="bg-red-500/10 border border-red-500 text-red-500 p-2 text-center mb-4 rounded-lg text-sm font-bold animate-pulse"
            >
              {error}
            </div>
          ))}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              type="text"
              {...register("nombre", {
                required: "El nombre es vital para el registro",
              })}
              placeholder="Nombre completo"
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition-colors"
            />
            {formErrors.nombre && (
              <p className="text-xs text-red-400 italic ml-1">
                {formErrors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="email"
              {...register("email", {
                required: "Necesitamos un email para contactarte",
              })}
              placeholder="Email profesional"
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition-colors"
            />
            {formErrors.email && (
              <p className="text-xs text-red-400 italic ml-1">
                {formErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              {...register("password", {
                required: "Establece una contraseña fuerte",
              })}
              placeholder="Contraseña"
              className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 outline-none focus:border-blue-500 transition-colors"
            />
            {formErrors.password && (
              <p className="text-xs text-red-400 italic ml-1">
                {formErrors.password.message}
              </p>
            )}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-lg mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]">
            Crear cuenta ahora
          </button>
        </form>

        <p className="text-slate-500 text-xs mt-8 text-center uppercase tracking-widest font-bold">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
