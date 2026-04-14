import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <ShieldX size={64} className="mx-auto text-destructive mb-6" />
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Accès refusé</h1>
        <p className="font-body text-muted-foreground mb-8">Vous n'avez pas les droits pour accéder à cette page.</p>
        <Link to="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover inline-block">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
