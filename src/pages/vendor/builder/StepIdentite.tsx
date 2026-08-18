import { useState } from "react";
import { toast } from "sonner";
import { VendorProfile } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
  localLogo: string | null;
  localCover: string | null;
  checkingSlug: boolean;
  handleSlugChange: (val: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => void;
  businessType?: "restaurant" | "ecommerce" | "hotel";
  onBusinessTypeChange?: (type: "restaurant" | "ecommerce" | "hotel") => void;
}

const SECTOR_CATEGORIES: Record<string, string[]> = {
  restaurant: [
    "Restaurant & Grillades",
    "Maquis & Saveurs Africaines",
    "Fast-Food, Burgers & Chawarma",
    "Pizzeria & Pâtes Italiennes",
    "Bar Lounge & Cocktails",
    "Pâtisserie, Glacier & Salon de Thé",
    "Traiteur & Événements",
    "Cuisine Asiatique & Wok",
    "Boucherie & Rôtisserie"
  ],
  ecommerce: [
    "Mode, Vêtements & Prêt-à-porter",
    "Chaussures & Sneakers Streetwear",
    "High-Tech, Smartphones & Gadgets",
    "Beauté, Cosmétiques & Parfumerie",
    "Bijoux, Montres & Accessoires",
    "Maroquinerie & Sacs de Luxe",
    "Maison, Déco & Électroménager",
    "Sport, Fitness & Outdoor",
    "Alimentation & Épicerie Fine"
  ],
  hotel: [
    "Hôtel & Suites de Luxe",
    "Résidence Meublée & Appartements",
    "Maison d'Hôtes & Guest House",
    "Auberge & Écolodge",
    "Bungalow & Villa Privée",
    "Complexe Hôtelier & Événements"
  ]
};

