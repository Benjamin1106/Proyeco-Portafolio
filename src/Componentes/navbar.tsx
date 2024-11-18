import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './Styles/navbar.css';
import logo from '../img/imglogo.png';
import Login from './login';

type NavbarProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated, role, setRole }) => {
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    const savedUserName = localStorage.getItem('userNombre');
    
    if (savedRole && savedAuthStatus === 'true') {
      setIsAuthenticated(true);
      setRole(savedRole);
      setUserName(savedUserName); // Cargamos el nombre del usuario
    } else {
      setIsAuthenticated(false);
      setRole('vecino');
    }
  }, [setIsAuthenticated, setRole]);

  const toggleMenu = useCallback(() => setIsActive(prevState => !prevState), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleLogin = useCallback(
    (userData: { role: string, rut: string, name: string, email: string, address: string, phone: string }) => {
      setIsAuthenticated(true);
      setRole(userData.role);
      setUserName(userData.name); // Guardamos el nombre del usuario en el estado
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userNombre', userData.name); // Guardamos el nombre en localStorage
      closeModal();
    },
    [setIsAuthenticated, setRole, closeModal]
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setRole('vecino');
    setUserName(null); // Limpiamos el nombre al cerrar sesión
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userNombre');
  }, [setIsAuthenticated, setRole]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo Junta de Vecinos" className="logo-image" />
          Junta de Vecinos
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          &#9776;
        </div>

        <ul className={`nav-menu ${isActive ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/noticias" className="nav-links" onClick={toggleMenu}>Noticias</Link>
          </li>
          {role !== 'directiva' && (
            <li className="nav-item">
              <Link to="/contacto" className="nav-links" onClick={toggleMenu}>Contacto</Link>
            </li>
          )}
          {isAuthenticated && (
            <>
              {role === 'directiva' && (
                <>
                  <li className="nav-item">
                    <Link to="/crearActividades" className="nav-links" onClick={toggleMenu}>Crear</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/lup" className="nav-links" onClick={toggleMenu}>Lup</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/usersList" className="nav-links" onClick={toggleMenu}>Usuarios</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/pending" className="nav-links" onClick={toggleMenu}>Pendientes</Link>
                  </li>
                </>
              )}
              {role === 'vecino' && (
                <>
                  <li className="nav-item">
                    <Link to="/solicitudes" className="nav-links" onClick={toggleMenu}>Solicitudes</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/actividades" className="nav-links" onClick={toggleMenu}>Participa</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/videos" className="nav-links" onClick={toggleMenu}>Videos Tutoriales</Link>
                  </li>
                </>
              )}
            </>
          )}

          {/* Mostrar nombre del usuario loggeado si está autenticado */}
          {isAuthenticated && (
            <li className="nav-item user-name">
              Usuario: {userName}
            </li>
          )}

          {/* Botón de Conéctate/Cerrar sesión dentro del menú móvil */}
          <div className="navbar-button-container">
            {isAuthenticated ? (
              <button className="navbar-button-logout" onClick={handleLogout}>
                <FaSignOutAlt className="navbar-icon" />Salir
              </button>
            ) : (
              <button className="navbar-button" onClick={openModal}>
                <FaSignInAlt className="navbar-icon" />Ingresa
              </button>
            )}
          </div>
        </ul>
      </div>

      <Login isOpen={isModalOpen} onClose={closeModal} onLogin={handleLogin} />
    </nav>
  );
};

export default Navbar;
