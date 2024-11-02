import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './actividades.css';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
  inscritos: string[]; // Array para almacenar los nombres de los inscritos
}

const Actividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [nombreUsuario, setNombreUsuario] = useState<string>(''); // Estado para el nombre del usuario
  const [mensaje, setMensaje] = useState<string>(''); // Estado para mostrar mensajes

  useEffect(() => {
    const fetchActividades = async () => {
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const actividadesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Actividad[];
      setActividades(actividadesData);
    };

    fetchActividades();
  }, []);

  const inscribirse = async (actividadId: string) => {
    if (!nombreUsuario.trim()) {
      setMensaje('Por favor, ingresa tu nombre para inscribirte.');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const actividadRef = doc(db, 'actividades', actividadId);
      const actividad = actividades.find(actividad => actividad.id === actividadId);

      // Verificar si el usuario ya está inscrito
      if (actividad && actividad.inscritos.includes(nombreUsuario)) {
        setMensaje('Ya estás inscrito en esta actividad.');
        setTimeout(() => setMensaje(''), 3000);
        return;
      }

      // Actualizar la lista de inscritos en Firestore
      const nuevosInscritos = actividad ? [...actividad.inscritos, nombreUsuario] : [nombreUsuario];
      await updateDoc(actividadRef, { inscritos: nuevosInscritos });

      // Actualizar el estado local
      setActividades(prev =>
        prev.map(actividad =>
          actividad.id === actividadId ? { ...actividad, inscritos: nuevosInscritos } : actividad
        )
      );
      setMensaje('¡Inscripción exitosa!');
    } catch (error) {
      console.error('Error al inscribirse:', error);
      setMensaje('Error al inscribirse. Inténtalo nuevamente.');
    }

    setTimeout(() => setMensaje(''), 3000); // Limpiar mensaje después de unos segundos
  };

  return (
    <div className="actividades-grid">
      {mensaje && <div className="alert">{mensaje}</div>} {/* Mostrar mensaje */}
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
        className="nombre-input"
      />
      {actividades.map(actividad => (
        <div key={actividad.id} className="actividad-card">
          <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
          <div className="actividad-content">
            <h3>{actividad.nombre}</h3>
            <p>{actividad.descripcion}</p>
            <p>Inscritos: {actividad.inscritos.length}</p>
            <button onClick={() => inscribirse(actividad.id)} className="inscribete-button">
              Inscríbete aquí
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Actividades;
