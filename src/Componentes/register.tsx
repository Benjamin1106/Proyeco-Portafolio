import React, { useState } from 'react';
import './register.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el registro
    console.log('Registro exitoso', { name, rut, email, password, address, phone, role });
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
          <option value="">Selecciona un rol</option>
          <option value="admin">Admin</option>
          <option value="directiva">Directiva</option>
          <option value="vecino">Vecino</option>
        </select>

        <button type="submit" className="register-button">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
