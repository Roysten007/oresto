import { useState } from "react";
import { Product, ProductVariant } from "@/data/mockData";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

interface Props {
  products: Product[];
  vendorId: string;
  onSave: (product: Partial<Product>) => Promise<void>;
  onDelete: (id: string) => void;
}

const ECOMMERCE_CATEGORIES = [
  "Mode & Vêtements",
  "Chaussures & Baskets",
  "Téléphones & High-Tech",
  "Beauté & Cosmétiques",
  "Accessoires & Bijoux",
  "Maison & Décoration",
  "Électroménager",
  "Nouveautés & Promos"
];

const BADGES = ["PROMO", "BESTSELLER", "NOUVEAU", "VENTE FLASH", "STOCK LIMITÉ"];

export default function StepEcommerceCatalogue({ products, vendorId, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Variant editing temporary states
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantOptions, setNewVariantOptions] = useState("");
  const [newFeature, setNewFeature] = useState("");

  const handleAddMultiplePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 4);
    const newImageUrls: string[] = [...(editing?.images || [])];

    for (const file of fileList) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (!newImageUrls.includes(base64)) {
          newImageUrls.push(base64);
          setEditing(prev => ({
            ...prev,
            images: newImageUrls,
            image: prev?.image || newImageUrls[0] || ""
          }));
        }
      };
      reader.readAsDataURL(file);

      if (storage && vendorId) {
        setUploading(true);
        try {
          const sRef = storageRef(storage, `ecommerce/${vendorId}/${Date.now()}_${file.name}`);
          await uploadBytes(sRef, file);
          const url = await getDownloadURL(sRef);
          setEditing(prev => {
            const current = prev?.images || [];
            return {
              ...prev,
              images: current.map(img => img.startsWith("data:") ? url : img),
              image: prev?.image?.startsWith("data:") ? url : prev?.image || url
            };
          });
        } catch {} finally {
          setUploading(false);
        }
      }
    }
  };

  const removePhoto = (index: number) => {
    if (!editing?.images) return;
    const filtered = editing.images.filter((_, i) => i !== index);
    setEditing({
      ...editing,
      images: filtered,
      image: filtered[0] || ""
    });
  };

  const addVariant = () => {
    if (!newVariantName.trim() || !newVariantOptions.trim()) {
      toast.error("Précisez le nom (ex: Taille) et les options (ex: S, M, L)");
      return;
    }
    const options = newVariantOptions.split(",").map(o => o.trim()).filter(Boolean);
    const currentVariants: ProductVariant[] = editing?.variants || [];
    setEditing({
      ...editing,
      variants: [...currentVariants, { name: newVariantName.trim(), options }]
    });
    setNewVariantName("");
    setNewVariantOptions("");
  };

  const removeVariant = (idx: number) => {
    const current = editing?.variants || [];
    setEditing({
      ...editing,
      variants: current.filter((_, i) => i !== idx)
    });
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    const current = editing?.features || [];
    setEditing({
      ...editing,
      features: [...current, newFeature.trim()]
    });
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    const current = editing?.features || [];
    setEditing({
      ...editing,
      features: current.filter((_, i) => i !== idx)
    });
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.price) {
      toast.error("Nom du produit et prix de vente obligatoires");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...editing,
        image: editing.images?.[0] || editing.image || "",
        stock: editing.stock !== undefined ? Number(editing.stock) : 10,
        inStock: editing.stock !== undefined ? Number(editing.stock) > 0 : true
      });
      setEditing(null);
      toast.success("Fiche produit enregistrée avec succès !");
    } finally {
      setSaving(false);
    }
  };

  const categories = Array.from(new Set([...ECOMMERCE_CATEGORIES, ...products.map(p => p.category)])).filter(Boolean);

  return (
    <div className="space-y-8 font-body">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-gray-900 flex items-center gap-2.5">
            <i className="fa-solid fa-boxes-stacked text-primary"></i>
            Catalogue E-Commerce & Fiches Produits
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {products.length} produit{products.length > 1 ? "s" : ""} dans votre boutique en ligne avec multi-photos et variantes
          </p>
        </div>
        <button
          onClick={() => setEditing({
            name: "",
            price: 0,
            originalPrice: 0,
            category: "Mode & Vêtements",
            image: "",
            images: [],
            stock: 15,
            badge: "NOUVEAU",
            variants: [
              { name: "Taille", options: ["S", "M", "L", "XL"] },
              { name: "Couleur", options: ["Noir", "Blanc"] }
            ],
            features: ["Livraison express 24h", "Produit 100% authentique"],
            description: ""
          })}
          className="px-5 py-3 bg-black text-white rounded-2xl font-bold text-xs hover:bg-primary transition-all shadow-lg shadow-black/15 flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="py-14 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-center bg-gray-50/50 p-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-sm">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <p className="font-heading font-black text-gray-800 text-base">Votre vitrine e-commerce est prête</p>
          <p className="text-xs text-gray-400 max-w-sm">
            Ajoutez vos premiers articles (vêtements, chaussures, smartphones, cosmétiques...) avec plusieurs photos et prix barrés.
          </p>
          <button
            onClick={() => setEditing({
              name: "Sneakers Streetwear Urban",
              price: 18500,
              originalPrice: 25000,
              category: "Chaussures & Baskets",
              stock: 20,
              badge: "PROMO",
              variants: [{ name: "Pointure", options: ["40", "41", "42", "43", "44"] }],
              features: ["Semelle amortissante", "Livraison gratuite"],
              description: "Chaussures tendance confortables et résistantes."
            })}
            className="mt-2 px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:bg-primary/90 transition-all"
          >
            Créer un produit exemple
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map(p => {
          const discount = p.originalPrice && p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
          const photosCount = p.images?.length || (p.image ? 1 : 0);

          return (
            <div key={p.id} className="p-4 bg-white rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between gap-4 hover:border-primary/50 transition-all group">
              
              <div className="flex gap-3.5">
                {/* Photo container */}
                <div className="relative w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-150">
                  {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                      <i className="fa-solid fa-box-open"></i>
                    </div>
                  )}
                  {photosCount > 1 && (
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                      {photosCount} 📷
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {p.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-black text-white text-[8px] font-black uppercase tracking-wider">
                        {p.badge}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[8px] font-black">
                        -{discount}%
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400 font-bold truncate">{p.category}</span>
                  </div>

                  <h3 className="font-heading font-black text-xs text-gray-900 truncate">{p.name}</h3>

                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-sm text-primary">
                      {Number(p.price).toLocaleString()} F
                    </span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {Number(p.originalPrice).toLocaleString()} F
                      </span>
                    )}
                  </div>

                  {/* Stock & Variants brief */}
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    <span>📦 Stock : <strong>{p.stock !== undefined ? p.stock : 10}</strong></span>
                    {p.variants && p.variants.length > 0 && (
                      <span>• {p.variants.length} variante{p.variants.length > 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <div className="flex gap-1.5">
                  {p.variants?.map(v => (
                    <span key={v.name} className="px-2 py-0.5 bg-gray-100 rounded-lg text-[9px] font-bold text-gray-600">
                      {v.name}: {v.options.slice(0, 2).join(",")}{v.options.length > 2 ? "..." : ""}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setEditing(p)} 
                    className="p-2 rounded-xl bg-gray-100 hover:bg-black hover:text-white transition-colors text-gray-700 text-xs"
                    title="Modifier la fiche"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button 
                    onClick={() => { if (confirm("Supprimer ce produit du catalogue ?")) onDelete(p.id); }} 
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors text-xs"
                    title="Supprimer"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Ajout / Modification Produit E-Commerce */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[36px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-heading font-black text-lg text-gray-900">
                  {editing.id ? "Modifier la fiche produit" : "Nouveau produit e-commerce"}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium">
                  Photos sous plusieurs angles, variantes, prix barrés et gestion de stock
                </p>
              </div>
              <button 
                onClick={() => setEditing(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
              
              {/* Galerie Multi-photos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Galerie Photos (Jusqu'à 4 photos) *
                  </label>
                  {uploading && <span className="text-[10px] text-primary font-bold"><i className="fa-solid fa-spinner fa-spin"></i> Téléversement...</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(editing.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                          Principale
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}

                  {(editing.images?.length || 0) < 4 && (
                    <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-orange-50/40 hover:border-primary transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center p-2">
                      <i className="fa-solid fa-cloud-arrow-up text-primary text-xl"></i>
                      <span className="text-[9px] font-bold text-gray-600">+ Ajouter photo</span>
                      <input type="file" accept="image/*" multiple onChange={handleAddMultiplePhotos} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </label>
                  )}
                </div>
              </div>

              {/* Titre et Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Nom du produit *</label>
                  <input
                    type="text"
                    value={editing.name || ""}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-xs outline-none focus:border-primary"
                    placeholder="Ex: Montre Connectée Pro Max"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Rayon / Catégorie</label>
                  <select
                    value={editing.category || ECOMMERCE_CATEGORIES[0]}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-gray-200 font-bold text-xs bg-white outline-none focus:border-primary"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tarifs (Prix Promo & Prix Barré) & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-600">Prix de vente (FCFA) *</label>
                  <input
                    type="number"
                    value={editing.price || ""}
                    onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-heading font-black text-base text-primary outline-none focus:border-primary"
                    placeholder="15000"
                    min="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-600">Prix barré / Ancien prix</label>
                  <input
                    type="number"
                    value={editing.originalPrice || ""}
                    onChange={e => setEditing({ ...editing, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-bold text-xs text-gray-500 outline-none focus:border-primary"
                    placeholder="20000"
                    min="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-600">Stock disponible</label>
                  <input
                    type="number"
                    value={editing.stock !== undefined ? editing.stock : 10}
                    onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-bold text-xs text-gray-800 outline-none focus:border-primary"
                    placeholder="10"
                    min="0"
                  />
                </div>
              </div>

              {/* Badges Marketing */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Badge Marketing (Optionnel)</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, badge: undefined })}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${!editing.badge ? "bg-black text-white" : "bg-gray-50 text-gray-600"}`}
                  >
                    Aucun
                  </button>
                  {BADGES.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditing({ ...editing, badge: b })}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                        editing.badge === b ? "bg-primary text-white border-primary shadow-sm" : "bg-gray-50 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gestion des Variantes (Tailles, Couleurs) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                  Variantes de Produit (Tailles, Couleurs, Modèles)
                </label>

                {editing.variants && editing.variants.length > 0 && (
                  <div className="space-y-2">
                    {editing.variants.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                          <span className="font-black text-gray-900 uppercase text-[10px]">{v.name} : </span>
                          <span className="font-bold text-primary">{v.options.join(", ")}</span>
                        </div>
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 text-xs">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                  <input
                    type="text"
                    value={newVariantName}
                    onChange={e => setNewVariantName(e.target.value)}
                    placeholder="Type (ex: Taille)"
                    className="w-full sm:w-1/3 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold outline-none"
                  />
                  <input
                    type="text"
                    value={newVariantOptions}
                    onChange={e => setNewVariantOptions(e.target.value)}
                    placeholder="Options séparées par des virgules (ex: S, M, L, XL)"
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addVariant}
                    className="px-4 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 text-xs"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>

              {/* Points forts & Description */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">
                  Points Forts & Description
                </label>

                {editing.features && editing.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {editing.features.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold">
                        <i className="fa-solid fa-check text-[8px]"></i> {f}
                        <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-600"><i className="fa-solid fa-xmark"></i></button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    placeholder="Ajouter un avantage (ex: Garantie 1 an, 100% Coton)..."
                    className="flex-1 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs outline-none"
                  />
                  <button type="button" onClick={addFeature} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 font-bold rounded-xl text-xs">
                    Ajouter
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Description complète, caractéristiques techniques et conseils d'utilisation..."
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

            </div>

            {/* Modal Footer */}
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
                {saving ? "Sauvegarde..." : "Valider la fiche produit"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
