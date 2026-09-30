import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Building2, 
  Utensils, 
  ShoppingBag, 
  Hotel, 
  Check, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Phone,
  MapPin,
  Clock
} from "lucide-react";
import { BusinessSector, setVendorSector, getVendorSector } from "@/lib/vendorSector";
import { MONTHLY_PLAN_PRICE, ANNUAL_PLAN_PRICE } from "@/services/subscriptionService";

export default function NewEstablishment() {
  const { user, vendorProfile, createEstablishment } = useAuth();
  const navigate = useNavigate();

  const activeSector = getVendorSector(vendorProfile);

  const [formData, setFormData] = useState({
    name: "",
    business_type: (activeSector || "ecommerce") as BusinessSector,
    city: vendorProfile?.city || "Cotonou",
    neighborhood: vendorProfile?.neighborhood || "Haie Vive",
    whatsapp: vendorProfile?.whatsapp || user?.phone || "+229 ",
    phone: vendorProfile?.phone || user?.phone || "+229 ",
    billingCycle: "monthly" as "monthly" | "annual",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Veuillez indiquer le nom de votre nouvel établissement");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createEstablishment({
        name: formData.name.trim(),
        business_type: formData.business_type,
        city: formData.city.trim() || "Cotonou",
        neighborhood: formData.neighborhood.trim() || "Centre-ville",
        whatsapp: formData.whatsapp.trim(),
        phone: formData.phone.trim(),
        billingCycle: formData.billingCycle,
        category: formData.business_type === "ecommerce" 
          ? "Mode & Boutique" 
          : formData.business_type === "hotel" 
          ? "Hôtel & Résidence" 
          : "Restaurant & Grillades"
      });

      if (result.success && result.vendorId) {
        setVendorSector(formData.business_type);
        toast.success(`🎉 L'établissement « ${formData.name} » a été créé avec succès !`);
        navigate(`/vendor/dashboard`);
      } else {
        toast.error(result.error || "Impossible d'ajouter cet établissement.");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sub">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#EA580C] text-xs font-bold mb-2">
          <Building2 size={13} />
          <span>Multi-Établissements Oresto</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 tracking-tight">
          Ajouter un nouvel <span className="text-[#FF6B00]">établissement</span>
        </h1>
        <p className="text-xs text-zinc-500 font-sub mt-1 leading-relaxed max-w-2xl">
          Créez une nouvelle boutique, un restaurant ou un hôtel sous votre compte unique (<strong className="text-zinc-800">{user?.email || "votre compte professionnel"}</strong>). Vous pourrez ensuite basculer librement de l'un à l'autre en un clic depuis votre tableau de bord.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Étape 1 : Identité de l'entreprise */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-zinc-950">Informations de l'établissement</h2>
              <p className="text-[11px] text-zinc-500">Nom, secteur d'activité et coordonnées</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                Nom officiel de l'établissement *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : KiffStyle Sneakers, Le Jardin Gourmand, Résidence Les Palmiers..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            {/* Secteur d'activité */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-2">
                Secteur d'activité *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "restaurant" as BusinessSector,
                    label: "Restaurant",
                    subtitle: "Carte, plats, tables & cuisine",
                    icon: <Utensils size={20} className="text-[#FF6B00]" />
                  },
                  {
                    id: "ecommerce" as BusinessSector,
                    label: "Boutique E-Commerce",
                    subtitle: "Articles, stocks, tailles & colis",
                    icon: <ShoppingBag size={20} className="text-purple-600" />
                  },
                  {
                    id: "hotel" as BusinessSector,
                    label: "Hôtel & Résidence",
                    subtitle: "Chambres, suites & réservations",
                    icon: <Hotel size={20} className="text-indigo-600" />
                  }
                ].map((s) => {
                  const isSelected = formData.business_type === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, business_type: s.id })}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-orange-500/50"
                          : "bg-zinc-50/70 hover:bg-zinc-100 text-zinc-800 border-zinc-200/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? "bg-white/10" : "bg-white border border-zinc-200/60"}`}>
                          {s.icon}
                        </div>
                        {isSelected && <Check size={16} className="text-emerald-400" />}
                      </div>
                      <div>
                        <p className="font-heading font-black text-sm">{s.label}</p>
                        <p className={`text-[11px] mt-0.5 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>{s.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ville & Quartier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  <MapPin size={13} className="inline mr-1 text-zinc-400" /> Ville *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Cotonou, Porto-Novo, Parakou..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                  Quartier / Zone
                </label>
                <input
                  type="text"
                  placeholder="Ex : Haie Vive, Cadjèhoun, Akpakpa..."
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Numéro WhatsApp pour commandes */}
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1.5">
                <Phone size={13} className="inline mr-1 text-emerald-600" /> Numéro WhatsApp commercial de l'établissement *
              </label>
              <input
                type="text"
                required
                placeholder="+229 97 00 00 00"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
              <p className="text-[10px] text-zinc-400 mt-1">C'est sur ce numéro que vos clients vous enverront leurs commandes directes.</p>
            </div>
          </div>
        </div>

        {/* Étape 2 : Choix de la formule (Les 2 tarifs officiels) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-zinc-950">Formule pour cet établissement</h2>
              <p className="text-[11px] text-zinc-500">Choisissez entre la facturation mensuelle ou annuelle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Formule Mensuelle */}
            <div
              onClick={() => setFormData({ ...formData, billingCycle: "monthly" })}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                formData.billingCycle === "monthly"
                  ? "border-[#FF6B00] bg-orange-50/20 shadow-md ring-2 ring-orange-500/20"
                  : "border-zinc-200/90 bg-white hover:border-zinc-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold">
                    Sans engagement
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.billingCycle === "monthly" ? "bg-[#FF6B00] border-[#FF6B00] text-white" : "border-zinc-300"}`}>
                    {formData.billingCycle === "monthly" && <Check size={12} />}
                  </div>
                </div>

                <h3 className="font-heading font-black text-lg text-zinc-950">Formule Mensuelle</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading font-black text-2xl text-zinc-950">{MONTHLY_PLAN_PRICE.toLocaleString("fr-FR")}</span>
                  <span className="text-xs font-bold text-zinc-500">FCFA / mois</span>
                </div>
                <p className="text-xs text-zinc-500 font-sub mt-2 leading-relaxed">
                  Facturation mensuelle par Mobile Money (MTN / Moov). 14 jours d'essai gratuit inclus pour démarrer.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-600 space-y-1.5">
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>0% de commission sur vos ventes</span></div>
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>Catalogue &amp; commandes illimités</span></div>
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>Résiliable à tout moment</span></div>
              </div>
            </div>

            {/* Formule Annuelle */}
            <div
              onClick={() => setFormData({ ...formData, billingCycle: "annual" })}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                formData.billingCycle === "annual"
                  ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20"
                  : "border-zinc-200/90 bg-white hover:border-zinc-300"
              }`}
            >
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                2 mois offerts !
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Économisez 10 000 FCFA
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${formData.billingCycle === "annual" ? "bg-emerald-600 border-emerald-600 text-white" : "border-zinc-300"}`}>
                    {formData.billingCycle === "annual" && <Check size={12} />}
                  </div>
                </div>

                <h3 className="font-heading font-black text-lg text-zinc-950">Formule Annuelle</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading font-black text-2xl text-zinc-950">{ANNUAL_PLAN_PRICE.toLocaleString("fr-FR")}</span>
                  <span className="text-xs font-bold text-zinc-500">FCFA / an</span>
                  <span className="text-[10px] text-zinc-400 line-through ml-1.5">60 000 FCFA</span>
                </div>
                <p className="text-xs text-zinc-500 font-sub mt-2 leading-relaxed">
                  Payez 10 mois et bénéficiez de 12 mois complets. Un an complet de sérénité sans interruption.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 text-xs text-zinc-600 space-y-1.5">
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>Tous les avantages Oresto Pro</span></div>
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>2 mois 100% gratuits (10 000 F d'économie)</span></div>
                <div className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /><span>Support prioritaire 7j/7</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* Réassurance & Bouton de création */}
        <div className="p-6 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-heading font-bold text-xs">Même compte : {user?.email}</p>
              <p className="text-[11px] text-zinc-400 font-sub">Vos accès restent inchangés. Vous basculez d'un établissement à l'autre en un clic.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/vendor/dashboard")}
              className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center gap-2 shadow-braised transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <span>Créer et activer l'établissement</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
