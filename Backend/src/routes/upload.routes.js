const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // RAM temporal

router.post("/subir", upload.single("archivo"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No hay archivo" });

    // Ponemos un nombre único para que no se borren fotos con el mismo nombre
    const fileName = `${Date.now()}_${file.originalname}`;

    // 1. Lanzamos el archivo al bucket "expedientes"
    const { data, error } = await supabase.storage
      .from("expedientes")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error; // Si la nube falla, nos dirá por qué

    // 2. Pedimos el link público para mandarlo al Frontend
    const { data: publicUrlData } = supabase.storage
      .from("expedientes")
      .getPublicUrl(fileName);

    res.json({
      message: "¡Subido a Supabase con éxito!",
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("❌ ERROR EN SUPABASE STORAGE:", error.message);
    res.status(500).json({ message: "Error en la nube", error: error.message });
  }
});

// RUTA PARA BORRAR (ELIMINAR) EL ARCHIVO DE LA NUBE
router.delete("/borrar", async (req, res) => {
  const { nombreArchivo } = req.body; // El Frontend nos dirá qué archivo borrar

  try {
    const { data, error } = await supabase.storage
      .from("expedientes")
      .remove([nombreArchivo]); // Supabase pide un array con el nombre

    if (error) throw error;

    res.json({ message: "Archivo destruido con éxito", data });
  } catch (error) {
    console.error("❌ ERROR AL BORRAR:", error.message);
    res
      .status(500)
      .json({ message: "No se pudo borrar", error: error.message });
  }
});

module.exports = router;
