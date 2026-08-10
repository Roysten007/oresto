import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const result = await adminLogin(email, password);
    if (result.success) {
      navigate("/oresto-admin/dashboard");
    } else {
      setError(result.error || "Identifiants incorrects");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden font-body selection:bg-primary selection:text-white">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 no-underline">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
              <i className="fa-solid fa-bolt text-xl"></i>
            </div>
            <span className="font-heading text-3xl font-black tracking-tighter uppercase text-white">
              ORESTO
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <i className="fa-solid fa-shield-halved text-xs"></i> Espace Sécurisé Admin
          </div>
          <p className="text-white/60 text-sm font-sub">
            Connectez-vous pour gérer la plateforme Oresto
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-sm"></i> {error}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl space-y-5 shadow-2xl">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@oresto.bj"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/70 mb-2">
              Mot de Passe
            </label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-white font-sub text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i> Connexion...
              </>
            ) : (
              <>
                <i className="fa-solid fa-[#FF6A00] fa-right-to-bracket text-sm"></i> Accéder au panneau
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link to="/" className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center justify-center gap-1.5 no-underline">
            <i className="fa-solid fa-arrow-left text-[10px]"></i> Retourner à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
