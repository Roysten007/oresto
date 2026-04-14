export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  password: string;
  role: "client" | "vendor";
  vendorId?: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  country: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  plan: "starter" | "pro" | "premium";
  verified: boolean;
  open: boolean;
  closingTime: string;
  deliveryTime: string;
  phone: string;
  whatsapp: string;
  description: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
  status: "active" | "pending" | "suspended" | "inactive";
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  vendorId: string;
  vendorName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  deliveryFee: number;
  status: "pending" | "preparing" | "delivering" | "delivered" | "cancelled";
  paymentMethod: string;
  address: string;
  date: string;
  deliveryPerson?: string;
}

export interface Review {
  id: string;
  shopId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Aminata Sossa", firstName: "Aminata", email: "aminata@test.com", password: "client123", role: "client", phone: "+229 97 12 34 56", city: "Cotonou", neighborhood: "Cadjèhoun" },
  { id: "u2", name: "Kofi Mensah", firstName: "Kofi", email: "kofi@test.com", password: "vendor123", role: "vendor", vendorId: "v1", phone: "+228 90 23 45 67", city: "Cotonou", neighborhood: "Akpakpa" },
  { id: "u3", name: "Fatou Diallo", firstName: "Fatou", email: "fatou@test.com", password: "vendor456", role: "vendor", vendorId: "v2", phone: "+228 91 34 56 78", city: "Lomé", neighborhood: "Bè" },
];

export const mockVendors: VendorProfile[] = [
  { id: "v1", name: "Restaurant Le Bénin", slug: "restaurant-le-benin", category: "Restaurants", city: "Cotonou", country: "Bénin", neighborhood: "Akpakpa", rating: 4.8, reviewCount: 124, plan: "pro", verified: true, open: true, closingTime: "22h", deliveryTime: "~20 min", phone: "+229 97 00 11 22", whatsapp: "+229 97 00 11 22", description: "Cuisine béninoise authentique, plats locaux et grillades.", coverImage: "https://picsum.photos/seed/benin-resto/800/400", tags: ["Livraison rapide", "Halal"], createdAt: "2024-06-15", status: "active" },
  { id: "v2", name: "Épicerie Lomé Fresh", slug: "epicerie-lome-fresh", category: "Épiceries", city: "Lomé", country: "Togo", neighborhood: "Bè", rating: 4.6, reviewCount: 89, plan: "starter", verified: false, open: true, closingTime: "21h", deliveryTime: "~30 min", phone: "+228 91 22 33 44", whatsapp: "+228 91 22 33 44", description: "Produits frais et épicerie fine à Lomé.", coverImage: "https://picsum.photos/seed/lome-fresh/800/400", tags: ["Bio", "Produits frais"], createdAt: "2024-09-20", status: "active" },
];

