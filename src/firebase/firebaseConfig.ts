import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSNuhyl2g56W6AbpdVZOEcH33twrpUiE0",
  authDomain: "proyecto-de-titulo-e4070.firebaseapp.com",
  projectId: "proyecto-de-titulo-e4070",
  storageBucket: "proyecto-de-titulo-e4070.appspot.com",
  messagingSenderId: "792762932008",
  appId: "1:792762932008:web:135a10e5c85e04f0020e1d",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar la instancia de Firestore
export { db };
