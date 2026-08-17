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

export interface VendorTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  layoutType: "modern" | "classic" | "minimal" | "luxury";
  heroStyle: "full" | "side" | "minimal";
  buttonStyle: "rounded" | "square" | "pill";
}

export interface VendorProfile {
  id: string;
  userId?: string;
  name: string;
  slug?: string;
  category: string;
  city: string;
  country?: string;
  neighborhood: string;
  rating: number;
  reviewCount: number;
  plan: "starter" | "pro" | "premium";
  verified: boolean;
  open: boolean;
  closingTime?: string;
  deliveryTime: string;
  phone: string;
  whatsapp: string;
  description: string;
  coverImage?: string;
  logo?: string;
  tags?: string[];
  createdAt?: string;
  joinedDate?: string;
  status: "active" | "pending" | "suspended" | "inactive";
  trialStartedAt?: number;
  trialEndsAt?: number;
  subscriptionPlan?: "starter" | "pro";
  subscriptionStatus?: "trial" | "active" | "pending_payment" | "restricted";
  nextBillingDate?: number;
  pendingInvoice?: {
    id: string;
    plan: "starter" | "pro";
    amount: number;
    paymentUrl: string;
    createdAt: number;
    expiresAt: number;
  } | null;
  paymentHistory?: Array<{
    id: string;
    plan: string;
    amount: number;
    date: string;
    status: "paid" | "failed";
    method: string;
  }>;
  theme?: VendorTheme;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    website?: string;
  };
  slug?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_choice?: string;
  cover_url?: string;
  logo_url?: string;
  is_published?: boolean;
  hours?: Record<string, { open: string; close: string; closed: boolean }>;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  payment_methods?: string[];
  ordering_enabled?: boolean;
  ordering_modes?: string[];
  prep_time?: string;
  reviews_enabled?: boolean;
  reviews_moderation?: boolean;
  sections_config?: Record<string, boolean>;
  featured_items?: string[]; // IDs of products to feature
  daily_menus?: Record<string, { entree?: string; plat?: string; dessert?: string }>; // Day-based menus
  promo_banner_url?: string;
  promo_label?: string;
  avg_delivery_time?: number;
  avg_price_range?: string;
  cuisine_tags?: string[];
  business_type?: "restaurant" | "ecommerce" | "hotel" | "services";
}

export interface ProductVariant {
  name: string; // ex: "Taille", "Couleur", "Modèle"
  options: string[]; // ex: ["S", "M", "L", "XL"] ou ["Noir", "Blanc", "Or"]
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Prix barré pour promos (ex: 25000)
  category: string;
  image: string; // Image principale
  images?: string[]; // Galerie multi-photos (jusqu'à 4 photos)
  available: boolean;
  stock?: number; // Quantité en stock
  inStock?: boolean;
  badge?: "PROMO" | "BESTSELLER" | "NOUVEAU" | "VENTE FLASH" | "STOCK LIMITÉ" | string;
  variants?: ProductVariant[];
  features?: string[]; // Points forts / Caractéristiques clés
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
  status: "pending" | "awaiting_payment" | "preparing" | "delivering" | "delivered" | "cancelled";
  paymentMethod: string;
  address: string;
  date: string;
  deliveryPerson?: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SiteOrder {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  ordering_mode: string;
  status: 'pending' | 'awaiting_payment' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
}

// === DONNÉES VIDES — Application neuve ===

export const mockUsers: User[] = [];

export const mockVendors: VendorProfile[] = [];

export const mockShops: VendorProfile[] = [];

export const mockProducts: Product[] = [];

export const mockOrders: Order[] = [];

export const mockReviews: Review[] = [];

export const mockAdminData = {
  stats: {
    activeVendors: 0,
    totalClients: 0,
    ordersThisMonth: 0,
    revenueThisMonth: 0,
    averageRating: 0,
    activeCountries: 0,
    planDistribution: { starter: 0, pro: 0, premium: 0 },
  },
  recentActivity: [] as { type: string; description: string; date: string; status: string }[],
  transactions: [] as { id: string; vendor: string; plan: string; amount: number; method: string; date: string; status: string }[],
  weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
  monthlyRevenue: [0, 0, 0, 0, 0, 0],
  vendorsPerWeek: [0, 0, 0, 0, 0, 0, 0],
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
