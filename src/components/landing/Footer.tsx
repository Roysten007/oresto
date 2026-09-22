import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 font-sans border-t border-violet-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#6633d6] text-white flex items-center justify-center font-bold text-sm shadow-[0_4px_12px_rgba(102,51,214,0.35)]">
                O
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#0f0a1f]">
                Oresto
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-sm">
              La plateforme tout-en-un pour créer votre vitrine professionnelle, digitaliser vos commandes et encaisser par Mobile Money sans commission.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#6633d6] bg-violet-50 border border-violet-100 px-3.5 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-[#6633d6]" />
              <span>14 jours d'essai gratuit • 0% de commission</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-bold text-[#0f0a1f] mb-4 text-xs uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-700 font-medium">🍽️ Restaurants & Maquis</span></li>
              <li><span className="text-slate-700 font-medium">🛍️ Boutiques & E-Commerce</span></li>
              <li><span className="text-slate-700 font-medium">🏨 Hôtels & Résidences</span></li>
              <li><a href="#demo" className="hover:text-[#6633d6] transition-colors">Démo en direct</a></li>
              <li><a href="#tarifs" className="hover:text-[#6633d6] transition-colors">Tarifs (5 000 F/mois)</a></li>
            </ul>
          </div>

          {/* Espace Pro Column */}
          <div>
            <h4 className="font-bold text-[#0f0a1f] mb-4 text-xs uppercase tracking-wider">Espace Pro</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="hover:text-[#6633d6] transition-colors">Créer un compte (14j gratuits)</Link></li>
              <li><Link to="/login" className="hover:text-[#6633d6] transition-colors">Connexion Espace Vendeur</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#6633d6] transition-colors">Back-office Admin</Link></li>
              <li><a href="#faq" className="hover:text-[#6633d6] transition-colors">Foire Aux Questions</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-[#0f0a1f] mb-4 text-xs uppercase tracking-wider">Assistance Locale</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6633d6] shrink-0" />
                <a href="https://wa.me/2290143405361" target="_blank" rel="noopener noreferrer" className="hover:text-[#6633d6] transition-colors font-medium">
                  +229 01 43 40 53 61
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6633d6] shrink-0" />
                <a href="mailto:contact@oresto.bj" className="hover:text-[#6633d6] transition-colors font-medium">
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

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Oresto. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> pour les entrepreneurs du Bénin & d'Afrique de l'Ouest
          </p>
        </div>
      </div>
    </footer>
  );
}
