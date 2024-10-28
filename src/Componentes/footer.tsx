import React from 'react';
import './footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-links">
          <h4>Fonos de Emergencia </h4>
          <ul>
            <li>Fono 1</li>
            <li>Fono 2</li>
            <li>Fono 3</li>
          </ul>
        </div>
        <div className="footer-section footer-contact">
          <h4>Contacto</h4>
          <p className='test'>Villa Los Lagos, Chile</p>
          <p className='test'>Teléfono: +56 9 1234 5678</p>
          <p className='test'>Email: contacto@juntaloslagos.cl</p>
        </div>
        <div className="footer-section footer-social">
          <h4>Síguenos</h4>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className='test'>&copy; 2024 Junta de Vecinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
