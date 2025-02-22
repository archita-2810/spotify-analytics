import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAie_KfIKjHsb3p7rrsXHo8X7Kc5qhtnzQ",
  authDomain: "spotify-analytics28.firebaseapp.com",
  projectId: "spotify-analytics28",
  storageBucket: "spotify-analytics28.firebasestorage.app",
  messagingSenderId: "939091667494",
  appId: "1:939091667494:web:4315069ffff3d2b95f14e7",
  measurementId: "G-5DBESY7MZZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };