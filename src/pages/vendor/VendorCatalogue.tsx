import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { Product } from "@/data/mockData";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter, 
  UtensilsCrossed, 
  ChevronRight,
  MoreVertical,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function VendorCatalogue() {
  const { user, vendorProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Real-time products from Firebase
  useEffect(() => {
    if (!user?.vendorId) return;
    const productsRef = ref(db, `products`);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(p => p.vendorId === user.vendorId);
        setProducts(productList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.vendorId]);

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      await update(ref(db, `products/${productId}`), { available: !currentStatus });
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Supprimer ce plat définitivement ?")) return;
    try {
      await remove(ref(db, `products/${productId}`));
      toast.success("Plat supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight">Carte du <span className="text-primary">Restaurant</span></h1>
          <p className="font-sub text-sm text-muted-foreground mt-1">Gérez vos plats et menus digitaux en temps réel</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-3xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> AJOUTER UN PLAT
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher un plat, une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-card border border-border shadow-sm focus:ring-2 focus:ring-primary outline-none font-sub text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-4 rounded-3xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-card border border-border rounded-[40px] shadow-sm">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <UtensilsCrossed size={40} className="text-muted-foreground opacity-20" />
          </div>
          <h3 className="font-heading text-xl font-bold">Aucun plat trouvé</h3>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Commencez par ajouter vos spécialités pour que vos clients puissent les commander.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p, idx) => (
              <div
                key={p.id}
                className="group relative bg-card border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!p.available ? 'grayscale opacity-50' : ''}`} 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-foreground">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-foreground hover:text-primary transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-lg font-bold text-foreground leading-tight">{p.name}</h3>
                    <p className="font-heading text-lg font-black text-primary">{p.price.toLocaleString()} F</p>
                  </div>
                  <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-6">{p.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="font-sub text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {p.available ? 'En Stock' : 'Épuisé'}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => toggleAvailability(p.id, p.available)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black transition-all ${
                        p.available 
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {p.available ? <X size={12} /> : <Check size={12} />}
                      {p.available ? 'MARQUER ÉPUISÉ' : 'REMETTRE EN STOCK'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
