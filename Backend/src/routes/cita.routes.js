const express = require("express");
const router = express.Router();

// 1. Importamos las funciones del controlador (Añadimos 'eliminarCita')
const {
  crearCita,
  obtenerCitas,
  eliminarCita,
} = require("../controllers/citas.controller");

// 2. Importamos el middleware de seguridad
const { verificarToken } = require("../middleware/auth.middleware");

// --- RUTAS ---

// OBTENER TODAS LAS CITAS
router.get("/", verificarToken, obtenerCitas);

// CREAR UNA NUEVA CITA
router.post("/", verificarToken, crearCita);

// ELIMINAR UNA CITA ESPECÍFICA (Usamos el :id para saber cuál borrar)
router.delete("/:id", verificarToken, eliminarCita);

module.exports = router;
