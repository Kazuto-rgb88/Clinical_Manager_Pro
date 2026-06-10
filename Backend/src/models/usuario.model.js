const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const Usuario = sequelize.define(
  "Usuario",
  {
    // AÑADIMOS EL ID CORRECTO AQUÍ:
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    fotoPerfil: { type: DataTypes.STRING },
  },
  {
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    },
  },
);

module.exports = Usuario;
