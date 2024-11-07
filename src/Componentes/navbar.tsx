import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; 
import logo from '../img/imglogo.png'; 

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo Junta de Vecinos" className="logo-image" />
          Junta de Vecinos
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Icono de menú (hamburguesa) */}
        </div>
        <ul className={`nav-menu ${isActive ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>Inicio</Link>
          </li>
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
        </ul>
        <button className="navbar-button">Conéctate</button>
      </div>
    </nav>
  );
};

export default Navbar;
