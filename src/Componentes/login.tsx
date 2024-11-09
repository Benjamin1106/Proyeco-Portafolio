import React, { useState } from 'react';
import './login.css';
import { db } from '../firebase/firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const formatRUT = (rut: string) => {
    let cleanRUT = rut.replace(/[^0-9K]/gi, '');
    if (cleanRUT.length > 9) cleanRUT = cleanRUT.slice(0, 9);
    if (cleanRUT.length > 0) {
      const digits = cleanRUT.slice(0, -1);
      const verifier = cleanRUT.charAt(cleanRUT.length - 1);
      const formattedDigits = digits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return `${formattedDigits}-${verifier.toUpperCase()}`;
    }
    return '';
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRUT = formatRUT(e.target.value);
    setRut(formattedRUT);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rut || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('rut', '==', rut));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0].data();
      const storedPassword = userDoc.password;

      if (password === storedPassword) {
        onLogin(userDoc.role);
        setRut(''); // Limpiar RUT
        setPassword(''); // Limpiar contraseña
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
            onChange={handleRUTChange}
            className="input-field"
            maxLength={12}
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
