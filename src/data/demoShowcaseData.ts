import { VendorProfile, Product } from "./mockData";

export interface DemoShowcase {
  vendor: VendorProfile;
  products: Product[];
}

// ============================================================================
// 🍽️ 1. RESTAURANT DÉMO : L'Atelier du Chef & Grill
// ============================================================================
export const DEMO_RESTAURANT: DemoShowcase = {
  vendor: {
    id: "v_latelier_chef",
    name: "L'Atelier du Chef & Grillades",
    slug: "latelier-du-chef",
    business_type: "restaurant",
    category: "Restaurants & Grillades",
    city: "Cotonou",
    neighborhood: "Haie Vive",
    rating: 4.9,
    reviewCount: 142,
    plan: "pro",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    verified: true,
    open: true,
    deliveryTime: "25-35 min",
    phone: "+229 97 00 11 22",
    whatsapp: "+229 97 00 11 22",
    description: "Restaurant gastronomique africain & grillades au feu de bois. Produits frais du terroir et ambiance chaleureuse.",
    logo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    cover_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    primary_color: "#EA580C",
    font_choice: "elegant",
    is_published: true,
    about_story: "Fondé en 2021 au cœur de la Haie Vive, L'Atelier du Chef est né d'un amour profond pour la gastronomie béninoise et les cuissons traditionnelles à la braise. Chaque plat est une célébration des épices locales et du savoir-faire artisanal.",
    about_concept: "Braisage au bois d'acacia, marinades maison 24h et sauces secrètes pimentées.",
    about_chef: "Chef Armel & sa brigade — 12 ans d'expérience dans les grands hôtels d'Afrique de l'Ouest.",
    hours: {
      Lundi: { open: "11:30", close: "23:30", closed: false },
      Mardi: { open: "11:30", close: "23:30", closed: false },
      Mercredi: { open: "11:30", close: "23:30", closed: false },
      Jeudi: { open: "11:30", close: "00:00", closed: false },
      Vendredi: { open: "11:30", close: "01:00", closed: false },
      Samedi: { open: "11:30", close: "01:00", closed: false },
      Dimanche: { open: "12:00", close: "23:00", closed: false },
    },
    gallery_images: [
      { id: "g1", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80", caption: "Côtelettes d'agneau braisées", category: "Plats" },
      { id: "g2", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", caption: "Salle principale & ambiance feutrée", category: "Ambiance" },
      { id: "g3", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", caption: "Terrasse extérieure aérée", category: "Terrasse" },
      { id: "g4", url: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80", caption: "Poissons braisés du jour", category: "Grillades" },
      { id: "g5", url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80", caption: "Cocktails signature & vins", category: "Boissons" },
      { id: "g6", url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", caption: "Burger Gourmet du Chef", category: "Plats" },
    ],
    reviews_list: [
      { id: "r1", name: "Christian H.", rating: 5, comment: "Le meilleur Capitaine braisé de Cotonou ! Cuisson parfaite, marinade exquise et service irréprochable.", date: "Il y a 2 jours" },
      { id: "r2", name: "Fanny A.", rating: 5, comment: "Cadre très classe pour un dîner romantique. Les cocktails sont excellents.", date: "Il y a 4 jours" },
      { id: "r3", name: "Dimitri K.", rating: 5, comment: "Réservation de table en ligne hyper fluide avec confirmation WhatsApp instantanée. Bravo !", date: "Il y a 1 semaine" },
    ],
    faq_items: [
      { q: "Faut-il obligatoirement réserver une table ?", a: "La réservation est fortement conseillée les vendredis, samedis et dimanches soirs afin de vous garantir le meilleur emplacement en salle ou en terrasse." },
      { q: "Proposez-vous la livraison à domicile ?", a: "Oui, vous pouvez commander directement sur cette vitrine et vous faire livrer en 30 minutes à Cotonou et Calavi." },
      { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons les règlements par MTN Mobile Money, Moov Money, Carte Visa/Mastercard et Espèces." },
      { q: "Organisez-vous des anniversaires ou repas de groupe ?", a: "Tout à fait ! Nous disposons d'un salon privé VIP pour vos événements de 10 à 30 personnes avec menus personnalisés." }
    ]
  },
  products: [
    {
      id: "dish_1",
      vendorId: "v_latelier_chef",
      name: "Capitaine Braisé Royal (Portion entière)",
      description: "Poisson frais du lac Nokoué, mariné aux épices du terroir et braisé au feu de bois. Servi avec alloco croustillant et piment vert maison.",
      price: 6500,
      originalPrice: 7500,
      category: "Grillades & Poissons",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "BESTSELLER"
    },
    {
      id: "dish_2",
      vendorId: "v_latelier_chef",
      name: "Poulet Bicyclette Braisé au Feu de Bois",
      description: "Véritable poulet fermier d'Afrique de l'Ouest, tendre et croustillant. Accompagné de frites d'igname et sauce tomate mijotée.",
      price: 5500,
      category: "Grillades & Viandes",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "RECOMMANDÉ"
    },
    {
      id: "dish_3",
      vendorId: "v_latelier_chef",
      name: "Chawarma Royal Viande & Fromage",
      description: "Émincé de bœuf mariné, sauce blanche à l'ail, crudités fraîches et fromage fondu roulé dans une galette libanaise toastée.",
      price: 2500,
      category: "Fast Good & Entrées",
      image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80",
      available: true,
    },
    {
      id: "dish_4",
      vendorId: "v_latelier_chef",
      name: "Côtelettes d'Agneau Grillées aux Fines Herbes",
      description: "Trois généreuses côtelettes d'agneau grillées à la minute, jus corsé au romarin, légumes glacés et riz basmati au beurre.",
      price: 8000,
      originalPrice: 9000,
      category: "Grillades & Viandes",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      available: true,
      badge: "CHEF'S CHOICE"
    },
    {
      id: "dish_5",
      vendorId: "v_latelier_chef",
      name: "Cocktail Signature 'Saveur Tropicale'",
      description: "Rhum ambré, jus d'ananas frais de Dangbo, fruit de la passion et sirop d'hibiscus fait maison.",
      price: 2500,
      category: "Boissons & Cocktails",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
      available: true
    }
  ]
};

// ============================================================================
// 🛍️ 2. BOUTIQUE DÉMO : KiffStyle Store
// ============================================================================
export const DEMO_BOUTIQUE: DemoShowcase = {
  vendor: {
    id: "v_kiffstyle",
    name: "KiffStyle Store Cotonou",
    slug: "kiffstyle-store",
    business_type: "ecommerce",
    category: "Mode, Baskets & Accessoires",
    city: "Cotonou",
    neighborhood: "Ganhi",
    rating: 4.95,
    reviewCount: 98,
    plan: "pro",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    verified: true,
    open: true,
    deliveryTime: "Livraison sous 24h",
    phone: "+229 96 44 55 66",
    whatsapp: "+229 96 44 55 66",
    description: "Boutique de sneakers tendance, streetwear de qualité et montres connectées. Expédition rapide partout au Bénin.",
    logo_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    cover_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    primary_color: "#7C3AED",
    font_choice: "bold",
    is_published: true,
    about_story: "KiffStyle Store est né de la passion du streetwear moderne et de l'élégance urbaine. Nous sélectionnons méticuleusement chaque paire et vêtement auprès des meilleurs ateliers pour garantir authenticité, confort et durabilité.",
    about_concept: "100% Qualité vérifiée, essayage et retours facilités sous 48h, prix justes.",
    about_chef: "Équipe KiffStyle — Conseillers de style disponibles sur WhatsApp 7j/7.",
    hours: {
      Lundi: { open: "09:00", close: "19:30", closed: false },
      Mardi: { open: "09:00", close: "19:30", closed: false },
      Mercredi: { open: "09:00", close: "19:30", closed: false },
      Jeudi: { open: "09:00", close: "19:30", closed: false },
      Vendredi: { open: "09:00", close: "20:00", closed: false },
      Samedi: { open: "09:00", close: "20:00", closed: false },
      Dimanche: { open: "14:00", close: "19:00", closed: false },
    },
    gallery_images: [
      { id: "g1", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", caption: "Sneakers Nike Air Vapour Edition", category: "Chaussures" },
      { id: "g2", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", caption: "Montre Connectée AMOLED Pro", category: "Montres" },
      { id: "g3", url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80", caption: "Veste d'hiver Streetwear", category: "Vêtements" },
      { id: "g4", url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80", caption: "Appareil photo & Accessoires Tech", category: "Accessoires" },
    ],
    reviews_list: [
      { id: "r1", name: "Bérénice T.", rating: 5, comment: "Paire de sneakers reçue en 4h chrono à Calavi ! Conforme aux photos et pointure parfaite.", date: "Hier" },
      { id: "r2", name: "Romaric H.", rating: 5, comment: "Paiement MoMo super rapide et sans frais. Service client très réactif.", date: "Il y a 3 jours" },
      { id: "r3", name: "Audrey S.", rating: 5, comment: "Super qualité de tissu pour les ensembles en lin. Je recommande les yeux fermés.", date: "Il y a 1 semaine" },
    ],
    faq_items: [
      { q: "Quels sont les délais et zones de livraison ?", a: "Nous livrons à Cotonou et Calavi en moins de 24h. Pour Porto-Novo, Parakou et Bohicon, l'expédition s'effectue via gare routière sous 24h à 48h." },
      { q: "Comment régler ma commande par Mobile Money ?", a: "Vous pouvez payer directement par MTN MoMo ou Moov Money lors de votre commande. C'est sécurisé et sans commission." },
      { q: "Puis-je échanger si la taille ne convient pas ?", a: "Oui ! Vous disposez de 48h après la réception pour demander un échange de pointure ou de modèle gratuitement." }
    ]
  },
  products: [
    {
      id: "prod_1",
      vendorId: "v_kiffstyle",
      name: "Sneakers Nike Air Max Pulse Red/Black",
      description: "Baskets streetwear nouvelle génération avec semelle à bulle d'air amortissante. Confort ultime pour le sport et le quotidien.",
      price: 32000,
      originalPrice: 40000,
      category: "Sneakers & Chaussures",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      ],
      available: true,
      stock: 8,
      badge: "VENTE FLASH -20%",
      variants: [
        { name: "Pointure", options: ["40", "41", "42", "43", "44"] },
        { name: "Couleur", options: ["Rouge/Noir", "Blanc Pur", "Triple Black"] }
      ],
      features: ["Semelle Air Max amortissante", "Matière respirante Mesh", "Garantie 6 mois"]
    },
    {
      id: "prod_2",
      vendorId: "v_kiffstyle",
      name: "Montre Connectée AMOLED Sport Ultra",
      description: "Écran HD Always-on, suivi cardiaque, oxygène sanguin, étanche IP68 et autonomie exceptionnelle de 10 jours.",
      price: 24000,
      originalPrice: 30000,
      category: "Accessoires & Montres",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      available: true,
      stock: 15,
      badge: "BESTSELLER",
      variants: [
        { name: "Bracelet", options: ["Silicone Noir", "Cuir Marron", "Acier Argent"] }
      ],
      features: ["Écran tactile AMOLED", "Appels Bluetooth HD", "Batterie 10 jours"]
    },
    {
      id: "prod_3",
      vendorId: "v_kiffstyle",
      name: "Ensemble Veste & Pantalon Lin Élite",
      description: "Coupe ajustée moderne, tissu 100% lin naturel respirant. Idéal pour cérémonies, soirées et réunions d'affaires.",
      price: 28000,
      category: "Prêt-à-porter & Vêtements",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      available: true,
      stock: 5,
      variants: [
        { name: "Taille", options: ["M", "L", "XL", "XXL"] },
        { name: "Coloris", options: ["Beige Sable", "Bleu Nuit", "Vert Kaki"] }
      ],
      features: ["100% Lin pur", "Finition haute couture", "Lavage machine 30°C"]
    }
  ]
};

// ============================================================================
// 🏨 3. HÔTEL DÉMO : Résidence Palmier Royal
// ============================================================================
export const DEMO_HOTEL: DemoShowcase = {
  vendor: {
    id: "v_palmier_royal",
    name: "Résidence Hôtelière Palmier Royal",
    slug: "palmier-royal",
    business_type: "hotel",
    category: "Hôtels & Résidences Meublées",
    city: "Cotonou",
    neighborhood: "Haie Vive (Zone Ambassades)",
    rating: 4.96,
    reviewCount: 87,
    plan: "pro",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    verified: true,
    open: true,
    deliveryTime: "Check-in 14h00",
    phone: "+229 97 88 99 00",
    whatsapp: "+229 97 88 99 00",
    description: "Résidence hôtelière de charme avec suites meublées, piscine extérieure, Wi-Fi Fibre et groupe électrogène 24h/24.",
    logo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    cover_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    primary_color: "#4F46E5",
    font_choice: "elegant",
    is_published: true,
    about_story: "Située dans le quartier le plus prisé et sécurisé de Cotonou, la Résidence Palmier Royal allie le standing d'un hôtel 4 étoiles à l'intimité d'une suite privée. Idéal pour vos séjours professionnels ou escapades touristiques.",
    about_concept: "Calme absolu, discrétion, propreté irréprochable et autonomie totale.",
    about_chef: "Équipe de conciergerie & gouvernantes dévouées 24h/24.",
    check_in_time: "14h00",
    check_out_time: "11h00",
    deposit_amount: "20000",
    long_stay_discount: true,
    long_stay_nights: "3",
    long_stay_rate: "15",
    hotel_services: [
      "Petit-déjeuner inclus / buffet",
      "Wi-Fi Fibre Haut Débit",
      "Groupe électrogène 24h/24",
      "Piscine & Espace Transats",
      "Parking privé sécurisé",
      "Navette Aéroport Cadjehoun"
    ],
    points_of_interest: [
      { name: "Aéroport International Cadjehoun", distance: "8 minutes en voiture", icon: "fa-solid fa-plane-departure" },
      { name: "Plage de Fidjrossè & Boulevard de la Marina", distance: "5 minutes", icon: "fa-solid fa-water" },
      { name: "Centre d'Affaires & Restaurants Haie Vive", distance: "2 minutes à pied", icon: "fa-solid fa-briefcase" },
      { name: "Marché Dantokpa & Centre-ville", distance: "12 minutes", icon: "fa-solid fa-city" }
    ],
    gallery_images: [
      { id: "g1", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", caption: "Suite Royale Deluxe avec balcon", category: "Chambres" },
      { id: "g2", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", caption: "Piscine privée et jardin tropical", category: "Extérieur" },
      { id: "g3", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", caption: "Chambre Executive King Size", category: "Chambres" },
      { id: "g4", url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80", caption: "Espace Lounge & Petit-déjeuner", category: "Services" }
    ],
    reviews_list: [
      { id: "r1", name: "Marc K.", rating: 5, comment: "Séjour parfait à Cotonou ! Literie d'un confort exceptionnel, clim sans coupure et Wi-Fi Fibre ultra rapide.", date: "Il y a 3 jours" },
      { id: "r2", name: "Nadège A.", rating: 5, comment: "Personnel adorable et discret. Le petit-déjeuner au bord de la piscine est un pur bonheur.", date: "Il y a 1 semaine" },
      { id: "r3", name: "Alexandre P.", rating: 5, comment: "Emplacement idéal à 2 pas des meilleurs restaurants. La réservation directe en ligne est super facile.", date: "Il y a 2 semaines" }
    ],
    faq_items: [
      { q: "Quelles sont les heures de Check-in et Check-out ?", a: "Le check-in débute à 14h00 et le check-out doit s'effectuer avant 11h00. Un aménagement d'horaires est possible sur simple demande selon les disponibilités." },
      { q: "L'électricité et la climatisation sont-elles garanties ?", a: "Oui, la résidence dispose d'un groupe électrogène automatique et d'une bâche à eau pour assurer 100% de continuité de service." },
      { q: "Y a-t-il une réduction pour les longs séjours ?", a: "Oui ! Nous appliquons automatiquement -15% de remise pour tout séjour de 3 nuits ou plus réservé en ligne." },
      { q: "Comment s'effectue le paiement ?", a: "Vous pouvez régler un acompte par Mobile Money (MTN MoMo ou Moov) ou régler la totalité à votre arrivée à la réception." }
    ]
  },
  products: [
    {
      id: "room_1",
      vendorId: "v_palmier_royal",
      name: "Suite Royale Vue Piscine (King Size)",
      description: "Grande suite de 45m² avec lit King Size haut de gamme, salon privé, climatisation split, Smart TV 55'' Netflix, salle de bain en marbre et terrasse privée donnant sur la piscine.",
      price: 45000,
      originalPrice: 55000,
      category: "Suites de Luxe",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
      ],
      available: true,
      stock: 3,
      badge: "COUP DE CŒUR",
      features: ["45 m² • 2 personnes", "Lit King Size 200x200", "Petit-déjeuner offert", "Wi-Fi Fibre 100 Mbps", "Vue Piscine"]
    },
    {
      id: "room_2",
      vendorId: "v_palmier_royal",
      name: "Chambre Executive Confort ClimatGroup",
      description: "Chambre lumineuse de 30m² idéale pour les voyageurs d'affaires. Lit Queen Size, bureau de travail ergonomique, coffre-fort électronique et minibar.",
      price: 30000,
      category: "Chambres Standard & Affaires",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      available: true,
      stock: 5,
      features: ["30 m² • 2 personnes", "Lit Queen Size", "Espace bureau", "Wi-Fi Fibre", "Climatisation 24h"]
    },
    {
      id: "room_3",
      vendorId: "v_palmier_royal",
      name: "Appartement Penthouse 2 Chambres",
      description: "Penthouse de 85m² avec 2 chambres indépendantes, grand séjour, cuisine américaine équipée et balcon panoramique.",
      price: 75000,
      originalPrice: 90000,
      category: "Appartements & Résidences",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      available: true,
      stock: 2,
      badge: "OFFRE FAMILLE & GROUPE",
      features: ["85 m² • Jusqu'à 5 personnes", "2 Lits King Size", "Cuisine équipée", "Salon VIP", "Parking inclus"]
    }
  ]
};

export function getDemoShowcaseBySlug(slug?: string): DemoShowcase | null {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  if (s === "latelier-du-chef" || s === "demo" || s === "restaurant") return DEMO_RESTAURANT;
  if (s === "kiffstyle-store" || s === "boutique" || s === "ecommerce") return DEMO_BOUTIQUE;
  if (s === "palmier-royal" || s === "hotel" || s === "residence") return DEMO_HOTEL;
  return null;
}
