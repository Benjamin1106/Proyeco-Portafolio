// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/navbar.tsx';
import FormularioSolicitudes from './Componentes/solicitudes.tsx';

const Home: React.FC = () => <h1>Hola Mundo 1</h1>;
const Services: React.FC = () => <h1>Hola Mundo 3</h1>;
const Contact: React.FC = () => <h1>Hola Mundo 4</h1>;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitudes" element={<FormularioSolicitudes />} /> {/* Usamos el nombre correcto */}
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
