import { useState, useMemo } from "react";
import { Product, VendorProfile } from "@/data/mockData";
import { Search, Package, Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  products: Product[];
  vendor: VendorProfile;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export default function CatalogueSection({ products, vendor, onSelectProduct, onQuickAddToCart }: Props) {
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

  if (products.length === 0) return null;

  return (
    <section id="catalogue" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
              Notre Collection
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
              Catalogue Produits & Nouveautés
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article, modèle..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-gray-200 text-xs font-medium outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>

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

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(p => {
            const discount = p.originalPrice && p.originalPrice > p.price
              ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
              : 0;
            const photosCount = p.images?.length || (p.image ? 1 : 0);

            return (
              <motion.div
                key={p.id}
                layout
                whileHover={{ y: -4 }}
                onClick={() => onSelectProduct(p)}
                className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
              >
                {/* Photo */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={p.image || (p.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80")}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
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
                    <span className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {photosCount} photos
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary block">
                      {p.category || "Article"}
                    </span>
                    <h4 className="font-heading font-black text-xs sm:text-sm text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                      {p.name}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-black text-sm sm:text-base text-gray-900 block">
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
                        if (p.variants && p.variants.length > 0) {
                          onSelectProduct(p);
                        } else {
                          onQuickAddToCart(p);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center hover:bg-primary transition-colors shadow-sm"
                      title="Voir / Ajouter au panier"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
