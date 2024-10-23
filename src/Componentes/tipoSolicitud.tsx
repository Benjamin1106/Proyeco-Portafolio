import React, { useState } from 'react';

const TipoSolicitud: React.FC = () => {
  const [tipoSolicitud, setTipoSolicitud] = useState('cancha'); // Estado para el tipo de solicitud
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [datosCertificado, setDatosCertificado] = useState('');
  const [fecha, setFecha] = useState(''); // Estado para la fecha

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Solicitud enviada con éxito!\nTipo de Solicitud: ${tipoSolicitud}\nFecha: ${fecha}`);
    // Aquí podrías manejar el envío de datos según el tipo de solicitud
  };

  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
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

      {/* Campo de fecha con validación para no permitir fechas anteriores a hoy */}
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
    </div>
  );
};

export default TipoSolicitud;
