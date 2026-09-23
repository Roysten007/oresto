import React from "react";
import { Link } from "react-router-dom";
import HeroDashboardCarousel from "./HeroDashboardCarousel";

export type BusinessSector = "restaurant" | "ecommerce" | "hotel";

interface LandingHeroProps {
  activeSector?: BusinessSector;
  onSelectSector?: (sector: BusinessSector) => void;
}

export default function LandingHero({ activeSector, onSelectSector }: LandingHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-hero-glow bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Titre — strictement 3 lignes, casse normale de phrase */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[48px] font-heading font-black text-zinc-950 tracking-tight leading-[1.15] mb-5 text-center max-w-5xl mx-auto">
          <span className="block sm:whitespace-nowrap">La plateforme tout&#8209;en&#8209;un pour</span>
          <span className="block sm:whitespace-nowrap text-[#FF6B00]">créer, vendre &amp; encaisser</span>
          <span className="block sm:whitespace-nowrap">sans intermédiaire.</span>
        </h1>

        {/* Subtitle with Outfit font */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-600 font-sub font-normal max-w-2xl mx-auto leading-relaxed mb-8 text-center">
          Créez votre site professionnel en 12 minutes. Vos clients commandent en 3 clics, et vous recevez 100% de l'argent directement par Mobile Money (0% de commission).
        </p>

        {/* Dual Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm sm:text-base shadow-braised hover:shadow-[0_16px_32px_-6px_rgba(255,107,0,0.55)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
          >
            <span>Démarrer mes 14 jours gratuits</span>
            <span className="text-base transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <a
            href="#tarifs"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-zinc-50 text-zinc-900 font-sub font-bold text-sm sm:text-base border border-zinc-200 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xs text-zinc-500">↓</span>
            <span>Voir les formules &amp; tarifs</span>
          </a>
        </div>

      </div>

      {/* Défilé immersif des captures d'écrans des 4 tableaux de bord (Restaurant, Boutique, Hôtel, Partenaire) */}
      <HeroDashboardCarousel />
    </section>
  );
}

export { LandingHero };
