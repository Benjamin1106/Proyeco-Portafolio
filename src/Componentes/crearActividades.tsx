import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './crearActividades.css';

const CrearActividades: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [foto, setFoto] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState<string>(''); // State for alerts

  const crearActividad = async () => {
    // Verificar que los campos no estén vacíos
    if (nombre.trim() && descripcion.trim()) {
      try {
        let fotoURL = '';

        // Subir archivo si se ha seleccionado
        if (foto) {
          const storage = getStorage();
          const uniqueFileName = `${Date.now()}_${foto.name}`;
          const fotoRef = ref(storage, `uploads/${uniqueFileName}`);
          await uploadBytes(fotoRef, foto);
          fotoURL = await getDownloadURL(fotoRef);
        }

        // Agregar los datos a Firestore
        await addDoc(collection(db, "actividades"), {
          nombre,
          descripcion,
          fotoURL,
          inscripto: false,
        });

        // Limpiar los campos después de crear la actividad
        setNombre('');
        setDescripcion('');
        setFoto(null);
        setMensaje('Actividad creada exitosamente!'); // Success alert
      } catch (error) {
        console.error("Error al crear la actividad: ", error);
        setMensaje('Error al crear la actividad. Por favor intenta nuevamente.'); // Error alert
      }
    } else {
      setMensaje('Por favor, completa todos los campos.'); // Alert for empty fields
    }

    // Clear the alert message after a few seconds
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividad-container">
      <h2 className="actividad-title">Crear Nueva Actividad</h2>
      {mensaje && <div className="alert">{mensaje}</div>} {/* Display alert message */}
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la actividad"
        className="actividad-input"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción de la actividad"
        className="actividad-textarea"
      />
      <input
        type="file"
        accept="image/*" // Asegura que solo se acepten archivos de imagen
        onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
        className="actividad-file-input"
      />
      <button onClick={crearActividad} className="actividad-button">Crear Actividad</button>
    </div>
  );
};

export default CrearActividades;
