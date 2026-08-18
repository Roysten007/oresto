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

  const activeSector = businessType || formData.business_type || "restaurant";
  const availableCategories = SECTOR_CATEGORIES[activeSector] || SECTOR_CATEGORIES.restaurant;

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

  const handleCategorySelect = (cat: string) => {
    setFormData({ ...formData, category: cat });
    toast.success(`Catégorie sélectionnée : ${cat}`);
  };

  return (
    <div className="space-y-8 font-body">
      <div>
        <h2 className="font-heading font-black text-2xl text-gray-900 mb-1">
          Identité & Catégorie de votre Activité
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Personnalisez le secteur, la catégorie précise et les coordonnées visibles sur votre vitrine en ligne.
        </p>
      </div>

      {/* 1. Sélecteur de Secteur / Métier */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
          1. Secteur d'activité principal
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onBusinessTypeChange?.("restaurant")}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              activeSector === "restaurant"
                ? "border-primary bg-orange-50/50 shadow-md ring-2 ring-primary/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              activeSector === "restaurant" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
            }`}>
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div>
              <p className="font-heading font-black text-xs text-gray-900">Restaurant & Grillades</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Plats, menus du jour, livraisons de repas & KDS.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onBusinessTypeChange?.("ecommerce")}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              activeSector === "ecommerce"
                ? "border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-600/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              activeSector === "ecommerce" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <p className="font-heading font-black text-xs text-gray-900">Boutique & E-Commerce</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Vêtements, sneakers, high-tech, stocks & colis.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onBusinessTypeChange?.("hotel")}
            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              activeSector === "hotel"
                ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              activeSector === "hotel" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              <i className="fa-solid fa-hotel"></i>
            </div>
            <div>
              <p className="font-heading font-black text-xs text-gray-900">Hôtel & Résidences</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Suites, chambres, réservations de nuitées & planning.</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Sélecteur de Catégorie Métier Spécialisée */}
      <div className="space-y-3 p-5 rounded-2xl bg-gray-50 border border-gray-200/80">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-700">
              2. Catégorie précise de votre établissement *
            </label>
            <p className="text-[11px] text-gray-500 font-medium mt-0.5">
              Sélectionnez la catégorie qui correspond le mieux à votre activité :
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCustomCatMode(!customCatMode)}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            {customCatMode ? "Choisir dans la liste" : "+ Saisie manuelle"}
          </button>
        </div>

        {/* Chips de catégories */}
        {!customCatMode ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {availableCategories.map(cat => {
              const isSelected = formData.category?.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:bg-orange-50/30"
                  }`}
                >
                  {isSelected && <i className="fa-solid fa-check text-[10px]"></i>}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1.5">
            <input
              type="text"
              value={formData.category || ""}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ex: Prêt-à-porter & Accessoires de Luxe"
            />
          </div>
        )}

        <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-2">
          <span className="font-bold text-gray-700">Catégorie active :</span>
          <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-xs">
            {formData.category || (activeSector === "ecommerce" ? "Mode, Vêtements & Prêt-à-porter" : activeSector === "hotel" ? "Hôtel & Suites de Luxe" : "Restaurant & Grillades")}
          </span>
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
