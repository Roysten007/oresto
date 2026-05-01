import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Utensils, 
  MessageCircle,
  Phone,
  Share2,
  Heart,
  Info,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorProfile, Product, Review, mockReviews } from "@/data/mockData";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useClient } from "@/contexts/ClientContext";

export default function ShopDetail() {
  const { id } = useParams(); // This is the slug based on Decouvrir.tsx
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeTab, setActiveTab] = useState<"menu" | "avis" | "infos">("menu");

  const { addToCart, totalItems, totalPrice } = useCart();
  const { favorites, toggleFavorite } = useClient();

  useEffect(() => {
    if (!id || !db) { setLoading(false); return; }

    const timeout = setTimeout(() => setLoading(false), 5000);
    let cancelled = false;

    const fetchProducts = (vId: string) => {
      // Use get for fast one-shot, then switch to onValue for real-time updates
      get(ref(db, 'products')).then((psnap) => {
        if (cancelled) return;
        const pData = psnap.val();
        if (pData) {
          const list = Object.keys(pData)
            .map(k => ({ id: k, ...pData[k] }))
            .filter((p: any) => p.vendorId === vId) as Product[];
          setProducts(list);
        }
      });
    };

    const handleVendorFound = (vId: string, vData: VendorProfile) => {
      if (cancelled) return;
      setVendor(vData);
      fetchProducts(vId);
      clearTimeout(timeout);
      setLoading(false);
    };

    const vendorsRef = ref(db, 'vendors');
    const slugQuery = query(vendorsRef, orderByChild('slug'), equalTo(id));

    // Fast path: try slug query + direct ID in parallel
    Promise.all([
      get(slugQuery),
      get(ref(db, `vendors/${id}`))
    ]).then(([slugSnap, directSnap]) => {
      if (cancelled) return;
      
      // 1. Try slug match first
      const slugData = slugSnap.val();
      if (slugData) {
        const vId = Object.keys(slugData)[0];
        handleVendorFound(vId, { id: vId, ...slugData[vId] } as VendorProfile);
        return;
      }
      
      // 2. Try direct ID match
      if (directSnap.exists()) {
        handleVendorFound(id, { id, ...directSnap.val() } as VendorProfile);
        return;
      }
      
      // 3. Last resort: scan all vendors
      get(vendorsRef).then((allSnap) => {
        if (cancelled) return;
        const allData = allSnap.val();
        if (allData) {
          const foundKey = Object.keys(allData).find(k => allData[k].slug === id);
          if (foundKey) {
            handleVendorFound(foundKey, { id: foundKey, ...allData[foundKey] } as VendorProfile);
            return;
          }
        }
        clearTimeout(timeout);
        setLoading(false);
      });
    }).catch(() => {
      if (!cancelled) {
        clearTimeout(timeout);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [id]);

  const isFavorite = vendor ? favorites.includes(vendor.id) : false;
  const reviews = useMemo(() => mockReviews.filter(r => r.shopId === vendor?.id), [vendor]);

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
    <div className="min-h-screen bg-[#FAFAFA] -mx-6 animate-pulse">
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
    <div className="py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
        <Utensils size={40} />
      </div>
      <p className="font-black text-sm uppercase">Restaurant introuvable</p>
      <button onClick={() => navigate('/app/decouvrir')} className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase">Retour</button>
    </div>
  );

  return (
    <div className="-mx-6 bg-white min-h-screen pb-40">
      {/* Hero Section */}
      <section className="relative h-[45vh] overflow-hidden">
        <img 
          src={vendor.cover_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600"} 
          className="w-full h-full object-cover"
          alt={vendor.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        {/* Floating Actions */}
        <div className="absolute top-8 left-6 right-6 flex justify-between z-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-all">
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => toggleFavorite(vendor.id)}
              className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-all"
            >
              <Heart size={18} className={isFavorite ? "fill-primary text-primary border-none" : ""} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-center text-white">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-20 h-20 rounded-[28px] border-4 border-white bg-white overflow-hidden shadow-2xl mb-4">
            <img src={vendor.logo_url || `https://ui-avatars.com/api/?name=${vendor.name}`} className="w-full h-full object-cover" alt="" />
          </motion.div>
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{vendor.name}</h1>
          <div className="flex items-center gap-3 text-[10px] font-bold text-white/70 uppercase tracking-widest">
            <span>{vendor.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><MapPin size={10} /> {vendor.neighborhood}</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="px-6 grid grid-cols-3 gap-4 -translate-y-8">
        {[
          { icon: Star, val: vendor.rating || "5.0", label: "Note", color: "text-amber-400" },
          { icon: Clock, val: "25-35", label: "Min", color: "text-blue-400" },
          { icon: Info, val: "Détails", label: "Infos", color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-[32px] shadow-xl border border-gray-50 flex flex-col items-center justify-center gap-1">
            <stat.icon size={18} className={`${stat.color} mb-1`} />
            <span className="font-black text-sm">{stat.val}</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 flex gap-8 border-b border-gray-50 mb-8 overflow-x-auto scrollbar-hide">
        {["Menu", "Avis", "Informations"].map((tab, i) => {
          const key = i === 0 ? "menu" : i === 1 ? "avis" : "infos";
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                active ? "text-primary" : "text-gray-400"
              }`}
            >
              {tab}
              {active && <motion.div layoutId="shopTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="px-6 space-y-10">
        <AnimatePresence mode="wait">
          {activeTab === "menu" ? (
            <motion.div key="menu" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-10">
              {/* Menu du Jour */}
              {(dailyItems.entree || dailyItems.plat || dailyItems.dessert) && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tight">Le Menu <span className="text-primary">du Jour</span></h2>
                    <span className="text-[9px] font-black uppercase bg-gray-50 px-3 py-1.5 rounded-full text-gray-400">{currentDay}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(dailyItems).map(([type, item]) => item && (
                      <div key={type} className="flex gap-4 p-5 rounded-[40px] bg-black text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Utensils size={60} />
                         </div>
                         <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/10">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                         </div>
                         <div className="flex-1 flex flex-col justify-between py-1 relative z-10">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[8px] font-black uppercase tracking-widest text-primary">{type}</span>
                               </div>
                               <h3 className="font-black text-sm uppercase truncate">{item.name}</h3>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                               <span className="font-black text-base">{item.price.toLocaleString()} F</span>
                               <button 
                                 onClick={() => addToCart(item)}
                                 className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                               >
                                 <Plus size={18} />
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Category selector */}
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                      activeCategory === cat ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products List */}
              <div className="space-y-8">
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
                    <div key={cat} className="space-y-6">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black uppercase tracking-tight">{cat}</h2>
                        <div className="flex-1 h-px bg-gray-50" />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {catProducts.map(p => (
                          <div key={p.id} className="flex gap-4 p-4 rounded-[32px] bg-white border border-gray-50 shadow-sm group active:scale-[0.98] transition-all">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                              <div>
                                <h3 className="font-black text-sm uppercase truncate leading-tight">{p.name}</h3>
                                <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-black text-base">{p.price.toLocaleString()} F</span>
                                <button 
                                  onClick={() => addToCart(p)}
                                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all"
                                >
                                  <Plus size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : activeTab === "avis" ? (
            <motion.div key="avis" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              {reviews.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200"><MessageCircle size={32} /></div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucun avis pour le moment</p>
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="p-6 rounded-[32px] bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-[10px] uppercase tracking-widest">{r.userName}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic leading-relaxed">"{r.comment}"</p>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div key="infos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">À propos</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{vendor.description || "Aucune description disponible pour ce restaurant."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button className="flex items-center justify-center gap-3 py-5 rounded-[28px] bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                   <Phone size={16} /> Appeler
                 </button>
                 <button className="flex items-center justify-center gap-3 py-5 rounded-[28px] bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest">
                   <MessageCircle size={16} /> WhatsApp
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
