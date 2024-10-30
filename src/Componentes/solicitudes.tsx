import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/firebaseConfig';
import Modal from 'react-modal';
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const today = new Date().toISOString().split('T')[0];

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

    if (!isRutValid(formData.rut)) {
      setModalMessage('El RUT ingresado no es válido.');
      setModalIsOpen(true);
      return;
    }

    if (!isOnlyLetters(formData.nombre)) {
      setModalMessage('El nombre debe contener solo letras.');
      setModalIsOpen(true);
      return;
    }

    if (!isOnlyLetters(formData.apellido)) {
      setModalMessage('El apellido debe contener solo letras.');
      setModalIsOpen(true);
      return;
    }

    if (formData.tipoSolicitud !== 'certificadoResidencia') {
      if (formData.horaInicio === formData.horaFin) {
        setModalMessage('La hora de inicio y la hora de fin no pueden ser iguales.');
        setModalIsOpen(true);
        return;
      }

      if (formData.horaInicio && formData.horaFin) {
        const horaInicio = new Date(`1970-01-01T${formData.horaInicio}:00`);
        const horaFin = new Date(`1970-01-01T${formData.horaFin}:00`);

        if (horaInicio >= horaFin) {
          setModalMessage('La hora de fin debe ser posterior a la hora de inicio.');
          setModalIsOpen(true);
          return;
        }

        if (!isHorarioValido(formData.horaInicio) || !isHorarioValido(formData.horaFin)) {
          setModalMessage('La reserva solo puede realizarse entre las 10:00 y las 22:00 horas.');
          setModalIsOpen(true);
          return;
        }
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
        const storageRef = ref(storage, `uploads/${archivo.name}`);
        await uploadBytes(storageRef, archivo);
        data.archivoUrl = storageRef.fullPath;
      }

      const collectionName = formData.tipoSolicitud === 'certificadoResidencia' 
        ? 'certificadoResidencia' 
        : 'solicitudes';

      await addDoc(collection(db, collectionName), data);
      setModalMessage('Solicitud enviada. A la brevedad recibirá un mensaje de aprobación.');
      setModalIsOpen(true);
      resetForm();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setModalMessage('Error al enviar la solicitud. Intente nuevamente.');
      setModalIsOpen(true);
    }
  };

  // Configuración del modal
  Modal.setAppElement('#root'); // Asegúrate de que el elemento raíz esté en el DOM

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <button type="submit">Enviar</button>
      </form>

      {/* Modal para alertas */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Notificación</h2>
        <p>{modalMessage}</p>
        <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default Solicitudes;
