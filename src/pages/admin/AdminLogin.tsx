import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = adminLogin(email, password);
    if (result.success) navigate("/oresto-admin/dashboard");
    else setError(result.error || "Erreur");
  };

  return (
    <div className="min-h-screen bg-oresto-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-heading text-4xl font-bold text-primary">ORESTO</span>
          <p className="font-sub text-primary-foreground/50 mt-2">Accès réservé à l'équipe Oresto</p>
        </div>
        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/20 text-destructive font-body text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
            className="w-full px-4 py-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 font-body text-primary-foreground focus:ring-2 focus:ring-primary outline-none" />
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 font-body text-primary-foreground focus:ring-2 focus:ring-primary outline-none pr-12" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/50">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
            Accéder au panel
          </button>
        </form>
      </div>
    </div>
  );
}
