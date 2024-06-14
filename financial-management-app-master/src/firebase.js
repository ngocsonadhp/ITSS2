import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCWLYfP4M5FRV3g7WQkjqEWKeQnN1Lm1_8",
  authDomain: "financial-management-app-da8ed.firebaseapp.com",
  projectId: "financial-management-app-da8ed",
  storageBucket: "financial-management-app-da8ed.appspot.com",
  messagingSenderId: "48320016634",
  appId: "1:48320016634:web:3523dccec2f4e98e4fd943",
});

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
