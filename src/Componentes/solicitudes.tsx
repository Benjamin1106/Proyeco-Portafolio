import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Calendar, momentLocalizer, SlotInfo, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Styles/solicitudes.css";
import Modal from "./modal";
import { jsPDF } from "jspdf";

import logo from '../img/imglogo.png';
import firma from '../img/firma.png';

// Configuración para moment.js
moment.locale("es");
const localizer = momentLocalizer(moment);

interface FormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoSolicitud: string;
  datosCertificado?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

const Solicitudes: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    rut: "",
    direccion: "",
    telefono: "",
    correo: "",
    tipoSolicitud: "",
    datosCertificado: "",
    fechaInicio: null,
    fechaFin: null,
  });

  const [reservasOcupadas, setReservasOcupadas] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const savedData = {
      nombre: localStorage.getItem("userNombre") || "",
      rut: localStorage.getItem("userRUT") || "",
      direccion: localStorage.getItem("userDireccion") || "",
      telefono: localStorage.getItem("userFono") || "",
      correo: localStorage.getItem("userCorreo") || "",
    };
    setFormData((prev) => ({ ...prev, ...savedData }));
  }, []);

  useEffect(() => {
    if (!formData.tipoSolicitud) return;

    // Escuchar cambios en tiempo real usando onSnapshot
    const reservasQuery = query(
      collection(db, formData.tipoSolicitud),
      where("tipoSolicitud", "==", formData.tipoSolicitud)
    );

    const unsubscribe = onSnapshot(reservasQuery, (snapshot) => {
      const fechasOcupadas = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Convertir Timestamp a Date
        const startDate = data.fechaInicio.toDate();
        const endDate = data.fechaFin.toDate();

        return {
          title: "Ocupado",
          start: startDate,
          end: endDate,
        };
      });

      setReservasOcupadas(fechasOcupadas);
    });

    return () => unsubscribe();
  }, [formData.tipoSolicitud]);

  const resetForm = () => {
    setFormData({
      nombre: "",
      rut: "",
      direccion: "",
      telefono: "",
      correo: "",
      tipoSolicitud: "",
      datosCertificado: "",
      fechaInicio: null,
      fechaFin: null,
    });
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setFormData((prev) => ({
      ...prev,
      fechaInicio: slotInfo.start,
      fechaFin: slotInfo.end,
    }));
    setSelectedSlot({
      title: "Seleccionado",
      start: slotInfo.start,
      end: slotInfo.end,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (["cancha", "salas", "plazas"].includes(formData.tipoSolicitud)) {
      if (!formData.fechaInicio || !formData.fechaFin) {
        alert("Por favor, selecciona un rango de fecha y hora.");
        return;
      }

      const isOcupado = reservasOcupadas.some((reserva) => {
        const reservaStart = new Date(reserva.start);
        const reservaEnd = new Date(reserva.end);
        return formData.fechaInicio! < reservaEnd && formData.fechaFin! > reservaStart;
      });

      if (isOcupado) {
        setModalMessage("Esta fecha y hora ya están ocupadas. Seleccione otro rango.");
        setIsModalOpen(true);
        return;
      }

      try {
        await addDoc(collection(db, formData.tipoSolicitud), {
          ...formData,
          fechaInicio: new Date(formData.fechaInicio!),
          fechaFin: new Date(formData.fechaFin!),
        });

        setModalMessage("Solicitud de reserva enviada correctamente.");
        setIsModalOpen(true);

        setReservasOcupadas((prev) => [
          ...prev,
          { title: "Ocupado", start: formData.fechaInicio, end: formData.fechaFin },
        ]);
      } catch (error) {
        setModalMessage("Error al enviar la solicitud. Intente nuevamente.");
        setIsModalOpen(true);
      }
    } else {
      // Para certificado de residencia, agregar los campos extra
      if (formData.tipoSolicitud === "certificadoResidencia") {
        const pdfData = {
          ...formData,
          nombre: localStorage.getItem("userNombre"),
          rut: localStorage.getItem("userRUT"),
          direccion: localStorage.getItem("userDireccion"),
          correo: localStorage.getItem("userCorreo"),
        };

        // Aquí deberías generar el PDF con los datos
        // Ejemplo de cómo agregar al PDF (utilizando alguna librería como jsPDF):
        
        const pdf = new jsPDF();
        const logoWidth = 40;  // Ajusta el tamaño del logo
        const logoHeight = 30; // Ajusta el tamaño del logo
        const xPosition = 165; // Ajusta la posición en el eje X (donde se coloca a la derecha)
        const yPosition = 5;  // Ajusta la posición en el eje Y (cerca de la parte superior)
        const firmaWidth = 40;
        const firmaHeight = 20;
        const xFirmaPosition = 10;  // Ajusta la posición en el eje X
        const yFirmaPosition = 160; // Ajusta la posición en el eje Y
        pdf.addImage(logo, 'PNG', xPosition, yPosition, logoWidth, logoHeight);
        pdf.setFont("helvetica", "bold");
        pdf.text("Certificado de Residencia Villa Los Lagos", pdf.internal.pageSize.width / 2, 20, { align: 'center' });
        pdf.setFont("helvetica", "normal");
        pdf.text(`El Señor o la Señora: ${pdfData.nombre}`, 10, 40);
        pdf.text(`De número de Cédula de Identidad: ${pdfData.rut}`, 10, 50);
        pdf.text(`Domiciliado en: ${pdfData.direccion}`, 10, 60);
        pdf.text(`Correo: ${pdfData.correo}`, 10, 70);
        pdf.text(`Con Motivo de: ${formData.datosCertificado}`, 10, 80);
        

        pdf.text("Firma de la Junta de Vecinos", 10, 120);
        pdf.text("_____________________________", 10, 130);
        pdf.text("Nombre: Jesús Navarro", 10, 140);
        pdf.text("Cargo: Presidente JJVV Villa Los Lagos", 10, 150);
        pdf.addImage(firma, 'PNG', xFirmaPosition, yFirmaPosition, firmaWidth, firmaHeight);
        pdf.save("certificado_residencia.pdf");
        // Firma como imagen


      }

      try {
        await addDoc(collection(db, "solicitudes"), formData);
        setModalMessage("Solicitud enviada correctamente.");
        setIsModalOpen(true);
      } catch (error) {
        setModalMessage("Error al enviar la solicitud. Intente nuevamente.");
        setIsModalOpen(true);
      }
    }

    resetForm();
  };

  const calendarMessages = {
    today: "Hoy",
    previous: "Atrás",
    next: "Siguiente",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay eventos en este rango.",
    showMore: (total: number) => `+ Ver más (${total})`,
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <label>Tipo de Solicitud:</label>
        <select
          name="tipoSolicitud"
          value={formData.tipoSolicitud}
          onChange={(e) => setFormData({ ...formData, tipoSolicitud: e.target.value })}
          required
          className="centrar-select"
        >
          <option value="" disabled>
            Seleccione tipo de Solicitud
          </option>
          <option value="cancha">Cancha</option>
          <option value="salas">Salas</option>
          <option value="plazas">Plazas</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
          <option value="certificadoActividades">Certificado de Participación de Actividades</option>
        </select>

        {(formData.tipoSolicitud === "cancha" ||
          formData.tipoSolicitud === "salas" ||
          formData.tipoSolicitud === "plazas") && (
          <Calendar
            selectable
            localizer={localizer}
            events={[...reservasOcupadas, ...(selectedSlot ? [selectedSlot] : [])]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: "20px" }}
            onSelectSlot={handleSelectSlot}
            defaultView={Views.WEEK}
            views={[Views.WEEK, Views.DAY]}
            messages={calendarMessages}
          />
        )}

{(formData.tipoSolicitud === "certificadoResidencia" || formData.tipoSolicitud === "certificadoResidencia") && (
  <div>
    <label>Razón:</label>
    <select
      name="datosCertificadoRes"
      value={formData.datosCertificado}
      onChange={(e) => setFormData({ ...formData, datosCertificado: e.target.value })}
      required
    >
      <option value="" disabled hidden>
        Seleccione una razón
      </option>
      <option value="Fines Particulares">Fines Particulares</option>
      <option value="Fines Laborales">Fines Laborales</option>
      <option value="Fines Recreativos">Fines Recreativos</option>
    </select>
  </div>
)}


        {(formData.tipoSolicitud === "certificadoActividades" || formData.tipoSolicitud === "certificadoActividades") && (
          <div>
            <label>Razón:</label>
            <select
              name="datosCertificadoAct"
              value={formData.datosCertificado}
              onChange={(e) => setFormData({ ...formData, datosCertificado: e.target.value })}
              required
            >
              <option value="" disabled hidden>
                Seleccione una razón
              </option>
              <option value="Fines Academicos">Fines Academicos</option>
              <option value="Demostrar Experiencia En Actividades">Demostrar Experiencia En Actividades</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        )}

        {(formData.tipoSolicitud === "cancha" ||
          formData.tipoSolicitud === "salas" ||
          formData.tipoSolicitud === "plazas") && (
          <div>
            <label>Fecha de Inicio:</label>
            <input
              type="datetime-local"
              name="fechaInicio"
              value={formData.fechaInicio ? moment(formData.fechaInicio).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setFormData({ ...formData, fechaInicio: new Date(e.target.value) })}
              required
            />
            <label>Fecha de Fin:</label>
            <input
              type="datetime-local"
              name="fechaFin"
              value={formData.fechaFin ? moment(formData.fechaFin).format("YYYY-MM-DDTHH:mm") : ""}
              onChange={(e) => setFormData({ ...formData, fechaFin: new Date(e.target.value) })}
              required
            />
          </div>
        )}

        <button type="submit">Enviar Solicitud</button>
      </form>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Solicitudes;
