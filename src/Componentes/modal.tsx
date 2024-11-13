import React from 'react';
import './modal.css';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;  // Cambié esto de 'setIsModalOpen' a 'onClose'
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;  // Si no está abierto, no se renderiza

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
