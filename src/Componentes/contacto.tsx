import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import './contacto.css';

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    correo: '',
    telefono: '',
    motivo: '',
    mensaje: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'contactos'), formData);
      alert('Formulario enviado exitosamente');
      setFormData({
        rut: '',
        nombre: '',
        correo: '',
        telefono: '',
        motivo: '',
        mensaje: ''
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Hubo un error al enviar el formulario');
    }
  };

  const handleClear = () => {
    setFormData({
      rut: '',
      nombre: '',
      correo: '',
      telefono: '',
      motivo: '',
      mensaje: ''
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Formulario de Contacto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input type="text" name="rut" value={formData.rut} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control" required />
        </div>
        <div className="form-group mb-3">
            <label htmlFor="motivo" className="form-label">Motivo</label>
            <select id="motivo" className="form-select" required>
                <option value="">Seleccione un motivo</option>
                <option value="consulta">Consulta</option>
                <option value="sugerencia">Sugerencia</option>
                <option value="reclamo">Reclamo</option>
                <option value="otros">Otros</option>
            </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} className="form-control" rows={3} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">Enviar</button>
        <button type="button" onClick={handleClear} className="btn btn-secondary">Limpiar</button>
      </form>
    </div>
  );
};

export default Contacto;
