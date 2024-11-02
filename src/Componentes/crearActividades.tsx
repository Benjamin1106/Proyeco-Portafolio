import React, { useState, useRef } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import './crearActividades.css';

const CrearActividades: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>(''); // Estado para alertas
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Referencia para el input de archivo

  const crearActividad = async () => {
    if (nombre.trim() && descripcion.trim()) {
      try {
        let fotoURL = '';

        const file = fileInputRef.current?.files?.[0];
        if (file) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 300,
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(file, options);

          const storage = getStorage();
          const uniqueFileName = `${Date.now()}_${file.name}`;
          const fotoRef = ref(storage, `uploads/${uniqueFileName}`);
          await uploadBytes(fotoRef, compressedFile);
          fotoURL = await getDownloadURL(fotoRef);
        }

        await addDoc(collection(db, 'actividades'), {
          nombre,
          descripcion,
          fotoURL,
          inscritos: [], // Campo de inscripción como array vacío
        });

        setNombre('');
        setDescripcion('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setMensaje('Actividad creada exitosamente!');
      } catch (error) {
        console.error('Error al crear la actividad:', error);
        setMensaje('Error al crear la actividad. Por favor intenta nuevamente.');
      }
    } else {
      setMensaje('Por favor, completa todos los campos.');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividad-container">
      <h2 className="actividad-title">Crear Nueva Actividad</h2>
      {mensaje && <div className="alert">{mensaje}</div>}
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
        accept="image/*"
        ref={fileInputRef}
        className="actividad-file-input"
      />
      <button onClick={crearActividad} className="actividad-button">Crear Actividad</button>
    </div>
  );
};

export default CrearActividades;
