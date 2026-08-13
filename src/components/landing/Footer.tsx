import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-oresto-black text-primary-foreground/70 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-heading text-2xl font-bold text-primary">ORESTO</span>
            <p className="mt-3 text-sm text-primary-foreground/50">La plateforme SaaS des restaurants qui veulent décoller en ligne.</p>
          </div>
          <div>
            <h4 className="font-sub font-semibold text-primary-foreground mb-4 text-sm">Plateforme</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#fonctionnalites" className="hover:text-primary transition-colors">Fonctionnalités</a></li>
              <li><a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sub font-semibold text-primary-foreground mb-4 text-sm">Vendeurs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register?role=vendor" className="hover:text-primary transition-colors">Inscription</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sub font-semibold text-primary-foreground mb-4 text-sm">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Conditions Générales (CGU)</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
          © 2026 Oresto. Fait avec ❤️ pour l'Afrique de l'Ouest.
        </div>
      </div>
    </footer>
  );
}
