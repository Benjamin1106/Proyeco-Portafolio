import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import emailjs from "emailjs-com";
import "./Styles/crearActividades.css";

const CrearActividades: React.FC = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [cupos, setCupos] = useState<number>(0);
  const [tipo, setTipo] = useState<string>("actividad");
  const [mensaje, setMensaje] = useState<string>("");
  const [users, setUsers] = useState<{ email: string; nombre: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cargar usuarios (email y nombre) desde Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          email: doc.data().email as string,
          nombre: doc.data().name as string, // Asegúrate de que 'nombre' esté en tu base de datos
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  // Función para enviar notificaciones por correo utilizando emailjs
  const enviarNotificacion = async (
    subject: string,
    tipo: string,
    titulo: string,
    descripcion: string
  ) => {
    if (users.length === 0) {
      console.warn("No hay usuarios registrados para enviar notificaciones.");
      return;
    }

    try {
      const sendEmailPromises = users.map((user) => {
        const templateParams = {
          subject,
          tipo,
          titulo,
          descripcion,
          nombre_usuario: user.nombre, 
          to_email: user.email,
        };

        return emailjs.send(
          "service_p2op1eu", // Reemplaza con tu Service ID
          "template_avzxkrf", // Reemplaza con tu Template ID
          templateParams,
          "xDYQGP5qWmrQPxol7" // Reemplaza con tu Public Key
        );
      });

      await Promise.all(sendEmailPromises);
      console.log("Todos los correos han sido enviados.");
    } catch (error) {
      console.error("Error al enviar notificaciones:", error);
    }
  };

  // Función para crear una nueva actividad o proyecto
  const crearActividad = async () => {
    if (titulo.trim() && descripcion.trim() && (tipo === "proyectoVecinal" || cupos > 0)) {
      try {
        let fotoURL = "";

        const file = fileInputRef.current?.files?.[0];
        if (file) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 300,
            useWebWorker: true,
          };

          const compressedFile = await imageCompression(file, options);
          const storage = getStorage();
          const uniqueFileName = `${Date.now()}_${file.name}`;
          const fotoRef = ref(storage, `uploads/${uniqueFileName}`);
          await uploadBytes(fotoRef, compressedFile);
          fotoURL = await getDownloadURL(fotoRef);
        }

        const collectionName = tipo === "actividad" ? "actividades" : "proyectosVecinales";

        await addDoc(collection(db, collectionName), {
          titulo,
          descripcion,
          tipo,
          fotoURL,
          inscritos: [],
          ...(tipo === "actividad" && { cupos }),
        });

        const subject = tipo === "actividad" ? "Nueva Actividad Creada" : "Nuevo Proyecto Vecinal";

        // Enviar notificación a los usuarios con los datos completos
        await enviarNotificacion(subject, tipo, titulo, descripcion);

        // Limpiar formulario
        setTitulo("");
        setDescripcion("");
        setCupos(0);
        setTipo("actividad");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setMensaje(`${tipo === "actividad" ? "Actividad" : "Proyecto Vecinal"} creado exitosamente!`);
      } catch (error) {
        console.error("Error al crear la actividad:", error);
        setMensaje("Error al crear la actividad. Por favor intenta nuevamente.");
      }
    } else {
      setMensaje(
        "Por favor, completa todos los campos y asegúrate de que los cupos sean mayores a 0 cuando sea necesario."
      );
    }

    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="actividad-container">
      <h2 className="actividad-title">Crear Nueva Actividad o Proyecto Vecinal</h2>
      {mensaje && <div className="alert">{mensaje}</div>}

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="actividad-select"
      >
        <option value="actividad">Actividad</option>
        <option value="proyectoVecinal">Proyecto Vecinal</option>
      </select>

      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
        className="actividad-input"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
        className="actividad-textarea"
      />

      {tipo === "actividad" && (
        <input
          type="number"
          value={cupos}
          onChange={(e) => setCupos(Number(e.target.value))}
          placeholder="Cantidad de cupos"
          className="actividad-input"
          min={1}
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="actividad-file-input"
      />

      <button onClick={crearActividad} className="actividad-button">
        Crear
      </button>
    </div>
  );
};

export default CrearActividades;
