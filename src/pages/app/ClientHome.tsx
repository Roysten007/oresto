import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClient } from "@/contexts/ClientContext";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { VendorProfile } from "@/data/mockData";
import { Search, MapPin, Heart, Star, Clock, Utensils, Sparkles, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function RestaurantCard({ restaurant, featured = false }: { restaurant: VendorProfile; featured?: boolean }) {
  const [isFav, setIsFav] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex-shrink-0 ${featured ? "w-[320px]" : "w-[260px]"}`}
    >
      <Link to={`/r/${restaurant.slug || restaurant.id}`} className="block group">
        <div className={`relative overflow-hidden rounded-[36px] bg-white border border-gray-100 shadow-sm group-hover:shadow-xl transition-all duration-500 ${featured ? "h-64" : "h-48"}`}>
          <img
            src={restaurant.cover_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={restaurant.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            {restaurant.promo_label && (
              <span className="px-3 py-1.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                {restaurant.promo_label}
              </span>
            )}
            {featured && (
              <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <Zap size={10} className="text-amber-400" /> Tendance
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
            <div className="min-w-0 flex-1 mr-2">
              <h3 className="font-black text-base uppercase tracking-tight truncate leading-none mb-1">{restaurant.name}</h3>
              <p className="text-[9px] font-bold opacity-75 uppercase tracking-widest flex items-center gap-2">
                <span className="flex items-center gap-1"><Clock size={9} /> {restaurant.deliveryTime || "25-35 min"}</span>
                {restaurant.distance && (
                  <span className="flex items-center gap-1 text-primary font-black"><MapPin size={9} /> {restaurant.distance.toFixed(1)} km</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-xl shrink-0">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-black">{restaurant.rating || "5.0"}</span>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={() => setIsFav(!isFav)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all shadow-lg active:scale-90"
      >
        <Heart size={16} className={isFav ? "fill-primary text-primary" : ""} />
      </button>
    </motion.div>
  );
}

export default function ClientHome() {
  const { user } = useAuth();
  const { city, location } = useClient();
  const [restaurants, setRestaurants] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const [isHungerZoneActive, setIsHungerZoneActive] = useState(() => {
    return localStorage.getItem("oresto_hunger_zone") === "true";
  });

  useEffect(() => {
    localStorage.setItem("oresto_hunger_zone", isHungerZoneActive.toString());
  }, [isHungerZoneActive]);

  useEffect(() => {
    const unsub = onValue(ref(db, "vendors"), snap => {
      const data = snap.val();
      if (data) {
        let list = Object.keys(data).map(k => ({ id: k, ...data[k] })) as VendorProfile[];
        list = list.filter(r => r.is_published);
        
        // Add distance (use client location or default Cotonou center)
        const refLat = location?.lat || 6.36536;
        const refLng = location?.lng || 2.41833;

        list = list.map(r => {
          // If vendor has no location, simulate one near Cotonou
          const vLat = r.location?.lat || (6.36536 + (r.id.charCodeAt(0) % 10) * 0.01);
          const vLng = r.location?.lng || (2.41833 + (r.id.charCodeAt(r.id.length - 1) % 10) * 0.01);
          const dist = getDistance(refLat, refLng, vLat, vLng);
          return { ...r, distance: dist };
        });
        
        // Sort by closest by default
        list = list.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

        setRestaurants(list);
      } else {
        setRestaurants([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });
    return () => unsub();
  }, [location]);

  const displayedRestaurants = useMemo(() => {
    if (!isHungerZoneActive) return restaurants;
    // Strict 5km filter
    return restaurants.filter((r: any) => r.distance && r.distance < 5);
  }, [isHungerZoneActive, restaurants]);

  const promoList = useMemo(() => {
    return displayedRestaurants.filter(r => r.promo_banner_url || r.cover_url).slice(0, 5);
  }, [displayedRestaurants]);

  useEffect(() => {
    if (promoList.length < 2) {
      setPromoIndex(0);
      return;
    }
    const id = setInterval(() => setPromoIndex(p => (p + 1) % promoList.length), 4000);
    return () => clearInterval(id);
  }, [promoList.length]);

  // Ensure promoIndex is always valid
  useEffect(() => {
    if (promoIndex >= promoList.length && promoList.length > 0) {
      setPromoIndex(0);
    }
  }, [promoList, promoIndex]);

  if (loading) {
    return (
      <div className="py-8 space-y-10 pb-32">
        <div className="h-10 w-52 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-56 w-full bg-gray-100 rounded-[40px] animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-100 rounded-xl animate-pulse" />
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3].map(i => <div key={i} className="h-48 w-64 bg-gray-100 rounded-[36px] flex-shrink-0 animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12 pb-32">
      {/* Greeting */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1 w-full">
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            {greeting}, {user?.firstName && user.firstName !== "Client" ? user.firstName : (user?.name && user.name !== "Invité" ? user.name : "Gourmet")} 👋
          </motion.p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-[0.9] break-words">
              Envie de <span className="text-primary">manger ?</span>
            </h1>
            <Link to="/app/addresses" className="shrink-0 mt-1 flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Lieu</span>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-primary border-b border-primary/20 pb-0.5">
                <MapPin size={10} /> {city || "Cotonou"}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Hunger Zone */}
      <div className="space-y-4 px-2">
        <Link
          to="/app/decouvrir"
          className="flex items-center gap-4 px-6 py-5 rounded-[28px] bg-white shadow-lg shadow-gray-100/80 border border-gray-50 group hover:border-primary/30 transition-all"
        >
          <Search size={20} className="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
          <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 flex-1 truncate">Chercher un restaurant, un plat...</span>
          <ChevronRight size={16} className="text-gray-200 group-hover:text-primary transition-colors" />
        </Link>

        <div className="flex items-center justify-between px-6 py-4 bg-black text-white rounded-[24px] shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2 rounded-xl transition-colors ${isHungerZoneActive ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
              <MapPin size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black uppercase tracking-widest">Zone de faim</h3>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5 truncate">Max 5km autour de vous</p>
            </div>
          </div>
          <button 
            onClick={() => setIsHungerZoneActive(!isHungerZoneActive)}
            className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 relative z-10 ${isHungerZoneActive ? "bg-primary" : "bg-white/20"}`}
          >
            <motion.div 
              animate={{ x: isHungerZoneActive ? 24 : 0 }} 
              className="w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Promo Carousel */}
      {promoList.length > 0 && (
        <section className="relative h-56 rounded-[40px] overflow-hidden shadow-2xl shadow-black/20 mx-2">
          <AnimatePresence mode="wait">
              <motion.div
                key={promoIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {promoList[promoIndex] && (
                  <>
                    <img src={promoList[promoIndex].promo_banner_url || promoList[promoIndex].cover_url} className="w-full h-full object-cover" alt="Promo" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-[75%] space-y-3 text-white">
                      <span className="px-3 py-1 bg-primary text-[9px] font-black uppercase tracking-[0.2em] rounded-full w-fit">Offre Spéciale</span>
                      <h2 className="text-2xl font-black uppercase tracking-tight leading-tight truncate">
                        {promoList[promoIndex].promo_label || promoList[promoIndex].name}
                      </h2>
                      <Link
                        to={`/r/${promoList[promoIndex].slug || promoList[promoIndex].id}`}
                        className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full w-fit hover:scale-105 transition-transform active:scale-95"
                      >
                        Commander →
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {promoList.map((_, i) => (
              <button key={i} onClick={() => setPromoIndex(i)} className={`h-1.5 rounded-full transition-all ${i === promoIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </section>
      )}

      {/* Près de vous */}
      <section className="space-y-6">
        <div className="flex items-end justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none truncate max-w-[200px]">Près de <span className="text-primary">chez vous</span></h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <MapPin size={10} className="text-primary" /> {isHungerZoneActive ? "Zone de faim activée" : "Restaurants disponibles"}
            </p>
          </div>
          <Link to="/app/decouvrir" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 border-b border-primary/30 pb-0.5 shrink-0">
            Tout voir <ChevronRight size={12} />
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {displayedRestaurants.length > 0 ? (
            displayedRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-300 gap-4 border-2 border-dashed border-gray-100 rounded-[40px] mx-6">
              <Utensils size={36} className="opacity-40" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Aucun restaurant à proximité</p>
            </div>
          )}
        </div>
      </section>

      {/* Populaires */}
      {displayedRestaurants.length > 1 && (
        <section className="space-y-6">
          <div className="px-2 space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Les <span className="text-primary">Populaires</span></h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tops commandés en ce moment</p>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {displayedRestaurants.slice().reverse().map(r => <RestaurantCard key={r.id} restaurant={r} featured />)}
          </div>
        </section>
      )}
    </div>
  );
}
