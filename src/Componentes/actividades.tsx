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
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedActividadId, setSelectedActividadId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'actividades'), (snapshot) => {
      const actividadesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Actividad[];
      setActividades(actividadesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (actividadId: string) => {
    setSelectedActividadId(actividadId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNombreUsuario('');
    setMensaje('');
  };

  const inscribirse = async () => {
    if (!nombreUsuario.trim() || !selectedActividadId) {
      setMensaje('Por favor, ingresa tu nombre para inscribirte.');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const actividadRef = doc(db, 'actividades', selectedActividadId);
      const actividad = actividades.find(act => act.id === selectedActividadId);

      if (actividad && actividad.inscritos.includes(nombreUsuario)) {
        setMensaje('Ya estás inscrito en esta actividad.');
        setTimeout(() => setMensaje(''), 3000);
        return;
      }

      const nuevosInscritos = actividad ? [...actividad.inscritos, nombreUsuario] : [nombreUsuario];
      await updateDoc(actividadRef, { inscritos: nuevosInscritos });

      setActividades(prev =>
        prev.map(act =>
          act.id === selectedActividadId ? { ...act, inscritos: nuevosInscritos } : act
        )
      );
      setMensaje('¡Inscripción exitosa!');
      closeModal();
    } catch (error) {
      console.error('Error al inscribirse:', error);
      setMensaje('Error al inscribirse. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="actividades-grid">
      {mensaje && <div className="alert">{mensaje}</div>}
      {loading ? (
        <div className="loading">Cargando actividades...</div>
      ) : (
        actividades.map(actividad => (
          <div key={actividad.id} className="actividad-card">
            <img src={actividad.fotoURL} alt={actividad.nombre} className="actividad-image" />
            <div className="actividad-content">
              <h3>{actividad.nombre}</h3>
              <p>{actividad.descripcion}</p>
              <p>Inscritos: {actividad.inscritos.length}</p>
              <button onClick={() => openModal(actividad.id)} className="inscribete-button">
                Inscríbete aquí
              </button>
            </div>
          </div>
        ))
      )}
      {/* Modal para inscripción */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Inscribirse en la actividad</h2>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="nombre-input"
            />
            <button onClick={inscribirse} className="submit-button">
              Confirmar Inscripción
            </button>
            <button onClick={closeModal} className="close-button">
              Cancelar
            </button>
            {mensaje && <p className="modal-mensaje">{mensaje}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Actividades;
