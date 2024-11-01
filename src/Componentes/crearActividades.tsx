import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CrearActividades: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');

  const crearActividad = async () => {
    if (nombre.trim()) {
      await addDoc(collection(db, "actividades"), {
        nombre,
        inscripto: false,
      });
      setNombre('');  // Limpiar el campo después de crear
    }
  };

  return (
    <div>
      <h2>Crear Nueva Actividad</h2>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la actividad"
      />
      <button onClick={crearActividad}>Crear Actividad</button>
    </div>
  );
};

export default CrearActividades;
