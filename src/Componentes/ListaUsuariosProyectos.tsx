import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './Styles/ListaUsuariosProyectos.css';

interface Usuario {
  id: string;
  email: string;
  name: string;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
}

interface ProyectoVecinal {
  id: string;
  titulo: string;
}

const ListaUsuariosProyectos: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [proyectos, setProyectos] = useState<ProyectoVecinal[]>([]);
  const [selectedProyecto, setSelectedProyecto] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'proyectosVecinales'));
        const proyectosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          titulo: doc.data().titulo,
        })) as ProyectoVecinal[];
        setProyectos(proyectosData);
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  useEffect(() => {
    if (!selectedProyecto) return;

    const fetchUsuarios = async () => {
      try {
        const participantesRef = collection(db, `proyectosVecinales/${selectedProyecto}/participantes`);
        const querySnapshot = await getDocs(participantesRef);
        const usuariosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Usuario[];
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [selectedProyecto]);

  const handleEstadoChange = async (usuarioId: string, nuevoEstado: 'aceptado' | 'rechazado') => {
    try {
      const usuarioRef = doc(db, `proyectosVecinales/${selectedProyecto}/participantes`, usuarioId);
      await updateDoc(usuarioRef, { estado: nuevoEstado });

      setUsuarios(prev =>
        prev.map(usuario =>
          usuario.id === usuarioId ? { ...usuario, estado: nuevoEstado } : usuario
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const handleEliminarUsuario = async (usuarioId: string) => {
    try {
      const usuarioRef = doc(db, `proyectosVecinales/${selectedProyecto}/participantes`, usuarioId);
      await deleteDoc(usuarioRef);

      setUsuarios(prev => prev.filter(usuario => usuario.id !== usuarioId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="lista-usuarios-proyectos">
      <h2>Gestión de Usuarios por Proyecto</h2>
      <div className="proyectos-selector">
        <label htmlFor="proyectos">Selecciona un proyecto:</label>
        <select
          id="proyectos"
          value={selectedProyecto || ''}
          onChange={e => setSelectedProyecto(e.target.value)}
        >
          <option value="" disabled>
            Selecciona un proyecto
          </option>
          {proyectos.map(proyecto => (
            <option key={proyecto.id} value={proyecto.id}>
              {proyecto.titulo}
            </option>
          ))}
        </select>
      </div>

      {selectedProyecto && (
        <div className="usuarios-lista">
          {usuarios.length > 0 ? (
            usuarios.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <p><strong>Nombre:</strong> {usuario.name}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Estado:</strong> {usuario.estado}</p>
                <div className="acciones">
                  <button
                    className="aceptar-button"
                    onClick={() => handleEstadoChange(usuario.id, 'aceptado')}
                    disabled={usuario.estado === 'aceptado'}
                  >
                    Aceptar
                  </button>
                  <button
                    className="rechazar-button"
                    onClick={() => handleEstadoChange(usuario.id, 'rechazado')}
                    disabled={usuario.estado === 'rechazado'}
                  >
                    Rechazar
                  </button>
                  <button className="eliminar-button" onClick={() => handleEliminarUsuario(usuario.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay usuarios inscritos en este proyecto.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaUsuariosProyectos;
