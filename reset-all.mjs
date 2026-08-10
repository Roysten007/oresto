/**
 * Script pour réinitialiser complètement la base de données Oresto
 * Supprime TOUTES les données de la Realtime Database
 * 
 * Exécuter avec : node reset-all.mjs
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD_8rpN4ESzDadZy3J6EmxZAVXObMc0ajc",
  authDomain: "oresto-connect.firebaseapp.com",
  projectId: "oresto-connect",
  storageBucket: "oresto-connect.firebasestorage.app",
  messagingSenderId: "376486896309",
  appId: "1:376486896309:web:57acaccb64e052614114fc",
  databaseURL: "https://oresto-connect-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Liste de tous les noeuds racine à vider
const NODES = [
  'users',
  'vendors', 
  'products',
  'orders',
  'admins',
  'user_preferences',
  'promos',
  'notifications'
];

async function resetAll() {
  console.log("🔍 Recherche des données en base de données...\n");

  for (const nodeName of NODES) {
    const nodeRef = ref(db, nodeName);
    const snap = await get(nodeRef);

    if (snap.exists()) {
      const data = snap.val();
      const keys = Object.keys(data);
      let deletedCount = 0;

      for (const key of keys) {
        console.log(`  Suppression de ${nodeName}/${key}`);
        await remove(ref(db, `${nodeName}/${key}`));
        deletedCount++;
      }
      console.log(`  ✅ ${deletedCount} entrée(s) supprimée(s) dans "${nodeName}"\n`);
    } else {
      console.log(`  ℹ️  Aucune donnée trouvée dans "${nodeName}"\n`);
    }
  }

  console.log("🎯 Réinitialisation terminée ! Toutes les données ont été supprimées.");
  process.exit(0);
}

resetAll();
