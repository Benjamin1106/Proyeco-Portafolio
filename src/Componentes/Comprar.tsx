import { useState } from 'react';
import './Styles/Comprar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

const Comprar = () => {
  const productos = [
    {
      id: 1,
      nombre: 'Certificado de Residencia',
      descripcion: 'Documento oficial para validar tu residencia.',
      precio: 2000,
      imagen: 'favicon.ico',
    },
    {
      id: 2,
      nombre: 'Solicitud de plaza o cancha',
      descripcion: 'Reserva de espacios comunitarios.',
      precio: 5000,
      imagen: 'favicon.ico',
    },
  ];

  const [carrito, setCarrito] = useState<{ id: number; nombre: string; precio: number; cantidad: number }[]>([]);

  const navigate = useNavigate();  // Usar el hook useNavigate

  const agregarAlCarrito = (producto: { id: number; nombre: string; precio: number }) => {
    if (!carrito.some((item) => item.id === producto.id)) {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // Función para manejar el pago y redirigir a WebPay
  const handlePagar = () => {
    navigate('/webpay');  // Redirigir a la ruta "/webpay"
  };

  return (
    <div className="comprar-container">
      <h1 className="titulo">Productos Disponibles</h1>
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
            <h2 className="producto-nombre">{producto.nombre}</h2>
            <p className="producto-descripcion">{producto.descripcion}</p>
            <p className="producto-precio">${producto.precio}</p>
            <button className="btn-agregar" onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>

      {carrito.length > 0 && (
        <div className="carrito-lateral">
          <h2 className="carrito-titulo">Carrito</h2>
          <ul className="carrito-lista">
            {carrito.map((item) => (
              <li key={item.id} className="carrito-item">
                <div className="carrito-imagen">
                  <FaShoppingCart size={24} color="#4CAF50" />
                </div>
                <div>
                  <p>{item.nombre}</p>
                  <p>
                    ${item.precio} x {item.cantidad}
                  </p>
                </div>
                <button className="btn-eliminar" onClick={() => eliminarDelCarrito(item.id)}>
                  🗑️
                </button>
              </li>
            ))}
          </ul>
          <div className="carrito-total">
            <p>Total: ${totalCarrito}</p>
          </div>
          <button className="btn-pagar" onClick={handlePagar}>
            Ir a Pagar
          </button>
        </div>
      )}
    </div>
  );
};

export default Comprar;
