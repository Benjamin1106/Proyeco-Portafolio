import React, { useState, useEffect } from 'react';
import './login.css';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { role: string, rut: string, name: string, email: string, address: string, phone: string }) => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onLogin }) => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si hay datos de sesión guardados en localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedRUT = localStorage.getItem('userRUT');
    const savedNombre = localStorage.getItem('userName');
    const savedCorreo = localStorage.getItem('userEmail');
    const savedDireccion = localStorage.getItem('userAddress');
    const savedFono = localStorage.getItem('userPhone');

    if (savedRole && savedRUT && savedNombre && savedCorreo && savedDireccion && savedFono) {
      onLogin({
        role: savedRole,
        rut: savedRUT,
        name: savedNombre,
        email: savedCorreo,
        address: savedDireccion,
        phone: savedFono
      });
    }
  }, [onLogin]);

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
        const userData = {
          role: userDoc.role,
          rut,
          name: userDoc.name,
          email: userDoc.email,
          address: userDoc.address,
          phone: userDoc.phone
        };

        onLogin(userData); // Pasamos los datos al componente principal

        // Guardamos en localStorage los datos del usuario
        localStorage.setItem('userRole', userDoc.role);
        localStorage.setItem('userRUT', rut);
        localStorage.setItem('userNombre', userDoc.name);
        localStorage.setItem('userCorreo', userDoc.email);
        localStorage.setItem('userDireccion', userDoc.address);
        localStorage.setItem('userFono', userDoc.phone);

        // Limpiamos los campos de entrada
        setRut('');
        setPassword('');
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

  const handleLogout = () => {
    // Eliminamos todos los datos del usuario del localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRUT');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userCorreo');
    localStorage.removeItem('userDireccion');
    localStorage.removeItem('userFono');
    onClose(); // Ejecutar la lógica para cerrar sesión en el componente principal
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleLogout}>&times;</span>
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
