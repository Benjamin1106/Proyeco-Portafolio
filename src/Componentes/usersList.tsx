import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import EditUserForm from './editUserForm'; // Importamos el componente de formulario
import './Styles/usersList.css';

// Componente para mostrar y editar usuarios
const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');

  // Obtener usuarios de Firestore
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usersData: any[] = [];
    querySnapshot.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    setUsers(usersData);
  };

  // Obtener datos del usuario seleccionado para edición
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setName(user.name);
    setRut(user.rut);
    setEmail(user.email);
    setPassword(user.password);
    setAddress(user.address);
    setPhone(user.phone);
    setRole(user.role);
  };

  // Actualizar los datos del usuario en Firestore
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        name,
        rut,
        email,
        password,
        address,
        phone,
        role,
      });
      // Actualizamos la lista de usuarios después de editar
      getUsers();
      // Limpiamos el formulario y la selección
      setSelectedUser(null);
      setName('');
      setRut('');
      setEmail('');
      setPassword('');
      setAddress('');
      setPhone('');
      setRole('');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    // Actualizamos la lista de usuarios después de eliminar
    getUsers();
  };

  // Cargar los usuarios cuando el componente se monta
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2>Lista de Usuarios</h2>

      {/* Tabla de usuarios */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.rut}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleSelectUser(user)} className="edit-btn">Editar</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Formulario de edición de usuario */}
      {selectedUser && (
        <EditUserForm
          name={name} setName={setName}
          rut={rut} setRut={setRut}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          address={address} setAddress={setAddress}
          phone={phone} setPhone={setPhone}
          role={role} setRole={setRole}
          handleSubmit={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserList;
