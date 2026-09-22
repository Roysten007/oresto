import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-white tracking-tight">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-md">
                O
              </span>
              <span>ORESTO</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              La plateforme tout-en-un pour créer votre site professionnel, digitaliser vos commandes et encaisser par Mobile Money sans intermédiaire.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>14 jours d'essai gratuit • 0% de commission</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-300 font-medium">🍽️ Restaurants & Maquis</span></li>
              <li><span className="text-slate-300 font-medium">🛍️ Boutiques & E-Commerce</span></li>
              <li><span className="text-slate-300 font-medium">🏨 Hôtels & Résidences</span></li>
              <li><a href="#demo" className="hover:text-amber-400 transition-colors">Démonstration en direct</a></li>
              <li><a href="#tarifs" className="hover:text-amber-400 transition-colors">Tarifs & Offres</a></li>
            </ul>
          </div>

          {/* Accès Rapide Column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Espace Pro</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-amber-400 transition-colors">Créer un compte (Essai 14j)</Link></li>
              <li><Link to="/login" className="hover:text-amber-400 transition-colors">Connexion Espace Vendeur</Link></li>
              <li><Link to="/admin/login" className="hover:text-amber-400 transition-colors">Back-office Admin</Link></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Foire Aux Questions</a></li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Assistance Locale</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="https://wa.me/2290143405361" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  +229 01 43 40 53 61
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:contact@oresto.bj" className="hover:text-amber-400 transition-colors">
                  contact@oresto.bj
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Cotonou, Bénin</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Oresto. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Conçu avec <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> pour les entrepreneurs d'Afrique de l'Ouest
          </p>
        </div>
      </div>
    </footer>
  );
}
