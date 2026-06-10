const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  // 1. Obtenemos el token de la cabecera (Header)
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ mensaje: "Acceso denegado. No hay token." });
  }

  try {
    // 2. Verificamos si el token es válido y no ha expirado
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = verificado.id; // Guardamos el ID para usarlo luego
    next(); // ¡Todo bien! Pasa a la siguiente función
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido o expirado" });
  }
};

module.exports = { verificarToken };
