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
    // Verificar que los campos no estén vacíos
    if (nombre.trim() && descripcion.trim()) {
      try {
        let fotoURL = '';

        // Subir archivo si se ha seleccionado
        const file = fileInputRef.current?.files?.[0];
        if (file) {
          // Configuración de compresión de imagen
          const options = {
            maxSizeMB: 1, // Tamaño máximo del archivo en MB
            maxWidthOrHeight: 300, // Dimensiones máximas de la imagen
            useWebWorker: true,
          };

          // Comprimir la imagen
          const compressedFile = await imageCompression(file, options);

          const storage = getStorage();
          const uniqueFileName = `${Date.now()}_${file.name}`;
          const fotoRef = ref(storage, `uploads/${uniqueFileName}`);
          await uploadBytes(fotoRef, compressedFile);
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
        if (fileInputRef.current) fileInputRef.current.value = ''; // Resetear el input de archivo
        setMensaje('Actividad creada exitosamente!'); // Alerta de éxito
      } catch (error) {
        console.error("Error al crear la actividad: ", error);
        setMensaje('Error al crear la actividad. Por favor intenta nuevamente.'); // Alerta de error
      }
    } else {
      setMensaje('Por favor, completa todos los campos.'); // Alerta para campos vacíos
    }

    // Limpiar el mensaje de alerta después de unos segundos
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividad-container">
      <h2 className="actividad-title">Crear Nueva Actividad</h2>
      {mensaje && <div className="alert">{mensaje}</div>} {/* Mostrar mensaje de alerta */}
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
        ref={fileInputRef} // Referencia para el input de archivo
        className="actividad-file-input"
      />
      <button onClick={crearActividad} className="actividad-button">Crear Actividad</button>
    </div>
  );
};

export default CrearActividades;
