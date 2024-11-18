import React, { useEffect, useState } from 'react';
import './Galeria.css';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Galeria: React.FC = () => {
  const activities = [
    {
      id: "manualidades",
      title: "Taller de Manualidades",
      description: "Vecinas aprenden a crear decoraciones con materiales reciclados. Ideal para todas las edades.",
      images: ["./src/img/manualidades1.jpg", "./src/img/manualidades2.jpg"],
    },
    {
      id: "limpieza",
      title: "Jornada de Limpieza Comunal",
      description: "Unimos fuerzas para mantener nuestras plazas y calles limpias y verdes.",
      images: ["./src/img/limpieza1.jpg"],
    },
    {
      id: "cocina",
      title: "Clase de Cocina Saludable",
      description: "Descubre recetas nutritivas y fáciles de preparar para toda la familia, en especial para los mas pequeños.",
      images: ["./src/img/cocina1.jpg", "./src/img/cocina2.jpg"],
    },
    {
      id: "futbol",
      title: "Campeonato de Fútbol Infantil",
      description: "Fomenta el deporte y la diversión en nuestros niños y jóvenes.",
      images: ["./src/img/futbol1.jpg"],
    },
    {
      id: "cine",
      title: "Cine al Aire Libre",
      description: "Disfrutamos de películas familiares bajo las estrellas en nuestra plaza central.",
      images: ["./src/img/cine1.jpg", "./src/img/cine2.jpg"],
    },
  ];

  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [dislikes, setDislikes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      const data: { [key: string]: { likes: number; dislikes: number } } = {};
      for (const activity of activities) {
        const docRef = doc(db, "activities", activity.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          data[activity.id] = docSnap.data() as { likes: number; dislikes: number };
        } else {
          await setDoc(docRef, { likes: 0, dislikes: 0 });
          data[activity.id] = { likes: 0, dislikes: 0 };
        }
      }
      setLikes(Object.fromEntries(Object.entries(data).map(([id, val]) => [id, val.likes])));
      setDislikes(Object.fromEntries(Object.entries(data).map(([id, val]) => [id, val.dislikes])));
    };

    fetchData();
  }, []);

  const updateCounts = async (id: string, field: "likes" | "dislikes") => {
    const docRef = doc(db, "activities", id);
    const newValue = field === "likes" ? likes[id] + 1 : dislikes[id] + 1;

    await updateDoc(docRef, { [field]: newValue });

    if (field === "likes") {
      setLikes({ ...likes, [id]: newValue });
    } else {
      setDislikes({ ...dislikes, [id]: newValue });
    }
  };

  return (
    <div className="galeria-container">
      <h1 className="galeria-title">Galería de Actividades</h1>
      {activities.map((activity) => (
        <div key={activity.id} className="galeria-section">
          <h2 className="galeria-activity-title">{activity.title}</h2>
          <p className="galeria-activity-description">{activity.description}</p>
          <div className="galeria-images">
            {activity.images.map((src, index) => (
              <img key={index} src={src} alt={activity.title} className="galeria-image" />
            ))}
          </div>
          <div className="galeria-buttons">
            <button className="like-button" onClick={() => updateCounts(activity.id, "likes")}>
              👍 Me Gusta ({likes[activity.id] || 0})
            </button>
            <button className="dislike-button" onClick={() => updateCounts(activity.id, "dislikes")}>
              👎 No Me Gusta ({dislikes[activity.id] || 0})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Galeria;
