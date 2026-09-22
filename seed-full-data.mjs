import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

async function runSeed() {
  console.log("🚀 Lancement du peuplement complet des données Oresto...");

  // Connexion en tant qu'admin pour avoir tous les droits d'écriture
  const adminCred = await signInWithEmailAndPassword(auth, "roystendesign@gmail.com", "creativecode@2025");
  const adminUid = adminCred.user.uid;
  console.log(`✅ Connecté avec le compte Super Admin (UID: ${adminUid})`);

  // 1. Configurer Super Admin
  await set(ref(db, `admins/${adminUid}`), {
    email: "roystendesign@gmail.com",
    role: "super_admin",
    createdAt: new Date().toISOString()
  });

  await set(ref(db, `users/${adminUid}`), {
    id: adminUid,
    name: "Super Administrateur Oresto",
    firstName: "Admin",
    email: "roystendesign@gmail.com",
    role: "admin",
    phone: "+229 97 00 00 00",
    created_at: new Date().toISOString()
  });
  console.log("✅ Super Admin configuré dans admins/ et users/");

  // 2. Configurer Vendeur Kofi
  const kofiUid = "yMnvBfCF2DR1htxQxOoXUmhpC7b2";
  const vendorId = "v_kofi";

  await set(ref(db, `users/${kofiUid}`), {
    id: kofiUid,
    name: "Kofi Mensah",
    firstName: "Kofi",
    email: "kofi@test.com",
    role: "vendor",
    phone: "+22997000002",
    city: "Cotonou",
    neighborhood: "Cadjehoun",
    vendorId: vendorId,
    created_at: new Date().toISOString()
  });

  const now = Date.now();
  const trialEndsAt = new Date(now + 14 * 86400000).toISOString();

  await set(ref(db, `vendors/${vendorId}`), {
    id: vendorId,
    userId: kofiUid,
    name: "Restaurant Le Bénin & Grillades",
    slug: "restaurant-le-benin",
    description: "Les meilleures grillades au feu de bois de Cotonou : carpe braisée, poulet fermier aux épices du terroir, alloco croustillant et jus naturels d'hibiscus.",
    category: "Restaurants",
    business_type: "restaurant",
    rating: 4.9,
    reviewCount: 42,
    phone: "+229 97 00 00 02",
    whatsapp: "+229 97 00 00 02",
    city: "Cotonou",
    neighborhood: "Cadjehoun",
    status: "active",
    plan: "pro",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    trialStartedAt: new Date(now - 2 * 86400000).toISOString(),
    trialEndsAt: trialEndsAt,
    nextBillingDate: trialEndsAt,
    verified: true,
    open: true,
    is_published: true,
    deliveryTime: "20-30 min",
    cover_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
    logo_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
    primary_color: "#EA580C",
    secondary_color: "#FFFFFF",
    totalSales: 450000,
    totalOrders: 68,
    revenue: 450000,
    payment_methods: ["MTN MoMo", "Moov Money", "Espèces à la livraison"],
    ordering_modes: ["Sur place", "Livraison à domicile", "À emporter"],
    sections_config: { hero: true, menu: true, about: true, contact: true, footer: true }
  });

  // Aussi peupler v_demo pour le mode vitrine par défaut
  await set(ref(db, `vendors/v_demo`), {
    id: "v_demo",
    userId: kofiUid,
    name: "L'Atelier du Chef & Grill",
    slug: "latelier-du-chef",
    description: "Poissons braisés au feu de bois et spécialités africaines",
    category: "Restaurants",
    business_type: "restaurant",
    rating: 4.9,
    reviewCount: 48,
    phone: "+229 97 00 00 00",
    whatsapp: "+229 97 00 00 00",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    status: "active",
    plan: "pro",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    verified: true,
    open: true,
    is_published: true,
    deliveryTime: "25-35 min",
    cover_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    primary_color: "#EA580C",
    secondary_color: "#FFFFFF",
    totalSales: 1250000,
    totalOrders: 184,
    revenue: 1250000,
    sections_config: { hero: true, menu: true, about: true, footer: true }
  });

  console.log("✅ Vendeur Kofi et Profils Restaurant configurés");

  // 3. Produits Restaurant
  const dishes = [
    {
      name: "Poulet Braisé Signature du Chef",
      description: "Demi-poulet fermier mariné 24h aux aromates locaux, grillé braisé au charbon de bois. Servi avec alloco fondant et attiéké ou frites maison.",
      price: 4500,
      category: "Plats Chauds",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop",
      available: true,
      vendorId: vendorId
    },
    {
      name: "Carpe Royale Braisée",
      description: "Carpe fraîche entière braisée à l'étouffée, sauce piment vert fait maison, tranches d'oignons caramélisés et citron vert.",
      price: 6500,
      category: "Poissons & Fruits de Mer",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
      available: true,
      vendorId: vendorId
    },
    {
      name: "Brochettes de Filet de Bœuf (Suya)",
      description: "5 brochettes tendres assaisonnées au kankankan traditionnel, piment doux et oignons émincés.",
      price: 3000,
      category: "Grillades & Entrées",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
      available: true,
      vendorId: vendorId
    },
    {
      name: "Jus de Bissap Royal & Menthe Fraîche",
      description: "Infusion artisanale de fleurs d'hibiscus du Bénin, menthe fraîche du jardin et pointe de gingembre.",
      price: 1000,
      category: "Boissons Fraîches",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
      available: true,
      vendorId: vendorId
    },
    {
      name: "Jus d'Ananas Pain de Sucre Pur",
      description: "100% pur jus pressé d'ananas pain de sucre d'Allada sans sucre ajouté, servi bien glacé.",
      price: 1200,
      category: "Boissons Fraîches",
      image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=800&auto=format&fit=crop",
      available: true,
      vendorId: vendorId
    }
  ];

  for (const d of dishes) {
    const prodRef = push(ref(db, "products"));
    await set(prodRef, d);
  }
  console.log(`✅ ${dishes.length} Plats et boissons enregistrés dans le catalogue`);

  // 4. Commandes de démonstration
  const sampleOrders = [
    {
      id: `ord_${Date.now() - 3600000}`,
      vendorId: vendorId,
      customerName: "Aimé Kpossou",
      customerPhone: "+229 97 11 22 33",
      items: [
        { name: "Poulet Braisé Signature du Chef", qty: 2, price: 4500 },
        { name: "Jus de Bissap Royal & Menthe Fraîche", qty: 2, price: 1000 }
      ],
      total: 11000,
      status: "delivered",
      paymentMethod: "MTN MoMo",
      deliveryAddress: "Cadjèhoun, Rue de l'Aéroport",
      date: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: `ord_${Date.now() - 1800000}`,
      vendorId: vendorId,
      customerName: "Sonia Dossou",
      customerPhone: "+229 96 44 55 66",
      items: [
        { name: "Carpe Royale Braisée", qty: 1, price: 6500 },
        { name: "Jus d'Ananas Pain de Sucre Pur", qty: 1, price: 1200 }
      ],
      total: 7700,
      status: "preparing",
      paymentMethod: "Moov Money",
      deliveryAddress: "Haie Vive, Cotonou",
      date: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  for (const ord of sampleOrders) {
    await set(ref(db, `orders/${ord.id}`), ord);
  }
  console.log(`✅ ${sampleOrders.length} Commandes créées avec succès`);

  // 5. Client Aminata
  const aminataUid = "8FS4DrraR8dOs38WcBlhNeDv1s62";
  await set(ref(db, `users/${aminataUid}`), {
    id: aminataUid,
    name: "Aminata Sawadogo",
    firstName: "Aminata",
    email: "aminata@test.com",
    role: "client",
    phone: "+22997000001",
    city: "Cotonou",
    neighborhood: "Akpakpa",
    created_at: new Date().toISOString()
  });
  console.log("✅ Client Aminata configuré");

  // 6. Prestataire / Affilié Jean
  const presUid = "p_jean_demo";
  await set(ref(db, `prestataires/${presUid}`), {
    uid: presUid,
    nom: "Jean Affilié Oresto",
    telephone: "+229 97 12 34 56",
    ville: "Cotonou",
    email: "jean.partenaire@oresto.bj",
    code_referral: "JEA482",
    date_inscription: "2026-08-01",
    statut: "actif",
    total_gagne: 25000,
    total_en_attente: 10000
  });

  await set(ref(db, `referrals/JEA482`), {
    prestataire_id: presUid,
    nom: "Jean Affilié Oresto",
    telephone: "+229 97 12 34 56",
    email: "jean.partenaire@oresto.bj",
    code: "JEA482"
  });
  console.log("✅ Prestataire Jean et code referral JEA482 configurés");

  console.log("\n🎉 DONNÉES PEUPLÉES AVEC SUCCÈS DANS FIREBASE !");
  process.exit(0);
}

runSeed().catch(err => {
  console.error("❌ Erreur pendant le peuplement:", err);
  process.exit(1);
});
