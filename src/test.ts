import {useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const pruebaFirestore = async () => {
  try {
    await addDoc(collection(db, 'testCollection'), { campoPrueba: 'valorPrueba' });
    console.log('¡Documento de prueba agregado!');
  } catch (error) {
    console.error('Error al agregar documento de prueba:', error);
  }
};

useEffect(() => {
  pruebaFirestore();
}, []);
