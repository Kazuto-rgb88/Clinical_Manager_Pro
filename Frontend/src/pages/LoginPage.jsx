import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();
  const { signin, errors: serverErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya estás autenticado, te mando al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2 text-center italic">
          Clinical Manager <span className="text-blue-500 font-black">PRO</span>
        </h1>
        <p className="text-slate-400 text-sm text-center mb-8 font-mono">
          Control de Acceso Médico
        </p>

        {/* 🚨 ERRORES DEL SISTEMA (Si la llave no gira) 🚨 */}
        {serverErrors &&
          serverErrors.map((error, i) => (
            <div
              key={i}
              className="bg-red-500/10 border border-red-500 text-red-500 p-3 text-center mb-4 rounded-lg text-xs font-bold uppercase tracking-tighter animate-pulse"
            >
              {error}
            </div>
          ))}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              {...register("email", {
                required: "El correo es tu identificación",
              })}
              className="w-full bg-slate-800/50 text-white p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              placeholder="correo@ejemplo.com"
            />
            {formErrors.email && (
              <span className="text-red-400 text-[10px] absolute -bottom-4 left-1 italic">
                {formErrors.email.message}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              {...register("password", { required: "Contraseña obligatoria" })}
              className="w-full bg-slate-800/50 text-white p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              placeholder="••••••••"
            />
            {formErrors.password && (
              <span className="text-red-400 text-[10px] absolute -bottom-4 left-1 italic">
                {formErrors.password.message}
              </span>
            )}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:-translate-y-1 active:translate-y-0">
            ENTRAR AL SISTEMA
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">
            ¿Nuevo en la clínica?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              Solicitar Registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
