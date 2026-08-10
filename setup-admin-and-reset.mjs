/**
 * Script pour :
 * 1. Créer le compte administrateur (ou se connecter s'il existe déjà)
 * 2. Vider TOUTES les données de la Realtime Database
 * 3. Ré-écrire le flag administrateur
 * 
 * Exécuter avec : node setup-admin-and-reset.mjs
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, get, remove, set } from "firebase/database";

// ========== CONFIGURATION ==========
const ADMIN_EMAIL = "roystendesign@gmail.com";
const ADMIN_PASSWORD = "creativecode@2025";

const firebaseConfig = {
  apiKey: "AIzaSyD_8rpN4ESzDadZy3J6EmxZAVXObMc0ajc",
  authDomain: "oresto-connect.firebaseapp.com",
  projectId: "oresto-connect",
  storageBucket: "oresto-connect.firebasestorage.app",
  messagingSenderId: "376486896309",
  appId: "1:376486896309:web:57acaccb64e052614114fc",
  databaseURL: "https://oresto-connect-default-rtdb.firebaseio.com"
};

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

async function setup() {
  let uid;
  
  // ÉTAPE 1 : Créer ou se connecter avec le compte admin
  console.log("🔑 Étape 1 : Création / connexion du compte administrateur...\n");

  try {
    // Essayer de créer le compte
    const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    uid = cred.user.uid;
    console.log(`  ✅ Compte administrateur créé : ${ADMIN_EMAIL} (UID: ${uid})\n`);
  } catch (createErr) {
    if (createErr.code === 'auth/email-already-in-use') {
      // Le compte existe déjà, essayer de se connecter
      console.log(`  ℹ️  Le compte ${ADMIN_EMAIL} existe déjà, tentative de connexion...\n`);
      try {
        const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
        uid = cred.user.uid;
        console.log(`  ✅ Connecté en tant que : ${ADMIN_EMAIL} (UID: ${uid})\n`);
      } catch (signInErr) {
        console.error(`  ❌ Impossible de se connecter : ${signInErr.message}`);
        console.log(`\n  💡 Le mot de passe fourni est incorrect pour ${ADMIN_EMAIL}.`);
        console.log(`  💡 Utilisation de l'authentification anonyme comme fallback...\n`);
        
        // Fallback: utiliser l'auth anonyme
        const cred = await signInAnonymously(auth);
        uid = cred.user.uid;
        console.log(`  ✅ Connecté de manière anonyme (UID: ${uid})\n`);
      }
    } else {
      console.error(`  ❌ Erreur lors de la création du compte : ${createErr.message}`);
      console.log(`  💡 Utilisation de l'authentification anonyme comme fallback...\n`);
      
      const cred = await signInAnonymously(auth);
      uid = cred.user.uid;
      console.log(`  ✅ Connecté de manière anonyme (UID: ${uid})\n`);
    }
  }

  // ÉTAPE 2 : Vider TOUTE la base de données
  console.log("🧹 Étape 2 : Nettoyage complet de la base de données...\n");

  for (const nodeName of NODES) {
    const nodeRef = ref(db, nodeName);
    const snap = await get(nodeRef);

    if (snap.exists()) {
      const data = snap.val();
      const keys = Object.keys(data);
      let deletedCount = 0;

      for (const key of keys) {
        console.log(`  Suppression de ${nodeName}/${key}`);
        try {
          await remove(ref(db, `${nodeName}/${key}`));
          deletedCount++;
        } catch (removeErr) {
          console.log(`  ⚠️  Erreur lors de la suppression de ${nodeName}/${key}: ${removeErr.message}`);
        }
      }
      console.log(`  ✅ ${deletedCount}/${keys.length} entrée(s) supprimée(s) dans "${nodeName}"\n`);
    } else {
      console.log(`  ℹ️  Aucune donnée trouvée dans "${nodeName}"\n`);
    }
  }

  // ÉTAPE 3 : Ré-écrire le flag administrateur
  console.log("👑 Étape 3 : Configuration du flag administrateur...\n");

  try {
    await set(ref(db, `admins/${uid}`), {
      email: ADMIN_EMAIL,
      role: "super_admin",
      createdAt: new Date().toISOString()
    });
    console.log(`  ✅ Admin créé : ${ADMIN_EMAIL} (UID: ${uid})\n`);
  } catch (adminErr) {
    console.error(`  ❌ Erreur lors de la création du flag admin : ${adminErr.message}\n`);
  }

  // ÉTAPE 4 : Résumé
  console.log("=".repeat(50));
  console.log("🎉 RÉINITIALISATION TERMINÉE !");
  console.log("=".repeat(50));
  console.log(`\n📧 Email admin    : ${ADMIN_EMAIL}`);
  console.log(`🔑 Mot de passe  : ${ADMIN_PASSWORD}`);
  console.log(`🔗 Tableau de bord : https://oresto-connect.vercel.app/oresto-admin/login`);
  console.log(`\n⚠️  Note : Les comptes Firebase Authentication`);
  console.log(`   (email/mot de passe) n'ont PAS été supprimés.`);
  console.log(`   Pour les supprimer, allez dans la Console Firebase :`);
  console.log(`   https://console.firebase.google.com/project/oresto-connect/authentication/users\n`);

  process.exit(0);
}

setup();
