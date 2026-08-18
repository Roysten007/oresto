import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue, update, push, set } from "firebase/database";
import { 
  ShoppingCart, 
  Clock, 
  MapPin, 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  X, 
  ChefHat, 
  Utensils, 
  MessageCircle,
  Share2,
  Info,
  Heart,
  Truck,
  Store,
  Rocket,
  AlertTriangle,
  Search,
  CheckCircle2,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorProfile, Product, Review } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import OrderChat from "@/components/OrderChat";
import ProductDetailModal from "@/components/ecommerce/ProductDetailModal";

export default function RestaurantPublic() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // E-commerce Product Detail Modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderChat, setShowOrderChat] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", notes: "" });
  const [placingOrder, setPlacingOrder] = useState(false);

  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  const isRestricted = vendor?.subscriptionStatus === "restricted" || vendor?.subscriptionStatus === "blocked";
  
  const isEcommerceMode = vendor?.business_type === "ecommerce" || 
    Boolean(vendor?.category && (
      vendor.category.toLowerCase().includes("boutique") ||
      vendor.category.toLowerCase().includes("mode") ||
      vendor.category.toLowerCase().includes("vente") ||
      vendor.category.toLowerCase().includes("tech") ||
      vendor.category.toLowerCase().includes("e-commerce")
    ));

  useEffect(() => {
    if (!slug || !db) { setLoading(false); return; }

    let unsubVendor: (() => void) | null = null;
    let unsubProducts: (() => void) | null = null;
    
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    const startListeners = (vendorId: string) => {
      const vendorRef = ref(db, `vendors/${vendorId}`);
      unsubVendor = onValue(vendorRef, (snap) => {
        if (snap.exists()) {
          const v = snap.val();
          const vendorData = { id: vendorId, ...v } as VendorProfile;
          const owner = user?.vendorId === vendorId || user?.id === vendorData.userId;
          setIsOwner(owner);

          const isPublished = vendorData.is_published === true || vendorData.is_published === "true";
          if (!isPublished && !owner) {
            setLoading(false);
            setVendor(null);
            return;
          }
          
          setVendor(vendorData);
          setLoading(false);
          clearTimeout(timeout);
        } else {
          setLoading(false);
          setVendor(null);
        }
      });

      const productsRef = ref(db, "products");
      unsubProducts = onValue(productsRef, (snap) => {
        if (snap.exists()) {
          const all = snap.val();
          const list: Product[] = Object.keys(all)
            .map(k => ({ id: k, ...all[k] }))
            .filter((p: any) => p.vendorId === vendorId && p.available !== false);
          setProducts(list);
        } else {
          setProducts([]);
        }
      });
    };

    const slugsRef = ref(db, `slugs/${slug.toLowerCase()}`);
    onValue(slugsRef, (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        const vendorId = typeof val === 'object' ? val.vendorId : val;
        if (vendorId) startListeners(vendorId);
        else setLoading(false);
      } else {
        const vendorsRef = ref(db, 'vendors');
        onValue(vendorsRef, (vSnap) => {
          if (vSnap.exists()) {
            const allVendors = vSnap.val();
            const foundId = Object.keys(allVendors).find(id => allVendors[id].slug?.toLowerCase() === slug.toLowerCase());
            if (foundId) startListeners(foundId);
            else {
              loadFallbackIfDemo(slug);
            }
          } else {
            loadFallbackIfDemo(slug);
          }
        }, { onlyOnce: true });
      }
    }, { onlyOnce: true });

    const loadFallbackIfDemo = (currentSlug: string) => {
      const lower = currentSlug.toLowerCase();
      if (lower.includes("maquis") || lower.includes("etoile") || lower.includes("resto") || lower.includes("restaurant")) {
        setVendor({
          id: "v_demo_resto",
          name: "Le Maquis Étoilé",
          slug: "le-maquis-etoile",
          category: "Restaurant & Grillades",
          business_type: "restaurant",
          city: "Cotonou",
          neighborhood: "Haie Vive",
          phone: "+229 97 00 00 00",
          whatsapp: "+229 97 00 00 00",
          description: "Spécialités africaines et grillades au feu de bois. Cuisine authentique et produits frais.",
          cover_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
          logo_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200",
          primary_color: "#EA580C",
          secondary_color: "#FFFFFF",
          font_choice: "modern",
          rating: 4.9,
          reviewCount: 42,
          open: true,
          deliveryTime: "30-45 min",
          plan: "pro",
          verified: true,
          status: "active",
          is_published: true,
          ordering_modes: ["dine_in", "takeaway", "delivery"],
          payment_methods: ["momo_mtn", "momo_moov", "cash"]
        });
        setProducts([
          { id: "p1", vendorId: "v_demo_resto", name: "Poulet Braisé & Alloco", price: 4500, category: "Plats", description: "Demi-poulet mariné aux épices du chef, servi avec alloco croustillant et sauce piment.", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600", available: true },
          { id: "p2", vendorId: "v_demo_resto", name: "Capitaine Braisé", price: 6000, category: "Plats", description: "Poisson capitaine frais braisé aux herbes locales, accompagné d'attiéké frais.", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600", available: true },
          { id: "p3", vendorId: "v_demo_resto", name: "Chawarma Viande Spécial", price: 2000, category: "Fast-Food", description: "Pain libanais garni de lamelles de bœuf mariné, sauce blanche et frites.", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600", available: true },
          { id: "p4", vendorId: "v_demo_resto", name: "Jus de Bissap Maison", price: 1000, category: "Boissons", description: "Infusion d'hibiscus frais à la menthe et vanille naturelle.", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600", available: true }
        ]);
        setLoading(false);
      } else if (lower.includes("boutique") || lower.includes("chic") || lower.includes("shop") || lower.includes("mode")) {
        setVendor({
          id: "v_demo_shop",
          name: "Ma Boutique Chic",
          slug: "ma-boutique-chic",
          category: "E-Commerce & Boutiques",
          business_type: "ecommerce",
          city: "Cotonou",
          neighborhood: "Ganhi",
          phone: "+229 96 00 00 00",
          whatsapp: "+229 96 00 00 00",
          description: "Prêt-à-porter tendance, sneakers streetwear et accessoires de mode. Livraison rapide partout au Bénin.",
          cover_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
          logo_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200",
          primary_color: "#000000",
          secondary_color: "#FFFFFF",
          font_choice: "modern",
          rating: 4.8,
          reviewCount: 29,
          open: true,
          deliveryTime: "24h Express",
          plan: "pro",
          verified: true,
          status: "active",
          is_published: true,
          promo_label: "🚚 Livraison offerte dès 20 000 FCFA à Cotonou & Calavi",
          ordering_modes: ["delivery"],
          payment_methods: ["momo_mtn", "momo_moov"]
        });
        setProducts([
          { id: "s1", vendorId: "v_demo_shop", name: "Sneakers Streetwear Urban", price: 18500, originalPrice: 25000, category: "Chaussures", badge: "PROMO", description: "Design moderne avec semelle amortissante. Parfaites pour le quotidien.", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600", images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], available: true, stock: 12, variants: [{ name: "Pointure", options: ["40", "41", "42", "43", "44"] }] },
          { id: "s2", vendorId: "v_demo_shop", name: "Smartwatch Ultra Pro 4G", price: 29000, originalPrice: 35000, category: "High-Tech", badge: "BESTSELLER", description: "Écran AMOLED HD, suivi cardiaque, appels Bluetooth et autonomie 7 jours.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", available: true, stock: 5, variants: [{ name: "Bracelet", options: ["Noir", "Orange Titane", "Argent"] }] },
          { id: "s3", vendorId: "v_demo_shop", name: "Robe Soirée Satin Prestige", price: 15000, category: "Vêtements", badge: "NOUVEAU", description: "Coupe élégante en tissu satiné premium. Idéale pour vos soirées et événements.", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600", available: true, stock: 8, variants: [{ name: "Taille", options: ["S", "M", "L", "XL"] }, { name: "Couleur", options: ["Émeraude", "Noir", "Rouge Rubis"] }] }
        ]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    return () => {
      clearTimeout(timeout);
      if (unsubVendor) unsubVendor();
      if (unsubProducts) unsubProducts();
    };
  }, [slug, user]);

  // Dynamic SEO & Structured Data (OpenGraph, Twitter, Schema.org)
  useEffect(() => {
    if (!vendor) return;

    // Document Title
    document.title = `${vendor.name} — ${vendor.category || 'Commander en ligne'} à ${vendor.city || 'Cotonou'} | Oresto`;

    // Meta Description
    const desc = vendor.description || `Découvrez la vitrine officielle et commandez en direct chez ${vendor.name} à ${vendor.city || 'Cotonou'}. Encaissement Mobile Money direct sans intermédiaire.`;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", desc);

    // OpenGraph Tags
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMetaTag("og:title", `${vendor.name} — Commander en ligne`);
    setMetaTag("og:description", desc);
    setMetaTag("og:image", vendor.cover_url || vendor.logo_url || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800");
    setMetaTag("og:url", window.location.href);
    setMetaTag("og:type", isEcommerceMode ? "website" : "restaurant");

    // Schema.org JSON-LD structured data for Google Search Rich Results
    const existingScript = document.getElementById("jsonld-structured-data");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "jsonld-structured-data";
    script.type = "application/ld+json";

    const schemaData = isEcommerceMode ? {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "name": vendor.name,
      "description": desc,
      "url": window.location.href,
      "telephone": vendor.phone || vendor.whatsapp || "",
      "currenciesAccepted": "XOF",
      "paymentAccepted": "Mobile Money (MTN, Moov, Celtiis)",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": vendor.city || "Cotonou",
        "streetAddress": vendor.neighborhood || ""
      }
    } : {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": vendor.name,
      "image": vendor.cover_url || "",
      "description": desc,
      "servesCuisine": vendor.cuisine_tags || [vendor.category || "Africaine"],
      "telephone": vendor.phone || vendor.whatsapp || "",
      "currenciesAccepted": "XOF",
      "paymentAccepted": "Mobile Money (MTN, Moov, Celtiis), Espèces",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": vendor.city || "Cotonou",
        "streetAddress": vendor.neighborhood || ""
      },
      "hasMenu": window.location.href
    };

    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById("jsonld-structured-data");
      if (s) s.remove();
    };
  }, [vendor, isEcommerceMode]);

  const handleAddToCart = (product: Product) => {
    if (isRestricted) {
      toast.warning("Les commandes sont temporairement suspendues pour cet établissement.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, qty: item.qty + 1} : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleAddToCartWithVariants = (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
    if (isRestricted) {
      toast.warning("Les commandes sont temporairement suspendues.");
      return;
    }
    const variantStr = Object.entries(selectedVariants).length > 0
      ? ` (${Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")})`
      : "";
    const customProduct = { ...product, name: `${product.name}${variantStr}` };

    setCart(prev => {
      const existing = prev.find(i => i.product.name === customProduct.name);
      if (existing) {
        return prev.map(i => i.product.name === customProduct.name ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { product: customProduct, qty: quantity }];
    });
    toast.success(`${quantity}x ${customProduct.name} ajouté au panier`);
  };

  const handleInstantBuy = (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
    handleAddToCartWithVariants(product, quantity, selectedVariants);
    setShowOrderForm(true);
  };

  const handleShare = async () => {
    if (navigator.share && vendor) {
      try {
        await navigator.share({
          title: vendor.name,
          text: vendor.description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category?.trim()).filter(Boolean));
    return ["Tous", ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === "Tous" || p.category?.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const currentDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date().getDay()];
  const dailyMenuIds = vendor?.daily_menus?.[currentDay] || {};
  const dailyItems = {
    entree: products.find(p => p.id === dailyMenuIds.entree),
    plat: products.find(p => p.id === dailyMenuIds.plat),
    dessert: products.find(p => p.id === dailyMenuIds.dessert),
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <Store size={36} />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Établissement introuvable</h1>
        <p className="text-gray-500 max-w-xs mx-auto mb-6 text-xs">Cette vitrine n'existe pas ou le lien est incorrect.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-xs uppercase">Retour à l'accueil</button>
      </div>
    );
  }

  const theme = {
    primary: vendor.primary_color || "#EA580C",
    bg: vendor.secondary_color || "#FFFFFF",
    font: vendor.font_choice === "elegant" ? "'Cormorant Garamond', serif" :
          vendor.font_choice === "bold" ? "'Montserrat', sans-serif" : "'Inter', sans-serif"
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-body" style={{ fontFamily: theme.font }}>
      
      {/* Top Banner for E-Commerce */}
      {isEcommerceMode && (
        <div className="bg-black text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <i className="fa-solid fa-truck-fast text-primary"></i>
          <span>Livraison Express • Retours sous 48h • Encaissement Mobile Money 100% Sécurisé</span>
        </div>
      )}

      {/* Floating Action Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md px-4 sm:px-8 py-3 border-b border-gray-150 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-150 overflow-hidden shadow-sm">
            <img src={vendor.logo_url || `https://ui-avatars.com/api/?name=${vendor.name}`} className="w-full h-full object-cover" alt="" />
          </div>
          <div>
            <h1 className="font-heading font-black text-sm text-gray-900 leading-tight truncate max-w-[180px] sm:max-w-xs">{vendor.name}</h1>
            <p className="text-[10px] text-gray-500 truncate">{vendor.neighborhood || "Haie Vive"}, {vendor.city || "Cotonou"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-xs">
            <Share2 size={16} />
          </button>
          {vendor.whatsapp && (
            <a 
              href={`https://wa.me/${vendor.whatsapp.replace(/\s/g, '')}`}
              target="_blank" 
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative h-44 sm:h-64 bg-gray-900 overflow-hidden">
        <img 
          src={vendor.cover_url || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"} 
          className="w-full h-full object-cover opacity-60"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="max-w-3xl space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider inline-block">
              {isEcommerceMode ? "Boutique Officielle Certifiée" : "Ouvert • Prêt à vous servir"}
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl">{vendor.name}</h2>
            <p className="text-xs text-gray-200 line-clamp-2 max-w-xl">{vendor.description}</p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Search & Categories Tabs */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isEcommerceMode ? "Rechercher un vêtement, smartphone, article..." : "Rechercher un plat, grillade, dessert..."}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-xs font-medium outline-none focus:border-primary shadow-sm"
            />
          </div>

          {/* Categories Horizontal Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-black text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Menu Special (Only for Restaurant) */}
        {!isEcommerceMode && dailyItems.plat && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                Suggestion du Chef ({currentDay})
              </span>
              <h3 className="font-heading font-black text-xl">{dailyItems.plat.name}</h3>
              <p className="text-xs text-white/90">{dailyItems.plat.description}</p>
            </div>
            <button
              onClick={() => handleAddToCart(dailyItems.plat!)}
              className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-heading font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-lg shrink-0"
            >
              Commander • {dailyItems.plat.price.toLocaleString()} F
            </button>
          </div>
        )}

        {/* Products Grid (E-Commerce or Restaurant Style) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h3 className="font-heading font-black text-base uppercase tracking-tight text-gray-900">
              {activeCategory === "Tous" ? (isEcommerceMode ? "Tous les articles" : "Tous nos plats") : activeCategory}
            </h3>
            <span className="text-xs text-gray-400 font-bold">{filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-white rounded-3xl border border-gray-200 p-8 space-y-2">
              <Package size={36} className="mx-auto text-gray-300" />
              <p className="font-bold text-sm text-gray-700">Aucun produit trouvé</p>
              <p className="text-xs">Essayez un autre mot-clé ou filtre de catégorie.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${isEcommerceMode ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {filteredProducts.map(p => {
                const discount = p.originalPrice && p.originalPrice > p.price
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
                const photosCount = p.images?.length || (p.image ? 1 : 0);

                return (
                  <motion.div
                    key={p.id}
                    layout
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => isEcommerceMode ? setSelectedProductForModal(p) : undefined}
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {p.image ? (
                        <img 
                          src={p.image} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={p.name} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={32} />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {p.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-black text-white text-[8px] font-black uppercase tracking-wider shadow-sm">
                            {p.badge}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[8px] font-black tracking-wider shadow-sm">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {photosCount > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                          {photosCount} photos
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary block">
                          {p.category || "Article"}
                        </span>
                        <h4 className="font-heading font-black text-xs sm:text-sm text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {p.name}
                        </h4>
                        {!isEcommerceMode && p.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{p.description}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="font-heading font-black text-sm sm:text-base text-gray-900 block" style={{ color: theme.primary }}>
                            {Number(p.price).toLocaleString()} F
                          </span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {Number(p.originalPrice).toLocaleString()} F
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isEcommerceMode && p.variants && p.variants.length > 0) {
                              setSelectedProductForModal(p);
                            } else {
                              handleAddToCart(p);
                            }
                          }}
                          className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center hover:bg-primary transition-colors shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="p-3.5 bg-black text-white rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/10"
          >
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-sm font-black shadow-md">
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Votre Panier</p>
                <p className="font-heading font-black text-sm text-white">{totalPrice.toLocaleString()} FCFA</p>
              </div>
            </div>

            <button
              onClick={() => setShowOrderForm(true)}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-credit-card"></i>
              <span>Commander</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Product Detail Modal for E-Commerce */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCartWithVariants}
        onInstantBuy={handleInstantBuy}
        primaryColor={theme.primary}
      />

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl my-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-black text-base text-gray-900">Finaliser votre commande</h3>
                <button onClick={() => setShowOrderForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <X size={16} />
                </button>
              </div>

              {/* Cart Summary */}
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                    <span className="font-bold text-gray-800">{item.qty}x {item.product.name}</span>
                    <span className="font-black text-primary">{(item.product.price * item.qty).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-xs flex justify-between font-black">
                <span>Total à régler :</span>
                <span className="text-primary font-heading text-sm">{totalPrice.toLocaleString()} FCFA</span>
              </div>

              {/* Form */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Votre Nom complet *</label>
                  <input
                    type="text"
                    value={orderForm.name}
                    onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-primary"
                    placeholder="Ex: Jean Houndété"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Numéro Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={orderForm.phone}
                    onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-primary"
                    placeholder="+229 97 00 00 00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Adresse de livraison</label>
                  <input
                    type="text"
                    value={orderForm.notes}
                    onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary"
                    placeholder="Quartier, repère, indications..."
                  />
                </div>
              </div>

              {/* MoMo Direct Action */}
              <button
                type="button"
                disabled={!orderForm.name.trim() || !orderForm.phone.trim() || placingOrder}
                onClick={async () => {
                  if (!db || !vendor?.id) return;
                  setPlacingOrder(true);
                  try {
                    const newOrderRef = push(ref(db, "orders"));
                    await set(newOrderRef, {
                      id: newOrderRef.key,
                      vendorId: vendor.id,
                      vendorName: vendor.name,
                      clientName: orderForm.name.trim(),
                      clientPhone: orderForm.phone.trim(),
                      address: orderForm.notes.trim() || "Livraison",
                      items: cart.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
                      total: totalPrice,
                      status: "payment_sent",
                      paymentMethod: "Mobile Money Direct",
                      date: new Date().toISOString()
                    });
                    
                    toast.success("Commande enregistrée ! Vous allez être redirigé vers WhatsApp.");
                    const rawPhone = (vendor.whatsapp || vendor.phone || "").replace(/\D/g, "");
                    const itemsList = cart.map(i => `• ${i.qty}x ${i.product.name} (${(i.product.price * i.qty).toLocaleString()} F)`).join("\n");
                    const msg = encodeURIComponent(`Bonjour *${vendor.name}* !\nJe viens de commander sur votre boutique :\n\n${itemsList}\n\n*Total : ${totalPrice.toLocaleString()} FCFA*\n👤 Nom : ${orderForm.name.trim()}\n📞 Tél : ${orderForm.phone.trim()}\n📍 Adresse : ${orderForm.notes.trim()}\n\nEnvoyé depuis Oresto Connect.`);
                    
                    setShowOrderForm(false);
                    setCart([]);
                    window.open(`https://wa.me/${rawPhone}?text=${msg}`, "_blank");
                  } finally {
                    setPlacingOrder(false);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>{placingOrder ? "Envoi en cours..." : "Confirmer et Payer par MoMo"}</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
