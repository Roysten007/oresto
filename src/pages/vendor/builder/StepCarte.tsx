import { useState } from "react";
import { Plus, Settings, Trash2, Camera, X, Check } from "lucide-react";
import { Product } from "@/data/mockData";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

interface Props {
  products: Product[];
  vendorId: string;
  onSave: (product: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => void;
}

const CATEGORIES = ["Entrées", "Plats", "Desserts", "Boissons", "Spécialités"];

export default function StepCarte({ products, vendorId, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Toujours afficher un aperçu local instantané
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditing(prev => prev ? { ...prev, image: reader.result as string } : prev);
    };
    reader.readAsDataURL(file);

    // Tenter l'upload Firebase en arrière-plan (optionnel)
    if (!storage || !vendorId) return;
    setUploading(true);
    try {
      const sRef = storageRef(storage, `products/${vendorId}/${Date.now()}_${file.name}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      // Remplacer le base64 par l'URL permanente
      setEditing(prev => prev ? { ...prev, image: url } : prev);
    } catch (err) {
      console.warn("Firebase Storage indisponible, aperçu local conservé", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.price) { toast.error("Nom et prix requis"); return; }
    setSaving(true);
    try { await onSave(editing); setEditing(null); }
    finally { setSaving(false); }
  };

  const categorizedProducts = CATEGORIES.map(cat => ({
    cat,
    items: products.filter(p => p.category === cat)
  })).filter(g => g.items.length > 0);

  const ungrouped = products.filter(p => !CATEGORIES.includes(p.category));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">La Carte</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} plat{products.length !== 1 ? 's' : ''} enregistré{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", price: 0, category: "Plats", image: "", description: "" })}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg"
        >
          <Plus size={18} /> Nouveau plat
        </button>
      </div>

      {products.length === 0 && (
        <div className="py-20 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-4 text-gray-400">
          <div className="text-5xl">🍽️</div>
          <p className="font-bold">Votre carte est vide</p>
          <p className="text-sm">Cliquez sur "Nouveau plat" pour commencer</p>
        </div>
      )}

      {categorizedProducts.map(({ cat, items }) => (
        <div key={cat} className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">{cat}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(p => (
              <div key={p.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                <div className="h-40 bg-gray-100 relative overflow-hidden">
                  {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl">🍴</div>}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(p)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors"><Settings size={13} /></button>
                    <button onClick={() => { if(confirm("Supprimer ce plat ?")) onDelete(p.id); }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.description}</p>
                  <p className="font-black text-lg mt-2">{Number(p.price).toLocaleString()} F</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {ungrouped.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Autres</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ungrouped.map(p => (
              <div key={p.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-36 bg-gray-100">{p.image && <img src={p.image} className="w-full h-full object-cover" />}</div>
                <div className="p-4"><p className="font-bold text-sm">{p.name}</p><p className="font-black">{Number(p.price).toLocaleString()} F</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-black text-lg">{editing.id ? "Modifier le plat" : "Nouveau plat"}</h3>
              <button onClick={() => setEditing(null)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5 flex-1">
              {/* Image upload */}
              <div className="relative aspect-video rounded-2xl bg-gray-100 overflow-hidden cursor-pointer group">
                {editing.image
                  ? <img src={editing.image} className="w-full h-full object-cover" alt="" />
                  : <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2"><Camera size={32} /><span className="text-xs font-bold uppercase">Photo du plat</span></div>
                }
                {uploading && <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sauvegarde...</div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">Changer la photo</div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Nom du plat *</label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 font-bold text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Ex: Poulet Braisé"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Prix (FCFA) *</label>
                <input
                  type="number"
                  value={editing.price || ""}
                  onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 font-black text-xl outline-none focus:ring-2 focus:ring-black"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} type="button" onClick={() => setEditing({ ...editing, category: c })} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${editing.category === c ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{c}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Description</label>
                <textarea
                  value={editing.description || ""}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-black resize-none h-20"
                  placeholder="Ingrédients, préparation..."
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-black text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 hover:bg-gray-800 transition-colors"
              >
                {saving ? "Enregistrement..." : "Enregistrer le plat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
