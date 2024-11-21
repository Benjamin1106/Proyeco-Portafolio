import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Importa los componentes de Material-UI
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const SolicitudesGrafico: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTipo, setSelectedTipo] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "solicitudes"),
      (snapshot) => {
        const solicitudesData = snapshot.docs.map((doc) => doc.data());
        setSolicitudes(solicitudesData);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtrar las solicitudes para que solo se muestren las del año 2024
  const solicitudes2024 = solicitudes.filter((solicitud) => {
    const fecha = solicitud.fechaEmision.toDate();
    return fecha.getFullYear() === 2024;
  });

  // Agrupar solicitudes por mes y tipo
  const solicitudesPorMesYTipo = solicitudes2024.reduce((acc: Record<string, Record<string, number>>, solicitud) => {
    const fecha = solicitud.fechaEmision.toDate();
    const mes = `${fecha.getMonth() + 1}-${fecha.getFullYear()}`; // MM-YYYY
    const tipo = solicitud.tipoSolicitud;

    if (!acc[mes]) {
      acc[mes] = {};
    }

    if (!acc[mes][tipo]) {
      acc[mes][tipo] = 0;
    }

    acc[mes][tipo] += 1; // Contamos las solicitudes por tipo en cada mes
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Convertir mes MM-YYYY a nombre de mes (enero, febrero, etc.)
  const mesesNombre: Record<string, string> = {
    "1": "Enero",
    "2": "Febrero",
    "3": "Marzo",
    "4": "Abril",
    "5": "Mayo",
    "6": "Junio",
    "7": "Julio",
    "8": "Agosto",
    "9": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  };

  // Preparar los datos para el gráfico
  const data = Object.keys(solicitudesPorMesYTipo).map((mes) => {
    const mesName = mesesNombre[mes.split("-")[0] as keyof typeof mesesNombre]; // Aseguramos que la clave sea un número
    
    // Usamos reduce para contar las solicitudes de todos los tipos para cada mes
    const cantidad = selectedTipo 
      ? solicitudesPorMesYTipo[mes][selectedTipo] || 0
      : Object.values(solicitudesPorMesYTipo[mes]).reduce((acc: number, val: number) => acc + val, 0); // Se especifica el tipo de 'acc' como 'number'
  
    return {
      mes: mesName,
      cantidad,
    };
  });

  // Obtener los tipos únicos de solicitud
  const tiposSolicitudes = Array.from(new Set(solicitudes2024.map((solicitud) => solicitud.tipoSolicitud)));

  if (isLoading) return <div>Loading...</div>;

  // Manejador de cambio de tipo de solicitud
  const handleTipoChange = (e: SelectChangeEvent<string>) => {
    setSelectedTipo(e.target.value);
  };

  return (
    <div>
      <h2>Gráfico de Solicitudes por Mes</h2>

      {/* Filtro para seleccionar el tipo de solicitud */}
      <FormControl fullWidth>
        <InputLabel>Tipo de Solicitud</InputLabel>
        <Select
          value={selectedTipo}
          onChange={handleTipoChange}  // Usamos el manejador de cambio con el tipo definido
          label="Tipo de Solicitud"
        >
          <MenuItem value="">Todos</MenuItem>
          {tiposSolicitudes.map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cantidad" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolicitudesGrafico;
