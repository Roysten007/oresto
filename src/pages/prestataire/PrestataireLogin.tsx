import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { toast } from "sonner";
import { Lock, Phone, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sub text-zinc-900 selection:bg-orange-100 selection:text-[#EA580C]">
      
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#FF6B00] rounded-xl flex items-center justify-center text-white font-heading font-black text-base shadow-braised">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-black tracking-tight text-zinc-950">
                Oresto
              </span>
              <span className="text-[11px] font-sub font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                Partenaires
              </span>
            </div>
          </Link>

          <Link
            to="/devenir-prestataire"
            className="px-4 py-2 rounded-xl text-xs font-sub font-bold text-[#EA580C] hover:bg-orange-50 transition-colors border border-orange-200"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 border border-zinc-200/90 shadow-float space-y-6">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto text-xl mb-3 border border-orange-100">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h1 className="font-heading font-black text-2xl text-zinc-950 tracking-tight">
              Espace Apporteur d'Affaires
            </h1>
            <p className="text-xs text-zinc-500 font-sub">
              Accédez à votre lien de parrainage et vos commissions en temps réel.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-sub font-bold flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sub">
            
            <div className="space-y-1.5">
              <label className="text-xs font-sub font-bold text-zinc-700 flex items-center gap-1.5">
                <Phone size={12} className="text-[#FF6B00]" />
                Numéro WhatsApp ou Email *
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="+229 97 00 00 00"
                required
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sub font-bold text-zinc-700 flex items-center gap-1.5">
                <Lock size={12} className="text-[#FF6B00]" />
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Connexion en cours..." : "Accéder à mon tableau de bord"}</span>
              <ArrowRight size={15} />
            </button>

            <div className="pt-2 text-center text-xs text-zinc-500 font-sub">
              <span>Pas encore partenaire ? </span>
              <Link to="/devenir-prestataire" className="text-[#EA580C] font-bold hover:underline">
                Inscrivez-vous ici
              </Link>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-6 px-4 text-center text-xs text-zinc-500 font-sub">
        <p>© {new Date().getFullYear()} Oresto • Programme d'Apporteurs d'Affaires</p>
      </footer>

    </div>
  );
}
