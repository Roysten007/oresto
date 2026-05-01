import { useState, useEffect } from "react";
import { mockShops, VendorProfile } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import { useClient } from "@/contexts/ClientContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export default function Favorites() {
  const { favorites, toggleFavorite } = useClient();
  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!db) return;
    const vendorsRef = ref(db, 'vendors');
    const unsubscribe = onValue(vendorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) as VendorProfile[];
        setVendors(list);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const favShops = vendors.filter(v => favorites.includes(v.id));

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="py-8 space-y-10 pb-40">
      <div className="space-y-1 px-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Mes <span className="text-primary">Favoris</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{favShops.length} Restaurants enregistrés</p>
      </div>

      <AnimatePresence mode="popLayout">
        {favShops.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-200">
              <Heart size={48} />
            </div>
            <div className="space-y-2">
              <p className="font-black text-sm uppercase">C'est bien vide ici...</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[200px]">Enregistrez vos restaurants préférés pour les retrouver ici !</p>
            </div>
            <button 
              onClick={() => navigate('/app/decouvrir')}
              className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest"
            >
              Découvrir
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {favShops.map(shop => (
              <motion.div
                key={shop.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white rounded-[48px] overflow-hidden shadow-sm border border-gray-50 hover:shadow-xl transition-all"
              >
                <Link to={`/app/shop/${shop.slug}`} className="block">
                  <div className="h-48 relative overflow-hidden">
                    <img src={shop.cover_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800"} alt={shop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">{shop.name}</h3>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-white/70 uppercase">
                          <span className="flex items-center gap-1"><Star size={12} className="fill-primary text-primary" /> {shop.rating || "5.0"}</span>
                          <span>•</span>
                          <span>{shop.neighborhood}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => toggleFavorite(shop.id)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md text-primary flex items-center justify-center shadow-lg active:scale-90 transition-all border border-white"
                >
                  <Heart size={20} className="fill-primary" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
