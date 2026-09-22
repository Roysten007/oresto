import React from "react";
import { BusinessSector } from "./LandingHero";

interface LandingProblemProps {
  activeSector: BusinessSector;
}

export default function LandingProblem({ activeSector }: LandingProblemProps) {
  const problemContent = {
    restaurant: {
      tag: "POURQUOI LES RESTAURANTS PERDENT DE L'ARGENT",
      title: "La restauration moderne ne peut plus dépendre de simples messages WhatsApp.",
      desc: "Chaque service de midi ou de week-end, les mêmes goulots d'étranglement freinent votre rentabilité.",
      cards: [
        {
          icon: "fa-solid fa-money-bill-wave",
          title: "25% à 30% de commission envolés chez les intermédiaires",
          desc: "Sur un plat vendu 4 000 FCFA, vous laissez plus de 1 000 FCFA à des plateformes tierces alors que c'est vous qui cuisinez et achetez les denrées.",
        },
        {
          icon: "fa-solid fa-clock",
          title: "Le coup de feu de midi ralenti par les appels",
          desc: "Votre équipe passe un temps précieux à épeler le menu du jour au téléphone pendant que les clients en salle attendent et que le service prend du retard.",
        },
        {
          icon: "fa-solid fa-comments",
          title: "Des clients perdus le soir par manque de réactivité",
          desc: "Un client affamé qui attend 15 minutes une réponse sur WhatsApp pour savoir ce qu'il reste en cuisine commande immédiatement chez votre concurrent.",
        },
      ],
    },
    ecommerce: {
      tag: "POURQUOI LES BOUTIQUES S'ÉPUISENT AU QUOTIDIEN",
      title: "Vendre sur les réseaux sociaux sans catalogue automatisé bride votre croissance.",
      desc: "Vous passez plus de temps à répondre aux demandes de prix qu'à expédier des commandes.",
      cards: [
        {
          icon: "fa-solid fa-comments",
          title: "« Combien le prix ? » répété 50 fois par jour",
          desc: "Envoyer manuellement des photos, détailler les tailles disponibles et renseigner les prix un par un consomme l'intégralité de vos journées.",
        },
        {
          icon: "fa-solid fa-money-bill-wave",
          title: "La course épuisante après les captures de paiement MoMo",
          desc: "Vérifier chaque capture d'écran de virement, déceler les fausses preuves et croiser les transactions ralentit considérablement vos expéditions.",
        },
        {
          icon: "fa-solid fa-boxes-stacked",
          title: "Des ruptures de stock vendues par inadvertance",
          desc: "Sans tableau de bord centralisé, un article déjà vendu à un premier client est souvent promis à un autre, provoquant déceptions et remboursements.",
        },
      ],
    },
    hotel: {
      tag: "POURQUOI LES HÔTELS ET RÉSIDENCES SOUS-PERFORMENT",
      title: "Remplir vos chambres ne devrait pas vous coûter 20% de commissions aux agences en ligne.",
      desc: "Les voyageurs locaux et de la diaspora cherchent à réserver directement auprès de vous.",
      cards: [
        {
          icon: "fa-solid fa-money-bill-wave",
          title: "Des commissions exorbitantes versées aux centrales de réservation",
          desc: "Sur une nuitée à 50 000 FCFA, jusqu'à 10 000 FCFA sont prélevés par des plateformes internationales alors que le client était déjà conquis.",
        },
        {
          icon: "fa-solid fa-calendar-xmark",
          title: "Le calendrier des disponibilités tenu sur papier",
          desc: "Les doubles réservations, les confirmations tardives et le manque de visibilité en temps réel pénalisent votre taux d'occupation.",
        },
        {
          icon: "fa-solid fa-mobile-screen-button",
          title: "Des acomptes et cautions complexes à encaisser",
          desc: "Exiger un déplacement physique ou attendre un virement bancaire décourage les voyageurs pressés prêts à valider instantanément par Mobile Money.",
        },
      ],
    },
  };

  const current = problemContent[activeSector];

  return (
    <section className="py-24 bg-[#FAFAFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-4">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>{current.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
            {current.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-normal leading-relaxed">
            {current.desc}
          </p>
        </div>

        {/* 3-Column Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {current.cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm hover:shadow-float transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-orange-100 text-lg">
                  <i className={card.icon}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-black text-zinc-950 tracking-tight mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-600 font-sub leading-relaxed">
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

export { LandingProblem };
