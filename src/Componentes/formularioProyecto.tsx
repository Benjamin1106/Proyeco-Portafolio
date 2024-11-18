import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './Styles/formulario.css';

interface FormularioProyectoProps {
  proyecto: { id: string; titulo: string };
  onClose: () => void;
}

const FormularioProyecto: React.FC<FormularioProyectoProps> = ({ proyecto, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', reason: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const proyectoRef = doc(db, 'proyectosVecinales', proyecto.id);
      const participantesRef = collection(proyectoRef, 'participantes');

      // Verificar si el correo ya está inscrito
      const q = query(participantesRef, where("email", "==", formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setErrorMessage('¡Correo ya inscrito en este proyecto!');
        return;
      }

      // Añadir el registro
      await addDoc(participantesRef, formData);

      console.log('Participación registrada:', formData);
      setSuccessMessage('¡Te has registrado exitosamente en el proyecto!');

      // Reiniciar formulario tras 5 segundos
      setTimeout(() => {
        setFormData({ name: '', email: '', reason: '' });
        setSuccessMessage(null);
        onClose();
      }, 5000);
    } catch (error) {
      console.error('Error al registrar participación:', error);
      setErrorMessage('Ocurrió un error al enviar el formulario. Intenta nuevamente.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Participar en {proyecto.titulo}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </label>
          <label>
            Motivo de Participación:
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Describe brevemente por qué deseas participar"
              required
            ></textarea>
          </label>
          <div className="button-group">
            <button type="submit" className="btn-submit">Enviar</button>
            <button type="button" onClick={onClose} className="btn-close">Cerrar</button>
          </div>
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default FormularioProyecto;
