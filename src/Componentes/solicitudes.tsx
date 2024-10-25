import React, { useState } from 'react';
import './solicitudes.css';

const Solicitudes: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('cancha');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [datosCertificado, setDatosCertificado] = useState('');
  const [fecha, setFecha] = useState('');
  const [archivo, setArchivo] = useState<File | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido)
    formData.append('rut', rut);
    formData.append('direccion', direccion);
    formData.append('telefono', telefono);
    formData.append('correo', correo);
    formData.append('tipoSolicitud', tipoSolicitud);

    if (tipoSolicitud !== 'certificadoResidencia') {
      formData.append('fecha', fecha);
      formData.append('horaInicio', horaInicio);
      formData.append('horaFin', horaFin);
    } else {
      formData.append('datosCertificado', datosCertificado);
      if (archivo) {
        formData.append('archivo', archivo);
      }
    }

    console.log('Datos enviados:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
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
          onChange={(e) => {
            setTipoSolicitud(e.target.value);
            setHoraInicio('');
            setHoraFin('');
            setDatosCertificado('');
            setFecha('');
            setArchivo(null);
          }}
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
          </div>
        )}

        {tipoSolicitud !== 'certificadoResidencia' && (
          <div>
            <h3>Horarios de Uso</h3>
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
            <h3>Datos para Certificado de Residencia</h3>
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
