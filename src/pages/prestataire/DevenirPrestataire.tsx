import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { toast } from "sonner";
import { 
  Zap, 
  ArrowRight, 
  DollarSign, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Phone, 
  User, 
  MapPin, 
  CheckCircle2, 
  TrendingUp,
  Percent
} from "lucide-react";

export default function DevenirPrestataire() {
  const { registerPrestataire } = usePrestataire();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    ville: "Cotonou",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nom.trim() || !form.telephone.trim() || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerPrestataire({
        nom: form.nom,
        telephone: form.telephone,
        ville: form.ville,
        password: form.password
      });

      if (res.success) {
        toast.success("🎉 Félicitations ! Votre compte apporteur d'affaires est actif.", { duration: 4000 });
        navigate("/prestataire/dashboard", { replace: true });
      } else {
        setError(res.error || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between font-body text-gray-900 selection:bg-primary selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-gray-150 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/25">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase text-gray-900">
              Oresto <span className="text-primary">Affiliation</span>
            </span>
          </Link>

          <Link
            to="/prestataire/login"
            className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
          >
            <span>Déjà inscrit ? Connexion</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column : Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-primary text-xs font-black uppercase tracking-wider">
              <Percent size={14} />
              <span>Programme Partenaires & Apporteurs d'Affaires</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading font-black text-3xl sm:text-5xl text-gray-900 tracking-tight leading-[1.1]">
                Gagnez <span className="text-primary">20% de commission</span> sur chaque abonnement.
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-xl">
                Recommandez Oresto Connect aux restaurants, boutiques et hôtels de votre ville. Touchez 20% de chaque paiement mensuel, <strong>à vie</strong> tant que vos clients restent actifs.
              </p>
            </div>

            {/* 3 Strong Arguments */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-gray-900">Revenus Passifs Récurrents</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Gagnez <strong>3 000 à 5 000 FCFA / mois</strong> par client actif. 10 clients = <strong>50 000 FCFA / mois</strong> sans effort supplémentaire.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-gray-900">Lien de Parrainage Personnel</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Partagez votre lien sur WhatsApp et réseaux sociaux. Tout commerçant qui s'inscrit vous est automatiquement attribué.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-gray-900">Paiements MoMo Automatiques</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Encaissez vos gains chaque fin de mois directement sur votre compte MTN Mobile Money ou Moov Money.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column : Signup Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-gray-200 shadow-xl space-y-6">
              
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-heading font-black text-2xl text-gray-900">
                  Créer mon Compte Prestataire
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Inscription gratuite et activation instantanée en moins de 60 secondes.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Nom */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <User size={12} className="text-primary" />
                    Nom et Prénom *
                  </label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Jean Houndété"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
                  />
                </div>

                {/* Téléphone & Ville */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Phone size={12} className="text-primary" />
                      Numéro WhatsApp (MoMo) *
                    </label>
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={e => setForm({ ...form, telephone: e.target.value })}
                      placeholder="+229 97 00 00 00"
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <MapPin size={12} className="text-primary" />
                      Ville de résidence *
                    </label>
                    <select
                      value={form.ville}
                      onChange={e => setForm({ ...form, ville: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      <option value="Cotonou">Cotonou</option>
                      <option value="Abomey-Calavi">Abomey-Calavi</option>
                      <option value="Porto-Novo">Porto-Novo</option>
                      <option value="Parakou">Parakou</option>
                      <option value="Bohicon">Bohicon</option>
                      <option value="Ouidah">Ouidah</option>
                      <option value="Autre">Autre ville</option>
                    </select>
                  </div>
                </div>

                {/* Mot de passe & Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Lock size={12} className="text-primary" />
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 6 caractères"
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                      <Lock size={12} className="text-primary" />
                      Confirmer mot de passe *
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirmer"
                      required
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{loading ? "Création du compte..." : "Activer mon Compte Apporteur d'Affaires"}</span>
                  <ArrowRight size={15} />
                </button>

                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  En vous inscrivant, vous acceptez les conditions du programme d'affiliation Oresto Connect. Aucune carte bancaire requise.
                </p>

              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-150 py-6 px-4 text-center text-xs text-gray-500 font-medium">
        <p>© {new Date().getFullYear()} Oresto Connect • Programme d'Apporteurs d'Affaires Indépendants</p>
      </footer>

    </div>
  );
}
