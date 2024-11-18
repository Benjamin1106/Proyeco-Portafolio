import React from 'react';
import './Styles/videos.css';

const videos = [
  {
    id: 1,
    title: 'Introducción a la Plataforma',
    description: 'Un breve recorrido por las principales funcionalidades de la plataforma.',
    url: 'https://www.youtube.com/watch?v=example1', // Reemplaza con el enlace real
  },
  {
    id: 2,
    title: 'Cómo Inscribirse en Actividades',
    description: 'Guía paso a paso para inscribirse en las actividades.',
    url: 'https://www.youtube.com/watch?v=example2', // Reemplaza con el enlace real
  },
  {
    id: 3,
    title: 'Manejo de la Pestaña de Tutoriales',
    description: 'Aprende a navegar por la pestaña de tutoriales.',
    url: 'https://www.youtube.com/watch?v=example3', // Reemplaza con el enlace real
  },
];

const Videos: React.FC = () => {
  return (
    <div className="videos-container">
      <h1 className="videos-title">Videos Tutoriales</h1>
      <section className="videos-section">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <h2 className="video-title">{video.title}</h2>
            <p className="video-description">{video.description}</p>
            <iframe
              className="video-iframe"
              width="560"
              height="315"
              src={video.url.replace('watch?v=', 'embed/')}
              title={video.title}
              allowFullScreen
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Videos;
