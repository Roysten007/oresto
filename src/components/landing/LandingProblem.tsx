import React, { useState } from "react";
import { BusinessSector } from "./LandingHero";

interface LandingProblemProps {
  activeSector?: BusinessSector;
}

export function LandingProblem({ activeSector = "restaurant" }: LandingProblemProps) {
  const [selectedSector, setSelectedSector] = useState<BusinessSector>(activeSector);

  const sectors = [
    { id: "restaurant" as BusinessSector, label: "Restaurants & maquis", icon: "fa-solid fa-utensils" },
    { id: "ecommerce" as BusinessSector, label: "Boutiques & commerces", icon: "fa-solid fa-bag-shopping" },
    { id: "hotel" as BusinessSector, label: "Hôtels & résidences", icon: "fa-solid fa-hotel" },
  ];

  const problemContent = {
    restaurant: {
      subtitle: "Chaque service de midi ou de week-end, les mêmes frictions ralentissent votre équipe et réduisent votre marge.",
      cards: [
        {
          num: "01",
          icon: "fa-solid fa-percent",
          title: "25% à 30% de commission envolés chez les intermédiaires",
          desc: "Sur un plat vendu 4 000 FCFA, vous laissez plus de 1 000 FCFA à des plateformes tierces alors que c'est vous qui achetez les denrées et cuisinez.",
        },
        {
          num: "02",
          icon: "fa-solid fa-phone-slash",
          title: "Le coup de feu de midi ralenti par les appels et messages",
          desc: "Votre équipe passe un temps précieux à épeler les prix et le menu du jour au téléphone pendant que les clients en salle attendent et que le service prend du retard.",
        },
        {
          num: "03",
          icon: "fa-solid fa-clock-rotate-left",
          title: "Des clients perdus le soir par manque de réactivité",
          desc: "Un client qui attend 15 minutes une réponse sur WhatsApp pour savoir ce qu'il reste en cuisine commande immédiatement chez un concurrent plus rapide.",
        },
      ],
    },
    ecommerce: {
      subtitle: "Vendre par simples messages WhatsApp sans catalogue automatisé freine la croissance de votre boutique.",
      cards: [
        {
          num: "01",
          icon: "fa-solid fa-comments",
          title: "« C'est combien le prix ? » répété 50 fois par jour",
          desc: "Envoyer manuellement des photos, repréciser les tailles disponibles et renseigner les prix un par un consomme l'intégralité de vos journées sans garantie de vente.",
        },
        {
          num: "02",
          icon: "fa-solid fa-receipt",
          title: "La course épuisante après les captures Mobile Money",
          desc: "Vérifier chaque capture d'écran de virement, traquer les faux messages de transfert et croiser les transactions ralentit considérablement la préparation de vos colis.",
        },
        {
          num: "03",
          icon: "fa-solid fa-box-open",
          title: "Des ruptures de stock vendues par inadvertance",
          desc: "Sans inventaire centralisé et synchronisé en direct, un article déjà vendu à un premier client est souvent promis à un autre, provoquant déceptions et remboursements.",
        },
      ],
    },
    hotel: {
      subtitle: "Remplir vos chambres ou vos appartements meublés ne devrait pas vous coûter des fortunes en commissions.",
      cards: [
        {
          num: "01",
          icon: "fa-solid fa-hand-holding-dollar",
          title: "Des commissions exorbitantes versées aux centrales en ligne",
          desc: "Sur une nuitée à 50 000 FCFA, jusqu'à 10 000 FCFA sont prélevés par des plateformes internationales alors que le voyageur cherchait directement votre établissement.",
        },
        {
          num: "02",
          icon: "fa-solid fa-calendar-xmark",
          title: "Le planning des disponibilités tenu sur papier ou notes",
          desc: "Les doubles réservations involontaires, les confirmations tardives et le manque de visibilité en temps réel créent des litiges embarrassants à l'accueil.",
        },
        {
          num: "03",
          icon: "fa-solid fa-shield-xmark",
          title: "Des acomptes et cautions complexes à sécuriser",
          desc: "Exiger un déplacement physique ou attendre un virement bancaire décourage les voyageurs pressés prêts à bloquer leur séjour immédiatement par Mobile Money.",
        },
      ],
    },
  };

  const current = problemContent[selectedSector];

  return (
    <section className="py-24 bg-[#FAFAFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-4xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-4">
            <i className="fa-solid fa-triangle-exclamation text-xs"></i>
            <span>Le problème</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-heading font-black text-zinc-950 tracking-tight leading-[1.2] mb-4">
            <span className="block sm:whitespace-nowrap">Les 3 freins qui font perdre des ventes</span>
            <span className="block text-[#FF6B00] sm:whitespace-nowrap">à votre commerce au quotidien</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 font-sub font-normal max-w-2xl leading-relaxed">
            {current.subtitle}
          </p>
        </div>

        {/* Sélecteur de secteur d'activité propre et interactif */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {sectors.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`px-4 py-2 rounded-full text-xs font-sub font-bold transition-all flex items-center gap-2 ${
                selectedSector === sec.id
                  ? "bg-[#FF6B00] text-white shadow-braised scale-102"
                  : "bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-xs"
              }`}
            >
              <i className={`${sec.icon} text-xs`}></i>
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* 3-Column Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {current.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-zinc-200/90 shadow-sm hover:shadow-float transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center border border-orange-100 text-lg group-hover:scale-105 transition-transform">
                    <i className={card.icon}></i>
                  </div>
                  <span className="text-xs font-sub font-bold text-zinc-400 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-lg">
                    {card.num}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-black text-zinc-950 tracking-tight mb-3 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-600 font-sub font-normal leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default LandingProblem;
