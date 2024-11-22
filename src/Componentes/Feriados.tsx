import { useState, useEffect } from 'react';
import { feriados } from '../../public/feriadosData'; // Asegúrate de que la ruta sea correcta.
import './Styles/Feriados.css';

interface Ley {
    nombre: string;
    url: string;
}

interface Feriado {
    nombre: string;
    comentarios: string | null;
    fecha: string;
    irrenunciable: string;
    tipo: string;
    leyes?: Ley[];
}

const Feriados = () => {
    const [feriadosState, setFeriadosState] = useState<Feriado[]>([]);

    // Función para formatear la fecha en formato dd/mm/yyyy, sumando 1 día
    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        date.setDate(date.getDate() + 1); // Sumar 1 día
        return date.toLocaleDateString('es-CL'); // Formato dd/mm/yyyy
    };

    useEffect(() => {
        // Desplazarse al principio de la página cuando el componente se monta
        window.scrollTo(0, 0); // Esto desplazará la página al principio (top 0)

        // Obtener el año actual
        const currentYear = new Date().getFullYear();

        // Filtrar los feriados que corresponden al año actual
        const feriadosDelAño = feriados.filter(feriado => {
            const feriadoYear = new Date(feriado.fecha).getFullYear();
            return feriadoYear === currentYear;
        });

        setFeriadosState(feriadosDelAño); // Establecer el estado con los feriados del año actual
    }, []); // El array vacío [] asegura que esto solo se ejecute una vez cuando el componente se monte.

    return (
        <div style={{ padding: '20px' }}>
            <h1>Feriados del Año {new Date().getFullYear()}</h1>
            {feriadosState.length > 0 ? (
                <table className="tabla-feriados">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Irrenunciable</th>
                            <th>Comentarios</th>
                            <th>Leyes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feriadosState.map((feriado, index) => (
                            <tr key={index}>
                                <td>{feriado.nombre}</td>
                                <td>{formatearFecha(feriado.fecha)}</td>
                                <td>{feriado.tipo}</td>
                                <td>{feriado.irrenunciable === '1' ? 'Sí' : 'No'}</td>
                                <td>{feriado.comentarios || 'N/A'}</td>
                                <td>
                                    {feriado.leyes && feriado.leyes.length > 0 ? (
                                        <ul>
                                            {feriado.leyes.map((ley, i) => (
                                                <li key={i}>
                                                    <a href={ley.url} target="_blank" rel="noopener noreferrer">
                                                        {ley.nombre}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'No aplica'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay feriados disponibles para este año.</p>
            )}
        </div>
    );
};

export default Feriados;
