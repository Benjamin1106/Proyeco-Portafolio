import React, { useState } from 'react';
import './login.css';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rut || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      // Crear una consulta para buscar el usuario por RUT
      const q = query(collection(db, 'users'), where('rut', '==', rut));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Validar la contraseña ingresada
      if (userData.password === password) {
        setError('');
        console.log('Inicio de sesión exitoso');
        onClose(); // Cerrar el modal al iniciar sesión correctamente
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error al iniciar sesión');
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

        <p className="register-text">
          ¿Eres nuevo? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
