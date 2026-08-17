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
}

export default function StepIdentite({ 
  formData, 
  setFormData, 
  localLogo, 
  localCover, 
  checkingSlug, 
  handleSlugChange, 
  handleFileUpload 
}: Props) {
  const [isLocating, setIsLocating] = useState(false);

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
        <h2 className="font-heading font-black text-2xl text-gray-900 mb-1">
          Identité & Coordonnées
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Définissez les informations principales de votre établissement qui apparaîtront sur votre vitrine.
        </p>
      </div>

      {/* Champs principaux */}
      <div className="space-y-6">
        
        {/* Nom du restaurant */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            Nom de l'établissement *
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-900 font-heading font-bold text-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            placeholder="Ex: Le Maquis Étoilé"
          />
        </div>

        {/* URL personnalisée */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
            Lien web direct (URL de votre site) *
          </label>
          <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="text-xs font-bold text-gray-400 select-none mr-1">oresto.app/r/</span>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={e => handleSlugChange(e.target.value)}
              className="flex-1 bg-transparent font-bold text-sm text-gray-900 outline-none"
              placeholder="le-maquis-etoile"
            />
            {checkingSlug && <i className="fa-solid fa-spinner fa-spin text-primary text-sm"></i>}
          </div>
          <p className="text-[11px] text-gray-400 italic">Ce lien court pourra être partagé sur vos réseaux sociaux et WhatsApp.</p>
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
              <p className="text-[11px] text-gray-500">Où se situe votre restaurant ?</p>
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
                placeholder="Ex: Haie Vive"
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
            placeholder="Présentez brièvement vos spécialités, vos grillades maison et l'ambiance de votre établissement..."
          />
        </div>

      </div>
    </div>
  );
}
