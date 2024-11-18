import React, { useState, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import './Styles/modal.css';

interface ModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      generatePdf(message);
    } else {
      setPdfUrl(null); // Clear PDF URL when modal is closed
    }
  }, [isOpen, message]);

  const generatePdf = async (message: string) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 24;

    page.drawText('Mensaje en PDF', {
      x: 50,
      y: 350,
      size: fontSize,
      font,
      color: rgb(0, 0.53, 0.71),
    });

    page.drawText(message, {
      x: 50,
      y: 300,
      size: fontSize - 10,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Mensaje</h2>
        <p>{message}</p>
        {pdfUrl && (
          <a href={pdfUrl} download="certificado_Solicitud.pdf">
            <button>Descargar PDF</button>
            <h1></h1>
          </a>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
