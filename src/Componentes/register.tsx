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
  const [role, setRole] = useState('');

  // Función para guardar los datos en Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear un objeto con los datos del formulario
    const userData = { name, rut, email, password, address, phone, role };

    try {
      // Agregar el nuevo documento a la colección 'users' en Firestore
      const docRef = await addDoc(collection(db, 'users'), userData);
      console.log('Registro exitoso con ID: ', docRef.id);
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

        {/* Campo de rol */}
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
        >
          <option value="" disabled>Selecciona un rol</option>
          <option value="directiva">Directiva</option>
          <option value="vecino">Vecino</option>
        </select>

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
