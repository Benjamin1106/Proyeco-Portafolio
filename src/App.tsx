// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/navbar';
import FormularioSolicitudes from './Componentes/solicitudes';
import Home from './Componentes/home';
import Footer from './Componentes/footer';
import CrearActividades from './Componentes/crearActividades';
import Contacto from './Componentes/contacto';
import Actividades from './Componentes/actividades';
import Videos from './Componentes/videos'; //Me genero conflicto el jenkins por lo de cambiar los acrhivos .json asi que borre lo de .tsx


//const Videos: React.FC = () => <h1>Cambiar nombre</h1>;

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>404</h1>
    <p>Oops. Nothing here...</p>
    <button onClick={() => window.location.href = '/'}>Go Home</button>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<FormularioSolicitudes />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/crearActividades" element={<CrearActividades />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* Ruta para capturar todas las rutas no existentes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;