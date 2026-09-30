import { useState, useMemo } from "react";
import { Product, VendorProfile } from "@/data/mockData";
import { Plus, Search, Utensils, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  products: Product[];
  vendor: VendorProfile;
  onAddToCart: (product: Product) => void;
}

export default function MenuSection({ products, vendor, onAddToCart }: Props) {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

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
  const dailyPlat = products.find(p => p.id === dailyMenuIds.plat);

  if (products.length === 0) return null;

  return (
    <section id="menu" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
              Notre Carte & Nos Saveurs
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
              Le Menu du Restaurant
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un plat, grillade..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-xs font-medium outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Suggestion du Chef (si configurée) */}
        {dailyPlat && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Sparkles size={12} />
                Suggestion du Chef ({currentDay})
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl">{dailyPlat.name}</h3>
              <p className="text-xs text-white/90 max-w-xl">{dailyPlat.description}</p>
            </div>
            <button
              onClick={() => onAddToCart(dailyPlat)}
              className="px-6 py-3.5 rounded-2xl bg-white text-gray-900 font-heading font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-lg shrink-0 flex items-center gap-2 active:scale-95"
            >
              <Plus size={14} />
              <span>Commander • {dailyPlat.price.toLocaleString()} FCFA</span>
            </button>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(p => (
            <motion.div
              key={p.id}
              layout
              whileHover={{ y: -3 }}
              className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Photo */}
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={p.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {p.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider">
                    {p.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-heading font-black text-base text-gray-900 leading-snug group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  {p.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-heading font-black text-lg text-primary">
                    {Number(p.price).toLocaleString()} FCFA
                  </span>

                  <button
                    type="button"
                    onClick={() => onAddToCart(p)}
                    className="px-4 py-2 rounded-xl bg-black text-white hover:bg-primary font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
                  >
                    <Plus size={14} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
