import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue, get, query, orderByChild, equalTo } from "firebase/database";
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
  Instagram, 
  Facebook, 
  MessageCircle,
  Phone,
  Check,
  Calendar,
  Share2,
  ExternalLink,
  Info,
  Heart,
  Truck,
  Store
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorProfile, Product, Review } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export default function RestaurantPublic() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [orderComplete, setOrderComplete] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { user } = useAuth();
  const { addToCart: addToGlobalCart, totalItems, totalPrice } = useCart();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!slug || !db) { setLoading(false); return; }

    const timeout = setTimeout(() => setLoading(false), 8000);
    
    // Function to handle vendor data once found
    const handleVendorUpdate = (v: any, id: string) => {
      const vendorData = { id, ...v } as VendorProfile;
      const owner = user?.vendorId === id;
      setIsOwner(owner);
      
      if (!vendorData.is_published && !owner) {
        navigate('/app/decouvrir');
        return;
      }
      
      setVendor(vendorData);
      setLoading(false);
      clearTimeout(timeout);
    };

    // 1. First, find the vendor ID by slug or direct ID
    const slugQuery = query(ref(db, 'vendors'), orderByChild('slug'), equalTo(slug));
    
    get(slugQuery).then((snapshot) => {
      let vendorId = slug; // Fallback to slug as ID
      
      if (snapshot.exists()) {
        vendorId = Object.keys(snapshot.val())[0];
      }

      // 2. Set up real-time listener for this vendor
      const vendorRef = ref(db, `vendors/${vendorId}`);
      const unsubVendor = onValue(vendorRef, (snap) => {
        if (snap.exists()) {
          handleVendorUpdate(snap.val(), vendorId);
        } else {
          // If not found by direct ID, maybe it's a slug but the query failed
          // We already tried the query, so if we're here and snap is null, it's truly not found
          setLoading(false);
        }
      });

      // 3. Set up real-time listener for products
      const productsRef = ref(db, 'products');
      const unsubProducts = onValue(productsRef, (psnap) => {
        const pData = psnap.val();
        if (pData) {
          const list = Object.keys(pData)
            .map(k => ({ id: k, ...pData[k] }))
            .filter((p: any) => p.vendorId === vendorId) as Product[];
          setProducts(list);
        }
      });

      return () => {
        unsubVendor();
        unsubProducts();
      };
    });

    return () => clearTimeout(timeout);
  }, [slug, navigate, user]);


  const handleAddToCart = (product: Product) => {
    addToGlobalCart(product);
  };

  const handleShare = async () => {
    if (navigator.share && vendor) {
      try {
        await navigator.share({
          title: vendor.name,
          text: vendor.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category?.trim()).filter(Boolean));
    return ["Tous", ...Array.from(cats).map(c => c.charAt(0).toUpperCase() + c.slice(1).toLowerCase())];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Tous") return products;
    return products.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
  }, [products, activeCategory]);

  const currentDay = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date().getDay()];
  const dailyMenuIds = vendor?.daily_menus?.[currentDay] || {};
  const dailyItems = {
    entree: products.find(p => p.id === dailyMenuIds.entree),
    plat: products.find(p => p.id === dailyMenuIds.plat),
    dessert: products.find(p => p.id === dailyMenuIds.dessert),
    boisson: products.find(p => p.id === dailyMenuIds.boisson),
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[45vh] bg-gradient-to-b from-gray-200 to-gray-100 relative">
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-3xl bg-white shadow-xl" />
          <div className="space-y-2 pb-1">
            <div className="h-6 w-48 bg-white/60 rounded-xl" />
            <div className="h-3 w-32 bg-white/40 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Category tabs skeleton */}
      <div className="px-6 py-6 flex gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-10 rounded-full bg-gray-100" style={{ width: `${60 + i * 20}px` }} />
        ))}
      </div>
      {/* Products skeleton */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-3xl bg-white border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gray-100" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
              <div className="h-3 w-1/2 bg-gray-50 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  if (!vendor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-12 gap-8">
      <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-5xl shadow-inner">🍽️</div>
      <div className="space-y-4 max-w-md">
         <h1 className="text-3xl font-black uppercase tracking-tight">Oups ! C'est vide.</h1>
         <p className="text-muted-foreground font-sub text-sm leading-relaxed">
           Ce restaurant n'est pas encore ouvert ou n'existe plus.<br/>
           Explorez d'autres saveurs sur notre plateforme.
         </p>
      </div>
      <button onClick={() => navigate('/app/decouvrir')} className="px-12 py-5 rounded-full bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl">
        Découvrir les restaurants
      </button>
    </div>
  );

  const theme = {
    primary: vendor.primary_color || "#E11D48",
    bg: vendor.secondary_color || "#FFFFFF",
    accent: vendor.accent_color || "#000000",
    font: vendor.font_choice === "modern" ? "'DM Sans', sans-serif" : 
          vendor.font_choice === "elegant" ? "'Cormorant Garamond', serif" :
          vendor.font_choice === "bold" ? "'Bebas Neue', sans-serif" : "'Outfit', sans-serif"
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: theme.font }}>
      <style>{`
        :root {
          --res-primary: ${theme.primary};
          --res-bg: ${theme.bg};
        }
      `}</style>

      {/* Preview Banner */}
      {!vendor.is_published && isOwner && (
        <div className="bg-amber-500 text-white py-2 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-center sticky top-0 z-[100] shadow-lg">
          Mode Aperçu — Votre site n'est pas encore public. Seul vous pouvez le voir.
        </div>
      )}

      {/* Sticky Header Actions */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-black active:scale-90 transition-all border border-gray-100"
        >
          <ChevronRight className="rotate-180" size={20} />
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="pointer-events-auto w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-black active:scale-90 transition-all border border-gray-100"
          >
            <Share2 size={20} />
          </button>
          {vendor.whatsapp && (
            <a 
              href={`https://wa.me/${vendor.whatsapp.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto w-12 h-12 rounded-2xl bg-[#25D366] shadow-xl flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <MessageCircle size={20} />
            </a>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-end justify-center z-0">
        <div className="absolute inset-0 z-[-1] bg-black overflow-hidden">
          <img 
            src={vendor.cover_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600"} 
            className="w-full h-full object-cover opacity-70"
            alt={vendor.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 translate-y-1/2">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-8 border-[#FAFAFA] bg-white overflow-hidden shadow-2xl"
          >
            <img src={vendor.logo_url || `https://ui-avatars.com/api/?name=${vendor.name}`} className="w-full h-full object-cover" alt="" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-12 pb-40 relative z-10">
        {/* Title and Metadata */}
        <div className="text-center pt-20 md:pt-24 pb-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black break-words leading-none">{vendor.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-3 px-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full whitespace-nowrap">{vendor.category}</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 whitespace-nowrap"><MapPin size={12} className="text-primary"/> {vendor.neighborhood}</span>
          </div>
        </div>
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 -translate-y-8 px-2 sm:px-0">
          {[
            { icon: Star, val: vendor.rating || "5.0", label: "Avis" },
            { icon: Clock, val: `${vendor.avg_delivery_time || "25-35"}`, label: "Min" },
            { icon: Phone, val: vendor.phone || "Contact", label: "Appeler", action: () => vendor.phone && (window.location.href = `tel:${vendor.phone}`) },
          ].map((stat, i) => (
            <button 
              key={i} 
              onClick={stat.action}
              className="bg-white p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] shadow-xl border border-gray-50 flex flex-col items-center justify-center gap-1 min-w-0 active:scale-95 transition-all"
            >
              <stat.icon size={16} className="text-primary mb-0.5 sm:mb-1 shrink-0" />
              <span className="font-black text-xs sm:text-sm truncate w-full text-center">{stat.val}</span>
              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-gray-400 truncate w-full text-center">{stat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu du Jour */}
        {(dailyItems.entree || dailyItems.plat || dailyItems.dessert) && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Le Menu <span className="text-primary">du Jour</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sélection fraîche du {currentDay}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(dailyItems).map(([type, item]) => item && (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative group bg-white p-6 rounded-[48px] border border-gray-100 shadow-xl overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-3 py-1 rounded-full bg-black text-white text-[8px] font-black uppercase tracking-widest">{type}</span>
                  </div>
                  <div className="w-20 h-20 rounded-3xl overflow-hidden mb-4 shadow-lg">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                  </div>
                  <h3 className="font-black text-sm uppercase mb-1 truncate pr-10">{item.name}</h3>
                  <p className="text-[9px] text-gray-400 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-base text-primary">{item.price.toLocaleString()} F</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-primary"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Tabs */}
        <div className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-md -mx-6 px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-black text-white shadow-xl" : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-16">
          {categories.filter(c => c !== "Tous" || activeCategory === "Tous").map(cat => {
            const catProducts = products.filter(p => p.category?.toLowerCase() === (cat === "Tous" ? activeCategory : cat).toLowerCase());
            if (activeCategory !== "Tous" && cat !== activeCategory) return null;
            
            if (!catProducts.length) {
              if (activeCategory === "Tous") return null;
              return (
                <div key={cat} className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <Utensils size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucun plat dans cette catégorie</p>
                </div>
              );
            }

            return (
              <div key={cat} className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{cat}</h2>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catProducts.map(p => (
                    <motion.div
                      key={p.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 flex flex-col"
                    >
                      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-50">
                        <img 
                          src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800"} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt={p.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                          <span className="font-black text-sm text-primary">{p.price.toLocaleString()} F</span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between bg-white relative z-10">
                        <div className="mb-6">
                          <h3 className="font-black text-lg uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{p.name}</h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(p)}
                          className="w-full py-4 rounded-[20px] bg-gray-50 hover:bg-black hover:text-white text-black font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-300" /> Ajouter
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Infos Section */}
        <section className="p-8 rounded-[48px] bg-white border border-gray-100 shadow-xl space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                 <Info size={24} />
              </div>
              <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter">Informations <span className="text-primary">Pratiques</span></h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Localisation et horaires d'ouverture</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <MapPin className="text-primary shrink-0" size={20} />
                    <div>
                       <p className="font-black text-xs uppercase tracking-widest mb-1 text-gray-400">Adresse</p>
                       <p className="text-sm font-bold leading-relaxed">
                          {vendor.neighborhood}, {vendor.city}<br/>
                          <span className="text-gray-400 font-medium">{vendor.address || "Adresse non précisée"}</span>
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <Clock className="text-primary shrink-0" size={20} />
                    <div>
                       <p className="font-black text-xs uppercase tracking-widest mb-1 text-gray-400">Horaires d'aujourd'hui</p>
                       <p className="text-sm font-bold">
                          {vendor.open ? "Ouvert actuellement" : "Fermé"} • {vendor.deliveryTime || "Service continu"}
                       </p>
                    </div>
                 </div>
              </div>
              <div className="bg-gray-50 rounded-[32px] p-6 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Modes de Paiement</h4>
                 <div className="flex flex-wrap gap-2">
                    {vendor.payment_methods?.map((m: string) => (
                       <span key={m} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest">
                          {m.replace('_', ' ')}
                       </span>
                    )) || <span className="text-[10px] font-bold text-gray-400 italic">Espèces acceptées</span>}
                 </div>
              </div>
           </div>
        </section>
      </div>

      {/* Floating Bottom Cart Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-4 right-4 z-[60] flex justify-center"
          >
            <Link 
              to="/app/cart" 
              className="w-full max-w-md px-6 py-4 bg-black text-white rounded-[32px] shadow-2xl shadow-black/40 flex items-center justify-between gap-4 hover:bg-primary active:scale-95 transition-all border border-white/10 backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ShoppingCart size={20} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
                    {totalItems}
                  </span>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="font-black text-[10px] uppercase tracking-widest opacity-60">Voir mon panier</span>
                  <span className="font-black text-lg">{totalPrice.toLocaleString()} F</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 hidden sm:block">Commander</span>
                <ChevronRight size={20} className="text-primary" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
