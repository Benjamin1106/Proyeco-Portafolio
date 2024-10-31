// modal.tsx
import React from 'react';
import './modal.css'; // Asegúrate de tener estilos para el modal

interface ModalProps {
  isOpen: boolean; // Añadir esta propiedad
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null; // No renderizar el modal si no está abierto

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Mensaje</h2>
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
