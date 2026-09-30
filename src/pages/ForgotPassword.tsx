import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setError("");

    if (!auth) {
      setError("Le service d'authentification est momentanément indisponible.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.code === "auth/user-not-found") {
        // Pour des raisons de sécurité, afficher quand même succès ou message clair
        setSent(true);
      } else if (err.code === "auth/invalid-email") {
        setError("L'adresse email saisie est invalide.");
      } else {
        setError("Impossible d'envoyer l'email de réinitialisation. Vérifiez l'adresse saisie.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4 font-body">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-block font-heading text-2xl sm:text-3xl font-black text-primary mb-8 tracking-tight uppercase no-underline">
          ORESTO
        </Link>
        {sent ? (
          <div className="p-8 rounded-[28px] bg-white border border-gray-150 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
              <i className="fa-solid fa-envelope-circle-check"></i>
            </div>
            <h1 className="font-heading text-xl font-bold text-gray-900">Email envoyé !</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Si un compte est associé à <strong className="text-gray-900">{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe en quelques secondes.
            </p>
            <div className="pt-2">
              <Link to="/login" className="inline-block w-full py-3.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all no-underline">
                Retour à la connexion
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="p-8 rounded-[28px] bg-white border border-gray-150 shadow-xl text-left space-y-4">
            <div className="text-center space-y-1 mb-4">
              <h1 className="font-heading text-2xl font-black text-gray-900">Mot de passe oublié ?</h1>
              <p className="text-gray-500 text-xs">
                Entrez votre adresse email enregistrée pour recevoir les instructions de réinitialisation.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                Adresse Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-medium text-sm outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Envoyer le lien de réinitialisation</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
                ← Retourner à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
