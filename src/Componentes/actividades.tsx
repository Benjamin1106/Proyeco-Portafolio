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
  const [emailUsuario, setEmailUsuario] = useState<string>(''); // Estado para el email del usuario
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null); // Actividad seleccionada para inscripción
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

  const inscribirse = async () => {
    if (!nombreUsuario.trim() || !emailUsuario.trim()) {
      setMensaje('Por favor, completa todos los campos para inscribirte.');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    if (actividadSeleccionada) {
      try {
        const actividadRef = doc(db, 'actividades', actividadSeleccionada.id);
        const actividad = actividades.find(act => act.id === actividadSeleccionada.id);

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
          prev.map(act =>
            act.id === actividadSeleccionada.id ? { ...act, inscritos: nuevosInscritos } : act
          )
        );
        setMensaje('¡Inscripción exitosa!');
      } catch (error) {
        console.error('Error al inscribirse:', error);
        setMensaje('Error al inscribirse. Inténtalo nuevamente.');
      }

      setActividadSeleccionada(null); // Cerrar modal
      setNombreUsuario('');
      setEmailUsuario('');
      setTimeout(() => setMensaje(''), 3000); // Limpiar mensaje después de unos segundos
    }
  };

  const abrirFormularioInscripcion = (actividad: Actividad) => {
    setActividadSeleccionada(actividad); // Seleccionar actividad y abrir modal
  };

  return (
    <div className="actividades-grid">
      {mensaje && <div className="alert">{mensaje}</div>} {/* Mostrar mensaje */}

      {actividades.map(actividad => (
        <div key={actividad.id} className="actividad-card">
          <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
          <div className="actividad-content">
            <h3>{actividad.nombre}</h3>
            <p>{actividad.descripcion}</p>
            <p>Inscritos: {actividad.inscritos.length}</p>
            <button onClick={() => abrirFormularioInscripcion(actividad)} className="inscribete-button">
              Inscríbete aquí
            </button>
          </div>
        </div>
      ))}

      {/* Modal para inscripción */}
      {actividadSeleccionada && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Inscribirse en {actividadSeleccionada.nombre}</h2>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="nombre-input"
            />
            <input
              type="email"
              placeholder="Tu email"
              value={emailUsuario}
              onChange={(e) => setEmailUsuario(e.target.value)}
              className="email-input"
            />
            <button onClick={inscribirse} className="submit-button">Enviar inscripción</button>
            <button onClick={() => setActividadSeleccionada(null)} className="close-button">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actividades;
