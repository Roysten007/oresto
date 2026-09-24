import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sectorParam = searchParams.get("sector") || searchParams.get("type");

  // Step 1: Choix du Secteur | Step 2: Identifiants | Step 3: Établissement
  const [step, setStep] = useState<number>(sectorParam ? 2 : 1);
  const [businessType, setBusinessType] = useState<"restaurant" | "ecommerce" | "hotel">(() => {
    if (sectorParam === "ecommerce" || sectorParam === "boutique") return "ecommerce";
    if (sectorParam === "hotel" || sectorParam === "residence") return "hotel";
    return "restaurant";
  });

  const [form, setForm] = useState({ firstName: "", name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [vendorForm, setVendorForm] = useState({ 
    shopName: "", 
    category: (sectorParam === "ecommerce" || sectorParam === "boutique") ? "E-Commerce & Boutiques" : "Restaurants", 
    city: "", 
    neighborhood: "", 
    shopPhone: "", 
    subscriptionPlan: "pro" as "starter" | "pro" 
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const handleSelectSector = (type: "restaurant" | "ecommerce" | "hotel") => {
    setBusinessType(type);
    setVendorForm(p => ({
      ...p,
      category: type === "ecommerce" ? "E-Commerce & Boutiques" : type === "hotel" ? "Hôtels & Résidences" : "Restaurants"
    }));
    setStep(2);
  };

  const handleNext = async () => {
    setError("");

    if (step === 2) {
      if (!form.firstName || !form.name || !form.email || !form.password) { 
        setError("Veuillez remplir tous les champs obligatoires."); 
        return; 
      }
      if (form.password !== form.confirmPassword) { 
        setError("Les mots de passe ne correspondent pas."); 
        return; 
      }
      if (form.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      setStep(3); 
      return; 
    }

    if (step === 3) {
      if (!vendorForm.shopName || !vendorForm.city) { 
        setError("Veuillez renseigner au moins le nom et la ville de votre établissement."); 
        return; 
      }
      setLoading(true);
      const result = await register({ 
        ...form, 
        ...vendorForm, 
        role: "vendor", 
        business_type: businessType,
        category: businessType === "ecommerce" ? "E-Commerce & Boutiques" : businessType === "hotel" ? "Hôtels & Résidences" : "Restaurants", 
        vendorId: `v${Date.now()}` 
      });
      if (result.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("oresto_active_workspace", businessType);
        }
        toast.success(`Votre espace ${businessType === "ecommerce" ? "Boutique" : businessType === "hotel" ? "Hôtel" : "Restaurant"} Pro est prêt ! Bienvenue 🚀`, { duration: 4000 });
        navigate("/vendor/dashboard", { replace: true });
      } else {
        setError(result.error || "Erreur lors de la création du compte");
        setLoading(false);
      }
    }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-body">
      
      {/* Left Panel - Hero Info */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#0A0A0A] p-10 lg:p-14 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary opacity-10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <Link to="/" className="relative z-10 flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-store"></i>
          </div>
          <span className="font-heading font-black text-xl tracking-tight uppercase text-white">
            Oresto <span className="text-primary">Pro</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-primary text-xs font-black uppercase tracking-wider">
            <i className="fa-solid fa-shield-halved"></i> 100% Dédié par Secteur
          </div>
          <h1 className="font-heading font-black text-3xl lg:text-4xl text-white leading-tight">
            Votre espace métier sur-mesure.
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Chaque secteur d'activité bénéficie de son propre tableau de bord, de ses outils dédiés et d'un encaissement MoMo direct avec 0% de commission.
          </p>
        </div>

        <div className="relative z-10 space-y-4 text-xs">
          {[
            { t: "Espaces Dédiés", d: "Tableau de bord adapté à votre métier", icon: "fa-solid fa-layer-group" },
            { t: "0% Commission", d: "100% de vos recettes restent sur votre MoMo", icon: "fa-solid fa-money-bill-wave" },
            { t: "14 Jours d'Essai", d: "Testez sans carte bancaire, zéro risque", icon: "fa-solid fa-calendar-check" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-xs">
                <i className={item.icon}></i>
              </div>
              <div>
                <p className="text-white font-bold">{item.t}</p>
                <p className="text-gray-400 text-[11px]">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Steps Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-14">
        <div className="lg:hidden mb-6 w-full flex justify-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <i className="fa-solid fa-store"></i>
            </div>
            <span className="font-heading font-black text-xl text-gray-900 tracking-tight uppercase">
              Oresto <span className="text-primary">Pro</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-lg space-y-6">
          
          {/* Header steps */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                Étape {step} sur {totalSteps}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {step === 1 ? "Choix du Métier" : step === 2 ? "Vos Identifiants" : "Votre Établissement"}
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
              {step === 1 
                ? "Quel est votre secteur d'activité ?" 
                : step === 2 
                ? "Créez vos identifiants d'accès" 
                : `Configurez votre ${businessType === "ecommerce" ? "Boutique E-Commerce" : businessType === "hotel" ? "Hôtel / Résidence" : "Restaurant / Maquis"}`}
            </h2>
            <p className="text-gray-500 text-xs mt-1 font-medium">
              {step === 1 
                ? "Sélectionnez votre métier pour obtenir un tableau de bord et des outils 100% personnalisés." 
                : step === 2 
                ? "Ces informations vous serviront à vous connecter à votre tableau de bord." 
                : "Dernière étape : renseignez les détails de votre commerce pour débuter."}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-base shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          {/* ─── ÉTAPE 1 : CHOIX DU SECTEUR D'ACTIVITÉ ─── */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Option 1 : Restaurant */}
              <button
                type="button"
                onClick={() => handleSelectSector("restaurant")}
                className="w-full p-5 rounded-3xl border-2 border-gray-200 hover:border-primary hover:bg-orange-50/40 text-left transition-all group flex items-start gap-4 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-base text-gray-900 group-hover:text-primary transition-colors">
                      Restaurant, Maquis & Fast-Food
                    </h3>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Carte digitale, QR Codes sur tables, gestion cuisine, commandes de repas & encaissements MoMo.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                    Tableau de bord Resto dédié
                  </span>
                </div>
              </button>

              {/* Option 2 : Boutique E-Commerce */}
              <button
                type="button"
                onClick={() => handleSelectSector("ecommerce")}
                className="w-full p-5 rounded-3xl border-2 border-gray-200 hover:border-primary hover:bg-orange-50/40 text-left transition-all group flex items-start gap-4 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-bag-shopping"></i>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-base text-gray-900 group-hover:text-primary transition-colors">
                      Boutique E-Commerce & Vente en Ligne
                    </h3>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Mode, Tech, Cosmétiques. Fiches multi-photos, sélection des tailles/couleurs, stocks & colis.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                    Tableau de bord Boutique dédié
                  </span>
                </div>
              </button>

              {/* Option 3 : Hôtel & Résidence */}
              <button
                type="button"
                onClick={() => handleSelectSector("hotel")}
                className="w-full p-5 rounded-3xl border-2 border-gray-200 hover:border-primary hover:bg-orange-50/40 text-left transition-all group flex items-start gap-4 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-hotel"></i>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-black text-base text-gray-900 group-hover:text-primary transition-colors">
                      Hôtel, Résidence & Hébergement
                    </h3>
                    <i className="fa-solid fa-chevron-right text-xs text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Présentation des chambres, tarifs nuitées, réservations directes et paiements MoMo sans agence.
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-lg">
                    Tableau de bord Hôtel dédié
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* ─── ÉTAPE 2 & 3 : FORMULAIRE ─── */}
          {step > 1 && (
            <form onSubmit={e => { e.preventDefault(); handleNext(); }} className="space-y-5">
              
              {/* Étape 2 : Identifiants personnels */}
              {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                  <div className="p-3 bg-muted rounded-2xl border border-border flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-bold">Secteur choisi :</span>
                    <span className="font-heading font-black text-primary uppercase">
                      {businessType === "ecommerce" ? "🛍️ Boutique E-Commerce" : businessType === "hotel" ? "🏨 Hôtel / Résidence" : "🍽️ Restaurant / Maquis"}
                    </span>
                    <button type="button" onClick={() => setStep(1)} className="text-primary underline font-bold text-[11px]">
                      Changer
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Prénom *</label>
                      <input 
                        value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} required
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Nom *</label>
                      <input 
                        value={form.name} onChange={e => updateForm("name", e.target.value)} required
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                        placeholder="Houndété"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Adresse Email *</label>
                    <input 
                      type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} required
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                      placeholder="jean@moncommerce.bj"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Téléphone WhatsApp</label>
                    <input 
                      type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                      placeholder="+229 97 00 00 00"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Mot de passe * (min 6 caractères)</label>
                    <div className="relative">
                      <input 
                        type={showPw ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)} required
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none pr-12 text-xs"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <i className={showPw ? "fa-solid fa-eye-slash text-xs" : "fa-solid fa-eye text-xs"}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Confirmer le mot de passe *</label>
                    <input 
                      type="password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} required
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Étape 3 : Établissement & Coordonnées */}
              {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">
                      {businessType === "ecommerce" ? "Nom de votre boutique *" : businessType === "hotel" ? "Nom de votre hôtel / résidence *" : "Nom de votre restaurant / maquis *"}
                    </label>
                    <input 
                      value={vendorForm.shopName} onChange={e => setVendorForm(p => ({ ...p, shopName: e.target.value }))} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs font-bold"
                      placeholder={businessType === "ecommerce" ? "Ex: KiffStyle & Tech Store" : businessType === "hotel" ? "Ex: Palmier Royal Résidence" : "Ex: L'Atelier du Chef & Grill"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Ville *</label>
                      <input 
                        value={vendorForm.city} onChange={e => setVendorForm(p => ({ ...p, city: e.target.value }))} required
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                        placeholder="Ex: Cotonou"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Quartier</label>
                      <input 
                        value={vendorForm.neighborhood} onChange={e => setVendorForm(p => ({ ...p, neighborhood: e.target.value }))}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                        placeholder="Ex: Haie Vive"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1 px-1">Numéro Mobile Money (MTN / Moov / Celtiis)</label>
                    <input 
                      value={vendorForm.shopPhone} onChange={e => setVendorForm(p => ({ ...p, shopPhone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary outline-none text-xs"
                      placeholder="+229 97 00 00 00"
                    />
                  </div>

                  {/* Formule info */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        ✨ Formule Oresto Pro
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm font-bold">
                        14 JOURS D'ESSAI GRATUITS
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-2xl text-emerald-600">0 FCFA</span>
                      <span className="text-xs font-bold text-gray-500">pendant 14 jours, puis 5 000 FCFA / mois sans engagement</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      🎉 <strong>Aucune carte bancaire requise</strong>. Accès immédiat à toutes les fonctionnalités : Vitrine Web autonome, QR Codes et encaissement Mobile Money direct (0% de commission).
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button" onClick={() => setStep(p => p - 1)}
                  className="px-6 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-wider hover:bg-gray-50 transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit" disabled={loading}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Création de votre espace en cours...</span>
                    </>
                  ) : (
                    <span>{step === 2 ? "Continuer" : "Démarrer mes 14 jours gratuits"}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 font-medium">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
