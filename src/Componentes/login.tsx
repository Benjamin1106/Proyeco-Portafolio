// Login.tsx
import React from 'react';
import './login.css';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si no está abierto, no renderiza el modal

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>
        ¡Bienvenido a la plataforma de Vecinos de Villa Los Lagos!</h2>
        <label htmlFor="rut">RUT</label>
        <input type="text" id="rut" name="rut" className="input-field" />

        <label htmlFor="password">Contraseña</label>
        <input type="password" id="password" name="password" className="input-field" />

        <button className="login-button">Iniciar sesión</button>
        
        <p className="register-text">¿Eres nuevo? <a href="/register">Regístrate aquí</a></p>
      </div>
    </div>
  );
};

export default Login;
