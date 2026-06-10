const { Router } = require("express");
const router = Router();

// 1. Importamos los controladores (Agregamos el de citas aquí arriba)
const {
  obtenerPacientes,
  crearPaciente,
  eliminarPaciente,
  actualizarPaciente, // <-- 1. IMPORTA LA FUNCIÓN AQUÍ
} = require("../controllers/pacientes.controller");
const { getDashboardData } = require("../controllers/dashboard.controller");
const { registrar, login } = require("../controllers/auth.controller");

// NUEVA LÍNEA: Asegúrate de que el archivo ../controllers/citas.controller.js EXISTA
const {
  crearCita,
  obtenerCitas,
  eliminarCita,
} = require("../controllers/citas.controller");

// AQUI ESTA EL SECRETO: Importamos el middleware
const { verificarToken } = require("../middleware/auth.middleware");

// --- RUTAS PÚBLICAS ---
router.post("/auth/registrar", registrar);
router.post("/auth/login", login);

// --- RUTAS PROTEGIDAS (Solo con Token) ---
router.get("/dashboard", verificarToken, getDashboardData);
router.get("/pacientes", verificarToken, obtenerPacientes);
router.post("/pacientes", verificarToken, crearPaciente);
router.delete("/pacientes/:id", verificarToken, eliminarPaciente);
router.put("/pacientes/:id", verificarToken, actualizarPaciente); // <-- 2. AGREGA ESTA LÍNEA

// NUEVAS RUTAS:
router.post("/citas", verificarToken, crearCita);
router.get("/citas", verificarToken, obtenerCitas);
router.delete("/citas/:id", verificarToken, eliminarCita);
module.exports = router;
