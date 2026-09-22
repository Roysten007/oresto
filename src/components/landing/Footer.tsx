import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] text-zinc-600 font-sub border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-sm shadow-braised">
                O
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-zinc-950 uppercase">
                Oresto
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500 font-sub leading-relaxed max-w-sm">
              La plateforme tout-en-un pour créer votre vitrine professionnelle, digitaliser vos commandes et encaisser par Mobile Money sans commission.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-sub font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full w-fit">
              <i className="fa-solid fa-shield-halved text-[#FF6B00]"></i>
              <span>14 jours d'essai gratuit • 0% de commission</span>
            </div>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="font-heading font-black text-zinc-950 mb-4 text-xs uppercase tracking-wider">Solutions</h4>
            <ul className="space-y-2.5 text-sm font-sub">
              <li><span className="text-zinc-800 font-semibold">🍽️ Restaurants & Maquis</span></li>
              <li><span className="text-zinc-800 font-semibold">🛍️ Boutiques & E-Commerce</span></li>
              <li><span className="text-zinc-800 font-semibold">🏨 Hôtels & Résidences</span></li>
              <li><a href="#demo" className="hover:text-[#FF6B00] transition-colors">Démo en direct</a></li>
              <li><a href="#tarifs" className="hover:text-[#FF6B00] transition-colors">Tarifs (5 000 F/mois)</a></li>
            </ul>
          </div>

          {/* Espace Pro & Affilié Column */}
          <div>
            <h4 className="font-heading font-black text-zinc-950 mb-4 text-xs uppercase tracking-wider">Espace Pro</h4>
            <ul className="space-y-2.5 text-sm font-sub">
              <li><Link to="/register" className="hover:text-[#FF6B00] transition-colors font-medium">Créer un compte (14j gratuits)</Link></li>
              <li><Link to="/login" className="hover:text-[#FF6B00] transition-colors font-medium">Connexion Espace Vendeur</Link></li>
              <li>
                <Link to="/devenir-prestataire" className="text-[#EA580C] hover:text-[#FF6B00] transition-colors font-bold flex items-center gap-1.5">
                  <i className="fa-solid fa-handshake text-xs"></i>
                  <span>Devenir Affilié (Revenus Passifs)</span>
                </Link>
              </li>
              <li><Link to="/prestataire/login" className="hover:text-[#FF6B00] transition-colors font-medium">Connexion Espace Affilié</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#FF6B00] transition-colors font-medium">Back-office Admin</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading font-black text-zinc-950 mb-4 text-xs uppercase tracking-wider">Assistance Locale</h4>
            <ul className="space-y-3 text-sm font-sub">
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-phone text-[#FF6B00] text-xs"></i>
                <a href="https://wa.me/2290143405361" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6B00] transition-colors font-bold">
                  +229 01 43 40 53 61
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fa-solid fa-envelope text-[#FF6B00] text-xs"></i>
                <a href="mailto:contact@oresto.bj" className="hover:text-[#FF6B00] transition-colors font-medium">
                  contact@oresto.bj
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <i className="fa-solid fa-location-dot text-zinc-400 text-xs mt-0.5"></i>
                <span>Cotonou, Bénin</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sub text-zinc-400">
          <p>© {new Date().getFullYear()} Oresto. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <i className="fa-solid fa-heart text-red-500"></i> pour les entrepreneurs du Bénin & d'Afrique de l'Ouest
          </p>
        </div>
      </div>
    </footer>
  );
}
