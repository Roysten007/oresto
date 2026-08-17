import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
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
        toast.success("Votre établissement a été créé avec succès ! Bienvenue 🚀", { duration: 4000 });
        navigate("/vendor/dashboard", { replace: true });
      } else {
        setError(result.error || "Erreur lors de la création de la boutique");
        setLoading(false);
      }
    }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Left Panel - Hero Info */}
      <div className="hidden lg:flex lg:w-1/3 bg-[#0A0A0A] p-10 lg:p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF6B00] opacity-5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <Link to="/" className="relative z-10 flex items-center gap-1 no-underline">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 22, color: "white" }}>OREST</span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 22, color: "white", position: "relative" }}>
            O<div className="absolute bottom-1 right-[-6px] w-[5px] h-[5px] bg-[#FF6B00] rounded-[1px]" />
          </span>
        </Link>

        <div className="relative z-10">
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }} className="text-3xl lg:text-5xl text-white leading-tight mb-6">
            Votre empire<br />commence ici.
          </h1>
          <p className="text-[#888] text-lg leading-relaxed">
            Rejoignez la plateforme qui révolutionne la restauration et l'hôtellerie en Afrique de l'Ouest.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {[
            { t: "Rapide", d: "Créez votre site en 12 min" },
            { t: "Complet", d: "Dashboard, Site & Chat inclus" },
            { t: "Gratuit", d: "Sans frais d'inscription" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <CheckCircle2 size={24} className="text-[#FF6B00]" />
              <div>
                <p className="text-white font-bold text-sm">{item.t}</p>
                <p className="text-[#666] text-xs">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Steps Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20">
        <div className="lg:hidden mb-8 w-full flex justify-center">
          <Link to="/" className="flex items-center gap-1 no-underline">
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 24, color: "#0A0A0A" }}>OREST</span>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 24, color: "#0A0A0A", position: "relative" }}>
              O<div className="absolute bottom-1 right-[-6px] w-[6px] h-[6px] bg-[#FF6B00] rounded-[1px]" />
            </span>
          </Link>
        </div>

        <div className="w-full max-w-lg">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i < step ? "bg-[#FF6B00]" : "bg-[#EEEEEE]"}`} />
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in duration-300">
              ⚠️ {error}
            </div>
          )}

          <div className="mb-10 text-center lg:text-left">
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }} className="text-3xl text-[#0A0A0A] mb-2">
              {step === 1 ? "Vos informations" : "Votre établissement"}
            </h2>
            <p className="text-[#777]">Étape {step} sur {totalSteps}</p>
          </div>

          <div className="space-y-8">
            {/* Étape 1 : Informations personnelles */}
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-10 duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Prénom</label>
                    <input 
                      value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} required
                      className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Nom</label>
                    <input 
                      value={form.name} onChange={e => updateForm("name", e.target.value)} required
                      className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Téléphone</label>
                  <input 
                    value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none" placeholder="+229 97 00 00 00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Email pro</label>
                  <input 
                    type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} required
                    className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Mot de passe</label>
                  <div className="relative">
                    <input 
                      type={showPw ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)} required
                      className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none pr-12"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BBB]">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Confirmer le mot de passe</label>
                  <input 
                    type="password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} required
                    className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Étape 2 : Informations Vendeur */}
            {step === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-10 duration-500">
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Nom de l'établissement</label>
                  <input 
                    value={vendorForm.shopName} onChange={e => setVendorForm(p => ({ ...p, shopName: e.target.value }))}
                    placeholder="Ex: Le Béninois, Chez Maman..."
                    className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Catégorie</label>
                  <div className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-[#FAFAFA] flex items-center gap-3">
                    <span className="text-xl">🍽️</span>
                    <span className="font-bold text-[#0A0A0A]">Restaurants</span>
                    <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-[#FF6B00] bg-[#FFF3E8] px-2 py-1 rounded-full">Catégorie par défaut</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Ville</label>
                    <input 
                      value={vendorForm.city} onChange={e => setVendorForm(p => ({ ...p, city: e.target.value }))}
                      placeholder="Ex: Cotonou"
                      className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Quartier</label>
                    <input 
                      value={vendorForm.neighborhood} onChange={e => setVendorForm(p => ({ ...p, neighborhood: e.target.value }))}
                      placeholder="Ex: Haïe Vive"
                      className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Téléphone de la réception</label>
                  <input 
                    value={vendorForm.shopPhone} onChange={e => setVendorForm(p => ({ ...p, shopPhone: e.target.value }))}
                    placeholder="+229 97 00 00 00"
                    className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none"
                  />
                </div>

                {/* Formule d'abonnement unique */}
                <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      ✨ Formule Unique Oresto Pro
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                      -50% 1er mois (2 500 F)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-2xl text-[#0A0A0A]">5 000 FCFA</span>
                    <span className="text-xs font-bold text-gray-500">/ mois</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    🎉 <strong>Essai 100% gratuit</strong> jusqu'au 1er octobre 2026. 0% de commission sur vos commandes, Site Web autonome inclus & Assistant IA IZA.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={() => { setStep(step - 1); setError(""); }}
                  className="flex-1 py-5 rounded-full border-2 border-[#EEEEEE] text-[#0A0A0A] font-bold flex items-center justify-center gap-2 hover:bg-[#F8F8F8] transition-all"
                >
                  <ArrowLeft size={18} /> Retour
                </button>
              )}
              <button 
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 py-5 rounded-full bg-[#0A0A0A] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#FF6B00] transition-all transform active:scale-95 disabled:opacity-50"
              >
                {loading ? "Création..." : (step === totalSteps ? "Lancer mon établissement" : "Suivant")} <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-[#777] font-medium">
            Déjà partenaire ? <Link to="/login" className="text-[#FF6B00] font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
