import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import './actividades.css';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
  inscritos: string[];
}

const Actividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // Estado para la carga

  useEffect(() => {
    // Usar onSnapshot para obtener cambios en tiempo real y mejorar el rendimiento
    const unsubscribe = onSnapshot(collection(db, 'actividades'), (snapshot) => {
      const actividadesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Actividad[];
      setActividades(actividadesData);
      setLoading(false); // Una vez que los datos se cargan, quitar el estado de carga
    });

    return () => unsubscribe(); // Limpiar suscripción cuando el componente se desmonte
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

      if (actividad && actividad.inscritos.includes(nombreUsuario)) {
        setMensaje('Ya estás inscrito en esta actividad.');
        setTimeout(() => setMensaje(''), 3000);
        return;
      }

      const nuevosInscritos = actividad ? [...actividad.inscritos, nombreUsuario] : [nombreUsuario];
      await updateDoc(actividadRef, { inscritos: nuevosInscritos });

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

    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividades-grid">
      {mensaje && <div className="alert">{mensaje}</div>}
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
        className="nombre-input"
      />
      {loading ? ( // Mostrar indicador de carga
        <div className="loading">Cargando actividades...</div>
      ) : (
        actividades.map(actividad => (
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
        ))
      )}
    </div>
  );
};

export default Actividades;

