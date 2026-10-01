import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Login() {
  const { login, loginAsGuest, lockedUntil } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isLocked) return;
    setLoading(true);
    setError("");
    
    const result = await login(email, password);
    if (result.success) {
      if (result.role === "admin") navigate("/oresto-admin/dashboard");
      else navigate("/vendor/dashboard");
    } else {
      setError(result.error || "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <SEOHead
        title="Connexion Espace Commerçant & Partenaire"
        description="Connectez-vous à votre espace Oresto pour gérer vos vitrines, commandes et encaissements Mobile Money."
      />
      {/* Left Panel - Brand / Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] p-10 lg:p-20 flex-col justify-between relative overflow-hidden">
        {/* Subtle orange glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B00] opacity-10 blur-[100px] rounded-full" />
        
        <Link to="/" className="relative z-10 flex items-center gap-1 no-underline">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 24, color: "white" }}>ORESTO</span>
        </Link>

        <div className="relative z-10 mt-20 lg:mt-0">
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }} className="text-4xl lg:text-6xl text-white leading-tight mb-6">
            Ravis de vous<br />revoir parmi nous.
          </h1>
          <p className="text-[#AAAAAA] text-lg max-w-md leading-relaxed">
            Connectez-vous à votre espace restaurateur pour gérer votre site, vos produits et vos commandes.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8 pt-10 border-t border-white/10 mt-10">
          <div>
            <p className="text-white font-bold text-xl mb-1">2 400+</p>
            <p className="text-[#666] text-xs uppercase tracking-widest font-semibold">Restaurants</p>
          </div>
          <div>
            <p className="text-white font-bold text-xl mb-1">12 min</p>
            <p className="text-[#666] text-xs uppercase tracking-widest font-semibold">Création de site</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20">
        <div className="lg:hidden mb-8 w-full flex justify-center">
          <Link to="/" className="flex items-center gap-1 no-underline">
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 24, color: "#0A0A0A" }}>ORESTO</span>
          </Link>
        </div>
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }} className="text-3xl text-[#0A0A0A] mb-2">Connexion Restaurateur</h2>
            <p className="text-[#777]">Entrez vos identifiants pour accéder à votre espace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in duration-300">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#0A0A0A] uppercase tracking-widest mb-2 px-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all placeholder:text-[#BBB]"
                placeholder="votre@email.com" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs font-bold text-[#0A0A0A] uppercase tracking-widest">Mot de passe</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#FF6B00] hover:underline">Oublié ?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPw ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-[#EEEEEE] bg-white text-[#0A0A0A] focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] outline-none transition-all pr-12 placeholder:text-[#BBB]"
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BBB] hover:text-[#0A0A0A] transition-colors"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !!isLocked}
              className="w-full group bg-[#0A0A0A] text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#FF6B00] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/5"
            >
              {loading ? "Connexion..." : "Se connecter"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-[#777] font-medium">
              Pas encore de restaurant enregistré ? <Link to="/register" className="text-[#FF6B00] font-bold hover:underline">Créer mon site</Link>
            </p>
          </div>

          {import.meta.env.DEV && (
            <div className="mt-8 p-5 rounded-2xl bg-[#F8F9FA] border border-[#EEEEEE] space-y-2.5">
              <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-2">Comptes de test (Dev uniquement)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("kofi@test.com");
                    setPassword("vendor123");
                  }}
                  className="text-left p-2.5 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#FF6B00] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A0A0A]">🍽️ Vendeur Resto</span>
                    <span className="text-[10px] font-semibold text-[#888]">Kofi</span>
                  </div>
                  <div className="text-[11px] text-[#666] truncate">kofi@test.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("aminata@test.com");
                    setPassword("client123");
                  }}
                  className="text-left p-2.5 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#FF6B00] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0A0A0A]">🛍️ Boutique</span>
                    <span className="text-[10px] font-semibold text-[#888]">Aminata</span>
                  </div>
                  <div className="text-[11px] text-[#666] truncate">aminata@test.com</div>
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-[#777]">
                <span>Portail administrateur</span>
                <Link to="/oresto-admin/login" className="text-[#FF6B00] font-bold hover:underline">
                  Connexion Admin →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Outfit:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
