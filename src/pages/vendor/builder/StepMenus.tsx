import { useRef } from "react";
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

export default function StepMenus({ formData, setFormData, products, vendorId }: Props) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoSave = (newMenus: Record<string, any>) => {
    if (!db || !vendorId) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await update(ref(db, `vendors/${vendorId}`), { daily_menus: newMenus });
        toast.success("Menu du jour mis à jour ✓", { id: "menu-autosave", duration: 1500 });
      } catch (e) {
        console.error("Erreur sauvegarde menu:", e);
      }
    }, 600);
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
    <div className="space-y-8 font-body">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading font-black text-2xl text-gray-900">Menus du Jour & Formules</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Programmez vos suggestions quotidiennes. Vos clients verront automatiquement le menu du jour dès l'ouverture.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-primary text-xs font-bold">
          <i className="fa-solid fa-calendar-day"></i> Aujourd'hui : <span className="font-black text-gray-900">{todayName}</span>
        </div>
      </div>

      {products.length === 0 && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-800 text-xs font-medium flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-primary"></i>
          <span>Ajoutez d'abord quelques plats à l'étape 2 (La Carte) pour pouvoir les assigner à vos jours de la semaine.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {DAYS.map(day => {
          const isToday = day === todayName;
          return (
            <div
              key={day}
              className={`rounded-2xl overflow-hidden shadow-sm transition-all bg-white ${
                isToday ? "border-2 border-primary ring-2 ring-primary/10" : "border border-gray-200"
              }`}
            >
              <div className={`px-4 py-3 flex items-center justify-between ${isToday ? "bg-primary text-white" : "bg-gray-50 border-b border-gray-100"}`}>
                <h3 className="font-heading font-black text-xs uppercase tracking-wider">{day}</h3>
                {isToday && <span className="text-[9px] font-black uppercase bg-white/25 px-2 py-0.5 rounded-full">Aujourd'hui</span>}
              </div>
              
              <div className="p-3.5 space-y-2.5">
                {[
                  { key: "entree", label: "Entrée", icon: "fa-solid fa-bowl-food" },
                  { key: "plat", label: "Plat Principal", icon: "fa-solid fa-utensils" },
                  { key: "dessert", label: "Dessert", icon: "fa-solid fa-ice-cream" },
                ].map(({ key, label, icon }) => {
                  const selectedId = formData.daily_menus?.[day]?.[key as any] || "";
                  return (
                    <div key={key} className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <i className={`${icon} text-primary text-[8px]`}></i>
                        {label}
                      </label>
                      <select
                        value={selectedId}
                        onChange={e => setDayItem(day, key, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 outline-none focus:border-primary"
                      >
                        <option value="">-- Aucun --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.price} F)</option>
                        ))}
                      </select>
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
