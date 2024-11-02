import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import './actividadesFormulario.css';

interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fotoURL: string;
  inscritos: string[];
}

interface FormularioInscripcionProps {
  actividadSeleccionada: Actividad;
  onClose: () => void;
  onInscripcionExitosa: (actividadId: string, nombreUsuario: string) => void;
}

const FormularioInscripcion: React.FC<FormularioInscripcionProps> = ({
  actividadSeleccionada,
  onClose,
  onInscripcionExitosa,
}) => {
  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [emailUsuario, setEmailUsuario] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const inscribirse = async () => {
    if (!nombreUsuario.trim() || !emailUsuario.trim()) {
      setMensaje('Por favor, completa todos los campos para inscribirte.');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    try {
      const actividadRef = doc(db, 'actividades', actividadSeleccionada.id);
      const nuevosInscritos = [...actividadSeleccionada.inscritos, nombreUsuario];

      await updateDoc(actividadRef, { inscritos: nuevosInscritos });
      onInscripcionExitosa(actividadSeleccionada.id, nombreUsuario);

      setMensaje('¡Inscripción exitosa!');
      setTimeout(() => {
        setMensaje('');
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error al inscribirse:', error);
      setMensaje('Error al inscribirse. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Inscribirse en {actividadSeleccionada.nombre}</h2>
        {mensaje && <div className="alert">{mensaje}</div>}
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
        <button onClick={onClose} className="close-button">Cancelar</button>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
