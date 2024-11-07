import React, { useState } from 'react';
import './login.css';
import { db } from '../firebase/firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: string) => void; // Ahora esperamos recibir el rol en onLogin
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rut || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Buscar usuario en Firestore por RUT
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('rut', '==', rut));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      // Obtener datos del usuario
      const userDoc = querySnapshot.docs[0].data();
      const storedPassword = userDoc.password;

      // Validar la contraseña
      if (password === storedPassword) {
        onLogin(userDoc.role); // Pasa el rol al componente padre (Navbar)
        onClose();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión: ', error);
      setError('Hubo un error al intentar iniciar sesión');
    } finally {
      setLoading(false);
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
            value={rut}
            onChange={(e) => setRut(e.target.value)}
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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>
        
        <p className="register-text">
          ¿Eres nuevo? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
