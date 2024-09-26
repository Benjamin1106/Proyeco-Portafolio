// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar.tsx';

const Home: React.FC = () => <h1>Hola Mundo 1</h1>;
const About: React.FC = () => <h1>Hola Mundo 2</h1>;
const Services: React.FC = () => <h1>Hola Mundo 3</h1>;
const Contact: React.FC = () => <h1>Hola Mundo 4</h1>;

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
