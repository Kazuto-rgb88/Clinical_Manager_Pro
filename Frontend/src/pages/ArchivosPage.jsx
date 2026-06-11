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
  // ✨ Ahora es una lista vacía para que soporte muchos archivos
  const [listaArchivos, setListaArchivos] = useState([]);
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

      // ✨ MAGIA: Guardamos el archivo en la lista con su nombre y su link
      const nuevoArchivo = {
        nombre: archivo.name,
        url: res.data.url,
      };

      setListaArchivos([...listaArchivos, nuevoArchivo]);

      // ✨ LIMPIEZA AUTOMÁTICA: El selector queda libre para el siguiente archivo
      setArchivo(null);
      alert("¡Archivo guardado en la lista!");
    } catch (error) {
      console.error(error);
      alert("Error al subir.");
    } finally {
      setSubiendo(false);
    }
  };

  // NUEVA FUNCIÓN PARA BORRAR DE LA NUBE
  const borrarDeLaNube = async (urlParaBorrar) => {
    if (
      !window.confirm(
        "¿Estás seguro de eliminar este archivo de la nube para siempre?",
      )
    )
      return;

    try {
      // ✨ Extraemos el nombre del archivo de la URL que pasamos
      const nombreArchivo = urlParaBorrar.split("/").pop();

      await client.delete("/archivos/borrar", {
        data: { nombreArchivo },
      });

      alert("Archivo eliminado de la faz de la tierra");

      // ✨ Quitamos el archivo de la lista visual después de borrarlo de la nube
      setListaArchivos(
        listaArchivos.filter((doc) => doc.url !== urlParaBorrar),
      );
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

                  <button
                    type="button"
                    onClick={quitarArchivo}
                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={subiendo || !archivo}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              subiendo
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20"
            }`}
          >
            {subiendo ? "Procesando..." : "Subir ahora"}
          </button>
        </form>

        {/* LISTA DINÁMICA DE DOCUMENTOS SUBIDOS */}
        {listaArchivos.length > 0 && (
          <div className="mt-8 space-y-3 pt-6 border-t border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase italic mb-4">
              Archivos en esta sesión:
            </h2>
            {listaArchivos.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-purple-400" />
                  <span className="text-xs font-bold truncate max-w-[150px]">
                    {doc.nombre}
                  </span>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => borrarDeLaNube(doc.url)} // ✨ Le pasamos la URL del archivo
                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchivosPage;
