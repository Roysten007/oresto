import { VendorProfile } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
  localLogo: string | null;
  localCover: string | null;
}

const FONTS = [
  { name: "Moderne (Inter)", id: "modern", family: "'Inter', sans-serif" },
  { name: "Gastronomie (Cormorant)", id: "elegant", family: "'Cormorant Garamond', serif" },
  { name: "Audacieux (Montserrat)", id: "bold", family: "'Montserrat', sans-serif" },
  { name: "Tendance (Outfit)", id: "outfit", family: "'Outfit', sans-serif" },
];

const THEMES = [
  { name: "Oresto Orange", primary: "#EA580C", bg: "#FFFFFF" },
  { name: "Noir & Or Maquis", primary: "#B45309", bg: "#FFFFFF" },
  { name: "Rouge Braise", primary: "#DC2626", bg: "#FFFFFF" },
  { name: "Vert Palmier", primary: "#15803D", bg: "#F0FDF4" },
  { name: "Océan Atlantique", primary: "#0284C7", bg: "#F0F9FF" },
  { name: "Bistrot Sombre", primary: "#F97316", bg: "#0A0A0A" },
];

export default function StepDesign({ formData, setFormData }: Props) {
  return (
    <div className="space-y-8 font-body">
      <div>
        <h2 className="font-heading font-black text-2xl text-gray-900 mb-1">
          Couleurs & Typographie
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Personnalisez la charte graphique de votre vitrine (couleurs, polices et ambiances). Vos modifications sont appliquées instantanément.
        </p>
      </div>

      {/* Palettes Prêtes à l'Emploi */}
      <div className="space-y-3">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
          Palettes Recommandées
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {THEMES.map(t => {
            const isSelected = formData.primary_color === t.primary && formData.secondary_color === t.bg;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setFormData({ ...formData, primary_color: t.primary, secondary_color: t.bg })}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left ${
                  isSelected ? "border-primary bg-orange-50/40 shadow-sm" : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex -space-x-1.5 shrink-0">
                  <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ background: t.primary }} />
                  <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ background: t.bg }} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-900 block truncate">{t.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{t.primary}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélecteurs de Couleurs Précises */}
      <div className="space-y-3 pt-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
          Couleurs Personnalisées
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Couleur d'accent</span>
              <span className="text-[10px] text-gray-400 font-mono">{formData.primary_color || "#EA580C"}</span>
            </div>
            <div className="relative w-10 h-10 rounded-xl border-2 border-white shadow-md overflow-hidden cursor-pointer" style={{ background: formData.primary_color || "#EA580C" }}>
              <input 
                type="color" 
                value={formData.primary_color || "#EA580C"} 
                onChange={e => setFormData({ ...formData, primary_color: e.target.value })} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150" 
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Arrière-plan vitrine</span>
              <span className="text-[10px] text-gray-400 font-mono">{formData.secondary_color || "#FFFFFF"}</span>
            </div>
            <div className="relative w-10 h-10 rounded-xl border-2 border-white shadow-md overflow-hidden cursor-pointer" style={{ background: formData.secondary_color || "#FFFFFF" }}>
              <input 
                type="color" 
                value={formData.secondary_color || "#FFFFFF"} 
                onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typographies */}
      <div className="space-y-3 pt-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
          Style de Police
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map(f => {
            const isSelected = formData.font_choice === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormData({ ...formData, font_choice: f.id })}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between ${
                  isSelected ? "border-primary bg-orange-50/40 text-primary shadow-sm" : "border-gray-200 bg-white hover:border-gray-300 text-gray-800"
                }`}
              >
                <div>
                  <span style={{ fontFamily: f.family }} className="text-sm font-bold block">{f.name}</span>
                  <span className="text-[11px] text-gray-400">Exemple de présentation soignée</span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
