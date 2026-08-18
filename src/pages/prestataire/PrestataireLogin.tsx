import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { toast } from "sonner";
import { Zap, ArrowRight, Lock, Phone, User } from "lucide-react";

export default function PrestataireLogin() {
  const { loginPrestataire } = usePrestataire();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Veuillez saisir votre numéro de téléphone ou email et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginPrestataire(identifier, password);
      if (res.success) {
        toast.success("Bon retour sur votre espace apporteur d'affaires !");
        navigate("/prestataire/dashboard", { replace: true });
      } else {
        setError(res.error || "Identifiants invalides");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between font-body text-gray-900 selection:bg-primary selection:text-white">
      
      {/* Top Header */}
      <header className="bg-white border-b border-gray-150 px-4 sm:px-8 py-4 shadow-xs">
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
            to="/devenir-prestataire"
            className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-primary hover:bg-orange-50 transition-colors border border-orange-200"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-gray-200 shadow-xl space-y-6">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl mb-3 shadow-xs">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h1 className="font-heading font-black text-2xl text-gray-900">
              Espace Apporteur d'Affaires
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Accédez à vos statistiques de parrainage et vos commissions en temps réel.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Phone size={12} className="text-primary" />
                Numéro WhatsApp ou Email *
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="+229 97 00 00 00"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Lock size={12} className="text-primary" />
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-bold text-sm outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Connexion en cours..." : "Accéder à mon Tableau de Bord"}</span>
              <ArrowRight size={15} />
            </button>

            <div className="pt-2 text-center text-xs text-gray-500">
              <span>Pas encore partenaire ? </span>
              <Link to="/devenir-prestataire" className="text-primary font-bold hover:underline">
                Inscrivez-vous ici
              </Link>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-150 py-6 px-4 text-center text-xs text-gray-500 font-medium">
        <p>© {new Date().getFullYear()} Oresto Connect • Programme d'Apporteurs d'Affaires</p>
      </footer>

    </div>
  );
}
