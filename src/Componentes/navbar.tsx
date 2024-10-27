import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; 

const Navbar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
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
            <Link to="/services" className="nav-links" onClick={toggleMenu}>Actividades</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={toggleMenu}>Videos Tutoriales</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
