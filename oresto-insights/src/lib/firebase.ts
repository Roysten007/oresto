import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_8rpN4ESzDadZy3J6EmxZAVXObMc0ajc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oresto-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oresto-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oresto-connect.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376486896309",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376486896309:web:57acaccb64e052614114fc",
  databaseURL: "https://oresto-connect-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
