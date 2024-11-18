import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/register.css';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = 'vecino';

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

  const validateRUT = (value: string) => {
    const cleanRUT = value.replace(/[^\dK.-]/gi, '');
    const rutParts = cleanRUT.split('-');
    if (rutParts.length !== 2) return false;

    const [digits, verifier] = rutParts;
    return /^\d{1,3}(\.\d{3})*$/.test(digits) && /^[0-9K]$/i.test(verifier);
  };

  const validateName = (value: string) => /^[a-zA-Z\s]{1,50}$/.test(value);
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const validatePassword = (value: string) => value.length >= 6;
  const validatePhone = (value: string) => /^\d{8,15}$/.test(value);
  const validateAddress = (value: string) => value.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones antes de enviar
    if (!validateRUT(rut)) return setError('Por favor, ingrese un RUT válido.');
    if (!validateName(name)) return setError('Por favor, ingrese un nombre válido.');
    if (!validateEmail(email)) return setError('Por favor, ingrese un correo electrónico válido.');
    if (!validatePassword(password)) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (!validatePhone(phone)) return setError('Por favor, ingrese un número de teléfono válido.');
    if (!validateAddress(address)) return setError('Por favor, ingrese una dirección.');

    setError(''); // Limpiar errores si las validaciones son exitosas
    const userData = { name, rut, email, password, address, phone, role };

    try {
      await addDoc(collection(db, 'registro'), userData);
      alert('Usuario registrado. Espere confirmación para acceder.');
      navigate('/'); // Redirigir al inicio después del registro
    } catch (e) {
      console.error('Error al registrar el usuario: ', e);
      alert('Hubo un error al registrar el usuario. Intente nuevamente.');
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRut(e.target.value);
  };

  const handleRutBlur = () => {
    setRut(formatRUT(rut));
  };

  return (
    <div className="register-container">
      <h2>Registrarse en la plataforma</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
        />

        <label htmlFor="rut">RUT</label>
        <input
          type="text"
          id="rut"
          value={rut}
          onChange={handleRutChange}
          onBlur={handleRutBlur} // Formatear al perder el foco
          className="input-field"
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          minLength={6}
        />

        <label htmlFor="address">Dirección</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
          required
        />

        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          required
        />

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