export const mockShops: VendorProfile[] = [
  ...mockVendors,
  { id: "v3", name: "Pharmacie Santé Plus", slug: "pharmacie-sante-plus", category: "Pharmacies", city: "Cotonou", country: "Bénin", neighborhood: "Ganhi", rating: 4.9, reviewCount: 67, plan: "premium", verified: true, open: true, closingTime: "20h", deliveryTime: "~25 min", phone: "+229 96 11 22 33", whatsapp: "+229 96 11 22 33", description: "Votre pharmacie de confiance à Cotonou.", coverImage: "https://picsum.photos/seed/pharma/800/400", tags: ["Vérifié", "Ordonnances"], createdAt: "2024-03-10", status: "active" },
  { id: "v4", name: "Boutique Élégance", slug: "boutique-elegance", category: "Boutiques", city: "Abidjan", country: "Côte d'Ivoire", neighborhood: "Cocody", rating: 4.5, reviewCount: 45, plan: "pro", verified: true, open: true, closingTime: "19h", deliveryTime: "~35 min", phone: "+225 07 11 22 33", whatsapp: "+225 07 11 22 33", description: "Mode africaine et prêt-à-porter pour femmes.", coverImage: "https://picsum.photos/seed/boutique/800/400", tags: ["Mode", "Wax"], createdAt: "2024-05-22", status: "active" },
  { id: "v5", name: "Boulangerie Le Fournil", slug: "boulangerie-le-fournil", category: "Boulangeries", city: "Cotonou", country: "Bénin", neighborhood: "Fidjrossè", rating: 4.7, reviewCount: 156, plan: "pro", verified: true, open: true, closingTime: "20h", deliveryTime: "~15 min", phone: "+229 97 44 55 66", whatsapp: "+229 97 44 55 66", description: "Pain frais, viennoiseries et pâtisseries artisanales.", coverImage: "https://picsum.photos/seed/bakery/800/400", tags: ["Artisanal", "Livraison rapide"], createdAt: "2024-01-05", status: "active" },
  { id: "v6", name: "Salon Beauté Divine", slug: "salon-beaute-divine", category: "Coiffure", city: "Lomé", country: "Togo", neighborhood: "Tokoin", rating: 4.3, reviewCount: 34, plan: "starter", verified: false, open: false, closingTime: "18h", deliveryTime: "Sur place", phone: "+228 90 55 66 77", whatsapp: "+228 90 55 66 77", description: "Coiffure, tresses, soins capillaires pour femmes.", coverImage: "https://picsum.photos/seed/salon/800/400", tags: ["Tresses", "Soins"], createdAt: "2024-08-14", status: "active" },
  { id: "v7", name: "Express Livraison", slug: "express-livraison", category: "Livraison", city: "Abidjan", country: "Côte d'Ivoire", neighborhood: "Plateau", rating: 4.1, reviewCount: 22, plan: "starter", verified: false, open: true, closingTime: "23h", deliveryTime: "~20 min", phone: "+225 05 66 77 88", whatsapp: "+225 05 66 77 88", description: "Service de livraison rapide à Abidjan.", coverImage: "https://picsum.photos/seed/delivery/800/400", tags: ["Rapide", "24/7"], createdAt: "2024-10-01", status: "pending" },
  { id: "v8", name: "Hôtel Étoile du Sud", slug: "hotel-etoile-du-sud", category: "Hôtels", city: "Cotonou", country: "Bénin", neighborhood: "Haie Vive", rating: 4.4, reviewCount: 78, plan: "premium", verified: true, open: true, closingTime: "24h", deliveryTime: "N/A", phone: "+229 21 30 40 50", whatsapp: "+229 21 30 40 50", description: "Hôtel 3 étoiles avec restaurant et piscine.", coverImage: "https://picsum.photos/seed/hotel/800/400", tags: ["Piscine", "Restaurant"], createdAt: "2024-02-28", status: "active" },
];

export const mockProducts: Product[] = [
  // Vendor v1 products
  { id: "p1", vendorId: "v1", name: "Poulet braisé", description: "Poulet grillé aux épices locales avec aloko", price: 3500, category: "Plats", image: "https://picsum.photos/seed/poulet/300/200", available: true },
  { id: "p2", vendorId: "v1", name: "Riz au gras", description: "Riz jollof avec viande de bœuf et légumes", price: 2500, category: "Plats", image: "https://picsum.photos/seed/riz/300/200", available: true },
  { id: "p3", vendorId: "v1", name: "Pâte rouge + sauce", description: "Pâte de maïs avec sauce d'arachide", price: 2000, category: "Plats", image: "https://picsum.photos/seed/pate/300/200", available: true },
  { id: "p4", vendorId: "v1", name: "Jus de bissap", description: "Jus d'hibiscus frais maison", price: 500, category: "Boissons", image: "https://picsum.photos/seed/bissap/300/200", available: true },
  { id: "p5", vendorId: "v1", name: "Salade composée", description: "Salade fraîche avec avocat et crevettes", price: 3000, category: "Entrées", image: "https://picsum.photos/seed/salade/300/200", available: false },
  // Vendor v2 products
  { id: "p6", vendorId: "v2", name: "Lait frais 1L", description: "Lait pasteurisé local", price: 1200, category: "Produits laitiers", image: "https://picsum.photos/seed/lait/300/200", available: true },
  { id: "p7", vendorId: "v2", name: "Riz parfumé 5kg", description: "Riz thaï premium importé", price: 4500, category: "Céréales", image: "https://picsum.photos/seed/riz5/300/200", available: true },
  { id: "p8", vendorId: "v2", name: "Huile de palme 1L", description: "Huile rouge artisanale", price: 1500, category: "Huiles", image: "https://picsum.photos/seed/huile/300/200", available: true },
  { id: "p9", vendorId: "v2", name: "Pack eau 6x1.5L", description: "Eau minérale naturelle", price: 2000, category: "Boissons", image: "https://picsum.photos/seed/eau/300/200", available: true },
  { id: "p10", vendorId: "v2", name: "Tomates fraîches 1kg", description: "Tomates du marché, bien mûres", price: 800, category: "Légumes", image: "https://picsum.photos/seed/tomate/300/200", available: true },
];

