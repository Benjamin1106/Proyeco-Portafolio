// register.tsx
import React, { useState } from 'react';
import './register.css';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const role = 'vecino';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { name, rut, email, password, address, phone, role };

    try {
      const docRef = await addDoc(collection(db, 'registro'), userData);
      console.log('Registro pendiente con ID: ', docRef.id);
    } catch (e) {
      console.error('Error al registrar el usuario: ', e);
    }
  };

  return (
    <div className="register-container">
      <h2>Registrarse en la plataforma</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <label htmlFor="rut">RUT</label>
        <input
          type="text"
          id="rut"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="input-field"
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <label htmlFor="address">Dirección</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
        />

        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
