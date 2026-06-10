const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cita = sequelize.define("Cita", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Cita Médica",
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    defaultValue: "Consulta estándar",
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  estadoPago: {
    type: DataTypes.ENUM("pendiente", "pagado"),
    defaultValue: "pendiente",
  },
  // No le pongas más validaciones aquí, deja que el controlador maneje el ID
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Cita;
