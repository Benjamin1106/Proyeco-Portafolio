// Actividades.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import FormularioInscripcion from './actividadesFormulario';
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
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [mensaje, setMensaje] = useState<string>('');

  useEffect(() => {
    const fetchActividades = async () => {
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const actividadesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Actividad[];
      setActividades(actividadesData);
    };

    fetchActividades();
  }, []);

  const handleInscripcionExitosa = (actividadId: string, nombreUsuario: string) => {
    setActividades((prev) =>
      prev.map((act) =>
        act.id === actividadId ? { ...act, inscritos: [...act.inscritos, nombreUsuario] } : act
      )
    );
    setMensaje('¡Inscripción exitosa!');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="actividades-grid">
      {mensaje && <div className="alert">{mensaje}</div>}

      {actividades.map((actividad) => (
        <div key={actividad.id} className="actividad-card">
          <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
          <div className="actividad-content">
            <h3>{actividad.nombre}</h3>
            <p>{actividad.descripcion}</p>
            <p>Inscritos: {actividad.inscritos.length}</p>
            <button onClick={() => setActividadSeleccionada(actividad)} className="inscribete-button">
              Inscríbete aquí
            </button>
          </div>
        </div>
      ))}

      {actividadSeleccionada && (
        <FormularioInscripcion
          actividadSeleccionada={actividadSeleccionada}
          onClose={() => setActividadSeleccionada(null)}
          onInscripcionExitosa={handleInscripcionExitosa}
        />
      )}
    </div>
  );
};

export default Actividades;
