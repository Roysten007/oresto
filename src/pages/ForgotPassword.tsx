import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="font-heading text-3xl font-bold text-primary block mb-8">ORESTO</Link>
        {sent ? (
          <div className="p-8 rounded-2xl bg-card border border-border">
            <span className="text-5xl block mb-4">✅</span>
            <h1 className="font-heading text-xl font-bold text-foreground mb-2">Email envoyé !</h1>
            <p className="font-body text-muted-foreground mb-6">Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.</p>
            <Link to="/login" className="inline-block px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">Retour à la connexion</Link>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h1 className="font-heading text-xl font-bold text-foreground mb-2">Mot de passe oublié</h1>
            <p className="font-body text-muted-foreground mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
              className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none mb-4" />
            <button onClick={() => setSent(true)} className="w-full py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
              Envoyer le lien
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
