import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, Store } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"client" | "vendor">("client");
  const [form, setForm] = useState({ firstName: "", name: "", phone: "", email: "", password: "", confirmPassword: "" });
  const [vendorForm, setVendorForm] = useState({ shopName: "", category: "Restaurants", city: "", neighborhood: "", shopPhone: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = role === "vendor" ? 3 : 2;

  const handleNext = () => {
    if (step === 1) { setStep(2); return; }
    if (step === 2) {
      if (form.password !== form.confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
      if (!form.email || !form.password || !form.firstName) { setError("Veuillez remplir tous les champs obligatoires."); return; }
      if (role === "vendor") { setStep(3); setError(""); return; }
      const result = register({ ...form, role });
      if (result.success) navigate("/app/home");
      else setError(result.error || "Erreur");
      return;
    }
    if (step === 3) {
      const result = register({ ...form, role, vendorId: `v${Date.now()}` });
      if (result.success) navigate("/vendor/dashboard");
      else setError(result.error || "Erreur");
    }
  };

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <Link to="/" className="font-heading text-3xl font-bold text-primary block text-center mb-6">ORESTO</Link>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8 px-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive font-body text-sm">{error}</div>}

        {step === 1 && (
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2 text-center">Créer un compte</h1>
            <p className="font-sub text-muted-foreground mb-8 text-center">Choisissez votre type de compte</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setRole("client"); setStep(2); }}
                className={`card-hover p-6 rounded-2xl border-2 text-center ${role === "client" ? "border-primary" : "border-border"}`}>
                <User size={32} className="mx-auto mb-3 text-foreground" />
                <h3 className="font-heading font-semibold text-foreground">Je suis un client</h3>
                <p className="font-body text-xs text-muted-foreground mt-2">Commander et recevoir</p>
              </button>
              <button onClick={() => { setRole("vendor"); setStep(2); }}
                className="card-hover p-6 rounded-2xl bg-oresto-black text-center border-2 border-oresto-black">
                <Store size={32} className="mx-auto mb-3 text-primary" />
                <h3 className="font-heading font-semibold text-primary-foreground">J'ai une boutique</h3>
                <p className="font-body text-xs text-primary-foreground/60 mt-2">Vendre sur Oresto</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">Vos informations</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sub text-sm font-medium text-foreground block mb-1">Prénom</label>
                  <input value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} required
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="font-sub text-sm font-medium text-foreground block mb-1">Nom</label>
                  <input value={form.name} onChange={e => updateForm("name", e.target.value)} required
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Téléphone</label>
                <input value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" placeholder="+229 97 00 00 00" />
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} required
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Mot de passe</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={form.password} onChange={e => updateForm("password", e.target.value)} required
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none pr-12" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Confirmer le mot de passe</label>
                <input type="password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} required
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-6">Profil de votre boutique</h2>
            <div className="space-y-4">
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Nom de la boutique</label>
                <input value={vendorForm.shopName} onChange={e => setVendorForm(p => ({ ...p, shopName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Catégorie</label>
                <select value={vendorForm.category} onChange={e => setVendorForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none">
                  {["Restaurants", "Pharmacies", "Épiceries", "Boutiques", "Boulangeries", "Coiffure", "Livraison", "Hôtels"].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sub text-sm font-medium text-foreground block mb-1">Ville</label>
                  <input value={vendorForm.city} onChange={e => setVendorForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="font-sub text-sm font-medium text-foreground block mb-1">Quartier</label>
                  <input value={vendorForm.neighborhood} onChange={e => setVendorForm(p => ({ ...p, neighborhood: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">Téléphone boutique</label>
                <input value={vendorForm.shopPhone} onChange={e => setVendorForm(p => ({ ...p, shopPhone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="flex gap-3 mt-8">
            <button onClick={() => { setStep(step - 1); setError(""); }}
              className="flex-1 py-3 rounded-full border-2 border-border text-foreground font-sub font-semibold btn-hover">
              Retour
            </button>
            <button onClick={handleNext}
              className="flex-1 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
              {step === totalSteps ? "Créer mon compte" : "Suivant"}
            </button>
          </div>
        )}

        <p className="mt-6 text-center font-body text-sm text-muted-foreground">
          Déjà un compte ? <Link to="/login" className="text-primary font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
