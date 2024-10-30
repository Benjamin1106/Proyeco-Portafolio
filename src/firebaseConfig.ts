import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Función para agregar un documento a Firestore
const agregarDocumentoPrueba = async () => {
  try {
    await addDoc(collection(db, 'testCollection'), { campoPrueba: 'valorPrueba' });
    console.log('¡Documento de prueba agregado!');
  } catch (error) {
    console.error('Error al agregar documento de prueba:', error);
  }
};

// Llama a la función al iniciar la aplicación
agregarDocumentoPrueba();

export { db };

