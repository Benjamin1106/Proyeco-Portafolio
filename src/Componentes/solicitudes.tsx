import React, { useState } from 'react';
import { db } from '../firebaseConfig'
import './solicitudes.css';

// Define tipos de datos
interface FormData {
  nombre: string;
  apellido: string;
  rut: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoSolicitud: string;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  datosCertificado?: string;
  archivoUrl?: string | null;
}

const Solicitudes: React.FC = () => {
  // Estados para el formulario
  const [nombre, setNombre] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [rut, setRut] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [tipoSolicitud, setTipoSolicitud] = useState<string>('cancha');
  const [horaInicio, setHoraInicio] = useState<string>('');
  const [horaFin, setHoraFin] = useState<string>('');
  const [datosCertificado, setDatosCertificado] = useState<string>('');
  const [fecha, setFecha] = useState<string>('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Función para manejar el envío de la solicitud
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: FormData = {
      nombre,
      apellido,
      rut,
      direccion,
      telefono,
      correo,
      tipoSolicitud,
      fecha: tipoSolicitud !== 'certificadoResidencia' ? fecha : undefined,
      horaInicio: tipoSolicitud !== 'certificadoResidencia' ? horaInicio : undefined,
      horaFin: tipoSolicitud !== 'certificadoResidencia' ? horaFin : undefined,
      datosCertificado: tipoSolicitud === 'certificadoResidencia' ? datosCertificado : undefined,
      archivoUrl: archivo ? URL.createObjectURL(archivo) : null,
    };

    try {
      // Detecta la colección adecuada
      if (tipoSolicitud === 'certificadoResidencia') {
        await db.collection('certificadoResidencia').add(data);
      } else {
        await db.collection('solicitudes').add(data);
      }
      console.log('Solicitud enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };

  return (
    <div className="container">
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombres:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <label>Apellidos:</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <label>Rut:</label>
        <input
          type="text"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          required
        />
        <label>Dirección:</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
        <label>Teléfono:</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <label>Correo Electrónico:</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <label>Tipo de Solicitud:</label>
        <select
          value={tipoSolicitud}
          onChange={(e) => setTipoSolicitud(e.target.value)}
          required
        >
          <option value="cancha">Cancha</option>
          <option value="salas">Salas</option>
          <option value="plazas">Plazas</option>
          <option value="certificadoResidencia">Certificado de Residencia</option>
        </select>

        {tipoSolicitud !== 'certificadoResidencia' && (
          <div>
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={today}
              required
            />
            <label>Desde:</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
            <label>Hasta:</label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
          </div>
        )}

        {tipoSolicitud === 'certificadoResidencia' && (
          <div>
            <label>Razón:</label>
            <input
              type="text"
              value={datosCertificado}
              onChange={(e) => setDatosCertificado(e.target.value)}
              required
            />
            <label>Adjuntar Archivo:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  setArchivo(e.target.files[0]);
                }
              }}
              required
            />
          </div>
        )}
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default Solicitudes;
