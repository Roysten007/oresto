import { useState } from "react";
import { Check, Smartphone, Monitor } from "lucide-react";
import { VendorProfile } from "@/data/mockData";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
  localLogo: string | null;
  localCover: string | null;
}

const FONTS = [
  { name: "Inter", id: "modern", family: "'Inter', sans-serif" },
  { name: "Cormorant", id: "elegant", family: "'Cormorant Garamond', serif" },
  { name: "Bebas Neue", id: "bold", family: "'Bebas Neue', sans-serif" },
  { name: "Outfit", id: "outfit", family: "'Outfit', sans-serif" },
];

const THEMES = [
  { name: "Classique", primary: "#111111", bg: "#FFFFFF" },
  { name: "Rouge Vif", primary: "#E11D48", bg: "#FFFFFF" },
  { name: "Vert Maquis", primary: "#166534", bg: "#F0FDF4" },
  { name: "Doré", primary: "#854D0E", bg: "#FFFBEB" },
  { name: "Ocean", primary: "#0369A1", bg: "#F0F9FF" },
  { name: "Nuit", primary: "#7C3AED", bg: "#0F172A" },
];

export default function StepDesign({ formData, setFormData, localLogo, localCover }: Props) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const font = FONTS.find(f => f.id === formData.font_choice) || FONTS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-10 h-full">
      {/* Controls */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-8 overflow-y-auto pr-2">
        <div>
          <h2 className="text-xl font-bold mb-1">Design Studio</h2>
          <p className="text-xs text-gray-500">Personnalisez les couleurs et la typographie. L'aperçu est en temps réel.</p>
        </div>

        {/* Theme Presets */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Thèmes Prêts à l'Emploi</label>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(t => (
              <button key={t.name} type="button" onClick={() => setFormData({ ...formData, primary_color: t.primary, secondary_color: t.bg })} className="p-2 rounded-xl border-2 border-gray-200 hover:border-black transition-all text-center">
                <div className="flex gap-1 justify-center mb-1">
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ background: t.bg }} />
                  <div className="w-5 h-5 rounded-full" style={{ background: t.primary }} />
                </div>
                <span className="text-[9px] font-bold uppercase">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Couleurs Personnalisées</label>
          <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Couleur principale</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{formData.primary_color}</span>
                <div className="relative w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm" style={{ background: formData.primary_color }}>
                  <input type="color" value={formData.primary_color || "#111111"} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer scale-150 w-full h-full" />
                </div>
              </div>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Arrière-plan</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{formData.secondary_color}</span>
                <div className="relative w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm" style={{ background: formData.secondary_color }}>
                  <input type="color" value={formData.secondary_color || "#FFFFFF"} onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer scale-150 w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Font */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400">Typographie</label>
          <div className="space-y-2">
            {FONTS.map(f => (
              <button key={f.id} type="button" onClick={() => setFormData({ ...formData, font_choice: f.id })} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${formData.font_choice === f.id ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                <span style={{ fontFamily: f.family }} className="font-bold">{f.name}</span>
                {formData.font_choice === f.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-gray-100 rounded-3xl p-8 flex flex-col gap-6 min-h-[500px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
            <button onClick={() => setDevice('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${device === 'mobile' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Smartphone size={15} />Mobile</button>
            <button onClick={() => setDevice('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${device === 'desktop' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Monitor size={15} />Bureau</button>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Aperçu en direct
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div
            className={`bg-white shadow-2xl overflow-hidden transition-all duration-500 border-8 border-gray-900 ${device === 'mobile' ? 'w-[300px] rounded-[40px]' : 'w-full rounded-2xl'}`}
            style={{ height: device === 'mobile' ? '520px' : '420px' }}
          >
            <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: formData.secondary_color, fontFamily: font.family }}>
              {/* Hero */}
              <div className="relative h-44 overflow-hidden">
                <img src={localCover || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"} className="w-full h-full object-cover" alt="cover" />
                <div className="absolute inset-0 bg-black/55 flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden border-2 border-white mb-3 shadow-lg">
                    <img src={localLogo || `https://ui-avatars.com/api/?name=${formData.name || 'R'}&background=random`} className="w-full h-full object-cover" alt="logo" />
                  </div>
                  <h1 className="text-white font-black text-xl leading-tight">{formData.name || "Votre Restaurant"}</h1>
                  <p className="text-white/60 text-xs mt-0.5">Restaurant · Abidjan</p>
                </div>
              </div>
              {/* CTA */}
              <div className="p-4 space-y-3">
                <button className="w-full py-3 rounded-xl text-white text-sm font-bold" style={{ backgroundColor: formData.primary_color }}>Voir le menu</button>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2].map(i => (
                    <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                      <div className="h-20 bg-gray-200" />
                      <div className="p-2"><div className="h-2 bg-gray-200 rounded w-3/4 mb-1" /><div className="h-3 rounded font-bold" style={{ backgroundColor: `${formData.primary_color}20` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
