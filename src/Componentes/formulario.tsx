import React, { useState } from 'react';
import './formulario.css';

interface FormularioProps {
  actividad: { id: string; nombre: string };
  onClose: () => void;
}

const Formulario: React.FC<FormularioProps> = ({ actividad, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Formulario enviado:', formData);
    onClose();
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
          <button type="submit">Enviar</button>
          <button type="button" onClick={onClose}>Cerrar</button>
        </form>
      </div>
    </div>
  );
};

export default Formulario;