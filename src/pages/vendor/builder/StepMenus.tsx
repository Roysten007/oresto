import { useEffect, useRef } from "react";
import { Product, VendorProfile } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { toast } from "sonner";

interface Props {
  formData: Partial<VendorProfile>;
  setFormData: (d: Partial<VendorProfile>) => void;
  products: Product[];
  vendorId: string;
}

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const currentDayName = () => {
  return ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"][new Date().getDay()];
};

const SLOT_CATEGORY_MAP: Record<string, string[]> = {
  entree: ["Entrées", "Entrée"],
  plat: ["Plats", "Plat", "Spécialités"],
  dessert: ["Desserts", "Dessert"],
  boisson: ["Boissons", "Boisson"],
};

export default function StepMenus({ formData, setFormData, products, vendorId }: Props) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save to Firebase whenever daily_menus changes
  const autoSave = (newMenus: Record<string, any>) => {
    if (!db || !vendorId) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await update(ref(db, `vendors/${vendorId}`), { daily_menus: newMenus });
        toast.success("Menu sauvegardé automatiquement ✓", { id: "menu-autosave", duration: 1500 });
      } catch (e) {
        console.error("Erreur sauvegarde menu:", e);
      }
    }, 800);
  };

  const setDayItem = (day: string, type: string, value: string) => {
    const current = formData.daily_menus || {};
    const dayMenu = current[day] || {};
    const newMenus = { ...current, [day]: { ...dayMenu, [type]: value } };
    setFormData({ ...formData, daily_menus: newMenus });
    autoSave(newMenus);
  };

  const todayName = currentDayName();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Menus du Jour</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configurez l'entrée, le plat et le dessert pour chaque jour. <strong>Sauvegarde automatique.</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs font-bold">
          📅 Aujourd'hui : <span className="text-amber-900">{todayName}</span>
        </div>
      </div>

      {products.length === 0 && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-medium">
          ⚠️ Ajoutez d'abord des plats à l'étape "La Carte" pour pouvoir configurer vos menus.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DAYS.map(day => {
          const isToday = day === todayName;
          return (
            <div
              key={day}
              className={`rounded-2xl overflow-hidden shadow-sm transition-all ${isToday ? "border-2 border-black ring-4 ring-black/5" : "border border-gray-100"}`}
            >
              <div className={`px-5 py-4 flex items-center justify-between ${isToday ? "bg-black text-white" : "bg-gray-50 border-b border-gray-100"}`}>
                <h3 className="font-black text-sm uppercase tracking-wider">{day}</h3>
                {isToday && <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-1 rounded-full">Aujourd'hui</span>}
              </div>
              <div className="p-5 space-y-4 bg-white">
                {[
                  { key: "entree", label: "Entrée", emoji: "🥗" },
                  { key: "plat", label: "Plat", emoji: "🍽️" },
                  { key: "dessert", label: "Dessert", emoji: "🍮" },
                  { key: "boisson", label: "Boisson", emoji: "🥤" },
                ].map(({ key, label, emoji }) => {
                  const selectedId = formData.daily_menus?.[day]?.[key as any] || "";
                  const selectedProduct = products.find(p => p.id === selectedId);
                  return (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{emoji} {label}</label>
                      <select
                        value={selectedId}
                        onChange={e => setDayItem(day, key, e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none transition-all ${selectedId ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        <option value="">— Non défini —</option>
                        {(() => {
                          const allowedCats = SLOT_CATEGORY_MAP[key] || [];
                          const filtered = products.filter(p => allowedCats.includes(p.category));
                          // fallback: show all if no product matches the category
                          const list = filtered.length > 0 ? filtered : products;
                          return list.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({Number(p.price).toLocaleString()} F)</option>
                          ));
                        })()}
                      </select>
                      {selectedProduct && (
                        <p className="text-[9px] text-gray-400 truncate pl-1">{selectedProduct.category}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
