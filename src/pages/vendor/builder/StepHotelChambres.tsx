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
}

const HOTEL_CATEGORIES = [
  "Chambre Standard",
  "Chambre Deluxe",
  "Suite Junior",
  "Suite Exécutive King",
  "Bungalow & Villa Privée",
  "Appartement Meublé",
  "Studio Équipé",
  "Chambre Familiale"
];

const HOTEL_BADGES = [
  "PETIT-DÉJ INCLUS",
  "VUE MER / PISCINE",
  "SUITE VIP",
  "COUP DE CŒUR",
  "RÉDUCTION LONG SÉJOUR",
  "CLIMATISÉ & FIBRE"
];

const COMMON_AMENITIES = [
  "Wi-Fi Fibre Haut Débit",
  "Climatisation Split 24h",
  "Lit King Size Confort Palace",
  "Salle de bain privée & Eau chaude",
  "Smart TV 4K avec Canal+",
  "Balcon privé avec vue",
  "Minibar & Réfrigérateur",
  "Petit-déjeuner buffet inclus",
  "Groupe électrogène automatique",
  "Service de ménage quotidien"
];

export default function StepHotelChambres({ products, vendorId, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editing) {
        setEditing(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editing]);

  // Filtrer les produits pour ne garder que les chambres / hébergements
  const hotelProducts = products.filter(p => 
    HOTEL_CATEGORIES.some(c => c.toLowerCase() === (p.category || "").toLowerCase()) ||
    (p.category || "").toLowerCase().includes("chambre") ||
    (p.category || "").toLowerCase().includes("suite") ||
    (p.category || "").toLowerCase().includes("bungalow") ||
    (p.category || "").toLowerCase().includes("appartement") ||
    (p.category || "").toLowerCase().includes("studio") ||
    (p.category || "").toLowerCase().includes("nuit")
  );

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
          const sRef = storageRef(storage, `hotel/${vendorId}/${Date.now()}_${file.name}`);
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

  const toggleAmenity = (amenity: string) => {
    const currentFeatures = editing?.features || [];
    const exists = currentFeatures.includes(amenity);
    const updated = exists ? currentFeatures.filter(f => f !== amenity) : [...currentFeatures, amenity];
    setEditing({
      ...editing,
      features: updated
    });
  };

  const handleAddCustomAmenity = () => {
    if (!newAmenity.trim()) return;
    const current = editing?.features || [];
    if (!current.includes(newAmenity.trim())) {
      setEditing({
        ...editing,
        features: [...current, newAmenity.trim()]
      });
    }
    setNewAmenity("");
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.price) {
      toast.error("Nom de la chambre/suite et tarif par nuit obligatoires");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...editing,
        category: editing.category || HOTEL_CATEGORIES[0],
        image: editing.images?.[0] || editing.image || "",
        stock: editing.stock !== undefined ? Number(editing.stock) : 4,
        inStock: editing.stock !== undefined ? Number(editing.stock) > 0 : true
      });
      setEditing(null);
      toast.success("Chambre enregistrée avec succès !");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-black text-2xl text-gray-900 flex items-center gap-2.5">
            <i className="fa-solid fa-hotel text-indigo-600"></i>
            Chambres, Suites & Hébergements
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {hotelProducts.length} type{hotelProducts.length > 1 ? "s" : ""} de chambre configuré{hotelProducts.length > 1 ? "s" : ""} avec tarifs par nuitée et équipements
          </p>
        </div>
        <button
          onClick={() => setEditing({
            name: "",
            price: undefined as any,
            originalPrice: undefined as any,
            category: HOTEL_CATEGORIES[0],
            image: "",
            images: [],
            stock: 1,
            badge: "",
            features: [],
            description: ""
          })}
          className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Ajouter une chambre / suite</span>
        </button>
      </div>

      {/* Liste des Chambres */}
      {hotelProducts.length === 0 ? (
        <div className="py-16 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 text-center bg-gray-50/50 p-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
            <i className="fa-solid fa-bed"></i>
          </div>
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-base">Aucune chambre enregistrée</h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1">
              Créez vos suites, chambres standard et hébergements pour permettre à vos clients de réserver directement.
            </p>
          </div>
          <button
            onClick={() => setEditing({
              name: "",
              price: undefined as any,
              originalPrice: undefined as any,
              category: HOTEL_CATEGORIES[0],
              image: "",
              images: [],
              stock: 1,
              badge: "",
              features: [],
              description: ""
            })}
            className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Ajouter ma première chambre</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotelProducts.map(room => (
            <div
              key={room.id}
              className="p-5 rounded-3xl bg-white border border-gray-200/90 hover:border-indigo-600/40 hover:shadow-xl transition-all flex flex-col justify-between gap-4 group relative"
            >
              <div className="flex gap-4">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-150">
                  <img
                    src={room.image || room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&auto=format&fit=crop&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {room.images && room.images.length > 1 && (
                    <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/75 text-white text-[9px] font-bold">
                      {room.images.length} photos
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {room.badge && (
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                        {room.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">
                      {room.category}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-sm text-gray-900 truncate">{room.name}</h3>

                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-base text-indigo-600">
                      {Number(room.price).toLocaleString()} FCFA
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">/ nuit</span>
                    {room.originalPrice && room.originalPrice > room.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {Number(room.originalPrice).toLocaleString()} F
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {room.description || "Chambre tout confort avec équipements modernes."}
                  </p>
                </div>
              </div>

              {/* Équipements inclus */}
              {room.features && room.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                  {room.features.slice(0, 3).map((feat, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-[10px] font-medium flex items-center gap-1">
                      <i className="fa-solid fa-check text-emerald-500 text-[8px]"></i>
                      {feat}
                    </span>
                  ))}
                  {room.features.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-400 text-[10px] font-bold">
                      +{room.features.length - 3} autres
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span className="text-[11px] font-bold text-gray-500">
                  Disponibilité : <strong className="text-gray-900">{room.stock ?? 3} chambres</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(room)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition-colors"
                    title="Modifier la chambre"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(room.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Supprimer la chambre"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'édition / création de chambre */}
      {editing && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-bed text-indigo-600"></i>
                {editing.id ? "Modifier la chambre / suite" : "Ajouter une chambre ou suite"}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Fermer la fiche chambre"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Corps Modal */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* Galerie Multi-Photos */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Photos de la chambre (Jusqu'à 4 photos HD)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(editing.images || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(!editing.images || editing.images.length < 4) && (
                    <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-600 bg-gray-50 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                      <i className="fa-solid fa-camera text-gray-400 text-lg"></i>
                      <span className="text-[10px] font-bold text-gray-500">Ajouter</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAddMultiplePhotos}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  )}
                </div>
                {uploading && <p className="text-[11px] text-indigo-600 font-bold animate-pulse">Téléversement des photos en cours...</p>}
              </div>

              {/* Nom & Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Nom de la Chambre / Suite *
                  </label>
                  <input
                    type="text"
                    value={editing.name || ""}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Ex: Suite Exécutive King & Balcon"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Type d'hébergement *
                  </label>
                  <select
                    value={editing.category || HOTEL_CATEGORIES[0]}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm bg-white outline-none focus:border-indigo-600"
                  >
                    {HOTEL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tarifs & Disponibilité */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Tarif / nuit (FCFA) *
                  </label>
                  <input
                    type="number"
                    value={editing.price || ""}
                    onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    placeholder="Ex: 35000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-heading font-black text-base text-indigo-600 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Tarif standard barré (Optionnel)
                  </label>
                  <input
                    type="number"
                    value={editing.originalPrice || ""}
                    onChange={e => setEditing({ ...editing, originalPrice: Number(e.target.value) })}
                    placeholder="Ex: 45000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-500 outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Nombre d'unités disponibles
                  </label>
                  <input
                    type="number"
                    value={editing.stock ?? 3}
                    onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })}
                    placeholder="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Badge promotionnel */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Badge mis en avant (Optionnel)
                </label>
                <div className="flex flex-wrap gap-2">
                  {HOTEL_BADGES.map(badge => {
                    const isSelected = editing.badge === badge;
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => setEditing({ ...editing, badge: isSelected ? undefined : badge })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {badge}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Équipements inclus */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Équipements & Services Inclus dans la chambre
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_AMENITIES.map(amenity => {
                    const isChecked = (editing.features || []).includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3.5 py-2.5 rounded-xl text-left font-medium text-xs flex items-center justify-between transition-all border ${
                          isChecked ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <i className="fa-solid fa-check text-indigo-600"></i>}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={e => setNewAmenity(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddCustomAmenity())}
                    placeholder="Ajouter un autre équipement (ex: Baignoire Jacuzzi)..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-medium outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Décrivez l'ambiance, la superficie, la vue et le confort de cette chambre..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-indigo-600 resize-none"
                />
              </div>

            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 font-bold text-xs text-gray-600 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/25 disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer la chambre"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
