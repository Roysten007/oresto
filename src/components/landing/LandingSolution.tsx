import React from "react";
import { BusinessSector } from "./LandingHero";

interface LandingSolutionProps {
  activeSector: BusinessSector;
}

export default function LandingSolution({ activeSector }: LandingSolutionProps) {
  const pillars = [
    {
      num: "01",
      icon: "fa-solid fa-wand-magic-sparkles",
      title: "Votre site web pro en 12 minutes",
      subtitle: "Aucune application à télécharger pour vos clients",
      desc: "Vous obtenez une adresse web personnalisée (ex : oresto.app/r/votre-nom) fluide et ultrarapide sur n'importe quel smartphone. Vos clients cliquent sur votre bio Instagram/TikTok ou scannent le QR Code et commandent en 3 clics.",
      highlights: [
        "Ouverture immédiate sans installer d'application",
        "Générateur de QR Codes haute définition pour tables ou comptoirs",
        "Photos HD, variantes de tailles/couleurs et fiches détaillées",
      ],
    },
    {
      num: "02",
      icon: "fa-solid fa-money-bill-wave",
      title: "0% de commission • MoMo direct",
      subtitle: "MTN MoMo, Moov Money et Celtiis Cash",
      desc: "Contrairement aux applications de livraison qui prélèvent 25% à 30% sur vos ventes, Oresto ne retient pas un seul franc. 100% de vos recettes arrivent directement sur votre propre compte Mobile Money.",
      highlights: [
        "Zéro commission sur votre chiffre d'affaires",
        "Paiements versés directement sur votre numéro marchand",
        "Historique des encaissements clair et exportable",
      ],
    },
    {
      num: "03",
      icon: "fa-solid fa-chart-line",
      title: "Tableau de bord & alertes en temps réel",
      subtitle: "Géré à 100% depuis votre smartphone",
      desc: "Dès qu'une commande est passée, une alerte sonore retentit et un récapitulatif détaillé s'affiche sur votre téléphone. Vous mettez à jour vos stocks, ajoutez vos plats du jour ou gérez vos livraisons en un clin d'œil.",
      highlights: [
        "Notification sonore et WhatsApp à chaque nouvelle commande",
        "Mise à jour des stocks et des prix en 5 secondes",
        "Interface responsive optimisée pour smartphone Android et iPhone",
      ],
    },
  ];

  return (
    <section id="fonctionnalites" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-4">
            <i className="fa-solid fa-layer-group text-xs"></i>
            <span>La solution Oresto</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-heading font-black text-zinc-950 tracking-tight leading-[1.2]">
            <span className="block sm:whitespace-nowrap">Tout ce dont votre établissement a besoin</span>
            <span className="block sm:whitespace-nowrap">pour <span className="text-[#FF6B00]">vendre et prospérer en ligne</span></span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-normal max-w-2xl mx-auto leading-relaxed">
            Une technologie simple, pensée pour encaisser par Mobile Money, gérer vos commandes sans friction et fidéliser vos clients.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm hover:shadow-float transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center border border-orange-100 text-lg">
                    <i className={pillar.icon}></i>
                  </div>
                  <span className="text-xs font-sub font-black text-[#FF6B00] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                    {pillar.num}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-zinc-950 tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs font-sub font-bold text-[#EA580C] mb-4">
                  {pillar.subtitle}
                </p>
                <p className="text-sm text-zinc-600 font-sub leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-100 space-y-2.5">
                {pillar.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs font-sub font-medium text-zinc-700">
                    <i className="fa-solid fa-check text-[#FF6B00] shrink-0 mt-0.5 text-xs"></i>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export { LandingSolution };
