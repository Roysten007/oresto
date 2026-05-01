/**
 * Script pour créer les comptes de test dans Firebase
 * Exécuter avec : node seed-test-accounts.mjs
 * 
 * Prérequis : npm install firebase
 */

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

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
const auth = getAuth(app);
const db = getDatabase(app);

const testAccounts = [
  {
    email: "aminata@test.com",
    password: "client123",
    userData: {
      name: "Aminata Sawadogo",
      firstName: "Aminata",
      role: "client",
      phone: "+22997000001",
      city: "Cotonou",
      neighborhood: "Akpakpa",
    }
  },
  {
    email: "kofi@test.com",
    password: "vendor123",
    userData: {
      name: "Kofi Mensah",
      firstName: "Kofi",
      role: "vendor",
      phone: "+22997000002",
      city: "Cotonou",
      neighborhood: "Cadjehoun",
    }
  }
];

async function createAccount(account) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
    const uid = cred.user.uid;

    const user = {
      id: uid,
      email: account.email,
      password: "",
      ...account.userData,
    };

    await set(ref(db, `users/${uid}`), user);

    if (account.userData.role === "vendor") {
      const vendorId = `v_${uid}`;
      await set(ref(db, `users/${uid}/vendorId`), vendorId);
      await set(ref(db, `vendors/${vendorId}`), {
        id: vendorId,
        userId: uid,
        name: "Restaurant Le Bénin",
        description: "Les meilleurs plats locaux de Cotonou",
        category: "Restaurants",
        rating: 4.8,
        reviewCount: 42,
        phone: account.userData.phone,
        whatsapp: account.userData.phone,
        city: account.userData.city,
        neighborhood: account.userData.neighborhood,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0],
        plan: "pro",
        verified: true,
        open: true,
        deliveryTime: "18-25 min",
        theme: {
          primaryColor: "#EAB308",
          secondaryColor: "#111111",
          accentColor: "#FACC15",
          fontFamily: "'Outfit', sans-serif",
          layoutType: "luxury",
          heroStyle: "full",
          buttonStyle: "pill"
        },
        socials: {
          instagram: "https://instagram.com/le_benin",
          facebook: "https://facebook.com/le_benin",
          tiktok: "https://tiktok.com/@le_benin"
        }
      });
    }

    const testProducts = [
      {
        name: "Poulet Braisé Signature",
        description: "Poulet mariné aux épices locales, servi avec alloco et attiéké.",
        price: 4500,
        category: "Plats",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=1000&auto=format&fit=crop",
        available: true,
        vendorId: vendorId
      },
      {
        name: "Poisson Grillé du Chef",
        description: "Carpe braisée, piment vert maison, garniture au choix.",
        price: 6000,
        category: "Plats",
        image: "https://images.unsplash.com/photo-1594005374167-5fd899986206?q=80&w=1000&auto=format&fit=crop",
        available: true,
        vendorId: vendorId
      },
      {
        name: "Jus de Bissap Royal",
        description: "Infusion de fleurs d'hibiscus, menthe fraîche et une touche de gingembre.",
        price: 1000,
        category: "Boissons",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1000&auto=format&fit=crop",
        available: true,
        vendorId: vendorId
      }
    ];

    for (const prod of testProducts) {
      const prodRef = push(ref(db, 'products'));
      await set(prodRef, prod);
    }

    console.log(`✅ Compte créé : ${account.email}`);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log(`⚠️  Compte déjà existant : ${account.email} (c'est OK)`);
    } else {
      console.error(`❌ Erreur pour ${account.email}:`, err.message);
    }
  }
}

console.log("🚀 Création des comptes de test Oresto...\n");
for (const account of testAccounts) {
  await createAccount(account);
}
console.log("\n✅ Terminé !");
process.exit(0);
