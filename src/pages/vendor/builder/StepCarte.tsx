import { useState, useEffect } from "react";
import { Product } from "@/data/mockData";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

interface Props {
  products: Product[];
  vendorId: string;
  onSave: (product: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => void;
  category?: string;
  isHotel?: boolean;
}

const DISH_CATEGORIES = [
  "Entrées & Tapas",
  "Plats Principaux & Grillades",
  "Spécialités Africaines",
  "Fast-Food, Burgers & Chawarma",
  "Desserts & Douceurs",
  "Boissons & Cocktails",
  "Accompagnements"
];

export default function StepCarte({ products, vendorId, onSave, onDelete, isHotel = false }: Props) {
  const defaultCategories = DISH_CATEGORIES;
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editing) {
        setEditing(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editing]);

  // Filtrer uniquement les plats et produits de restaurant
  const restaurantProducts = products.filter(p => 
    !["chaussure", "sneaker", "basket", "mode", "vêtement", "robe", "chemise", "smartphone", "high-tech", "chambre", "suite", "bungalow", "appartement", "studio"].some(
      forbidden => (p.category || "").toLowerCase().includes(forbidden) || (p.name || "").toLowerCase().includes(forbidden)
    )
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditing(prev => prev ? { ...prev, image: reader.result as string } : prev);
    };
    reader.readAsDataURL(file);

