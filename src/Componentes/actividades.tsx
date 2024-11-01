import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './actividades.css';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
}

const ActividadesList: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);

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

  return (
    <div className="actividades-grid">
      {actividades.map(actividad => (
        <div key={actividad.id} className="actividad-card">
          <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
          <div className="actividad-content">
            <h3>{actividad.nombre}</h3>
            <p>{actividad.descripcion}</p>
            <button className="inscribete-button">Inscríbete aquí</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActividadesList;