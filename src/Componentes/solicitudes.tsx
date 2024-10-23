import React from 'react';
import TipoSolicitud from './tipoSolicitud.tsx';

const FormularioSolicitudes: React.FC = () => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Solicitud enviada con éxito!');
  };

  return (
    <div>
      <h1>Solicitudes</h1>
      <form onSubmit={handleSubmit}>
        <TipoSolicitud /> {/* Usamos la directiva aquí */}
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default FormularioSolicitudes;
