// EditUserForm.tsx
import React, { FC } from 'react';
import './editUserForm.css'

type EditUserFormProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  rut: string;
  setRut: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
};

const EditUserForm: FC<EditUserFormProps> = ({
  name, setName, rut, setRut, email, setEmail, password, setPassword,
  address, setAddress, phone, setPhone, role, setRole, handleSubmit
}) => {
  return (
    <div className="edit-user-form">
      <h3>Editar Usuario</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <label htmlFor="rut">RUT</label>
        <input
          type="text"
          id="rut"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          className="input-field"
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="centrar-pass"
        />

        <label htmlFor="address">Dirección</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-field"
        />

        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />

        <label htmlFor="role">Rol</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="centrar-select"
        >
          <option value="directiva">Directiva</option>
          <option value="vecino">Vecino</option>
        </select>

        <button type="submit" className="update-button">Actualizar Usuario</button>
      </form>
    </div>
  );
};

export default EditUserForm;
