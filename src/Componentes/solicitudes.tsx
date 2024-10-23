import React, { useState } from 'react';
import './solicitudes.css';

const Solicitudes: React.FC = () => {
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [tipoSolicitud, setTipoSolicitud] = useState('cancha'); // Estado para el tipo de solicitud
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [datosCertificado, setDatosCertificado] = useState('');
  const [fecha, setFecha] = useState(''); // Estado para la fecha

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h1>Solicitudes</h1>
      <form>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Tipo de Solicitud:</label>
        <select
          value={tipoSolicitud}
          onChange={(e) => {
            setTipoSolicitud(e.target.value);
            // Limpiar los campos de horas y datos cuando se cambia el tipo
            setHoraInicio('');
            setHoraFin('');
            setDatosCertificado('');
            setFecha(''); // Resetear fecha al cambiar tipo
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
              min={today} // Establecer la fecha mínima como hoy
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
          </div>
        )}

        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default Solicitudes;
