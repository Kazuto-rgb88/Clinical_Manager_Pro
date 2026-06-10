const Usuario = require("../models/usuario.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registrar = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res
      .status(201)
      .json({ mensaje: "Médico registrado con éxito", id: nuevoUsuario.id });
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al registrar", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Buscar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    // 2. Comparar contraseña escrita con la encriptada en la DB
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto)
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // 3. Crear el TOKEN (la llave) que dura 2 horas
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      mensaje: "Bienvenido al sistema",
      token,
      nombre: usuario.nombre,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el login", error: error.message });
  }
};

module.exports = { registrar, login };
