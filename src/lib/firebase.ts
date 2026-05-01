import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_8rpN4ESzDadZy3J6EmxZAVXObMc0ajc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oresto-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oresto-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oresto-connect.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376486896309",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376486896309:web:57acaccb64e052614114fc",
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID, 
  databaseURL: "https://oresto-connect-default-rtdb.firebaseio.com"
};

// Initialize Firebase only if config is present
const isConfigured = !!firebaseConfig.apiKey;

const app = isConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getDatabase(app) : null; // Now using Realtime Database
const storage = app ? getStorage(app) : null;

// Initialize Analytics & Messaging asynchronously
let analytics: ReturnType<typeof getAnalytics> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;


if (app) {
  isAnalyticsSupported().then(supported => {
    if (supported) analytics = getAnalytics(app);
  });
  
  isMessagingSupported().then(supported => {
    if (supported) messaging = getMessaging(app);
  });
}

export { app, auth, db, storage, messaging, analytics, isConfigured };
