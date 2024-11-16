import React, { useState, useRef } from 'react'; 
import { db } from '../firebase/firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import imageCompression from 'browser-image-compression'; 
import './crearActividades.css';

const CrearActividades: React.FC = () => { 
  const [titulo, setTitulo] = useState<string>(''); // Cambié nombre a título
  const [descripcion, setDescripcion] = useState<string>(''); 
  const [cupos, setCupos] = useState<number>(0); // Estado para cupos
  const [tipo, setTipo] = useState<string>('actividad'); // Estado para tipo de actividad
  const [mensaje, setMensaje] = useState<string>(''); 
  const fileInputRef = useRef<HTMLInputElement | null>(null); 

  const crearActividad = async () => {
    if (titulo.trim() && descripcion.trim() && (tipo === 'proyectoVecinal' || cupos > 0)) { // Si es proyecto vecinal, no se valida cupos
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

        // Guardar en la base de datos en función del tipo de actividad
        const collectionName = tipo === 'actividad' ? 'actividades' : 'proyectosVecinales';

        await addDoc(collection(db, collectionName), {
          titulo, // Usamos "titulo" en vez de "nombre"
          descripcion,
          tipo,   // Tipo de actividad
          fotoURL,
          inscritos: [], // Campo de inscripción como array vacío
          ...(tipo === 'actividad' && { cupos }) // Solo agregamos "cupos" si es una actividad
        });

        // Limpiar formulario
        setTitulo('');
        setDescripcion('');
        setCupos(0);
        setTipo('actividad'); // Restablecemos el tipo
        if (fileInputRef.current) fileInputRef.current.value = '';
        setMensaje('Actividad  o Proyecto Vecinal creado exitosamente!');
      } catch (error) {
        console.error('Error al crear la actividad:', error);
        setMensaje('Error al crear la actividad. Por favor intenta nuevamente.');
      }
    } else {
      setMensaje('Por favor, completa todos los campos y asegúrate de que los cupos sean mayores a 0 cuando sea necesario.');
    }

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividad-container">
      <h2 className="actividad-title">Crear Nueva Actividad o Proyecto Vecinal</h2>
      {mensaje && <div className="alert">{mensaje}</div>}

      {/* Select para elegir tipo de actividad */}
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="actividad-select"
      >
        <option value="actividad">Actividad</option>
        <option value="proyectoVecinal">Proyecto Vecinal</option>
      </select>

      {/* Título en vez de nombre */}
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
        className="actividad-input"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        className="actividad-textarea"
      />
      
      {/* Mostrar cupos solo si es una actividad */}
      {tipo === 'actividad' && (
        <input
          type="number"
          value={cupos}
          onChange={(e) => setCupos(Number(e.target.value))}
          placeholder="Cantidad de cupos"
          className="actividad-input"
          min={1}
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="actividad-file-input"
      />
      <button onClick={crearActividad} className="actividad-button">Crear</button>
    </div>
  );
};

export default CrearActividades;
