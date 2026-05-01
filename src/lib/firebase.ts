import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID, 
  databaseURL: "https://oresto-connect-default-rtdb.firebaseio.com" // Explicitly adding RTDB URL
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
