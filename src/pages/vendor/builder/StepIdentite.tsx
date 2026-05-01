import { Camera, Image as ImageIcon, Plus, Compass, Loader2 } from "lucide-react";
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

export default function StepIdentite({ formData, setFormData, localLogo, localCover, checkingSlug, handleSlugChange, handleFileUpload }: Props) {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }
    
    setIsLocating(true);
    toast.loading("Recherche de votre position...", { id: "geo-vendor" });
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || "";
          const neighborhood = data.address.suburb || data.address.neighbourhood || data.address.road || "";
          
          setFormData({ ...formData, city, neighborhood });
          toast.success("Position trouvée !", { id: "geo-vendor" });
        } catch (error) {
          toast.error("Impossible de récupérer l'adresse exacte", { id: "geo-vendor" });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error("Erreur de géolocalisation", { id: "geo-vendor" });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Identité du restaurant</h2>
          <p className="text-sm text-gray-500">Ces informations apparaîtront sur votre site public.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nom du restaurant</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-b-2 border-gray-200 focus:border-black py-3 text-2xl font-bold outline-none transition-colors bg-transparent"
            placeholder="Ex: Chez Fatou"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">URL du site</label>
          <div className="flex items-center gap-2 border-b-2 border-gray-200 focus-within:border-black py-3 transition-colors">
            <span className="text-gray-400 text-sm">oresto.app/r/</span>
            <input
              type="text"
              value={formData.slug || ""}
              onChange={e => handleSlugChange(e.target.value)}
              className="flex-1 outline-none font-bold text-lg bg-transparent"
              placeholder="chez-fatou"
            />
            {checkingSlug && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Instagram</label>
            <input
              type="text"
              value={formData.social_links?.instagram || ""}
              onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black text-sm"
              placeholder="@username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Facebook</label>
            <input
              type="text"
              value={formData.social_links?.facebook || ""}
              onChange={e => setFormData({ ...formData, social_links: { ...formData.social_links, facebook: e.target.value } })}
              className="w-full bg-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black text-sm"
              placeholder="Nom de la page"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
          <textarea
            value={formData.description || ""}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-gray-100 rounded-xl p-4 font-medium h-28 resize-none outline-none focus:ring-2 focus:ring-black text-sm"
            placeholder="Racontez votre histoire..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Localisation</h3>
              <p className="text-xs text-gray-500">Où se trouve votre restaurant ?</p>
            </div>
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              {isLocating ? <Loader2 size={14} className="animate-spin" /> : <Compass size={14} />}
              Me localiser
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Ville</label>
              <input
                type="text"
                value={formData.city || ""}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Ex: Cotonou"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Quartier / Adresse</label>
              <input
                type="text"
                value={formData.neighborhood || ""}
                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Ex: Haïe Vive"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Photos</h2>
          <p className="text-sm text-gray-500">Cliquez sur les zones pour uploader vos images.</p>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Logo</label>
          <div className="relative w-32 h-32 group cursor-pointer">
            <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center group-hover:border-black transition-colors">
              {localLogo
                ? <img src={localLogo} className="w-full h-full object-cover" alt="logo" />
                : <div className="text-center text-gray-400"><Camera size={28} className="mx-auto" /><span className="text-[9px] font-bold uppercase mt-1 block">Logo</span></div>
              }
            </div>
            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg"><Plus size={14} /></div>
          </div>
        </div>

        {/* Cover */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Image de couverture</label>
          <div className="relative w-full aspect-[16/7] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden group cursor-pointer hover:border-black transition-colors">
            {localCover
              ? <img src={localCover} className="w-full h-full object-cover" alt="cover" />
              : <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2"><ImageIcon size={36} /><span className="text-xs font-bold uppercase">Couverture</span></div>
            }
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm">Changer l'image</div>
            <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
