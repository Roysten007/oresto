import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BusinessSector } from "./LandingHero";

interface LandingValueStackProps {
  activeSector: BusinessSector;
}

export function LandingValueStack({ activeSector }: LandingValueStackProps) {
  const [selectedCount, setSelectedCount] = useState<number>(1);

  const tiers = [
    { count: 1, price: 5000, perStore: 5000, discount: null, label: "1 Établissement", desc: "Idéal pour lancer un restaurant, une boutique ou une résidence" },
    { count: 2, price: 9000, perStore: 4500, discount: "-10%", label: "2 Établissements", desc: "Pour les gérants ayant 2 points de vente ou 2 activités distinctes" },
    { count: 3, price: 12000, perStore: 4000, discount: "-20%", label: "3 Établissements", desc: "Pack complet multi-activités (ex: Restaurant + Boutique + Hôtel)" },
  ];

  const currentTier = tiers.find((t) => t.count === selectedCount) || tiers[0];

  const includedItems = [
    {
      title: "Votre site web & vitrine digitale sur-mesure",
      desc: "Menu interactif, catalogue e-commerce ou moteur de réservation avec photos HD et fiches fluides.",
      val: "Valeur : 75 000 FCFA",
    },
    {
      title: "Encaissement Mobile Money direct (0% de commission)",
      desc: "MTN MoMo, Moov Money et Celtiis Cash. L'argent arrive directement sur votre compte marchand.",
      val: "0% retenue",
    },
    {
      title: "Générateur de QR Code HD prêt à imprimer",
      desc: "QR code élégant pour vos tables de restaurant, vos comptoirs ou la réception de vos chambres.",
      val: "Inclus",
    },
    {
      title: "Tableau de bord gérant & alertes en temps réel",
      desc: "Suivi des commandes en direct, alertes automatiques et gestion simplifiée des stocks.",
      val: "Inclus",
    },
    {
      title: "Assistant IA conversationnel 24h/24",
      desc: "Répond automatiquement aux questions fréquentes de vos clients sur vos plats, produits et disponibilités.",
      val: "Inclus",
    },
    {
      title: "Assistance WhatsApp dédiée au Bénin",
      desc: "Notre équipe locale vous assiste par WhatsApp (+229 01 43 40 53 61) et vous aide à démarrer.",
      val: "Support 7j/7",
    },
  ];

  return (
    <section id="tarifs" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-4">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>TARIFICATION TRANSPARENTE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
            Une formule simple,{" "}
            <span className="text-[#FF6B00]">
              sans mauvaise surprise
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium">
            Profitez de <strong>14 jours d'essai gratuit</strong>. Sans engagement, sans carte bancaire requise.
          </p>
        </div>

        {/* Profile count tabs (1, 2, 3 établissements) */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-full bg-white border border-zinc-200 shadow-sm">
            {tiers.map((tier) => (
              <button
                key={tier.count}
                onClick={() => setSelectedCount(tier.count)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-sub font-bold transition-all flex items-center gap-2 ${
                  selectedCount === tier.count
                    ? "bg-[#FF6B00] text-white shadow-braised font-black"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <span>{tier.label}</span>
                {tier.discount && (
                  <span
                    className={`text-[10px] uppercase px-1.5 py-0.5 rounded-md font-black ${
                      selectedCount === tier.count
                        ? "bg-white/20 text-white"
                        : "bg-orange-100 text-[#EA580C]"
                    }`}
                  >
                    {tier.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Value Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Left Column: What's included */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100">
                <div>
                  <h3 className="text-xl font-heading font-black text-zinc-950 uppercase">Tout est inclus dans votre formule</h3>
                  <p className="text-xs text-zinc-500 font-sub mt-1">Chaque profil dispose de son espace indépendant</p>
                </div>
                <span className="text-xs font-sub font-bold text-[#EA580C] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Zéro frais cachés
                </span>
              </div>

              <div className="space-y-4">
                {includedItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0 mt-0.5">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="text-sm font-sub font-bold text-zinc-900">{item.title}</h4>
                        <span className="text-[11px] font-mono font-semibold text-zinc-400">{item.val}</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-sub mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center gap-2.5 text-xs text-zinc-600 font-sub">
              <i className="fa-solid fa-shield-halved text-[#FF6B00] shrink-0 text-sm"></i>
              <span>
                <strong>Garantie 14 jours d'essai sans frais</strong> : testez toutes les fonctionnalités en conditions réelles.
              </span>
            </div>
          </div>

          {/* Right Column: Pricing Card with Orange Braisé Accent */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border-2 border-orange-500/50 shadow-float flex flex-col justify-between relative overflow-hidden">
            
            {/* Top pill */}
            <div className="absolute top-4 right-4 bg-[#FF6B00] text-white text-[10px] font-sub font-black uppercase px-3 py-1 rounded-full shadow-sm">
              14 jours offerts
            </div>

            <div>
              <span className="text-xs font-sub font-black uppercase tracking-wider text-[#EA580C] block mb-1">
                Formule Pro Autonome
              </span>
              <h3 className="text-2xl font-heading font-black text-zinc-950 mb-1 uppercase">
                {currentTier.label}
              </h3>
              <p className="text-xs text-zinc-500 font-sub mb-6">
                {currentTier.desc}
              </p>

              {/* Price display block */}
              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-zinc-200 mb-6 text-center">
                <span className="text-[11px] font-sub font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Pendant 14 jours
                </span>
                <div className="text-3xl font-heading font-black text-emerald-600 mb-3">
                  0 FCFA <span className="text-xs font-sub font-normal text-zinc-500">/ 14 jours</span>
                </div>
                <div className="h-px bg-zinc-200 my-3" />
                <span className="text-[11px] font-sub font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Puis ensuite seulement
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl sm:text-5xl font-heading font-black text-zinc-950">
                    {currentTier.price.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-xs font-sub font-bold text-zinc-500">FCFA / mois</span>
                </div>
                {selectedCount > 1 && (
                  <p className="text-xs font-sub font-bold text-[#EA580C] mt-2">
                    Soit {currentTier.perStore.toLocaleString("fr-FR")} FCFA / mois par profil ({currentTier.discount})
                  </p>
                )}
                <p className="text-[11px] text-zinc-500 mt-2 font-sub font-medium">
                  0% de commission sur vos paiements MoMo
                </p>
              </div>

              {/* Bullets with Font Awesome checkmarks */}
              <ul className="space-y-3 mb-8 text-xs font-sub font-semibold text-zinc-700">
                <li className="flex items-center gap-2.5">
                  <i className="fa-solid fa-check text-[#FF6B00] text-xs shrink-0"></i>
                  <span>Activation immédiate sans carte bancaire</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fa-solid fa-check text-[#FF6B00] text-xs shrink-0"></i>
                  <span>Encaissement MTN, Moov et Celtiis direct</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="fa-solid fa-check text-[#FF6B00] text-xs shrink-0"></i>
                  <span>Assistance humaine WhatsApp au Bénin</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2 group"
              >
                <span>Démarrer mes 14 jours gratuits</span>
                <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
              </Link>
              <p className="text-center text-[11px] text-zinc-400 mt-3 font-sub font-medium">
                Sans engagement • Annulation en 1 clic
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingValueStack;