export const mockOrders: Order[] = [
  { id: "CMD-001", clientId: "u1", clientName: "Aminata Sossa", vendorId: "v1", vendorName: "Restaurant Le Bénin", items: [{ name: "Poulet braisé", qty: 2, price: 3500 }, { name: "Jus de bissap", qty: 2, price: 500 }], total: 8500, deliveryFee: 500, status: "delivered", paymentMethod: "MTN MoMo", address: "Cadjèhoun, Cotonou", date: "2025-01-10T14:30:00", deliveryPerson: "Ibrahim K." },
  { id: "CMD-002", clientId: "u1", clientName: "Aminata Sossa", vendorId: "v1", vendorName: "Restaurant Le Bénin", items: [{ name: "Riz au gras", qty: 1, price: 2500 }], total: 3000, deliveryFee: 500, status: "delivering", paymentMethod: "Cash", address: "Cadjèhoun, Cotonou", date: "2025-01-12T12:00:00", deliveryPerson: "Moussa T." },
  { id: "CMD-003", clientId: "u1", clientName: "Aminata Sossa", vendorId: "v2", vendorName: "Épicerie Lomé Fresh", items: [{ name: "Lait frais 1L", qty: 3, price: 1200 }, { name: "Riz parfumé 5kg", qty: 1, price: 4500 }], total: 8600, deliveryFee: 600, status: "pending", paymentMethod: "Moov Money", address: "Bè, Lomé", date: "2025-01-12T16:00:00" },
  { id: "CMD-004", clientId: "u1", clientName: "Aminata Sossa", vendorId: "v1", vendorName: "Restaurant Le Bénin", items: [{ name: "Pâte rouge + sauce", qty: 1, price: 2000 }, { name: "Salade composée", qty: 1, price: 3000 }], total: 5500, deliveryFee: 500, status: "preparing", paymentMethod: "MTN MoMo", address: "Cadjèhoun, Cotonou", date: "2025-01-12T18:30:00" },
  { id: "CMD-005", clientId: "u1", clientName: "Aminata Sossa", vendorId: "v2", vendorName: "Épicerie Lomé Fresh", items: [{ name: "Pack eau 6x1.5L", qty: 2, price: 2000 }], total: 4600, deliveryFee: 600, status: "cancelled", paymentMethod: "Cash", address: "Bè, Lomé", date: "2025-01-08T10:00:00" },
];

export const mockReviews: Review[] = [
  { id: "r1", shopId: "v1", userId: "u1", userName: "Aminata S.", rating: 5, comment: "Excellent poulet braisé, livraison rapide !", date: "2025-01-10", reply: "Merci Aminata ! À bientôt 😊" },
  { id: "r2", shopId: "v1", userId: "u4", userName: "Cédric A.", rating: 4, comment: "Bonne cuisine, un peu d'attente mais ça vaut le coup.", date: "2025-01-08" },
  { id: "r3", shopId: "v1", userId: "u5", userName: "Marie T.", rating: 5, comment: "Le meilleur riz au gras de Cotonou !", date: "2025-01-05", reply: "Merci Marie, ça nous fait très plaisir !" },
  { id: "r4", shopId: "v2", userId: "u1", userName: "Aminata S.", rating: 4, comment: "Produits frais et bon service.", date: "2025-01-09" },
  { id: "r5", shopId: "v2", userId: "u6", userName: "Koffi B.", rating: 5, comment: "Toujours les meilleurs prix du quartier.", date: "2025-01-07" },
];

