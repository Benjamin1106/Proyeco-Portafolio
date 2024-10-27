import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a href="#about">¿Quiénes Somos?</a></li>
            <li><a href="#contact">Contacto</a></li>
            <li><a href="#services">Servicios</a></li>
          </ul>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contacto</h4>
          <p>Villa Los Lagos, Chile</p>
          <p>Teléfono: +56 9 1234 5678</p>
          <p>Email: contacto@juntaloslagos.cl</p>
        </div>
        <div className="footer-section footer-social">
          <h4>Síguenos</h4>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Junta de Vecinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
