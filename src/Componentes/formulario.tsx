import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, addDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './formulario.css';

interface FormularioProps {
  actividad: { id: string; nombre: string; cupos: number };
  onClose: () => void;
}

const Formulario: React.FC<FormularioProps> = ({ actividad, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null); // Limpiar mensaje de error al cambiar el campo
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (actividad.cupos > 0) {
      try {
        const actividadRef = doc(db, 'actividades', actividad.id);
        const inscritosRef = collection(actividadRef, 'inscritos');

        // Verificar si el correo ya está inscrito
        const q = query(inscritosRef, where("email", "==", formData.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setErrorMessage('¡Correo ya inscrito!'); // Establecer mensaje de error
          return; // Detener el proceso si el correo ya está inscrito
        }

        // Guardar los datos del inscrito en la subcolección 'inscritos'
        await addDoc(inscritosRef, formData);

        // Actualizar el número de cupos
        await updateDoc(actividadRef, {
          cupos: actividad.cupos - 1,
        });

        console.log('Inscripción realizada:', formData);
        setSuccessMessage('¡Te has inscrito exitosamente!'); // Establecer el mensaje de éxito

        // Esperar 5 segundos antes de refrescar la página
        setTimeout(() => {
          window.location.reload(); // Refrescar la página
        }, 5000);

        // No cerrar el modal aquí para que el mensaje se muestre
      } catch (error) {
        console.error('Error al inscribir:', error);
      }
    } else {
      alert('Lo sentimos, no hay cupos disponibles.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Inscripción para {actividad.nombre}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
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
              required 
            />
          </label>
          <label>
            Dirección de Domicilio:
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
          </label>
          <div className="button-group">
            <button type="submit">Enviar</button>
            <button type="button" onClick={onClose}>Cerrar</button>
          </div>
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>} {/* Mostrar mensaje de éxito */}
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Mostrar mensaje de error */}
      </div>
    </div>
  );
};

export default Formulario;
