import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const { adminLogin, adminLockedUntil } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    setSubmitting(true);
    const res = await adminLogin(email, password);
    setSubmitting(false);

    if (res.success) {
      toast.success("Connexion réussie");
      navigate("/admin");
    } else {
      toast.error(res.error || "Identifiants incorrects");
    }
  };

  const isLocked = adminLockedUntil && Date.now() < adminLockedUntil;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-primary items-center justify-center text-white shadow-xl shadow-primary/30 mb-4">
          <Zap size={28} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black font-heading tracking-tight text-white uppercase">
          Oresto Insights
        </h2>
        <p className="mt-1 text-xs text-white/50 uppercase tracking-widest font-semibold">
          Espace Administrateur Sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141414] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Email Administrateur
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  disabled={Boolean(isLocked) || submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@oresto.bj"
                  className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  required
                  disabled={Boolean(isLocked) || submitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {isLocked && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <Lock size={14} />
                <span>Accès verrouillé suite à plusieurs tentatives échouées.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={Boolean(isLocked) || submitting}
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-heading font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? "Vérification..." : "Accéder au Dashboard"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-white/40">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Protection par jeton cryptographique Firebase</span>
          </div>
        </div>
      </div>
    </div>
  );
}
