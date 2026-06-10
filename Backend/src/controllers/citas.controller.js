const Cita = require("../models/cita.model");

const crearCita = async (req, res) => {
  try {
    // CAMBIO CLAVE: Usamos 'req.usuarioId' porque así lo guarda tu middleware
    const nuevaCita = await Cita.create({
      ...req.body,
      usuarioId: req.usuarioId,
    });

    res.status(201).json({
      mensaje: "Cita creada con éxito",
      nuevacita: nuevaCita,
    });
  } catch (error) {
    console.error("Error al crear cita:", error.message);
    res.status(400).json({
      mensaje: "Error al crear cita",
      error: error.message,
    });
  }
};

const obtenerCitas = async (req, res) => {
  try {
    // CAMBIO CLAVE: Usamos 'req.usuarioId'
    const citas = await Cita.findAll({
      where: { usuarioId: req.usuarioId },
    });
    res.json(citas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener citas",
      error: error.message,
    });
  }
};

const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    // CAMBIO CLAVE: Usamos 'req.usuarioId'
    await Cita.destroy({
      where: { id, usuarioId: req.usuarioId },
    });
    res.json({ mensaje: "Cita eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar",
      error: error.message,
    });
  }
};

module.exports = { crearCita, obtenerCitas, eliminarCita };
