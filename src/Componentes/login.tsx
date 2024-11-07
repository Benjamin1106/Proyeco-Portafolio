import React, { useState } from 'react';
import './login.css';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // Nueva propiedad para gestionar el inicio de sesión
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica de autenticación simulada
    if (rut && password) {
      onLogin(); // Llama a la función de autenticación en `Navbar`
    } else {
      setError('Por favor, completa todos los campos');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>¡Bienvenido a la plataforma de Vecinos de Villa Los Lagos!</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label htmlFor="rut">RUT</label>
          <input
            type="text"
            id="rut"
            name="rut"
            className="input-field"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
