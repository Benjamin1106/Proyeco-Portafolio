import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaShoppingCart, FaChartBar } from 'react-icons/fa';
import './Styles/navbar.css';
import logo from '../img/imglogo.png';
import Login from './login';

type NavbarProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated, role, setRole }) => {
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    const savedUserName = localStorage.getItem('userNombre');

    if (savedRole && savedAuthStatus === 'true') {
      setIsAuthenticated(true);
      setRole(savedRole);
      setUserName(savedUserName);
    } else {
      setIsAuthenticated(false);
      setRole('vecino');
    }
  }, [setIsAuthenticated, setRole]);

  const toggleMenu = useCallback(() => setIsActive((prevState) => !prevState), []);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleLogin = useCallback(
    (userData: { role: string; rut: string; name: string; email: string; address: string; phone: string }) => {
      setIsAuthenticated(true);
      setRole(userData.role);
      setUserName(userData.name);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userNombre', userData.name);
      closeModal();
    },
    [setIsAuthenticated, setRole, closeModal]
  );

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setRole('vecino');
    setUserName(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userNombre');
  }, [setIsAuthenticated, setRole]);

  // Calculamos el número de enlaces en el menú
  const getMenuItemsCount = () => {
    let count = 3; // Siempre hay al menos 3 enlaces por defecto

    // Agregar elementos adicionales dependiendo de si está autenticado o no
    if (isAuthenticated) {
      count += role === 'directiva'
        ? 5 // Si es directiva, se muestran 5 enlaces más
        : 3; // Si es vecino, se muestran 3 enlaces más
    }

    return count;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo Junta de Vecinos" className="logo-image" />
          Junta de Vecinos
        </Link>

        {getMenuItemsCount() > 3 && (
          <div className="menu-icon" onClick={toggleMenu}>
            &#9776;
          </div>
        )}

        <ul className={`nav-menu ${isActive ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={toggleMenu}>Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/noticias" className="nav-links" onClick={toggleMenu}>Noticias</Link>
          </li>
          {role !== 'directiva' && (
            <li className="nav-item">
              <Link to="/contacto" className="nav-links" onClick={toggleMenu}>Contacto</Link>
            </li>
          )}
          {isAuthenticated && (
            <>
              {role === 'directiva' && (
                <>
                  <li className="nav-item">
                    <Link to="/crearActividades" className="nav-links" onClick={toggleMenu}>Crear</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/lup" className="nav-links" onClick={toggleMenu}>Lup</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/usersList" className="nav-links" onClick={toggleMenu}>Usuarios</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/grafico" className="nav-links" onClick={toggleMenu}><FaChartBar /></Link>
                  </li>

                </>
              )}
              {role === 'vecino' && (
                <>
                  <li className="nav-item">
                    <Link to="/solicitudes" className="nav-links" onClick={toggleMenu}>Solicitudes</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/actividades" className="nav-links" onClick={toggleMenu}>Participa</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/videos" className="nav-links" onClick={toggleMenu}>Videos Tutoriales</Link>
                  </li>
                </>
              )}
            </>
          )}
          {isAuthenticated && (
            <li className="nav-item user-name">
              Usuario: {userName}
            </li>
          )}
          <div className="navbar-button-container">
            {isAuthenticated ? (
              <button className="navbar-button-logout" onClick={handleLogout}>
                <FaSignOutAlt className="navbar-icon" />Salir
              </button>
            ) : (
              <button className="navbar-button" onClick={openModal}>
                <FaSignInAlt className="navbar-icon" />Ingresa
              </button>
            )}
          </div>
        </ul>
      </div>
      <Login isOpen={isModalOpen} onClose={closeModal} onLogin={handleLogin} />
    </nav>
  );
};

export default Navbar;
