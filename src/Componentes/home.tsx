import React, { useEffect, useState } from 'react';
import ScrollReveal from 'scrollreveal';
import './home.css';
import foto1 from "../img/Foto1.jpg";
import presidente from "../img/presidente.jpg";
import secretaria from "../img/secretaria.jpg";
import tesorera from "../img/tesorera.jpg";

const Home: React.FC = () => {
  const [visitorsOnline, setVisitorsOnline] = useState<number>(0);

  useEffect(() => {
    ScrollReveal().reveal('.hero-section', {
      duration: 3000,
      origin: 'bottom',
      distance: '50px',
      opacity: 0,
    });
    ScrollReveal().reveal('.about-section', {
      duration: 2000,
      origin: 'left',
      distance: '50px',
      delay: 200,
      opacity: 0,
    });
    ScrollReveal().reveal('.goal-section', {
      duration: 1500,
      origin: 'right',
      distance: '50px',
      delay: 400,
      opacity: 0,
    });
    ScrollReveal().reveal('.gallery-section', {
      duration: 2000,
      origin: 'left',
      distance: '50px',
      delay: 800,
      opacity: 0,
    });
    ScrollReveal().reveal('.directiva-section', {
      duration: 2000,
      origin: 'bottom',
      distance: '50px',
      delay: 800,
      opacity: 0,
    });

    // Simulación de visitantes en línea
    setVisitorsOnline(Math.floor(Math.random() * 50) + 1);
  }, []);

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


      {/* Sección de Galería */}
      <section className="gallery-section">
        <div className="gallery-image">
          <img src="./src/img/galleryplaceholder.jpg" alt="Galería de Fotos" />
        </div>
        <div className="gallery-content">
          <h2>Galería de Fotos</h2>
          <p>
            Descubre momentos destacados de nuestras actividades comunitarias en la Villa Los Lagos. 
            Un espacio para recordar y compartir nuestros logros y celebraciones.
          </p>
          <a href="/Galeria" className="gallery-button">Ver Galería</a>
        </div>
      </section>

      
      {/* Sección de Nuestra Directiva */}
      <section className="directiva-section">
        <h2>Nuestra Directiva</h2>
        <p>Nuestra directiva está constituida por diversos dirigentes de la junta de vecinos de Villa Los Lagos.</p>
        <div className="directiva-members">
          <div className="member">
            <img src={presidente} alt="Jesús Navarro" />
            <h3>Jesús Navarro</h3>
            <p>Presidente de la junta de vecinos, 38 años.</p>
          </div>
          <div className="member">
            <img src={secretaria} alt="Nancy Lueta" />
            <h3>Nancy Lueta</h3>
            <p>Secretaria de la junta de vecinos, 55 años.</p>
          </div>
          <div className="member">
            <img src={tesorera} alt="Eugenia Zapa" />
            <h3>Eugenia Zapa</h3>
            <p>Tesorera, 63 años.</p>
          </div>
        </div>
      </section>

      {/* Huincha de Contacto */}
      <section className="contact-banner">
        <h2 className="contact-title">¿Necesitas Contactarnos?</h2>
        <h3>
          Presiona el botón que está acá y podrás llenar el formulario de contacto, en cuanto podamos te contestaremos.
        </h3>
        <a href="/contacto" className="contact-button">CONTÁCTANOS</a>
      </section>

      {/* Contador de visitantes */}
      <section className="visitor-count">
        La cantidad de {visitorsOnline} vecinos han visitado nuestra página.
      </section>
    </div>
  );
};

export default Home;
