import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/navbar';
import FormularioSolicitudes from './Componentes/solicitudes';
import Home from './Componentes/home';
import Footer from './Componentes/footer';
import CrearActividades from './Componentes/crearActividades';
import Contacto from './Componentes/contacto';
import Actividades from './Componentes/actividades';
import Videos from './Componentes/videos';
import Register from './Componentes/register';
import UsersList from './Componentes/usersList';
import ProtectedRoute from './Componentes/protectedRoute';
import PendingUsersList from './Componentes/pendingUsersList';
import NewsComponent from './Componentes/noticias';
import Chatbot from './Componentes/Chatbot';  // Importa el componente Chatbot

const NotFound: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0099ff',
    color: '#fff',
    textAlign: 'center'
  }}>
    <h1 style={{ fontSize: '10rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '2rem' }}>Oops. Nothing here...</p>
    <button 
      style={{
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#0099ff',
        backgroundColor: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
      onClick={() => window.location.href = '/'}>Go Home</button>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string>('vecino');

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} role={role} setRole={setRole} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/register" element={<Register />} />
        <Route path="/noticias" element={<NewsComponent />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/solicitudes" element={<FormularioSolicitudes />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/crearActividades" element={<CrearActividades />} />
          <Route path="/usersList" element={<UsersList />} />
          <Route path="/pending" element={<PendingUsersList />} />
        </Route>

        {/* Ruta para capturar todas las rutas no existentes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Chatbot /> {/* Aquí agregas el componente del chatbot flotante */}
      <Footer />
    </Router>
  );
};

export default App;
