// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeWcXT8iSBU06O0UvICl9XlxzFBWS6ksA",
  authDomain: "gerador-de-senha-51a0c.firebaseapp.com",
  projectId: "gerador-de-senha-51a0c",
  storageBucket: "gerador-de-senha-51a0c.appspot.com",
  messagingSenderId: "172358556504",
  appId: "1:172358556504:web:1331a44ce1f567485ae32d"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa serviços
const firestore = getFirestore(app);
const auth = getAuth(app);

// Exporta os serviços para uso em outras partes do app
export { app, firestore, auth };
