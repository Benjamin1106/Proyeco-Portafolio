import React from 'react';
import './home.css';
import foto1 from "../img/Foto1.jpg"

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero section con imagen de fondo */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className='test'>Bienvenidos a la Plataforma de Junta de Vecinos</h1>
          <p className='test'>Conectando a nuestra comunidad por un futuro mejor</p>
          <a href="#about" className="cta-button">Conoce Más</a>
        </div>
      </section>

      {/* Sección de Quiénes Somos */}
      <section className="about-section" id="about">
        <h2>¿Quiénes Somos?</h2>
        <p>
          Somos la junta de vecinos de la Villa Los Lagos, comprometidos con la participación activa 
          de nuestros habitantes. Nuestra misión es construir una comunidad unida y colaborativa. Esta 
          plataforma será el punto de partida para expandirnos a todas las juntas de vecinos del país.
        </p>
      </section>

      {/* Sección de Nuestro Objetivo con imagen */}
      <section className="goal-section">
        <div className="goal-content">
          <h2>Nuestro Objetivo</h2>
          <p>
            Crear una red digital que conecte a las comunidades de todo el país, facilitando la comunicación 
            y la colaboración entre vecinos y juntas.
          </p>
        </div>
        <div className="goal-image">
          <img src={foto1} alt="Comunidad Unida" />
        </div>
      </section>
    </div>
  );
};

export default Home;
