const Paciente = require("../models/paciente.model");
const Usuario = require("../models/usuario.model");
const Cita = require("../models/cita.model");
const { Op } = require("sequelize"); // Para hacer operaciones avanzadas

const getDashboardData = async (req, res) => {
  try {
    // 1. Buscamos al médico (usando req.usuarioId que viene del middleware)
    const medico = await Usuario.findByPk(req.usuarioId);

    // 2. Contamos cuántos pacientes tiene en total
    const totalPacientes = await Paciente.count({
      where: { usuarioId: req.usuarioId },
    });

    // 3. Calculamos el DINERO TOTAL recaudado (Citas 'pagadas' con monto > 0)
    const ingresosTotales =
      (await Cita.sum("monto", {
        where: {
          usuarioId: req.usuarioId,
          estadoPago: "pagado",
          monto: { [Op.gt]: 0 }, // Solo sumamos lo que entra
        },
      })) || 0; // Si no hay ingresos, devolvemos 0 en lugar de null

    // 4. Calculamos los GASTOS dinámicos (Citas con monto < 0)
    const gastosTotales =
      (await Cita.sum("monto", {
        where: {
          usuarioId: req.usuarioId,
          monto: { [Op.lt]: 0 }, // Sumamos lo que sale (números negativos)
        },
      })) || 0;

    // 5. Contamos cuántos cobros están pendientes (Citas Pendientes)
    const pagosPendientes = await Cita.count({
      where: {
        usuarioId: req.usuarioId,
        estadoPago: "pendiente",
      },
    });

    // 6. BALANCE FINAL (Ingresos + Gastos, ya que el gasto es negativo)
    const balanceFinal =
      parseFloat(ingresosTotales) + parseFloat(gastosTotales);

    res.json({
      saludo: `¡Hola, Dr. ${medico ? medico.nombre : "Colega"}!`,
      resumen: {
        totalPacientes,
        ingresosTotales: parseFloat(ingresosTotales).toFixed(2), // Bruto
        gastosTotales: Math.abs(parseFloat(gastosTotales)).toFixed(2), // En positivo para la vista
        balanceFinal: balanceFinal.toFixed(2), // Lo que queda en el bolsillo
        pagosPendientes,
      },
      alertas: [
        // Mensaje dinámico de pacientes
        totalPacientes === 0
          ? "👥 Aún no tienes pacientes registrados en tu base de datos."
          : `🚀 Actualmente gestionas un total de ${totalPacientes} pacientes registrados.`,

        // Mensaje dinámico de finanzas (Cobros pendientes)
        pagosPendientes > 0
          ? `⚠️ Atención: Tienes ${pagosPendientes} cobro(s) pendiente(s) por gestionar.`
          : "✅ ¡Excelente! Estás al día con todos tus cobros.",

        // Mensaje de éxito o precaución financiera
        balanceFinal > 0
          ? `💰 Saldo positivo: Tu ganancia neta actual es de $${balanceFinal.toFixed(2)}.`
          : "📊 Alerta financiera: Tus ingresos actuales están cubriendo gastos o están en 0.",
      ],
      fecha: new Date().toLocaleDateString(),
    });
  } catch (error) {
    console.error("Error en Dashboard:", error.message);
    res.status(500).json({
      mensaje: "Error al cargar datos del dashboard",
      error: error.message,
    });
  }
};

module.exports = { getDashboardData };
