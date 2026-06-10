const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ MOTOR RUGIENDO: ¡Conexión con NEON establecida!");
  } catch (error) {
    console.error("❌ ERROR DE MOTOR:", error.message);
    process.exit(1);
  }
};

sequelize.conectarDB = conectarDB;
module.exports = sequelize;
