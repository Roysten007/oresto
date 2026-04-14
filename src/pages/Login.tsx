import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, failedAttempts, lockedUntil } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      const userData = localStorage.getItem("oresto_user");
      if (userData) {
        const user = JSON.parse(userData);
        navigate(user.role === "vendor" ? "/vendor/dashboard" : "/app/home");
      }
    } else {
      setError(result.error || "Erreur");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-oresto-black flex-col justify-center p-12">
        <Link to="/" className="font-heading text-4xl font-bold text-primary mb-4">ORESTO</Link>
        <p className="font-sub text-primary-foreground/60 text-lg mb-12">La super-app du commerce local en Afrique de l'Ouest</p>
        <ul className="space-y-6">
          {["🏪 +2 400 boutiques partenaires", "📱 Paiement MoMo intégré", "🚀 Livraison en ~20 minutes"].map((feat, i) => (
            <li key={i} className="flex items-center gap-3 text-primary-foreground/80 font-body">{feat}</li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden font-heading text-3xl font-bold text-primary block mb-8">ORESTO</Link>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Connexion</h1>
          <p className="font-sub text-muted-foreground mb-8">Connectez-vous à votre compte Oresto</p>

          {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive font-body text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-sub text-sm font-medium text-foreground block mb-1.5">Email / Téléphone</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                placeholder="votre@email.com" />
            </div>
            <div>
              <label className="font-sub text-sm font-medium text-foreground block mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition pr-12"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="font-sub text-sm text-primary hover:underline">Mot de passe oublié ?</Link>
            </div>
            <button type="submit" disabled={!!isLocked}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover disabled:opacity-50">
              Se connecter
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            Pas encore de compte ? <Link to="/register" className="text-primary font-medium hover:underline">Créer un compte</Link>
          </p>

          <div className="mt-8 p-4 rounded-2xl bg-muted">
            <p className="font-sub text-xs text-muted-foreground mb-2">Comptes de test :</p>
            <p className="font-body text-xs text-muted-foreground">Client : aminata@test.com / client123</p>
            <p className="font-body text-xs text-muted-foreground">Vendeur : kofi@test.com / vendor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
