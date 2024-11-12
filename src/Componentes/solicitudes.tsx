import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./solicitudes.css";
import Modal from "./modal";

// Definir tipos de datos para cada formulario
interface FormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoSolicitud: string;
  datosCertificado?: string;
  fecha?: Date | null;
  horaInicio?: string;
  horaFin?: string;
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
    fecha: null,
    horaInicio: "",
    horaFin: "",
  });

  const [reservasOcupadas, setReservasOcupadas] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Cargar datos desde localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userNombre") || "";
    const savedRut = localStorage.getItem("userRUT") || "";
    const savedAddress = localStorage.getItem("userDireccion") || "";
    const savedPhone = localStorage.getItem("userFono") || "";
    const savedEmail = localStorage.getItem("userCorreo") || "";

    setFormData((prev) => ({
      ...prev,
      nombre: savedName,
      rut: savedRut,
      direccion: savedAddress,
      telefono: savedPhone,
      correo: savedEmail,
    }));
  }, []);

  useEffect(() => {
    const obtenerReservas = async () => {
      const snapshot = await getDocs(collection(db, "reservas"));
      const fechasOcupadas = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          fecha: new Date(data.fecha.seconds * 1000),
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
        };
      });
      setReservasOcupadas(fechasOcupadas);
    };

    obtenerReservas();
  }, []);

  // Validación del RUT
  const isRutValid = (rut: string) => /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/.test(rut);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en la fecha
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      setFormData((prev) => ({ ...prev, fecha: value }));
    } else if (Array.isArray(value) && value.length === 2) {
      setFormData((prev) => ({ ...prev, fecha: value[0] }));
    } else {
      setFormData((prev) => ({ ...prev, fecha: null }));
    }
  };

  // Reiniciar el formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      rut: "",
      direccion: "",
      telefono: "",
      correo: "",
      tipoSolicitud: "",
      datosCertificado: "",
      fecha: null,
      horaInicio: "",
      horaFin: "",
    });
  };

  // Comprobar si la franja horaria está ocupada
  const isHorarioOcupado = (fecha: Date, horaInicio: string, horaFin: string) => {
    return reservasOcupadas.some((reserva) => {
      const reservaFecha = new Date(reserva.fecha);
      return (
        reservaFecha.toDateString() === fecha.toDateString() &&
        ((horaInicio >= reserva.horaInicio && horaInicio < reserva.horaFin) ||
          (horaFin > reserva.horaInicio && horaFin <= reserva.horaFin))
      );
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRutValid(formData.rut)) {
      alert("El RUT ingresado no es válido.");
      return;
    }

    if (formData.tipoSolicitud === "cancha" || formData.tipoSolicitud === "plazas" || formData.tipoSolicitud === "salas") {
      if (!formData.fecha) {
        alert("Por favor, selecciona una fecha.");
        return;
      }

      if (!formData.horaInicio || !formData.horaFin) {
        alert("Por favor, selecciona las horas de inicio y fin.");
        return;
      }

      // Comprobar si el horario ya está reservado
      if (isHorarioOcupado(formData.fecha, formData.horaInicio, formData.horaFin)) {
        setModalMessage("Esta fecha y horario ya están ocupados. Seleccione otro horario.");
        setIsModalOpen(true);
        return;
      }

      try {
        await addDoc(collection(db, "reservas"), {
          ...formData,
          fecha: formData.fecha.toISOString(),
        });
        setModalMessage("Solicitud de reserva enviada correctamente.");
        setIsModalOpen(true);
        setReservasOcupadas((prev) => [...prev, { fecha: formData.fecha!, horaInicio: formData.horaInicio, horaFin: formData.horaFin }]);
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
          onChange={handleInputChange}
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

        {/* Campos de certificado */}
        {(formData.tipoSolicitud === "certificadoResidencia" || formData.tipoSolicitud === "certificadoActividades") && (
          <div>
            <label>Razón:</label>
            <select
              className="centrar-select"
              name="datosCertificado"
              value={formData.datosCertificado}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled hidden>
                Seleccione una razón
              </option>
              {formData.tipoSolicitud === "certificadoResidencia" ? (
                <>
                  <option value="razon1">Para fines particulares</option>
                  <option value="razon2">Para fines especiales</option>
                </>
              ) : (
                <>
                  <option value="razon1">Para fines académicos</option>
                  <option value="razon2">Para demostrar experiencia en actividades</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Campos de reserva de espacio */}
        {(formData.tipoSolicitud === "cancha" || formData.tipoSolicitud === "salas" || formData.tipoSolicitud === "plazas") && (
          <>
            <label>Fecha:</label>
            <Calendar
              onChange={handleDateChange}
              value={formData.fecha}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              tileDisabled={({ date }) =>
                reservasOcupadas.some((reserva) => reserva.fecha.toDateString() === date.toDateString())
              }
            />
            <label>Desde:</label>
            <input
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleInputChange}
              required
            />
            <label>Hasta:</label>
            <input
              type="time"
              name="horaFin"
              value={formData.horaFin}
              onChange={handleInputChange}
              required
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
