import { useState } from "react";
import client from "../api/axios";
import {
  Upload,
  FileText,
  CheckCircle,
  Eye,
  ArrowLeft,
  X,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ArchivosPage() {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [urlResultado, setUrlResultado] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleDragOver = (handleDragOver) => (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArchivo(e.dataTransfer.files[0]);
    }
  };

  const quitarArchivo = () => {
    setArchivo(null);
    setUrlResultado("");
  };

  const subirArchivo = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("Selecciona un archivo");
    setSubiendo(true);
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const res = await client.post("/archivos/subir", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUrlResultado(res.data.url);
      alert("¡Archivo en la nube!");
    } catch (error) {
      console.error(error);
      alert("Error al subir.");
    } finally {
      setSubiendo(false);
    }
  };

  // NUEVA FUNCIÓN PARA BORRAR DE LA NUBE
  const borrarDeLaNube = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este archivo de la nube para siempre?",
      )
    )
      return;

    try {
      // Extraemos el nombre del archivo de la URL de Supabase
      const nombreArchivo = urlResultado.split("/").pop();

      await client.delete("/archivos/borrar", {
        data: { nombreArchivo }, // Mandamos el nombre en el body
      });

      alert("Archivo eliminado de la faz de la tierra");
      quitarArchivo(); // Limpiamos la pantalla
    } catch (error) {
      console.error(error);
      alert("No se pudo borrar del servidor.");
    }
  };

  return (
    <div className="p-10 min-h-screen text-white bg-slate-950">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Dashboard
      </button>

      <h1 className="text-3xl font-bold italic mb-8">
        Gestión de <span className="text-purple-500">Documentos</span>
      </h1>

      <div className="max-w-xl bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <form onSubmit={subirArchivo} className="space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all relative ${
              archivo
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-slate-700 hover:border-purple-500"
            }`}
          >
            {!archivo ? (
              <>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-500 mb-4" size={48} />
                <p className="text-slate-400 font-medium italic underline">
                  Sube tu archivo o PDF
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="text-emerald-500 mb-2" size={50} />
                <p className="text-sm font-bold text-white mb-4">
                  {archivo.name}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(URL.createObjectURL(archivo), "_blank")
                    }
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-bold border border-slate-700"
                  >
                    <Eye size={16} className="text-blue-400" /> Mirar archivo
                  </button>

                  {/* Si ya se subió, este botón no limpia pantalla, borra nube */}
                  {!urlResultado && (
                    <button
                      type="button"
                      onClick={quitarArchivo}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={subiendo || !archivo || urlResultado}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              subiendo || urlResultado
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            {subiendo
              ? "Procesando..."
              : urlResultado
                ? "Ya está en la nube"
                : "Subir ahora"}
          </button>
        </form>

        {urlResultado && (
          <div className="mt-8 p-4 bg-slate-800 border border-emerald-500/30 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-500" />
                <p className="text-sm font-bold text-emerald-500 italic">
                  Guardado con éxito
                </p>
              </div>
              <a
                href={urlResultado}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline text-xs font-bold"
              >
                Link Directo
              </a>
            </div>

            {/* BOTÓN DEFINITIVO DE ELIMINAR NUBE */}
            <button
              onClick={borrarDeLaNube}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
            >
              <Trash2 size={14} /> Eliminar archivo de la nube
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchivosPage;
