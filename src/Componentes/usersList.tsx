import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // Biblioteca para crear el PDF
import "moment/locale/es";
import "./solicitudes.css";
import Modal from "./modal";

interface FormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoSolicitud: string;
  datosCertificado?: string;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
}

const Solicitudes: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    rut: "",
    direccion: "",
    telefono: "",
    correo: "",
    tipoSolicitud: "",
    datosCertificado: "",
    fechaInicio: null,
    fechaFin: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const savedData = {
      nombre: localStorage.getItem("userNombre") || "",
      rut: localStorage.getItem("userRUT") || "",
      direccion: localStorage.getItem("userDireccion") || "",
      telefono: localStorage.getItem("userFono") || "",
      correo: localStorage.getItem("userCorreo") || "",
    };
    setFormData((prev) => ({ ...prev, ...savedData }));
  }, []);

  const handleTipoSolicitudChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value;
    setFormData((prev) => ({ ...prev, tipoSolicitud: tipo }));

    if (tipo === "certificadoResidencia") {
      // Rellenar los campos automáticamente
      const savedData = {
        nombre: localStorage.getItem("userNombre") || "",
        rut: localStorage.getItem("userRUT") || "",
        direccion: localStorage.getItem("userDireccion") || "",
        correo: localStorage.getItem("userCorreo") || "",
      };
      setFormData((prev) => ({ ...prev, ...savedData }));
    }
  };

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText("Certificado de Residencia", {
      x: 200,
      y: 350,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Nombre: ${formData.nombre}`, { x: 50, y: 300, font, size: 12 });
    page.drawText(`RUT: ${formData.rut}`, { x: 50, y: 280, font, size: 12 });
    page.drawText(`Dirección: ${formData.direccion}`, { x: 50, y: 260, font, size: 12 });
    page.drawText(`Correo: ${formData.correo}`, { x: 50, y: 240, font, size: 12 });
    page.drawText("Este certificado confirma su residencia en la dirección indicada.", {
      x: 50,
      y: 200,
      font,
      size: 12,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CertificadoResidencia.pdf";
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.tipoSolicitud === "certificadoResidencia") {
      await generatePDF(); // Genera y descarga el PDF
    }

    try {
      await addDoc(collection(db, "solicitudes"), formData);
      setModalMessage("Solicitud enviada correctamente.");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage("Error al enviar la solicitud. Intente nuevamente.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <label>Tipo de Solicitud:</label>
        <select
          name="tipoSolicitud"
          value={formData.tipoSolicitud}
          onChange={handleTipoSolicitudChange}
          required
          className="centrar-select"
        >
          <option value="" disabled>
            Seleccione tipo de Solicitud
          </option>
          <option value="cancha">Cancha</option>
          <option value="salas">Salas</option>
          <option value="plazas">Plazas</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
          <option value="certificadoActividades">Certificado de Participación de Actividades</option>
        </select>

        {(formData.tipoSolicitud === "certificadoResidencia") && (
          <div>
            <p>Datos del usuario precargados:</p>
            <p>Nombre: {formData.nombre}</p>
            <p>RUT: {formData.rut}</p>
            <p>Dirección: {formData.direccion}</p>
            <p>Correo: {formData.correo}</p>
          </div>
        )}

        <button type="submit">Enviar Solicitud</button>
      </form>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          message={modalMessage} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Solicitudes;