export default function StepIdentite({ 
  formData, 
  setFormData, 
  localLogo, 
  localCover, 
  checkingSlug, 
  handleSlugChange, 
  handleFileUpload,
  businessType = "restaurant",
  onBusinessTypeChange
}: Props) {
  const [isLocating, setIsLocating] = useState(false);
  const [customCatMode, setCustomCatMode] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const activeSector = businessType || formData.business_type || "restaurant";
  const availableCategories = SECTOR_CATEGORIES[activeSector] || SECTOR_CATEGORIES.restaurant;

  // Extraction de la liste des catégories sélectionnées (support multi-choix)
  const currentCategories: string[] = formData.categories && formData.categories.length > 0
    ? formData.categories
    : formData.category
      ? formData.category.split(",").map(s => s.trim()).filter(Boolean)
      : [availableCategories[0]];

  const handleToggleCategory = (cat: string) => {
    let updated: string[];
    const exists = currentCategories.some(c => c.toLowerCase() === cat.toLowerCase());
    if (exists) {
      if (currentCategories.length <= 1) {
        toast.info("Vous devez conserver au moins une catégorie active");
        return;
      }
      updated = currentCategories.filter(c => c.toLowerCase() !== cat.toLowerCase());
    } else {
      updated = [...currentCategories, cat];
    }
    setFormData({
      ...formData,
      categories: updated,
      category: updated.join(", ")
    });
    toast.success(exists ? `Catégorie retirée : ${cat}` : `Catégorie ajoutée : ${cat}`);
  };

  const handleAddCustomCategory = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (currentCategories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.info("Cette catégorie est déjà sélectionnée");
      return;
    }
    const updated = [...currentCategories, trimmed];
    setFormData({
      ...formData,
      categories: updated,
      category: updated.join(", ")
    });
    setCustomInput("");
    toast.success(`Catégorie ajoutée : ${trimmed}`);
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (currentCategories.length <= 1) {
      toast.info("Conservez au moins une catégorie");
      return;
    }
    const updated = currentCategories.filter(c => c.toLowerCase() !== catToRemove.toLowerCase());
    setFormData({
      ...formData,
      categories: updated,
      category: updated.join(", ")
    });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée par votre navigateur");
      return;
    }
    
    setIsLocating(true);
    toast.loading("Détection de votre position GPS...", { id: "geo-step" });
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Cotonou";
          const neighborhood = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || "";
          
          setFormData({ ...formData, city, neighborhood });
          toast.success("Position GPS détectée avec succès !", { id: "geo-step" });
        } catch {
          toast.success("Position GPS captée", { id: "geo-step" });
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        toast.error("Veuillez autoriser l'accès GPS dans votre navigateur", { id: "geo-step" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-8 font-body">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            activeSector === "ecommerce" ? "bg-purple-100 text-purple-700" : activeSector === "hotel" ? "bg-indigo-100 text-indigo-700" : "bg-orange-100 text-primary"
          }`}>
            {activeSector === "ecommerce" ? "ESPACE BOUTIQUE E-COMMERCE" : activeSector === "hotel" ? "ESPACE HÔTEL & RÉSIDENCE" : "ESPACE RESTAURANT & GRILLADES"}
          </span>
        </div>
        <h2 className="font-heading font-black text-2xl text-gray-900">
          Identité & Catégories
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Définissez les catégories et les coordonnées visibles sur votre vitrine en ligne.
        </p>
      </div>

      {/* Sélecteur de Catégories Multi-Choix */}
      <div className="space-y-4 p-5 rounded-2xl bg-gray-50 border border-gray-200/80">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700">
              Catégories de votre {activeSector === "ecommerce" ? "boutique" : activeSector === "hotel" ? "établissement" : "restaurant"} * (Sélection multiple)
            </label>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              💡 Cliquez sur plusieurs catégories pour les combiner sur votre vitrine :
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCustomCatMode(!customCatMode)}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            {customCatMode ? "Fermer la saisie libre" : "+ Ajouter une catégorie personnalisée"}
          </button>
        </div>

        {/* Formulaire d'ajout personnalisé si ouvert */}
        {customCatMode && (
          <div className="flex gap-2 p-3 bg-white rounded-xl border border-primary/20 shadow-sm">
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddCustomCategory())}
              className="flex-1 px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg outline-none focus:border-primary"
              placeholder="Ex: Sneakers Édition Limitée, Robes de Cérémonie..."
            />
            <button
              type="button"
              onClick={handleAddCustomCategory}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              Ajouter
            </button>
          </div>
        )}

        {/* Chips de catégories avec multi-sélection */}
        <div className="flex flex-wrap gap-2 pt-1">
          {availableCategories.map(cat => {
            const isSelected = currentCategories.some(c => c.toLowerCase() === cat.toLowerCase());
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleToggleCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02] ring-2 ring-primary/20"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:bg-orange-50/30"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                  isSelected ? "bg-white text-primary" : "border border-gray-300 text-transparent"
                }`}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Récapitulatif des catégories actives */}
        <div className="pt-3 border-t border-gray-200/70 space-y-2">
          <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            {currentCategories.length} Catégorie{currentCategories.length > 1 ? "s" : ""} sélectionnée{currentCategories.length > 1 ? "s" : ""} sur votre vitrine :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold text-xs"
              >
                <span>{cat}</span>
                {currentCategories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="w-4 h-4 rounded-full hover:bg-primary hover:text-white flex items-center justify-center text-[10px] transition-colors"
                    title="Retirer cette catégorie"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Champs principaux */}
      <div className="space-y-6">
        
        {/* Nom du commerce */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            Nom de l'établissement *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 font-heading font-bold text-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder={activeSector === "ecommerce" ? "Ex: KiffStyle & Tech Store" : activeSector === "hotel" ? "Ex: Palmier Royal Résidence" : "Ex: L'Atelier du Chef & Grill"}
          />
        </div>

        {/* URL personnalisée */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            Lien web direct (URL de votre vitrine) *
          </label>
          <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="text-xs font-bold text-gray-400 select-none mr-1">oresto.app/r/</span>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={e => handleSlugChange(e.target.value)}
              className="flex-1 bg-transparent font-bold text-sm text-gray-900 outline-none"
              placeholder={activeSector === "ecommerce" ? "kiffstyle-store" : activeSector === "hotel" ? "palmier-royal" : "latelier-du-chef"}
            />
            {checkingSlug && <i className="fa-solid fa-spinner fa-spin text-primary text-sm"></i>}
          </div>
          <p className="text-[11px] text-gray-400 italic">Ce lien court peut être partagé directement sur WhatsApp, TikTok et Instagram.</p>
        </div>

        {/* Photos (Logo + Couverture) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Logo */}
          <div className="sm:col-span-1 space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Logo</label>
            <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 hover:bg-orange-50/30 hover:border-primary transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group overflow-hidden">
              {localLogo || formData.logo_url ? (
                <img src={localLogo || formData.logo_url} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-camera"></i>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Ajouter un logo</span>
                </>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Changer
              </div>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Couverture */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Image de Bannière</label>
            <div className="relative w-full aspect-[16/8] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 hover:bg-orange-50/30 hover:border-primary transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group overflow-hidden">
              {localCover || formData.cover_url ? (
                <img src={localCover || formData.cover_url} alt="Cover" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm mb-1 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600">Ajouter une bannière</span>
                </>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                Changer
              </div>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-sm text-gray-900">Emplacement & Ville</h3>
              <p className="text-[11px] text-gray-500">
                {activeSector === "ecommerce" ? "Où se situe votre boutique / point d'expédition ?" : activeSector === "hotel" ? "Où se situe votre résidence / hôtel ?" : "Où se situe votre restaurant / maquis ?"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <i className={`fa-solid fa-location-crosshairs ${isLocating ? "animate-spin" : ""}`}></i>
              <span>{isLocating ? "Détection..." : "Me localiser"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ville</label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-bold outline-none focus:bg-white focus:border-primary"
                placeholder="Ex: Cotonou"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quartier</label>
              <input
                type="text"
                value={formData.neighborhood || ""}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-xs font-bold outline-none focus:bg-white focus:border-primary"
                placeholder={activeSector === "ecommerce" ? "Ex: Ganhi / Maro-Militaire" : "Ex: Haie Vive"}
              />
            </div>
          </div>
        </div>

        {/* Description / Histoire */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            Description & Spécialités
          </label>
          <textarea
            rows={3}
            value={formData.description || ""}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs leading-relaxed outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder={
              activeSector === "ecommerce"
                ? "Présentez vos articles phares, vos collections exclusives et vos délais de livraison express au Bénin..."
                : activeSector === "hotel"
                ? "Présentez vos suites climatisées, les équipements inclus (Wi-Fi, piscine) et les conditions de réservation..."
                : "Présentez brièvement vos spécialités, vos grillades maison et l'ambiance de votre établissement..."
            }
          />
        </div>

      </div>
    </div>
  );
}
