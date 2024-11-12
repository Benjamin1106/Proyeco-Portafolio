import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css';
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

  const toggleMenu = useCallback(() => setIsActive(prevState => !prevState), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleLogin = useCallback(
    (userData: { role: string, rut: string, name: string, email: string, address: string, phone: string }) => {
      setIsAuthenticated(true);
      setRole(userData.role);
      closeModal();
    },
    [setIsAuthenticated, setRole, closeModal]
  );
  

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setRole('vecino');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRUT');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('userCorreo');
    localStorage.removeItem('userDireccion');
    localStorage.removeItem('userFono');
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
                    <Link to="/crearActividades" className="nav-links" onClick={toggleMenu}>Crear Actividades</Link>
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

          {/* Botón de Conéctate/Cerrar sesión dentro del menú móvil */}
          <div className="navbar-button-container">
            {isAuthenticated ? (
              <button className="navbar-button-logout" onClick={handleLogout}>
                <FaSignOutAlt className="navbar-icon" /> Cerrar sesión
              </button>
            ) : (
              <button className="navbar-button" onClick={openModal}>
                <FaSignInAlt className="navbar-icon" /> Conéctate
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
