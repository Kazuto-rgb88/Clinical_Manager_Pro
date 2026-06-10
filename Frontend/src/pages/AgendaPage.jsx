import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import client from "../api/axios";

function AgendaPage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);

  // 1. PASO: CARGAR CITAS AL ENTRAR (Para que no se borren con F5)
  const cargarCitas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await client.get("/citas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const citasFormateadas = res.data.map((cita) => ({
        id: cita.id,
        title: `${cita.title} - $${cita.monto}`,
        start: cita.start,
        end: cita.end,
        backgroundColor: cita.estadoPago === "pagado" ? "#10b981" : "#f59e0b",
      }));
      setEventos(citasFormateadas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  // 2. PASO: GUARDAR CITA AL ARRASTRAR
  const handleSelect = async (info) => {
    const titulo = prompt("¿Qué actividad realizarás? (Ej: Consulta Médica)");
    if (!titulo) return;

    const monto = prompt("¿Cuánto vas a cobrar por esta cita?");
    const respuestaPago = confirm(
      "¿El paciente ya pagó? \n(Aceptar = SÍ / Cancelar = PENDIENTE)",
    );
    const estado = respuestaPago ? "pagado" : "pendiente";

    try {
      const token = localStorage.getItem("token");
      const datosParaEnviar = {
        title: titulo.trim(),
        start: info.startStr,
        end: info.endStr,
        monto: parseFloat(monto) || 0,
        estadoPago: estado,
      };

      await client.post("/citas", datosParaEnviar, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 1. Limpiamos la selección visual de FullCalendar para que no se duplique
      info.view.calendar.unselect();

      // 2. Refrescamos desde la base de datos para que CARGARCITAS pinte los colores
      // Recuerda que CARGARCITAS ya tiene la lógica de los colores:
      // pagado ? "#10b981" (Verde) : "#f59e0b" (Ámbar)
      await cargarCitas();

      alert("¡Cita agendada con éxito!");
    } catch (error) {
      console.error("Detalle del Error:", error.response?.data);
      alert(
        "Error al guardar: " + (error.response?.data?.mensaje || "Error 400"),
      );
    }
  };

  // 3. PASO: ELIMINAR CITA AL HACER CLICK
  const handleEventClick = async (clickInfo) => {
    if (confirm(`¿Eliminar la cita: '${clickInfo.event.title}'?`)) {
      try {
        const idCita = clickInfo.event.id;
        await client.delete(`/citas/${idCita}`);
        clickInfo.event.remove(); // Lo quita de la pantalla
        alert("Cita eliminada.");
      } catch (error) {
        console.error(error);
        alert("No se pudo eliminar.");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors font-bold"
      >
        <ArrowLeft size={20} /> Volver al Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <CalendarIcon className="text-purple-500" size={32} />
        <h1 className="text-3xl font-bold italic">
          Agenda de <span className="text-purple-500">Consultas</span>
        </h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="es"
          selectable={true}
          selectMirror={true}
          select={handleSelect}
          eventClick={handleEventClick} // <--- NUEVO: Click para borrar
          events={eventos}
          height="75vh"
          slotDuration="00:30:00"
          allDaySlot={false}
        />
      </div>
    </div>
  );
}

export default AgendaPage;
