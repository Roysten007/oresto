import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-oresto-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-2xl font-800 text-primary">
            ORESTO
          </Link>

          <div className="hidden md:flex items-center gap-8 font-sub text-sm">
            <a href="#accueil" className="text-primary-foreground/80 hover:text-primary transition-colors">Accueil</a>
            <a href="#fonctionnalites" className="text-primary-foreground/80 hover:text-primary transition-colors">Fonctionnalités</a>
            <a href="#abonnements" className="text-primary-foreground/80 hover:text-primary transition-colors">Abonnements</a>
            <a href="#pays" className="text-primary-foreground/80 hover:text-primary transition-colors">Pays</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 rounded-full border border-primary-foreground/30 text-primary-foreground font-sub text-sm btn-hover hover:border-primary-foreground">
              Se connecter
            </Link>
            <Link to="/register" className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-sub text-sm font-600 btn-hover">
              Commencer
            </Link>
          </div>

          <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-oresto-black border-t border-foreground/10 px-4 pb-4 font-sub">
          <a href="#accueil" className="block py-3 text-primary-foreground/80 hover:text-primary" onClick={() => setOpen(false)}>Accueil</a>
          <a href="#fonctionnalites" className="block py-3 text-primary-foreground/80 hover:text-primary" onClick={() => setOpen(false)}>Fonctionnalités</a>
          <a href="#abonnements" className="block py-3 text-primary-foreground/80 hover:text-primary" onClick={() => setOpen(false)}>Abonnements</a>
          <a href="#pays" className="block py-3 text-primary-foreground/80 hover:text-primary" onClick={() => setOpen(false)}>Pays</a>
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/login" className="text-center px-5 py-2.5 rounded-full border border-primary-foreground/30 text-primary-foreground text-sm">Se connecter</Link>
            <Link to="/register" className="text-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-600">Commencer</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
