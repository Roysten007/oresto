import React from "react";
import { Link } from "react-router-dom";
import { BusinessSector } from "./LandingHero";

interface LandingValueStackProps {
  activeSector: BusinessSector;
}

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  desc: string;
  price: number;
  periodText: string;
  perStoreText?: string;
  features: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "mensuel",
    name: "Formule Mensuelle",
    desc: "Idéal pour tester ou digitaliser votre activité avec un budget maîtrisé et flexible.",
    price: 5000,
    periodText: "FCFA / mois / établissement",
    perStoreText: "Sans engagement • Résiliable à tout moment",
    features: [
      "Vitrine web & QR Codes HD personnalisés",
      "Catalogue produits / Menu / Réservations en ligne",
      "Commandes directes reçues sur WhatsApp",
      "Encaissements Mobile Money 100% directs (0% commission)",
      "Paiements MTN, Moov et Celtiis Cash",
      "Tableau de bord gérant & suivi des ventes",
      "Assistant IA IZA conversationnel 24h/24",
      "Assistance WhatsApp locale au Bénin (7j/7)",
    ],
  },
  {
    id: "annuel",
    name: "Formule Annuelle",
    badge: "2 MOIS OFFERTS — ÉCONOMIE DE 10 000 FCFA",
    isPopular: true,
    desc: "La formule la plus avantageuse pour pérenniser votre commerce toute l'année.",
    price: 50000,
    periodText: "FCFA / an / établissement",
    perStoreText: "Soit seulement ~4 160 FCFA / mois au lieu de 60 000 FCFA",
    features: [
      "Tous les avantages de la formule mensuelle",
      "2 mois d'abonnement 100% offerts (10 000 FCFA économisés)",
      "Vitrines web illimitées en ajout multi-établissements",
      "Encaissements MoMo 100% directs (0% de commission)",
      "Badge vérifié & indexation Google prioritaire",
      "Accompagnement & configuration initiale sur-mesure",
      "Support prioritaire VIP WhatsApp 7j/7",
    ],
  },
];

export function LandingValueStack({ activeSector }: LandingValueStackProps) {
  return (
    <section id="tarifs" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-4">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Tarification transparente</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight">
            Des tarifs clairs,{" "}
            <span className="text-[#FF6B00]">sans mauvaise surprise</span>.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-normal leading-relaxed">
            Testez toutes les fonctionnalités pendant <strong>14 jours gratuits</strong>. Sans engagement, sans carte bancaire requise.
          </p>
        </div>

        {/* 2 Pricing Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.isPopular
                  ? "border-2 border-[#FF6B00] shadow-[0_16px_45px_rgba(255,107,0,0.15)] md:-translate-y-2"
                  : "border border-zinc-200/90 shadow-sm hover:shadow-float"
              }`}
            >
              {/* Badge optionnel (populaire / réduction) */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[11px] font-sub font-bold px-3.5 py-1 rounded-full shadow-sm whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Title & Desc */}
                <div className="mb-6">
                  <h3 className="text-xl font-heading font-black text-zinc-950 mb-1.5">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-sub leading-relaxed min-h-[36px]">
                    {tier.desc}
                  </p>
                </div>

                {/* Price Display Block */}
                <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 mb-6 text-center">
                  <span className="text-[11px] font-sub font-semibold text-emerald-600 block mb-1">
                    14 jours offerts (0 FCFA)
                  </span>

                  <div className="flex items-baseline justify-center gap-1.5 my-1">
                    <span className="text-4xl font-heading font-black text-zinc-950">
                      {tier.price.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-xs font-sub font-bold text-zinc-500">
                      {tier.periodText}
                    </span>
                  </div>

                  {tier.perStoreText && (
                    <p className="text-xs font-sub font-bold text-[#EA580C] mt-1">
                      {tier.perStoreText}
                    </p>
                  )}

                  <p className="text-[11px] text-zinc-500 mt-2 font-sub font-medium">
                    0% de commission sur vos encaissements MoMo
                  </p>
                </div>

                {/* Included Features List */}
                <ul className="space-y-3 mb-8 text-xs font-sub font-semibold text-zinc-700">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <i className="fa-solid fa-check text-[#FF6B00] text-xs shrink-0 mt-0.5"></i>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button & Note */}
              <div className="pt-4 border-t border-zinc-100">
                <Link
                  to="/register"
                  className={`w-full py-3.5 px-6 rounded-full font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2 group ${
                    tier.isPopular
                      ? "bg-[#FF6B00] hover:bg-[#EA580C] text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white"
                  }`}
                >
                  <span>Démarrer mes 14 jours gratuits</span>
                  <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>

                <p className="text-center text-[11px] text-zinc-400 mt-2.5 font-sub font-medium">
                  Sans carte bancaire • Annulation en 1 clic
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reassurance Multi-établissements & Contact */}
        <div className="mt-12 max-w-2xl mx-auto text-center space-y-4">
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/70 text-xs text-orange-950 font-sub">
            <span className="font-heading font-black text-[#FF6B00] block mb-1">
              <i className="fa-solid fa-layer-group mr-1.5"></i>
              Vous gérez plusieurs commerces ? (ex: Restaurant + Boutique)
            </span>
            Un seul compte et un seul mot de passe vous permettent d'ajouter tous vos établissements et de basculer de l'un à l'autre en 1 clic depuis votre tableau de bord.
          </div>

          <p className="text-xs text-zinc-500 font-sub">
            Une question ou besoin d'un accompagnement personnalisé ?{" "}
            <a
              href="https://wa.me/2290143405361?text=Bonjour%20Oresto%2C%20je%20souhaite%20des%20informations%20sur%20les%20tarifs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6B00] font-bold hover:underline"
            >
              Échangez directement avec notre équipe locale sur WhatsApp
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}

export default LandingValueStack;
