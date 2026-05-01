import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { VendorProfile } from "@/data/mockData";
import { useClient } from "@/contexts/ClientContext";
import { Search, Star, Clock, Utensils, MapPin, List, Map as MapIcon, ChevronDown, SlidersHorizontal, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "rating", label: "⭐ Mieux notés" },
  { id: "fast", label: "🕐 Rapides (<25min)" },
  { id: "cheap", label: "💰 Moins chers" },
  { id: "near", label: "📍 Zone de Faim (<5km)" },
  { id: "open", label: "🟢 Ouverts maintenant" },
];

export default function Decouvrir() {
  const { location } = useClient();
  const [restaurants, setRestaurants] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

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

  useEffect(() => {
    const vendorsRef = ref(db, 'vendors');
    const unsubscribe = onValue(vendorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let list = Object.keys(data).map(key => ({ id: key, ...data[key] })) as VendorProfile[];
        list = list.filter(r => r.is_published);

        // Add distance (use client location or default Cotonou center)
        const refLat = location?.lat || 6.36536;
        const refLng = location?.lng || 2.41833;

        list = list.map(r => {
          const vLat = r.location?.lat || (6.36536 + (r.id.length % 10) * 0.01);
          const vLng = r.location?.lng || (2.41833 + (r.id.length % 5) * 0.01);
          return { ...r, distance: getDistance(refLat, refLng, vLat, vLng) };
        });
        
        // Sort by distance by default
        list = list.sort((a: any, b: any) => a.distance - b.distance);

        setRestaurants(list);
      } else {
        setRestaurants([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [location]);

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter(r => 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine_tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    switch (activeFilter) {
      case "rating": result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "fast": result = result.filter(r => (r.avg_delivery_time || 30) <= 25); break;
      case "open": result = result.filter(r => r.open); break;
      case "near": 
        result = result.filter((r: any) => r.distance < 5);
        break;
      case "cheap":
        result = result.filter(r => r.avg_price_range?.includes("500") || r.avg_price_range?.includes("1000"));
        break;
    }

    return result;
  }, [restaurants, search, activeFilter, location]);

  return (
    <div className="py-8 space-y-8 pb-32">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between px-2 gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none truncate">Découvrir</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{filteredRestaurants.length} restaurants disponibles</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 shrink-0">
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-black text-white shadow-lg" : "text-gray-400"}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode("map")}
            className={`p-2 rounded-xl transition-all ${viewMode === "map" ? "bg-black text-white shadow-lg" : "text-gray-400"}`}
          >
            <MapIcon size={18} />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-20 z-30 bg-[#FAFAFA]/80 backdrop-blur-md -mx-6 px-6 py-2 space-y-4">
        <div className="relative group">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Pizza, Burger, Sushi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-12 py-5 rounded-[32px] bg-white border border-gray-100 shadow-sm focus:border-primary/20 focus:shadow-xl focus:shadow-primary/5 outline-none font-bold text-xs transition-all"
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === f.id 
                  ? "bg-black text-white shadow-xl scale-105" 
                  : "bg-white border border-gray-100 text-gray-400 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {loading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-gray-100 rounded-[40px] animate-pulse" />)
            ) : filteredRestaurants.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                  <Utensils size={40} className="text-gray-200" />
                </div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Aucun résultat</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Essayez d'autres filtres ou une autre recherche.</p>
              </div>
            ) : (
              filteredRestaurants.map((shop, i) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={`/r/${shop.slug}`} 
                    className="group relative block bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={shop.cover_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={shop.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        {shop.open ? (
                          <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">Ouvert</span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-widest">Fermé</span>
                        )}
                        {shop.promo_label && (
                          <span className="px-3 py-1.5 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest">Offre</span>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 w-14 h-14 rounded-2xl border-4 border-white bg-white overflow-hidden shadow-xl">
                        <img 
                          src={shop.logo_url || `https://ui-avatars.com/api/?name=${shop.name}`} 
                          className="w-full h-full object-cover"
                          alt="Logo"
                        />
                      </div>
                    </div>

                    <div className="p-6 pt-8 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="font-black text-xl uppercase tracking-tight truncate leading-none group-hover:text-primary transition-colors">{shop.name}</h3>
                          <div className="flex items-center gap-1 mt-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                            <MapPin size={10} className="text-primary" />
                            <span className="truncate">
                              {shop.neighborhood} {shop.distance ? `• ${shop.distance.toFixed(1)} km` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-xl text-xs font-black">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{shop.rating || "5.0"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={12} /> {shop.avg_delivery_time || "25"} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Utensils size={12} /> {shop.category}
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button className="flex-1 py-4 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors">
                          Commander
                        </button>
                        <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                          <Heart size={20} />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative h-[60vh] bg-gray-100 rounded-[48px] overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-200"
          >
            <MapPin size={48} className="text-primary mb-4 animate-bounce" />
            <p className="font-black text-xs uppercase tracking-widest text-gray-400">Carte interactive</p>
            <p className="text-[10px] text-gray-300 mt-2 font-bold">(Simulation Leaflet.js)</p>
            
            {/* Simulation de pins */}
            {filteredRestaurants.slice(0, 5).map((r, i) => (
              <div 
                key={r.id}
                className="absolute w-8 h-8 rounded-full border-4 border-white bg-primary shadow-lg overflow-hidden"
                style={{ top: `${20 + i * 15}%`, left: `${30 + i * 10}%` }}
              >
                <img src={r.logo_url} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
