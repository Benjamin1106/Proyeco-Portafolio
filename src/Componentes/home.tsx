import React from 'react';
import './home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenidos a la Plataforma de Junta de Vecinos</h1>
        <p>Un espacio para conectar y mejorar nuestra comunidad.</p>
      </header>
      
      <section className="about-section">
        <h2>¿Quiénes Somos?</h2>
        <p>
          Somos la junta de vecinos de la Villa Los Lagos, comprometidos con la participación
          activa de nuestros habitantes. Nuestro objetivo es unir a la comunidad y trabajar juntos 
          para mejorar la calidad de vida de todos.
        </p>
        <p>
          Esta plataforma está diseñada para gestionar solicitudes, eventos y discusiones comunitarias 
          de manera eficiente. Comenzamos en la Villa Los Lagos, pero nuestro sueño es expandir esta 
          plataforma para que todas las juntas de vecinos del país puedan beneficiarse de esta herramienta.
        </p>
      </section>

      <section className="goal-section">
        <h2>Nuestro Objetivo</h2>
        <p>
          Crear una red digital que facilite la comunicación y el trabajo colaborativo entre los 
          vecinos y las juntas de distintas comunidades en todo el país.
        </p>
      </section>
    </div>
  );
};

export default Home;
