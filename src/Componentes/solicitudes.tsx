import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/firebaseConfig';
import './solicitudes.css';
import Modal from './modal';

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
  motivo?: string;
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
    motivo: '',
    archivoUrl: null,
  });
  const [archivo, setArchivo] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const today = new Date().toISOString().split('T')[0];

  // Validaciones
  const formatRUT = (rut: string) => {
    let cleanRUT = rut.replace(/[^0-9K]/gi, ''); 
    if (cleanRUT.length > 9) cleanRUT = cleanRUT.slice(0, 9);
    if (cleanRUT.length > 0) {
      const digits = cleanRUT.slice(0, -1);
      const verifier = cleanRUT.charAt(cleanRUT.length - 1);
      const formattedDigits = digits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return `${formattedDigits}-${verifier.toUpperCase()}`;
    }
    return '';
  };

  const isOnlyLetters = (value: string) => /^[A-Za-zÀ-ÿ\s]+$/.test(value);
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone: string) => /^[0-9]{9}$/.test(phone);

  // Manejo de cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'rut') {
      setFormData((prev) => ({ ...prev, [name]: formatRUT(value) }));
    } else if (name === 'nombre' || name === 'apellido') {
      if (isOnlyLetters(value)) setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === 'telefono') {
      setFormData((prev) => ({ ...prev, [name]: `+56${value}` })); 
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validación del envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(formData.correo)) {
      alert('El correo ingresado no es válido.');
      return;
    }

    if (!isPhoneValid(formData.telefono.replace('+56', ''))) {
      alert('El teléfono debe tener 9 dígitos.');
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
      }
    }

    const data: FormData = {
      ...formData,
      archivoUrl: null,
    };

    try {
      if (archivo) {
        const storage = getStorage();
        const uniqueFileName = `${Date.now()}_${archivo.name}`;
        const storageRef = ref(storage, `uploads/${uniqueFileName}`);
        await uploadBytes(storageRef, archivo);
        data.archivoUrl = storageRef.fullPath;
      }

      const collectionName = formData.tipoSolicitud === 'certificadoResidencia' 
        ? 'certificadoResidencia' 
        : 'solicitudes';

      await addDoc(collection(db, collectionName), data);
      setModalMessage('Solicitud enviada. Recibirá una confirmación por correo.');
      setIsModalOpen(true);

      // Función de envío de correo
      await sendConfirmationEmail(data);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setModalMessage('Error al enviar la solicitud. Intente nuevamente.');
      setIsModalOpen(true);
    }
  };

  // Envío de correo de confirmación
  const sendConfirmationEmail = async (data: FormData) => {
    const emailContent = `
      Estimado/a ${data.nombre} ${data.apellido},
      Su solicitud de ${data.tipoSolicitud} ha sido recibida. Detalles:
      - Fecha: ${data.fecha}
      - Hora Inicio: ${data.horaInicio}
      - Hora Fin: ${data.horaFin}
      Gracias por confiar en nosotros.
    `;
    if (data.tipoSolicitud === 'certificadoResidencia') {
      // Enviar PDF (implementación pendiente)
    }
    console.log('Correo enviado con contenido:', emailContent);
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit} className="centrar-formulario">
        <label>Nombres:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />

        <label>Apellidos:</label>
        <input type="text" name="apellido" value={formData.apellido} onChange={handleInputChange} required />

        <label>RUT:</label>
        <input type="text" name="rut" value={formData.rut} onChange={handleInputChange} required />

        <label>Teléfono:</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} required placeholder="912345678" />

        <label>Tipo de Solicitud:</label>
        <select name="tipoSolicitud" value={formData.tipoSolicitud} onChange={handleInputChange} required>
          <option value="" disabled>Seleccione tipo de Solicitud</option>
          <option value="cancha">Cancha</option>
          <option value="sede">Sede</option>
          <option value="plazas">Plazas</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
        </select>

        {formData.tipoSolicitud && (formData.tipoSolicitud === 'cancha' || formData.tipoSolicitud === 'sede' || formData.tipoSolicitud === 'plazas') && (
          <>
            <label>Fecha:</label>
            <input type="date" name="fecha" value={formData.fecha} min={today} onChange={handleInputChange} required />

            <label>Hora Inicio:</label>
            <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleInputChange} required />

            <label>Hora Fin:</label>
            <input type="time" name="horaFin" value={formData.horaFin} onChange={handleInputChange} required />
          </>
        )}

        {formData.tipoSolicitud === 'certificadoResidencia' && (
          <>
            <label>Motivo:</label>
            <select name="motivo" value={formData.motivo} onChange={handleInputChange} required>
              <option value="" disabled>Seleccione motivo</option>
              <option value="Trámite de residencia">Trámite de residencia</option>
              <option value="Otro">Otro</option>
            </select>

            <label>Documento (Cuenta a nombre del solicitante):</label>
            <input type="file" onChange={(e) => setArchivo(e.target.files ? e.target.files[0] : null)} required />
          </>
        )}

        <button type="submit">Enviar Solicitud</button>
        {isModalOpen && <Modal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />}
      </form>
    </div>
  );
};

export default Solicitudes;
