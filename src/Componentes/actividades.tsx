import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './actividades.css';
import Formulario from './formulario';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
  cupos: number;
}

const Actividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

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

  const handleInscribeteClick = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    setShowForm(true);
  };

  return (
    <div className="actividades-grid">
      {actividades.map(actividad => (
        <div key={actividad.id} className="actividad-card">
          <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
          <div className="actividad-content">
            <h3>{actividad.nombre}</h3>
            <p>{actividad.descripcion}</p>
            <p>Cupos disponibles: {actividad.cupos}</p>
            <button 
              className={`inscribete-button ${actividad.cupos === 0 ? 'cupos-llenos' : ''}`}
              onClick={() => handleInscribeteClick(actividad)}
              disabled={actividad.cupos === 0}
            >
              {actividad.cupos > 0 ? 'Inscríbete aquí' : 'Cupos llenos'}
            </button>
          </div>
        </div>
      ))}
      {showForm && selectedActividad && (
        <Formulario 
          actividad={selectedActividad} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default Actividades;