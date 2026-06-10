const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./config/db");
require("dotenv").config();

const app = express();

// 1. MIDDLEWARES DE SEGURIDAD
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. IMPORTACIÓN Y USO DE RUTAS
const uploadRoutes = require("./routes/upload.routes");

app.use("/api/archivos", uploadRoutes);

app.use("/api", require("./routes/index.routes"));

// 3. MODELOS Y RELACIONES
const Usuario = require("./models/usuario.model");
const Paciente = require("./models/paciente.model");
const Cita = require("./models/cita.model");

Usuario.hasMany(Paciente, { foreignKey: "usuarioId" });
Paciente.belongsTo(Usuario, { foreignKey: "usuarioId" });
Usuario.hasMany(Cita, { foreignKey: "usuarioId" });
Cita.belongsTo(Usuario, { foreignKey: "usuarioId" });

// 4. FUNCIÓN DE ARRANQUE
const PORT = process.env.PORT || 3000;

const arrancarSistema = async () => {
  try {
    // Sincronización oficial del proyecto
    await sequelize.sync({ alter: true });

    console.log("✅ SISTEMA TOTALMENTE RESTABLECIDO.");

    app.listen(PORT, () => {
      console.log(`🚀 El motor está rugiendo en el puerto ${PORT}`);
      console.log(
        "El sistema está funcionando correctamente y listo para empezar.",
      );
    });
  } catch (err) {
    console.error("⚠️ Error crítico:", err.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

arrancarSistema();
