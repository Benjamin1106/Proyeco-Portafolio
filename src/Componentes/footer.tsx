import React from 'react';
import './footer.css';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-num">
          <h4>Fonos de Emergencia</h4>
          <ul>
            <li><a href="tel:+56912345678">Carabineros: +56 9 1234 5678</a></li>
            <li><a href="tel:+56987654321">Bomberos: +56 9 8765 4321</a></li>
            <li><a href="tel:+56911223344">Ambulancia: +56 9 1122 3344</a></li>
          </ul>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contacto</h4>
          <p>Villa Los Lagos, Chile</p>
          <p>Teléfono: <a href="tel:+56999887766">+56 9 9988 7766</a></p>
          <p>Email: <a href="mailto:contacto@juntaloslagos.cl">contacto@juntaloslagos.cl</a></p>
        </div>
        <div className="footer-section footer-social">
          <h4>Síguenos</h4>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Junta de Vecinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
