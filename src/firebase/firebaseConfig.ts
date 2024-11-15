import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSNuhyl2g56W6AbpdVZOEcH33twrpUiE0",
  authDomain: "proyecto-de-titulo-e4070.firebaseapp.com",
  projectId: "proyecto-de-titulo-e4070",
  storageBucket: "proyecto-de-titulo-e4070.appspot.com",
  messagingSenderId: "792762932008",
  appId: "1:792762932008:web:135a10e5c85e04f0020e1d",
  measurementId: "G-FN5CE2V6BE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

const analytics = getAnalytics(app);

// Exportar la instancia de Firestore
export { db };
