import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import './Styles/pendingUsersList.css';

const PendingUsersList: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);

  const getPendingUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'registro'));
    const usersData: any[] = [];
    querySnapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    setPendingUsers(usersData);
  };

  const acceptUser = async (user: any) => {
    try {
      // Transfer user to 'users' collection and delete from 'registro'
      await addDoc(collection(db, 'users'), {
        name: user.name,
        rut: user.rut,
        email: user.email,
        password: user.password,
        address: user.address,
        phone: user.phone,
        role: user.role,
      });
      await deleteDoc(doc(db, 'registro', user.id));
      getPendingUsers(); // Refresh the list after acceptance
    } catch (error) {
      console.error('Error al aceptar usuario:', error);
    }
  };

  const deleteUser = async (user: any) => {
    try {
      await deleteDoc(doc(db, 'registro', user.id));
      getPendingUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  useEffect(() => {
    getPendingUsers();
  }, []);

  return (
    <div className="pending-users-list">
      <h2>Usuarios Pendientes de Aceptación</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.length > 0 ? (
            pendingUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.rut}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => acceptUser(user)} className="accept-btn">Aceptar</button>
                  <button onClick={() => deleteUser(user)} className="delete-btn">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No hay usuarios pendientes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingUsersList;
