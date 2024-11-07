import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from '../img/imglogo.png';
import Login from './login';

// Definir las propiedades que el componente Navbar va a recibir
type NavbarProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsActive(prevState => !prevState), []);
  const toggleModal = useCallback(() => setIsModalOpen(prevState => !prevState), []);
  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
    setIsModalOpen(false);
  }, [setIsAuthenticated]);
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

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

          {isAuthenticated && (
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
              <li className="nav-item">
                <Link to="/contacto" className="nav-links" onClick={toggleMenu}>Contacto</Link>
              </li>
              <li className="nav-item">
                <Link to="/crearActividades" className="nav-links" onClick={toggleMenu}>Crear Actividades</Link>
              </li>
              <li className="nav-item">
                <Link to="/usersList" className="nav-links" onClick={toggleMenu}>Usuarios</Link>
              </li>
            </>
          )}
        </ul>

        {isAuthenticated ? (
          <button className="navbar-button-logout" onClick={handleLogout}>Cerrar sesión</button>
        ) : (
          <button className="navbar-button" onClick={toggleModal}>Conéctate</button>
        )}
      </div>

      <Login isOpen={isModalOpen} onClose={toggleModal} onLogin={handleLogin} />
    </nav>
  );
};

export default Navbar;
