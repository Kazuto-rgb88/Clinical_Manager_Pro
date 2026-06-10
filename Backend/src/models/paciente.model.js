const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Lo crearemos ahora

const Paciente = sequelize.define("Paciente", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING, unique: true },
  telefono: { type: DataTypes.STRING },
  edad: { type: DataTypes.INTEGER }, // <-- Añade esta línea exactamente así
  estadoPago: {
    type: DataTypes.ENUM("pendiente", "pagado"),
    defaultValue: "pendiente",
  },
  estadoConsulta: {
    type: DataTypes.ENUM("espera", "completada"),
    defaultValue: "espera",
  },
  ultimaConsulta: { type: DataTypes.DATE },
  proximaCita: { type: DataTypes.DATE },
});

module.exports = Paciente;
