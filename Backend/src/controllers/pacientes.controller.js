const Paciente = require("../models/paciente.model");

// Función 1: Obtener la lista (Cambiamos .find() por .findAll())
const obtenerPacientes = async (req, res) => {
  try {
    // Solo buscamos los que pertenecen a este doctor (req.usuarioId)
    const listaPacientes = await Paciente.findAll({
      where: { usuarioId: req.usuarioId },
    });
    res.json({
      total: listaPacientes.length,
      datos: listaPacientes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los pacientes",
      error: error.message,
    });
  }
};

// Función 2: GUARDAR (Cambiamos new Paciente y .save() por .create())
const crearPaciente = async (req, res) => {
  try {
    // Inyectamos el ID del doctor que viene del Token
    const nuevoPaciente = await Paciente.create({
      ...req.body,
      usuarioId: req.usuarioId, // <--- EL DOCTOR ES EL DUEÑO
    });

    res.status(201).json({
      mensaje: "Paciente registrado con éxito en la base de datos",
      dato: nuevoPaciente,
    });
  } catch (error) {
    console.error("❌ Error al procesar paciente:", error.message);
    res.status(400).json({
      mensaje: "No se pudo registrar el paciente.",
      error: error.message,
    });
  }
};

// Función 3: ELIMINAR (Cambiamos por .destroy())
const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Paciente.destroy({
      where: { id: id, usuarioId: req.usuarioId }, // En Sequelize especificamos cuál borrar
    });

    if (!eliminado) {
      return res
        .status(404)
        .json({ mensaje: "El paciente no existe en la base de datos" });
    }

    res.json({ mensaje: "Paciente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar:", error.message);
    res.status(500).json({ mensaje: "ID no válido o error de servidor" });
  }
};

// Función 4: ACTUALIZAR (Usamos .update())
const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    // Buscamos y actualizamos los datos que vienen en el body
    const [actualizado] = await Paciente.update(req.body, {
      where: { id: id, usuarioId: req.usuarioId },
    });

    if (!actualizado) {
      return res
        .status(404)
        .json({ mensaje: "Paciente no encontrado para actualizar" });
    }

    res.json({ mensaje: "Paciente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
    res.status(500).json({ mensaje: "Error al actualizar el paciente" });
  }
};

module.exports = {
  obtenerPacientes,
  crearPaciente,
  eliminarPaciente,
  actualizarPaciente, // <-- Exportamos la función de actualización
};