export const mockAdminData = {
  stats: {
    activeVendors: 47,
    totalClients: 312,
    ordersThisMonth: 1284,
    revenueThisMonth: 1175000,
    averageRating: 4.6,
    activeCountries: 2,
    planDistribution: { starter: 18, pro: 22, premium: 7 },
  },
  recentActivity: [
    { type: "new_vendor", description: "Boulangerie Chez Maman — Cotonou", date: "il y a 2h", status: "En attente validation" },
    { type: "payment", description: "Restaurant Le Bénin — Plan Pro", date: "il y a 3h", status: "Confirmé" },
    { type: "report", description: "Épicerie Lomé — avis suspect", date: "il y a 5h", status: "À examiner" },
    { type: "new_vendor", description: "Salon Beauté Cocody — Abidjan", date: "il y a 6h", status: "En attente validation" },
    { type: "payment", description: "Pharmacie Santé Plus — Plan Premium", date: "il y a 8h", status: "Confirmé" },
    { type: "new_client", description: "Nouvel utilisateur — Dakar", date: "il y a 10h", status: "Inscrit" },
    { type: "payment", description: "Boutique Élégance — Plan Pro", date: "il y a 12h", status: "Confirmé" },
    { type: "report", description: "Express Livraison — retard récurrent", date: "il y a 1j", status: "À examiner" },
    { type: "new_vendor", description: "Épicerie du Marché — Lomé", date: "il y a 1j", status: "Validé" },
    { type: "payment", description: "Hôtel Étoile du Sud — Plan Premium", date: "il y a 2j", status: "Confirmé" },
  ],
  transactions: [
    { id: "t1", vendor: "Restaurant Le Bénin", plan: "Pro", amount: 25000, method: "MTN MoMo", date: "2025-01-12", status: "confirmed" },
    { id: "t2", vendor: "Pharmacie Santé Plus", plan: "Premium", amount: 50000, method: "Moov Money", date: "2025-01-11", status: "confirmed" },
    { id: "t3", vendor: "Boutique Élégance", plan: "Pro", amount: 25000, method: "MTN MoMo", date: "2025-01-10", status: "confirmed" },
    { id: "t4", vendor: "Épicerie Lomé Fresh", plan: "Starter", amount: 10000, method: "MTN MoMo", date: "2025-01-10", status: "pending" },
    { id: "t5", vendor: "Salon Beauté Divine", plan: "Starter", amount: 10000, method: "Moov Money", date: "2025-01-09", status: "confirmed" },
    { id: "t6", vendor: "Express Livraison", plan: "Starter", amount: 10000, method: "MTN MoMo", date: "2025-01-08", status: "failed" },
    { id: "t7", vendor: "Hôtel Étoile du Sud", plan: "Premium", amount: 50000, method: "Virement", date: "2025-01-07", status: "confirmed" },
    { id: "t8", vendor: "Boulangerie Le Fournil", plan: "Pro", amount: 25000, method: "MTN MoMo", date: "2025-01-06", status: "confirmed" },
    { id: "t9", vendor: "Restaurant Le Bénin", plan: "Pro", amount: 25000, method: "MTN MoMo", date: "2025-01-05", status: "confirmed" },
    { id: "t10", vendor: "Pharmacie Santé Plus", plan: "Premium", amount: 50000, method: "Moov Money", date: "2025-01-04", status: "confirmed" },
    { id: "t11", vendor: "Boutique Élégance", plan: "Pro", amount: 25000, method: "MTN MoMo", date: "2025-01-03", status: "pending" },
    { id: "t12", vendor: "Salon Beauté Divine", plan: "Starter", amount: 10000, method: "Moov Money", date: "2025-01-02", status: "confirmed" },
  ],
  weeklyRevenue: [180000, 210000, 195000, 240000, 220000, 260000, 190000],
  monthlyRevenue: [850000, 920000, 1050000, 980000, 1100000, 1175000],
  vendorsPerWeek: [3, 5, 2, 4, 6, 3, 4],
};

export const categories = [
  { icon: "🍽️", label: "Restaurants" },
  { icon: "💊", label: "Pharmacies" },
  { icon: "🛒", label: "Épiceries" },
  { icon: "👗", label: "Boutiques" },
  { icon: "🍞", label: "Boulangeries" },
  { icon: "💇", label: "Coiffure" },
  { icon: "🚚", label: "Livraison" },
  { icon: "🏨", label: "Hôtels" },
];
