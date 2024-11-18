import React from 'react';
import './Styles/footer.css';
import logo from '../img/imglogo.png'; 
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">

      <div className="footer-content">
        {/* Sección del logo */}
        <div className="footer-section footer-logo">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <img src={logo} alt="Logo de la Junta de Vecinos" className="logo-image1" />
          </Link>
        </div>

        {/* Fonos de emergencia */}
        <div className="footer-section footer-num">
          <h4>Fonos de Emergencia</h4>
          <ul>
            <li><a href="tel:133">Carabineros: 133</a></li>
            <li><a href="tel:132">Bomberos: 132</a></li>
            <li><a href="tel:131">Ambulancia: 131</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-section footer-contact">
          <h4>Contacto</h4>
          <p>Villa Los Lagos, Chile</p>
          <p>Teléfono: <a href="tel:+56975131688">+56 9 7513 1688</a></p>
          <p>Email: <a href="mailto:villaloslagos.jjvv@gmail.com">contacto@juntaloslagos.cl</a></p>
        </div>

        {/* Enlaces de Interés */}
        <div className="footer-section footer-links">
          <h4>Enlaces de Interés</h4>
          <ul>
            <li><a href="https://www.carabineros.cl/" target="_blank" rel="noopener noreferrer">Carabineros de Chile</a></li>
            <li><a href="https://www.bomberos.cl/" target="_blank" rel="noopener noreferrer">Bomberos de Chile</a></li>
            <li><Link to="/feriados">Feriados de Chile</Link></li>
            
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="footer-section footer-social">
          <h4>Síguenos</h4>
          <a href="https://www.faceebok.cl" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://www.x.com" target="_blank"><FaTwitter /></a>
          <a href="https://www.instagram.com" target="_blank"><FaInstagram /></a>
        </div>
      </div>

      {/* Pie de página */}
      <div className="footer-bottom">
        <p>&copy; 2024 Junta de Vecinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
