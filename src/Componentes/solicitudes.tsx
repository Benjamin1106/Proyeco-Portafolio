import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";  // Asegúrate de que el idioma español esté cargado
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./solicitudes.css";
import Modal from "./modal";

// Configurar moment.js para usar español
moment.locale("es");  // Asegurarse de establecer el idioma en español

// Configuración para usar moment.js en el calendario
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
    const obtenerReservas = async () => {
      const snapshot = await getDocs(collection(db, "reservas"));
      const fechasOcupadas = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          title: "Ocupado",
          start: new Date(data.fechaInicio.seconds * 1000),
          end: new Date(data.fechaFin.seconds * 1000),
        };
      });
      setReservasOcupadas(fechasOcupadas);
    };

    obtenerReservas();
  }, []);

  const isRutValid = (rut: string) => /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/.test(rut);

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
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setFormData((prev) => ({
      ...prev,
      fechaInicio: slotInfo.start,
      fechaFin: slotInfo.end,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRutValid(formData.rut)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    if (formData.tipoSolicitud === "cancha" || formData.tipoSolicitud === "salas" || formData.tipoSolicitud === "plazas") {
      if (!formData.fechaInicio || !formData.fechaFin) {
        alert("Por favor, selecciona un rango de fecha y hora.");
        return;
      }

      const isOcupado = reservasOcupadas.some((reserva) => {
        return (
          formData.fechaInicio! < reserva.end &&
          formData.fechaFin! > reserva.start
        );
      });

      if (isOcupado) {
        setModalMessage("Esta fecha y hora ya están ocupadas. Seleccione otro rango.");
        setIsModalOpen(true);
        return;
      }

      try {
        await addDoc(collection(db, "reservas"), {
          ...formData,
          fechaInicio: formData.fechaInicio.toISOString(),
          fechaFin: formData.fechaFin.toISOString(),
        });
        setModalMessage("Solicitud de reserva enviada correctamente.");
        setIsModalOpen(true);
        setReservasOcupadas((prev) => [
          ...prev,
          { title: "Ocupado", start: formData.fechaInicio, end: formData.fechaFin },
        ]);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        setModalMessage("Error al enviar la solicitud. Intente nuevamente.");
        setIsModalOpen(true);
      }
    } else {
      try {
        await addDoc(collection(db, "solicitudes"), formData);
        setModalMessage("Solicitud enviada correctamente.");
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        setModalMessage("Error al enviar la solicitud. Intente nuevamente.");
        setIsModalOpen(true);
      }
    }

    resetForm();
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="nombre" value={formData.nombre} />
        <input type="hidden" name="rut" value={formData.rut} />
        <input type="hidden" name="direccion" value={formData.direccion} />
        <input type="hidden" name="telefono" value={formData.telefono} />
        <input type="hidden" name="correo" value={formData.correo} />

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

        {/* Calendario de reservas */}
        {(formData.tipoSolicitud === "cancha" || formData.tipoSolicitud === "salas" || formData.tipoSolicitud === "plazas") && (
          <>
            <label>Seleccione una fecha y hora:</label>
            <Calendar
              selectable
              localizer={localizer}
              events={reservasOcupadas}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, margin: "20px" }}
              onSelectSlot={handleSelectSlot}
            />
          </>
        )}

        <button type="submit">Enviar Solicitud</button>
      </form>

      {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Solicitudes;