    if (!storage || !vendorId) return;
    setUploading(true);
    try {
      const sRef = storageRef(storage, `products/${vendorId}/${Date.now()}_${file.name}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      setEditing(prev => prev ? { ...prev, image: url } : prev);
    } catch {
      // Conserver l'aperçu local
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.name || (!editing?.price && !editing?.minPrice)) { 
      toast.error("Nom et prix du plat requis"); 
      return; 
    }
    setSaving(true);
    try { 
      const isFlex = editing.priceType === "flexible";
      const basePrice = isFlex ? Number(editing.minPrice || editing.price || 150) : Number(editing.price);
      await onSave({
        ...editing,
        price: basePrice,
        minPrice: isFlex ? basePrice : undefined,
        priceType: isFlex ? "flexible" : "fixed",
        priceStep: isFlex ? Number(editing.priceStep || 50) : undefined,
        category: editing.category || DISH_CATEGORIES[1]
      }); 
      setEditing(null); 
    } finally { 
      setSaving(false); 
    }
  };

  const allCategories = Array.from(new Set([...DISH_CATEGORIES, ...restaurantProducts.map(p => p.category)])).filter(Boolean);
  const categorizedProducts = allCategories.map(cat => ({
    cat,
    items: restaurantProducts.filter(p => p.category === cat)
  })).filter(g => g.items.length > 0);

  const ungrouped = restaurantProducts.filter(p => !p.category);

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-gray-900">
            La Carte & Vos Plats
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {restaurantProducts.length} plat{restaurantProducts.length !== 1 ? 's' : ''} configuré{restaurantProducts.length !== 1 ? 's' : ''} sur votre vitrine
          </p>
        </div>
        <button
          onClick={() => setEditing({ name: "", price: undefined as any, category: DISH_CATEGORIES[1], image: "", description: "" })}
          className="px-5 py-3 bg-primary text-white rounded-2xl font-bold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Ajouter un plat</span>
        </button>
      </div>

      {restaurantProducts.length === 0 && (
        <div className="py-14 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-center bg-gray-50/50 p-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-primary flex items-center justify-center text-2xl">
            <i className={`fa-solid ${isHotel ? "fa-bed" : "fa-utensils"}`}></i>
          </div>
          <p className="font-bold text-gray-800 text-sm">{isHotel ? "Aucune chambre enregistrée" : "Votre carte est vide"}</p>
          <p className="text-xs text-gray-400 max-w-xs">
            Ajoutez vos spécialités pour qu'elles s'affichent instantanément sur votre site.
          </p>
          <button
            onClick={() => setEditing({ name: "", price: undefined as any, category: isHotel ? "Standard" : "Plats Principaux & Grillades", image: "", description: "" })}
            className="mt-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Ajouter mon premier plat</span>
          </button>
        </div>
      )}

      {/* Groupes par catégorie */}
      <div className="space-y-6">
        {categorizedProducts.map(({ cat, items }) => (
          <div key={cat} className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <i className="fa-solid fa-tag text-primary text-[10px]"></i>
                {cat}
              </h3>
              <span className="text-[10px] font-bold text-gray-400">{items.length} article{items.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map(p => (
                <div key={p.id} className="p-3 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3 hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 relative overflow-hidden shrink-0">
                    {p.image ? (
                      <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                        <i className={`fa-solid ${isHotel ? "fa-bed" : "fa-utensils"}`}></i>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{p.description || "Recette maison"}</p>
                    <p className="font-heading font-black text-xs text-primary mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>{p.priceType === "flexible" ? `À partir de ${(p.minPrice || p.price).toLocaleString()} F` : `${Number(p.price).toLocaleString()} F`}</span>
                      {p.priceType === "flexible" && (
                        <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.2 rounded-sm">
                          Portion libre
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button 
                      onClick={() => setEditing(p)} 
                      className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors text-xs"
                      title="Modifier"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button 
                      onClick={() => { if(confirm("Supprimer cet élément ?")) onDelete(p.id); }} 
                      className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-xs"
                      title="Supprimer"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {ungrouped.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 pb-2">Autres articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ungrouped.map(p => (
                <div key={p.id} className="p-3 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-gray-900 truncate">{p.name}</p>
                    <p className="font-black text-xs text-primary">{Number(p.price).toLocaleString()} F</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(p)} className="p-2 text-gray-400 hover:text-black"><i className="fa-solid fa-pen"></i></button>
                    <button onClick={() => onDelete(p.id)} className="p-2 text-red-400 hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading font-black text-base text-gray-900">
                {editing.id ? (isHotel ? "Modifier la chambre" : "Modifier le plat") : (isHotel ? "Ajouter une chambre" : "Ajouter un plat")}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Fermer la fenêtre d'édition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4 flex-1 text-xs">
              {/* Photo */}
              <div className="relative aspect-video rounded-2xl bg-gray-100 overflow-hidden cursor-pointer group border-2 border-dashed border-gray-200 hover:border-primary transition-all">
                {editing.image ? (
                  <img src={editing.image} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-1.5">
                    <i className="fa-solid fa-camera text-2xl text-gray-400"></i>
                    <span className="text-[10px] font-bold uppercase">{isHotel ? "Photo de la chambre" : "Photo du plat"}</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                    <i className="fa-solid fa-spinner fa-spin"></i> Sauvegarde...
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                  Changer la photo
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                  {isHotel ? "Nom de la chambre *" : "Nom du plat *"}
                </label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder={isHotel ? "Ex: Suite Royale 201" : "Ex: Poulet Braisé & Alloco"}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                  {isHotel ? "Prix par nuit (FCFA) *" : "Prix du plat (FCFA) *"}
                </label>
                <input
                  type="number"
                  value={editing.price || ""}
                  onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-heading font-black text-lg text-primary outline-none focus:border-primary"
                  placeholder="Ex: 2500"
                  min="0"
                />
              </div>

              {/* Option Plat à la portion / Montant libre */}
              <div className="p-3.5 bg-orange-50/80 border border-orange-200/80 rounded-2xl space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setEditing(prev => prev ? ({
                    ...prev,
                    priceType: prev.priceType === "flexible" ? "fixed" : "flexible",
                    minPrice: prev.minPrice || prev.price || 150,
                    priceStep: prev.priceStep || 50
                  }) : prev)}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="flexible-toggle"
                      checked={editing.priceType === "flexible"}
                      onChange={e => setEditing(prev => prev ? ({
                        ...prev,
                        priceType: e.target.checked ? "flexible" : "fixed",
                        minPrice: prev.minPrice || prev.price || 150,
                        priceStep: prev.priceStep || 50
                      }) : prev)}
                      className="w-4 h-4 text-primary rounded-sm border-gray-300 focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="flexible-toggle" className="text-xs font-bold text-gray-900 cursor-pointer">
                      Plat à montant libre / portion au choix
                    </label>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    editing.priceType === "flexible" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {editing.priceType === "flexible" ? "Activé" : "Fixe"}
                  </span>
                </div>

                {editing.priceType === "flexible" && (
                  <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-orange-200/60 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                        Montant minimum (FCFA) *
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        value={editing.minPrice || editing.price || 150}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setEditing(prev => prev ? ({ ...prev, minPrice: val, price: val }) : prev);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-orange-200 text-xs font-bold text-gray-900 outline-none focus:border-primary"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-600 block mb-1">
                        Pas de tranche (FCFA)
                      </label>
                      <input
                        type="number"
                        min="25"
                        step="25"
                        value={editing.priceStep || 50}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setEditing(prev => prev ? ({ ...prev, priceStep: val }) : prev);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-orange-200 text-xs font-bold text-gray-900 outline-none focus:border-primary"
                        placeholder="50"
                      />
                    </div>
                    <p className="col-span-2 text-[10px] text-gray-600 leading-tight">
                      💡 Exemples au Bénin : Atassi, Alloco, Riz, Spaghetti, Pâte... Le client verra <strong>« À partir de {(editing.minPrice || 150).toLocaleString()} FCFA »</strong> et pourra choisir sa portion librement par tranche de {(editing.priceStep || 50).toLocaleString()} FCFA.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">Catégorie</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {Array.from(new Set([...defaultCategories, ...products.map(p => p.category)])).filter(Boolean).map(c => (
                    <button 
                      key={c} 
                      type="button" 
                      onClick={() => setEditing({ ...editing, category: c })} 
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                        editing.category === c ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editing.category || ""}
                  onChange={e => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary"
                  placeholder="Ou tapez une catégorie personnalisée..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editing.description || ""}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary resize-none"
                  placeholder={isHotel ? "Lit King size, Climatisation, Wifi, Balcon..." : "Accompagnement, épices, préparation..."}
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="py-3 px-5 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
              >
                {saving ? "Sauvegarde..." : "Valider et enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
