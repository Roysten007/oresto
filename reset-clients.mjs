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

async function resetClients() {
  console.log("Recherche des clients en base de données...");
  const usersRef = ref(db, 'users');
  const snap = await get(usersRef);
  
  if (snap.exists()) {
    const users = snap.val();
    let deletedCount = 0;
    
    for (const uid in users) {
      if (users[uid].role === "client") {
        console.log(`Suppression du client: ${users[uid].email || "Invité"} (UID: ${uid})`);
        await remove(ref(db, `users/${uid}`));
        await remove(ref(db, `user_preferences/${uid}`));
        deletedCount++;
      }
    }
    console.log(`✅ ${deletedCount} client(s) supprimé(s) avec succès.`);
  } else {
    console.log("Aucun utilisateur trouvé.");
  }
  process.exit(0);
}

resetClients();
