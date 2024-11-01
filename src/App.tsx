// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/navbar.tsx';
import FormularioSolicitudes from './Componentes/solicitudes.tsx';
import Home from './Componentes/home.tsx';
import Footer from './Componentes/footer.tsx';
import CrearActividades from './Componentes/crearActividades.tsx';

const Actividades: React.FC = () => <h1>Cambiar nombre</h1>;
const Videos: React.FC = () => <h1>Cambiar nombre</h1>;

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
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
