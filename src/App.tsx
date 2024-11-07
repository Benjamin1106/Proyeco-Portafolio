import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Componentes/navbar';
import FormularioSolicitudes from './Componentes/solicitudes';
import Home from './Componentes/home';
import Footer from './Componentes/footer';
import CrearActividades from './Componentes/crearActividades';
import Contacto from './Componentes/contacto';
import Actividades from './Componentes/actividades';
import Videos from './Componentes/videos'; // Asegúrate de que este componente exista
import Register from './Componentes/register';
import UserList from './Componentes/usersList';

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
      onClick={() => window.location.href = '/'}
    >
      Go Home
    </button>
  </div>
);

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isNotFoundPage = location.pathname !== '/' && 
                          location.pathname !== '/solicitudes' && 
                          location.pathname !== '/actividades' && 
                          location.pathname !== '/videos' && 
                          location.pathname !== '/contacto' && 
                          location.pathname !== '/crearActividades' &&
                          location.pathname !== '/register' &&
                          location.pathname !== '/userList';

  return (
    <>
      {!isNotFoundPage && <Navbar />}
      {children}
      {!isNotFoundPage && <Footer />}
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solicitudes" element={<FormularioSolicitudes />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/crearActividades" element={<CrearActividades />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userList" element={<UserList />} />
          {/* Ruta para capturar todas las rutas no existentes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
