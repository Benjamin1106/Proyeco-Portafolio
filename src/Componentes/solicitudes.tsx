import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/firebaseConfig';
import './solicitudes.css';

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
  archivoUrl?: string | null;
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
  const [showModal, setShowModal] = useState(false); // Modal para confirmación

  const isRutValid = (rut: string) => /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/.test(rut);
  const isOnlyLetters = (value: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const isHorarioValido = (hora: string) => {
    const [hours, minutes] = hora.split(':').map(Number);
    return (hours > 10 || (hours === 10 && minutes === 0)) && (hours < 22);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRutValid(formData.rut) || !isOnlyLetters(formData.nombre) || !isOnlyLetters(formData.apellido)) {
      setShowModal(true);
      return;
    }

    if (formData.tipoSolicitud !== 'certificadoResidencia' && formData.horaInicio && formData.horaFin) {
      const horaInicio = new Date(`1970-01-01T${formData.horaInicio}:00`);
      const horaFin = new Date(`1970-01-01T${formData.horaFin}:00`);
      if (horaInicio >= horaFin || !isHorarioValido(formData.horaInicio) || !isHorarioValido(formData.horaFin)) {
        setShowModal(true);
        return;
      }
    }

    const data: FormData = {
      ...formData,
      telefono: `+56${formData.telefono}`,
      archivoUrl: null,
    };

    try {
      if (archivo) {
        const storage = getStorage();
        const storageRef = ref(storage, `uploads/${archivo.name}-${Date.now()}`);
        await uploadBytes(storageRef, archivo);
        data.archivoUrl = storageRef.fullPath;
      }

      const collectionName = formData.tipoSolicitud === 'certificadoResidencia' ? 'certificadoResidencia' : 'solicitudes';
      await addDoc(collection(db, collectionName), data);
      resetForm();
      setShowModal(true); // Mostrar modal de éxito
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setShowModal(true);
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
        />

        <label>Apellidos:</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          required
        />

        <label>RUT:</label>
        <input
          type="text"
          name="rut"
          value={formData.rut}
          onChange={handleInputChange}
          required
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
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleInputChange}
          required
        />

        <label>Correo:</label>
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
          <option value="">Seleccione...</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
          <option value="otro">Otro</option>
        </select>

        {formData.tipoSolicitud !== 'certificadoResidencia' && (
          <>
            <label>Fecha:</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />

            <label>Hora Inicio:</label>
            <input
              type="time"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleInputChange}
              required
            />

            <label>Hora Fin:</label>
            <input
              type="time"
              name="horaFin"
              value={formData.horaFin}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        <label>Archivo:</label>
        <input type="file" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />

        <button type="submit">Enviar</button>
      </form>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p>Solicitud enviada. A la brevedad recibirá un mensaje de aprobación.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solicitudes;
