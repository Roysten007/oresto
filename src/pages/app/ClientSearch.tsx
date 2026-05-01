import { useState } from "react";
import { Link } from "react-router-dom";
import { mockShops, categories } from "@/data/mockData";
import { Search, Heart, MapPin, Star, Clock, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientSearch() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const filterOptions = [
    { label: "⭐ 4.5+", value: "rating" },
    { label: "🟢 Ouvert", value: "open" },
    { label: "🚀 Rapide", value: "fast" },
    { label: "💎 Premium", value: "verified" },
    ...categories.map(c => ({ label: c.label, value: c.label }))
  ];

  const toggleFilter = (val: string) => {
    setActiveFilters(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const filtered = mockShops.filter(s => {
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (activeFilters.includes("open") && !s.open) return false;
    if (activeFilters.includes("verified") && !s.verified) return false;
    if (activeFilters.includes("rating") && s.rating < 4.5) return false;
    if (activeFilters.includes("fast") && parseInt(s.deliveryTime) > 30) return false;
    
    const catFilters = activeFilters.filter(f => categories.some(c => c.label === f));
    if (catFilters.length > 0 && !catFilters.includes(s.category)) return false;
    
    return true;
  });

  return (
    <div className="py-8 space-y-8 pb-40">
      {/* Search Header */}
      <div className="px-2 space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Recherche <span className="text-primary">Oresto</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trouvez votre prochaine saveur</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <Search size={20} />
          </div>
          <input 
            autoFocus 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Pizza, Burger, Sushi..."
            className="w-full pl-14 pr-6 py-6 rounded-[32px] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 outline-none font-black text-xs uppercase tracking-widest focus:border-primary transition-all" 
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-2">
        {filterOptions.map(f => (
          <button 
            key={f.value} 
            onClick={() => toggleFilter(f.value)}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeFilters.includes(f.value) 
                ? "bg-black text-white shadow-lg scale-105" 
                : "bg-white border border-gray-100 text-gray-400 hover:border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="px-4 flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {filtered.length} Résultats trouvés
        </p>
      </div>

      {/* Results Grid */}
      <div className="px-2 space-y-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-2">
                <p className="font-black text-sm uppercase">Aucun résultat</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                  Désolé, nous n'avons rien trouvé pour votre recherche. Essayez d'autres mots clés !
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filtered.map((shop, i) => (
                <motion.div
                  key={shop.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    to={`/app/shop/${shop.id}`} 
                    className="group block bg-white rounded-[48px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all active:scale-[0.98]"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img src={shop.coverImage} alt={shop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-6 left-6 flex gap-2">
                        {shop.open ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">Ouvert</span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-[8px] font-black uppercase tracking-widest">Fermé</span>
                        )}
                        {shop.verified && (
                          <span className="px-3 py-1.5 rounded-xl bg-primary text-white text-[8px] font-black uppercase tracking-widest">Vérifié</span>
                        )}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">{shop.name}</h3>
                          <p className="text-[10px] font-bold text-white/70 uppercase flex items-center gap-1">
                            <MapPin size={10} className="text-primary" /> {shop.neighborhood}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex flex-col items-center justify-center border border-white/20">
                          <Star size={14} className="fill-primary text-primary" />
                          <span className="text-[10px] font-black mt-0.5">{shop.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                      <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {shop.deliveryTime}</span>
                        <span>•</span>
                        <span>{shop.category}</span>
                      </div>
                      <button className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Heart size={20} />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
