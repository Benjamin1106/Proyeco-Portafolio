// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/navbar.tsx';
import FormularioSolicitudes from './Componentes/solicitudes.tsx';

const Inicio: React.FC = () => <h1>Hola Juan Saludos</h1>;
const Services: React.FC = () => <h1>Hola Mundo 3</h1>;
const Contact: React.FC = () => <h1>Hola Mundo 4</h1>;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/solicitudes" element={<FormularioSolicitudes />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
