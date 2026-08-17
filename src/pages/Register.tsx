import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<"restaurant" | "ecommerce">("restaurant");
  const [form, setForm] = useState({ firstName: "", name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [vendorForm, setVendorForm] = useState({ 
    shopName: "", 
    category: "Restaurants", 
    city: "", 
    neighborhood: "", 
    shopPhone: "", 
    subscriptionPlan: "pro" as "starter" | "pro" 
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalSteps = 2;

  const handleNext = async () => {
    setError("");
    if (step === 1) {
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

      setStep(2); 
      return; 
    }

    if (step === 2) {
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
        category: businessType === "ecommerce" ? "E-Commerce & Boutiques" : "Restaurants", 
        vendorId: `v${Date.now()}` 
      });
      if (result.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("oresto_active_workspace", businessType);
        }
        toast.success("Votre espace professionnel a été créé avec succès ! Bienvenue 🚀", { duration: 4000 });
        navigate("/vendor/dashboard", { replace: true });
      } else {
        setError(result.error || "Erreur lors de la création de l'espace");
        setLoading(false);
      }
    }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-body">
      {/* Left Panel - Hero Info */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#0A0A0A] p-10 lg:p-16 flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary opacity-10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <Link to="/" className="relative z-10 flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-store"></i>
          </div>
          <span className="font-heading font-black text-xl tracking-tight uppercase text-white">
            Oresto <span className="text-primary">Connect</span>
          </span>
        </Link>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-primary text-xs font-black uppercase tracking-wider">
            <i className="fa-solid fa-dove"></i> Tranquillité d'Esprit
          </div>
          <h1 className="font-heading font-black text-3xl lg:text-5xl text-white leading-tight">
            Votre sérénité<br />commence ici.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Rejoignez les restaurateurs et e-commerçants qui automatisent leurs ventes et gardent 100% de leurs revenus.
          </p>
        </div>

        <div className="relative z-10 space-y-5 text-xs">
          {[
            { t: "Espaces Dédiés", d: "Restaurants ou Boutiques E-Commerce", icon: "fa-solid fa-layer-group" },
            { t: "Zéro Commission", d: "100% de vos gains conservés par MoMo", icon: "fa-solid fa-shield-halved" },
            { t: "14 Jours Gratuits", d: "Sans engagement ni carte bancaire", icon: "fa-solid fa-clock" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3.5">
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20">
        <div className="lg:hidden mb-8 w-full flex justify-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white">
              <i className="fa-solid fa-store"></i>
            </div>
            <span className="font-heading font-black text-xl text-gray-900 tracking-tight uppercase">
              Oresto <span className="text-primary">Connect</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                Étape {step} sur {totalSteps}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {step === 1 ? "Vos Identifiants" : "Votre Établissement"}
              </span>
            </div>
            <h2 className="font-heading font-black text-2xl lg:text-3xl text-gray-900 tracking-tight">
              {step === 1 ? "Créez votre compte Pro" : "Configurez votre espace dédié"}
            </h2>
            <p className="text-gray-500 text-xs mt-1 font-medium">
              {step === 1 ? "Renseignez vos accès personnels pour débuter vos 14 jours d'essai gratuit." : "Sélectionnez votre type d'activité pour obtenir un espace 100% sur-mesure."}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-base shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={e => { e.preventDefault(); handleNext(); }} className="space-y-5">
            {/* Étape 1 : Identifiants personnels */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Prénom *</label>
                    <input 
                      value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Nom *</label>
                    <input 
                      value={form.name} onChange={e => updateForm("name", e.target.value)} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Houndété"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Adresse Email *</label>
                  <input 
                    type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="jean@moncommerce.bj"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Téléphone WhatsApp</label>
                  <input 
                    type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="+229 97 00 00 00"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Mot de passe * (min 6 caractères)</label>
                  <div className="relative">
                    <input 
                      type={showPw ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none pr-12 text-xs"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <i className={showPw ? "fa-solid fa-eye-slash text-xs" : "fa-solid fa-eye text-xs"}></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Confirmer le mot de passe *</label>
                  <input 
                    type="password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Étape 2 : Votre établissement & Choix d'espace */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                
                {/* Choix du type de commerce */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest px-1">
                    Votre type d'activité *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessType("restaurant");
                        setVendorForm(p => ({ ...p, category: "Restaurants" }));
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col gap-1.5 ${
                        businessType === "restaurant" ? "border-primary bg-orange-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-primary flex items-center justify-center text-sm">
                        <i className="fa-solid fa-utensils"></i>
                      </div>
                      <div>
                        <span className="font-heading font-black text-xs text-gray-900 block">Restaurant / Maquis</span>
                        <span className="text-[10px] text-gray-500">Plats, Cuisine, Menus</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBusinessType("ecommerce");
                        setVendorForm(p => ({ ...p, category: "E-Commerce & Boutiques" }));
                      }}
                      className={`p-3.5 rounded-2xl border-2 transition-all text-left flex flex-col gap-1.5 ${
                        businessType === "ecommerce" ? "border-primary bg-orange-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-sm">
                        <i className="fa-solid fa-bag-shopping"></i>
                      </div>
                      <div>
                        <span className="font-heading font-black text-xs text-gray-900 block">Boutique en Ligne</span>
                        <span className="text-[10px] text-gray-500">Mode, Tech, Stocks</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">
                    {businessType === "ecommerce" ? "Nom de votre boutique *" : "Nom de votre établissement *"}
                  </label>
                  <input 
                    value={vendorForm.shopName} onChange={e => setVendorForm(p => ({ ...p, shopName: e.target.value }))} required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder={businessType === "ecommerce" ? "Ex: Boutique Prestige & Tech" : "Ex: Le Maquis Étoilé"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Ville *</label>
                    <input 
                      value={vendorForm.city} onChange={e => setVendorForm(p => ({ ...p, city: e.target.value }))} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Ex: Cotonou"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Quartier</label>
                    <input 
                      value={vendorForm.neighborhood} onChange={e => setVendorForm(p => ({ ...p, neighborhood: e.target.value }))}
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Ex: Haie Vive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Numéro Mobile Money (MTN / Moov / Celtiis)</label>
                  <input 
                    value={vendorForm.shopPhone} onChange={e => setVendorForm(p => ({ ...p, shopPhone: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="+229 97 00 00 00"
                  />
                </div>

                {/* Formule info */}
                <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      ✨ Formule Unique Oresto Pro
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                      -50% 1er mois (2 500 F)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-2xl text-gray-900">5 000 FCFA</span>
                    <span className="text-xs font-bold text-gray-500">/ mois</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    🎉 <strong>Essai 100% gratuit pendant 14 jours</strong> sans engagement. 0% de commission sur vos encaissements, Vitrine Web autonome et Assistant IA IZI.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button" onClick={() => setStep(p => p - 1)}
                  className="px-6 py-4 rounded-2xl border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-wider hover:bg-gray-50 transition-all"
                >
                  Retour
                </button>
              )}
              <button
                type="submit" disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <span>{step === 1 ? "Continuer" : "Lancer mon espace Pro"}</span>
                )}
              </button>
            </div>
          </form>

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
