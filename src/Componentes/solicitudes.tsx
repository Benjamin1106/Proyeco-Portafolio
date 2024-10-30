import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/firebaseConfig';
import './solicitudes.css';

// Define tipos de datos
interface FormData {
  nombre: string;
  apellido: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoSolicitud: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  datosCertificado?: string;
  archivoUrl?: string | null; // Se almacenará la referencia del archivo
}

const Solicitudes: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    rut: '',
    direccion: '',
    telefono: '',
    correo: '',
    tipoSolicitud: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    datosCertificado: '',
    archivoUrl: null,
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const today = new Date().toISOString().split('T')[0];

  // Validaciones
  const isRutValid = (rut: string) => /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/.test(rut);
  const isOnlyLetters = (value: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);

  // Manejo de cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reiniciar formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      rut: '',
      direccion: '',
      telefono: '',
      correo: '',
      tipoSolicitud: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      datosCertificado: '',
      archivoUrl: null,
    });
    setArchivo(null);
  };

  // Validación de horario operativo y secuencia de horas
  const isHorarioValido = (hora: string) => {
    const [hours, minutes] = hora.split(':').map(Number);
    return (hours > 10 || (hours === 10 && minutes === 0)) && (hours < 22);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRutValid(formData.rut)) {
      alert('El RUT ingresado no es válido.');
      return;
    }

    if (!isOnlyLetters(formData.nombre)) {
      alert('El nombre debe contener solo letras.');
      return;
    }

    if (!isOnlyLetters(formData.apellido)) {
      alert('El apellido debe contener solo letras.');
      return;
    }

    if (formData.tipoSolicitud !== 'certificadoResidencia') {
      if (formData.horaInicio === formData.horaFin) {
        alert('La hora de inicio y la hora de fin no pueden ser iguales.');
        return;
      }

      if (formData.horaInicio && formData.horaFin) {
        const horaInicio = new Date(`1970-01-01T${formData.horaInicio}:00`);
        const horaFin = new Date(`1970-01-01T${formData.horaFin}:00`);

        if (horaInicio >= horaFin) {
          alert('La hora de fin debe ser posterior a la hora de inicio.');
          return;
        }

        if (!isHorarioValido(formData.horaInicio) || !isHorarioValido(formData.horaFin)) {
          alert('La reserva solo puede realizarse entre las 10:00 y las 22:00 horas.');
          return;
        }
      }
    }

    const data: FormData = {
      ...formData,
      telefono: `+56${formData.telefono}`,
      archivoUrl: null, // Inicialmente null
    };

    try {
      if (archivo) {
        const storage = getStorage();
        const storageRef = ref(storage, `uploads/${archivo.name}`);
        await uploadBytes(storageRef, archivo);
        data.archivoUrl = storageRef.fullPath; // Guarda solo la referencia del archivo
      }

      const collectionName = formData.tipoSolicitud === 'certificadoResidencia' 
        ? 'certificadoResidencia' 
        : 'solicitudes';

      await addDoc(collection(db, collectionName), data);
      alert('Solicitud enviada. A la brevedad recibirá un mensaje de aprobación.');
      resetForm();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Error al enviar la solicitud. Intente nuevamente.');
    }
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombres:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          pattern="^[A-Za-zÀ-ÿ\s]+$"
          title="El nombre debe contener solo letras."
        />
        <label>Apellidos:</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          required
          pattern="^[A-Za-zÀ-ÿ\s]+$"
          title="El apellido debe contener solo letras."
        />
        <label>RUT:</label>
        <input
          type="text"
          name="rut"
          value={formData.rut}
          onChange={handleInputChange}
          required
          placeholder="12.345.678-X"
          pattern="^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$"
          title="El RUT debe tener el formato 12.345.678-X y puede terminar en un número o 'k'."
        />
        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleInputChange}
          required
        />
        <label>Teléfono:</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          required
          placeholder="912345678"
          pattern="[0-9]{9}"
          maxLength={9}
          title="El teléfono debe tener 9 dígitos."
        />
        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          required
        />
        <label>Tipo de Solicitud:</label>
        <select
          name="tipoSolicitud"
          value={formData.tipoSolicitud}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Seleccione tipo de Solicitud</option>
          <option value="cancha">Cancha</option>
          <option value="salas">Salas</option>
          <option value="plazas">Plazas</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
        </select>

        {formData.tipoSolicitud !== 'certificadoResidencia' && (
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              min={today}
              required
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
          </div>
        )}

        {formData.tipoSolicitud === 'certificadoResidencia' && (
          <div>
            <label>Razón:</label>
            <select
              name="datosCertificado"
              value={formData.datosCertificado}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled hidden>Seleccione una razón</option>
              <option value="razon1">Para fines particulares</option>
              <option value="razon2">Para fines especiales</option>
            </select>
            <label>Subir Documento:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  setArchivo(e.target.files[0]);
                }
              }}
              required
            />
          </div>
        )}

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Solicitudes;
