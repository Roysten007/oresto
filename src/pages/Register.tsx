import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: "", name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [vendorForm, setVendorForm] = useState({ shopName: "", category: "Restaurants", city: "", neighborhood: "", shopPhone: "", subscriptionPlan: "pro" as "starter" | "pro" });
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
        setError("Veuillez renseigner au moins le nom et la ville de votre restaurant."); 
        return; 
      }
      setLoading(true);
      const result = await register({ 
        ...form, 
        ...vendorForm, 
        role: "vendor", 
        category: "Restaurants", 
        vendorId: `v${Date.now()}` 
      });
      if (result.success) {
        toast.success("Votre établissement a été configuré avec succès ! Bienvenue 🚀", { duration: 4000 });
        navigate("/vendor/dashboard", { replace: true });
      } else {
        setError(result.error || "Erreur lors de la création de la boutique");
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
            <i className="fa-solid fa-utensils"></i>
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
            Rejoignez les professionnels qui automatisent leurs commandes et gardent 100% de leurs revenus.
          </p>
        </div>

        <div className="relative z-10 space-y-5 text-xs">
          {[
            { t: "Création Rapide", d: "Votre site prêt en 12 minutes", icon: "fa-solid fa-bolt" },
            { t: "Zéro Commission", d: "100% de vos gains dans votre poche", icon: "fa-solid fa-shield-halved" },
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
              <i className="fa-solid fa-utensils"></i>
            </div>
            <span className="font-heading font-black text-xl text-gray-900 tracking-tight uppercase">
              Oresto <span className="text-primary">Connect</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-lg">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < step ? "bg-primary" : "bg-gray-200"}`} />
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation text-red-500 text-sm shrink-0"></i>
                <span>{error}</span>
              </div>
              {error.includes("Se connecter") && (
                <div className="pt-2 border-t border-red-200/60">
                  <Link 
                    to={`/login?email=${encodeURIComponent(form.email)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-right-to-bracket"></i>
                    Se connecter avec cet email
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="mb-8 text-center lg:text-left">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 mb-1">
              {step === 1 ? "Vos informations personnelles" : "Votre établissement"}
            </h2>
            <p className="text-xs text-gray-500 font-bold">Étape {step} sur {totalSteps}</p>
          </div>

          <div className="space-y-6">
            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Prénom *</label>
                    <input 
                      value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Ex: Sophie"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Nom *</label>
                    <input 
                      value={form.name} onChange={e => updateForm("name", e.target.value)} required
                      className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                      placeholder="Ex: Lawson"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Numéro Téléphone / WhatsApp</label>
                  <input 
                    value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs" 
                    placeholder="+229 97 00 00 00"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Email *</label>
                  <input 
                    type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="contact@monrestaurant.com"
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

            {/* Étape 2 : Votre établissement */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-10 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Nom de votre établissement *</label>
                  <input 
                    value={vendorForm.shopName} onChange={e => setVendorForm(p => ({ ...p, shopName: e.target.value }))} required
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-xs"
                    placeholder="Ex: Le Maquis Étoilé"
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
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1.5 px-1">Numéro Mobile Money (MoMo / Moov)</label>
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
                    🎉 <strong>Essai 100% gratuit pendant 14 jours</strong> sans carte bancaire. 0% de commission sur vos commandes, Site Web autonome inclus & Assistant IA IZI.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={() => { setStep(step - 1); setError(""); }}
                  className="flex-1 py-4 rounded-full border-2 border-gray-200 text-gray-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <i className="fa-solid fa-arrow-left"></i> Retour
                </button>
              )}
              <button 
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 py-4 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <span><i className="fa-solid fa-spinner fa-spin mr-1"></i> Création...</span>
                ) : (
                  <span>{step === totalSteps ? "Lancer mon établissement" : "Continuer"} <i className="fa-solid fa-arrow-right ml-1"></i></span>
                )}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-500 text-xs font-medium">
            Déjà partenaire ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
