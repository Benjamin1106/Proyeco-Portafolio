import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import emailjs from 'emailjs-com';
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
  const [status, setStatus] = useState<string>('');

  const formatRUT = (rut: string) => {
    let cleanRUT = rut.replace(/[^0-9K]/gi, ''); 
    if (cleanRUT.length > 9) {
      cleanRUT = cleanRUT.slice(0, 9); 
    }
    if (cleanRUT.length > 0) {
      const digits = cleanRUT.slice(0, -1);
      const verifier = cleanRUT.charAt(cleanRUT.length - 1);
      const formattedDigits = digits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return `${formattedDigits}-${verifier.toUpperCase()}`;
    }
    return '';
  };

  const formatTelefono = (telefono: string) => {
    let cleanTelefono = telefono.replace(/\D/g, '');
    if (!cleanTelefono.startsWith('56')) {
      cleanTelefono = '56' + cleanTelefono;
    }
    if (cleanTelefono.length > 11) {
      cleanTelefono = cleanTelefono.slice(0, 11);
    }
    return cleanTelefono;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'rut') {
      const formattedRUT = formatRUT(value);
      setFormData({ ...formData, [name]: formattedRUT });
    } else if (name === 'nombre') {
      const regex = /^[a-zA-Z\s]*$/;
      if (value.length <= 50 && regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'telefono') {
      const formattedTelefono = formatTelefono(value);
      setFormData({ ...formData, [name]: formattedTelefono });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'contactos'), formData);
      setStatus('Formulario enviado exitosamente');

      const templateParams = {
        from_name: formData.nombre,
        to_email: formData.correo,
        message: formData.mensaje,
        rut: formData.rut,
        telefono: formData.telefono,
        motivo: formData.motivo,
        
      };

      emailjs.send('service_uakj6ut', 'template_zrxce7r', templateParams, 'xDYQGP5qWmrQPxol7')
        .then(() => {
          setStatus('¡El mensaje ha sido enviado con éxito!');
        }, (error) => {
          console.error('Error al enviar correo:', error);
          setStatus('Hubo un error al enviar el correo');
        });

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
      setStatus('Hubo un error al enviar el formulario');
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
      {status && (
  <div className="alert alert-success text-center" role="alert">
    {status}
  </div>
)}
      <h2 className="text-center mb-4">Formulario de Contacto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input 
            type="text" 
            name="rut" 
            value={formData.rut} 
            onChange={handleChange} 
            className="form-control" 
            required 
            maxLength={12}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input 
            type="email" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input 
            type="tel" 
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            className="form-control" 
            required 
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="motivo" className="form-label">Motivo</label>
          <select 
            id="motivo" 
            name="motivo" 
            className="form-select" 
            value={formData.motivo} 
            onChange={handleChange} 
            required
          >
            <option value="">Seleccione un motivo</option>
            <option value="consulta">Consulta</option>
            <option value="sugerencia">Sugerencia</option>
            <option value="reclamo">Reclamo</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea 
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange} 
            className="form-control" 
            rows={3} 
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">Enviar</button>
        <button type="button" onClick={handleClear} className="btn btn-secondary">Limpiar</button>
      </form>
      {status && <p className="mt-3">{status}</p>}
    </div>
  );
};

export default Contacto;