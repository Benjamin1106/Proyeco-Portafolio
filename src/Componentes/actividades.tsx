import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import './actividades.css';
import Formulario from './formulario';
import FormularioProyecto from './formularioProyecto';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
  cupos: number;
}

interface ProyectoVecinal {
  id: string;
  titulo: string;
  fotoURL: string;
  descripcion: string;
}

const Actividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [proyectosVecinales, setProyectosVecinales] = useState<ProyectoVecinal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showProyectoForm, setShowProyectoForm] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoVecinal | null>(null);
  const [inscripciones, setInscripciones] = useState<Record<string, boolean>>({});

  const userEmail = localStorage.getItem("userCorreo") || "user@example.com";

  useEffect(() => {
    const fetchActividades = async () => {
      const querySnapshot = await getDocs(collection(db, 'actividades'));
      const actividadesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Actividad[];
      setActividades(actividadesData);
    };

    const fetchProyectosVecinales = async () => {
      const querySnapshot = await getDocs(collection(db, 'proyectosVecinales'));
      const proyectosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProyectoVecinal[];
      setProyectosVecinales(proyectosData);
    };

    const fetchInscripciones = async () => {
      const inscripcionesSnapshot = await getDocs(collection(db, 'actividades'));
      const inscritoPorActividad: Record<string, boolean> = {};

      for (const actividad of inscripcionesSnapshot.docs) {
        const inscritosRef = collection(actividad.ref, 'inscritos');
        const q = query(inscritosRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          inscritoPorActividad[actividad.id] = true;
        }
      }
      setInscripciones(inscritoPorActividad);
    };

    fetchActividades();
    fetchProyectosVecinales();
    fetchInscripciones();
  }, [userEmail]);

  const handleInscribeteClick = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    setShowForm(true);
  };

  const handleParticiparClick = (proyecto: ProyectoVecinal) => {
    setSelectedProyecto(proyecto);
    setShowProyectoForm(true);
  };

  return (
    <div className="actividades">
      <h2>Actividades</h2>
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
                disabled={actividad.cupos === 0 || inscripciones[actividad.id]}
              >
                {actividad.cupos === 0 ? 'Cupos llenos' : inscripciones[actividad.id] ? 'Inscrito' : 'Inscríbete aquí'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="proyectos-vecinales">
        <h2>Proyectos Vecinales</h2>
        <div className="proyectos-vecinales-grid">
          {proyectosVecinales.map(proyecto => (
            <div key={proyecto.id} className="proyecto-card">
              <img src={proyecto.fotoURL} alt={proyecto.titulo} className="actividad-image" />
              <div className="proyecto-content">
                <h3>{proyecto.titulo}</h3>
                <p>{proyecto.descripcion}</p>
                <button
                  className="inscribete-button"
                  onClick={() => handleParticiparClick(proyecto)}
                >
                  Participar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && selectedActividad && (
        <Formulario
          actividad={selectedActividad}
          onClose={() => setShowForm(false)}
        />
      )}

      {showProyectoForm && selectedProyecto && (
        <FormularioProyecto
          proyecto={selectedProyecto}
          onClose={() => setShowProyectoForm(false)}
        />
      )}
    </div>
  );
};

export default Actividades;
