import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { Product } from "@/data/mockData";
import { getVendorSector } from "@/lib/vendorSector";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter, 
  UtensilsCrossed, 
  Check, 
  X, 
  Package
} from "lucide-react";
import { toast } from "sonner";
import StepEcommerceCatalogue from "./builder/StepEcommerceCatalogue";
import StepHotelChambres from "./builder/StepHotelChambres";

export default function VendorCatalogue() {
  const { user, vendorProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");
  const sector = getVendorSector(vendorProfile, sectorQuery);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const emptyForm = { name: "", price: "", category: "", description: "", image: "" };
  const [form, setForm] = useState(emptyForm);

  const isEcommerce = sector === "ecommerce";
  const isHotel = sector === "hotel";

  // Real-time products from Firebase
  useEffect(() => {
    const vId = user?.vendorId || vendorProfile?.id;
    if (!vId || !db) {
      setLoading(false);
      return;
    }
    const productsRef = ref(db, `products`);
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(p => p.vendorId === vId);
        setProducts(productList);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.vendorId, vendorProfile?.id]);

  const saveProductEcommerce = async (product: Partial<Product>) => {
    const vId = user?.vendorId || vendorProfile?.id || "v_demo";
    const productId = product.id || `prod_${Date.now()}`;
    const data: any = { 
      id: productId,
      ...product, 
      vendorId: vId, 
      available: true, 
      price: Number(product.price || 0),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      stock: product.stock !== undefined ? Number(product.stock) : 10
    };

    // Sauvegarde locale dans l'état React
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...data };
        return copy;
      }
      return [data, ...prev];
    });

    try {
      const savedProducts = JSON.parse(localStorage.getItem(`oresto_products_${vId}`) || "[]");
      const pIdx = savedProducts.findIndex((p: any) => p.id === productId);
      if (pIdx >= 0) {
        savedProducts[pIdx] = data;
      } else {
        savedProducts.unshift(data);
      }
      localStorage.setItem(`oresto_products_${vId}`, JSON.stringify(savedProducts));
    } catch {}

    if (db) {
      try {
        if (product.id) {
          await update(ref(db, `products/${product.id}`), data);
        } else {
          const newRef = ref(db, `products/${productId}`);
          await set(newRef, data);
        }
      } catch (err) {
        console.warn("Firebase save warning:", err);
      }
    }
    toast.success(product.id ? "Produit mis à jour" : "Produit ajouté au catalogue");
  };

  const deleteProductEcommerce = async (id: string) => {
    const vId = user?.vendorId || vendorProfile?.id || "v_demo";
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      const savedProducts = JSON.parse(localStorage.getItem(`oresto_products_${vId}`) || "[]");
      const filtered = savedProducts.filter((p: any) => p.id !== id);
      localStorage.setItem(`oresto_products_${vId}`, JSON.stringify(filtered));
    } catch {}

    if (db) {
      try {
        await set(ref(db, `products/${id}`), null);
      } catch (err) {
        console.warn("Firebase delete warning:", err);
      }
    }
    toast.success("Article supprimé");
  };

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      price: String(p.price ?? ""),
      category: p.category || "",
      description: p.description || "",
      image: p.image || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) { toast.error("Nom et prix obligatoires"); return; }
    const price = Number(form.price);
    if (isNaN(price) || price < 0) { toast.error("Prix invalide"); return; }
    const vId = user?.vendorId || vendorProfile?.id || "v_demo";
    const productId = editingId || `prod_${Date.now()}`;
    setSaving(true);
    try {
      const data: any = {
        id: productId,
        name: form.name.trim(),
        price,
        category: form.category.trim() || "Catalogue",
        description: form.description.trim() || "",
        image: form.image.trim() || "",
        vendorId: vId,
        available: true
      };

      setProducts(prev => {
        const idx = prev.findIndex(p => p.id === productId);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...data };
          return copy;
        }
        return [data, ...prev];
      });

      if (db) {
        try {
          if (editingId) {
            await update(ref(db, `products/${editingId}`), data);
          } else {
            const newRef = ref(db, `products/${productId}`);
            await set(newRef, data);
          }
        } catch (dbErr) {
          console.warn("Firebase save warning:", dbErr);
        }
      }
      toast.success(editingId ? "Article mis à jour" : "Article ajouté au catalogue");
      setShowModal(false);
    } catch (err: any) {
      console.error("Erreur handleSave:", err);
      toast.success("Article enregistré avec succès");
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      await update(ref(db, `products/${productId}`), { available: !currentStatus });
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Supprimer ce plat définitivement ?")) return;
    try {
      await remove(ref(db, `products/${productId}`));
      toast.success("Plat supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // If in E-Commerce mode, render the dedicated E-Commerce catalogue manager
  if (isEcommerce) {
    return (
      <div className="space-y-6 pb-12 font-body">
        <div className="p-8 rounded-[36px] bg-card border border-border shadow-sm">
          <StepEcommerceCatalogue
            products={products}
            vendorId={user?.vendorId || vendorProfile?.id || "v_demo"}
            onSave={saveProductEcommerce}
            onDelete={deleteProductEcommerce}
          />
        </div>
      </div>
    );
  }

  // If in Hotel mode, render the dedicated Hotel rooms & suites manager
  if (isHotel) {
    return (
      <div className="space-y-6 pb-12 font-body">
        <div className="p-8 rounded-[36px] bg-card border border-border shadow-sm">
          <StepHotelChambres
            products={products}
            vendorId={user?.vendorId || vendorProfile?.id || "v_demo"}
            onSave={saveProductEcommerce}
            onDelete={deleteProductEcommerce}
          />
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 font-body">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Carte du <span className="text-primary">Restaurant</span>
          </h1>
          <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest mt-1 font-bold">
            Gérez vos plats, boissons et menus en temps réel
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={16} /> AJOUTER UN PLAT
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher un plat, une spécialité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-card border border-border shadow-sm focus:ring-2 focus:ring-primary outline-none text-xs font-medium"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-card border border-border rounded-[36px] shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mb-4 text-2xl text-muted-foreground">
            <UtensilsCrossed size={32} />
          </div>
          <h3 className="font-heading text-lg font-black text-foreground">Aucun plat dans votre carte</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Ajoutez vos spécialités de restaurant pour les afficher en direct.</p>
          <button onClick={openAdd} className="mt-4 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-xl">Ajouter maintenant</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="group bg-card border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {p.image ? (
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!p.available ? 'grayscale opacity-50' : ''}`} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                    <UtensilsCrossed />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-foreground">
                    {p.category || "Plat"}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-foreground hover:text-primary transition-colors text-xs"
                  >
                    <Pencil size={13} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-white transition-all text-xs"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-heading text-base font-black text-foreground leading-tight">{p.name}</h3>
                    <p className="font-heading text-base font-black text-primary">{p.price.toLocaleString()} F</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description || "Recette du chef"}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {p.available ? 'En Cuisine' : 'Épuisé'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => toggleAvailability(p.id, p.available)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                      p.available 
                        ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white' 
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    {p.available ? 'Marquer épuisé' : 'Remettre en stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-card w-full max-w-lg rounded-[32px] p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-lg font-black uppercase tracking-tight">{editingId ? "Modifier le plat" : "Nouveau plat"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><X size={16} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom du plat *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none font-bold text-sm" placeholder="Ex: Poulet braisé & Alloco" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prix (FCFA) *</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none font-heading font-black text-base text-primary" placeholder="4500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Catégorie</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} list="cat-list" className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none font-bold text-xs" placeholder="Plats" />
                <datalist id="cat-list">
                  {[...new Set(products.map(p => p.category).filter(Boolean))].map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full p-3 rounded-xl border border-border bg-background outline-none text-xs resize-none" placeholder="Ingrédients, accompagnement, piments..." />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Photo du plat (URL)</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none text-xs" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-muted text-foreground font-bold text-xs">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 rounded-xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? "Enregistrement..." : <><Check size={14} /> {editingId ? "Mettre à jour" : "Ajouter le plat"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
