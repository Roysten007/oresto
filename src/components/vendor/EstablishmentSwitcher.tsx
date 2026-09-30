import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Check, 
  Store, 
  ShoppingBag, 
  Hotel, 
  Utensils, 
  Sparkles,
  ExternalLink,
  X
} from "lucide-react";
import { BusinessSector, getVendorSector, setVendorSector } from "@/lib/vendorSector";

interface EstablishmentSwitcherProps {
  currentSector?: BusinessSector;
}

export default function EstablishmentSwitcher({ currentSector }: EstablishmentSwitcherProps) {
  const { vendorProfile, userVendors = [], switchVendor, createEstablishment, updateVendorBusinessType } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    business_type: (currentSector || "ecommerce") as BusinessSector,
    city: "Cotonou",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Secteur effectif (priorité au workspace actif puis au profil)
  const effectiveSector: BusinessSector = currentSector || getVendorSector(vendorProfile);

  // Chercher si l'utilisateur possède déjà un établissement de ce secteur
  const matchingVendor = userVendors.find(v => v.business_type === effectiveSector);

  const currentVendorId = vendorProfile?.id || "";
  const currentPlan = (vendorProfile?.subscriptionPlan || "solo").toLowerCase();
  const maxAllowed = currentPlan === "trio" ? 3 : currentPlan === "duo" ? 2 : 1;
  const planLabel = currentPlan === "trio" ? "Formule Trio (3 max)" : currentPlan === "duo" ? "Formule Duo (2 max)" : "Formule Solo (1 max)";

  // Format de l'icône selon le secteur
  const getSectorIcon = (type?: string) => {
    const s = type || effectiveSector;
    switch (s) {
      case "ecommerce":
        return <ShoppingBag size={14} className="text-purple-600" />;
      case "hotel":
        return <Hotel size={14} className="text-indigo-600" />;
      default:
        return <Utensils size={14} className="text-[#FF6B00]" />;
    }
  };

  const handleSelectVendor = async (vId: string) => {
    if (vId === currentVendorId) {
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    try {
      await switchVendor(vId);
      const target = userVendors.find(v => v.id === vId);
      if (target?.business_type) {
        setVendorSector(target.business_type as BusinessSector);
      }
      toast.success(`Bascule vers « ${target?.name || "l'établissement"} » effectuée !`);
      navigate("/vendor/dashboard");
    } catch {
      toast.error("Erreur lors du changement d'établissement");
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name.trim()) {
      toast.error("Veuillez renseigner le nom de l'établissement");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEstablishment({
        name: newStore.name.trim(),
        business_type: newStore.business_type,
        city: newStore.city.trim(),
        category: newStore.category || (newStore.business_type === "ecommerce" ? "Boutique" : newStore.business_type === "hotel" ? "Hôtel" : "Restaurant"),
      });

      if (result.success && result.vendorId) {
        toast.success(`🎉 Nouvel établissement « ${newStore.name} » créé avec succès !`);
        setShowAddModal(false);
        setIsOpen(false);
        setNewStore({ name: "", business_type: "ecommerce", city: "Cotonou", category: "" });
        navigate(`/vendor/dashboard`);
      } else {
        toast.error(result.error || "Impossible d'ajouter cet établissement");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de création");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nom affiché selon le secteur effectif pour éviter les incohérences de libellé
  let activeDisplayName = vendorProfile?.name || "";
  if (effectiveSector === "ecommerce") {
    if (!activeDisplayName || activeDisplayName === "L'Atelier du Chef & Grill" || activeDisplayName === "Mon établissement") {
      activeDisplayName = matchingVendor?.name || "Ma Boutique";
    }
  } else if (effectiveSector === "hotel") {
    if (!activeDisplayName || activeDisplayName === "L'Atelier du Chef & Grill" || activeDisplayName === "Mon établissement") {
      activeDisplayName = matchingVendor?.name || "Mon Hôtel";
    }
  } else {
    activeDisplayName = activeDisplayName || "L'Atelier du Chef & Grill";
  }

  return (
    <>
      <div className="relative mb-3">
        {/* Bouton d'affichage de l'établissement actif */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2.5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200/70 group-hover:scale-105 transition-transform">
              {getSectorIcon(effectiveSector)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-xs font-bold text-zinc-950 truncate leading-tight">
                {activeDisplayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] font-sub text-zinc-500 capitalize truncate">
                  {effectiveSector === "ecommerce" ? "Boutique" : effectiveSector === "hotel" ? "Hôtel" : "Restaurant"} • {vendorProfile?.city || "Bénin"}
                </span>
              </div>
            </div>
          </div>
          <ChevronDown size={14} className={`text-zinc-400 shrink-0 ml-1.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Menu Dropdown Switcher */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-zinc-200/90 shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
            {/* Header Formule */}
            <div className="px-2.5 py-1.5 border-b border-zinc-100 flex items-center justify-between text-[11px] font-sub">
              <span className="font-bold text-zinc-700">Mes Établissements ({userVendors.length})</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#EA580C] font-bold text-[10px]">
                {vendorProfile?.subscriptionPlan === "annual" ? "50 000 F/an" : "5 000 F/mois"}
              </span>
            </div>

            {/* Liste des établissements */}
            <div className="max-h-48 overflow-y-auto space-y-1 py-1.5">
              {userVendors.map((v) => {
                const isActive = v.id === currentVendorId;
                const isAnn = v.subscriptionPlan === "annual";
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVendor(v.id)}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors text-xs font-sub ${
                      isActive
                        ? "bg-zinc-900 text-white font-bold"
                        : "hover:bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/10" : "bg-zinc-100"}`}>
                        {getSectorIcon(v.business_type)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-heading text-xs leading-tight">{v.name}</p>
                        <p className={`text-[10px] truncate ${isActive ? "text-zinc-300" : "text-zinc-400"}`}>
                          {v.business_type === "ecommerce" ? "Boutique" : v.business_type === "hotel" ? "Hôtel" : "Restaurant"} • {v.city || "Cotonou"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-mono ${isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                        {isAnn ? "Annuel" : "5 000 F"}
                      </span>
                      {isActive && <Check size={14} className="text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sélecteur de secteur rapide pour l'établissement actif */}
            <div className="p-2 my-1 rounded-xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Activité de l'établissement</span>
                <span className="text-[10px] font-bold capitalize" style={{ color: effectiveSector === "ecommerce" ? "#9333EA" : effectiveSector === "hotel" ? "#4F46E5" : "#EA580C" }}>
                  {effectiveSector === "ecommerce" ? "Boutique" : effectiveSector === "hotel" ? "Hôtel" : "Restaurant"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={async () => {
                    await updateVendorBusinessType("ecommerce");
                    toast.success("✨ Établissement configuré en Boutique !");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    effectiveSector === "ecommerce"
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
                  }`}
                >
                  <ShoppingBag size={11} />
                  <span>Boutique</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateVendorBusinessType("restaurant");
                    toast.success("✨ Établissement configuré en Restaurant !");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    effectiveSector === "restaurant"
                      ? "bg-[#FF6B00] text-white shadow-xs"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
                  }`}
                >
                  <Utensils size={11} />
                  <span>Resto</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateVendorBusinessType("hotel");
                    toast.success("✨ Établissement configuré en Hôtel !");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    effectiveSector === "hotel"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/60"
                  }`}
                >
                  <Hotel size={11} />
                  <span>Hôtel</span>
                </button>
              </div>
            </div>

            {/* Bouton d'ajout vers la page dédiée */}
            <div className="pt-1.5 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/vendor/establishments/new");
                }}
                className="w-full py-2 px-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#EA580C] text-xs font-sub font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>+ Ajouter un établissement</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout d'établissement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                  <Store size={16} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-base text-zinc-950">Nouvel Établissement</h3>
                  <p className="text-[11px] text-zinc-500 font-sub">Ajoutez un restaurant, une boutique ou un hôtel</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 font-sub text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Nom de l'établissement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : KiffStyle Store, Le Maquis Étoilé..."
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Secteur d'activité *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "restaurant", label: "Restaurant", icon: <Utensils size={14} /> },
                    { id: "ecommerce", label: "Boutique", icon: <ShoppingBag size={14} /> },
                    { id: "hotel", label: "Hôtel", icon: <Hotel size={14} /> },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setNewStore({ ...newStore, business_type: s.id as BusinessSector })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        newStore.business_type === s.id
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-xs font-bold"
                          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {s.icon}
                      <span className="text-[11px]">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Ville d'implantation *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Cotonou, Porto-Novo, Parakou..."
                  value={newStore.city}
                  onChange={(e) => setNewStore({ ...newStore, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-bold shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Création..." : "Créer l'établissement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
