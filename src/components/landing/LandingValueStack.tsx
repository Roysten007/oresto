import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Zap, Sparkles, Building2, Store, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { BusinessSector } from './LandingHero';

interface LandingValueStackProps {
  activeSector: BusinessSector;
}

export function LandingValueStack({ activeSector }: LandingValueStackProps) {
  const [selectedProfileCount, setSelectedProfileCount] = useState<number>(1);

  // Pricing calculation based on user specs: 5 000 FCFA/mo per profile with multi-profile discounts
  const pricingTiers = [
    { count: 1, price: 5000, perStore: 5000, discount: null, label: '1 Établissement', desc: 'Idéal pour démarrer un restaurant, une boutique ou une résidence' },
    { count: 2, price: 9000, perStore: 4500, discount: '-10%', label: '2 Établissements', desc: 'Pour les gérants ayant 2 points de vente ou 2 activités distinctes' },
    { count: 3, price: 12000, perStore: 4000, discount: '-20%', label: '3 Établissements', desc: 'Pack complet multi-activités (ex: Restaurant + Boutique + Hôtel)' },
  ];

  const currentTier = pricingTiers.find(t => t.count === selectedProfileCount) || pricingTiers[0];

  const stackItems = [
    {
      title: "Votre site web & vitrine digitale sur-mesure",
      desc: "Menu interactif, catalogue e-commerce ou moteur de réservation avec photos HD, options et fiches produits fluides.",
      value: "Valeur : 75 000 FCFA",
    },
    {
      title: "Encaissement Mobile Money direct (0% de commission)",
      desc: "MTN MoMo, Moov Money et Celtiis Cash. L'argent arrive directement sur votre compte marchand, sans rétention.",
      value: "Valeur : Inestimable",
    },
    {
      title: "Générateur de QR Code HD prêt à imprimer",
      desc: "QR code élégant pour vos tables de restaurant, vos comptoirs de boutique ou la réception de vos chambres.",
      value: "Valeur : 15 000 FCFA",
    },
    {
      title: "Tableau de bord gérant & alertes sonores instantanées",
      desc: "Suivi des commandes en direct, alertes WhatsApp automatiques pour vous et vos clients, gestion des stocks.",
      value: "Valeur : 40 000 FCFA",
    },
    {
      title: "Agent IA conversationnel 24h/24",
      desc: "Répond automatiquement aux questions fréquentes de vos clients sur vos plats, produits et disponibilités.",
      value: "Valeur : 30 000 FCFA",
    },
    {
      title: "Support prioritaire & assistance WhatsApp dédiée",
      desc: "Notre équipe béninoise vous assiste par WhatsApp (+229 01 43 40 53 61) et vous aide à configurer votre catalogue.",
      value: "Inclus",
    },
  ];

  return (
    <section id="tarifs" className="py-24 bg-slate-900 relative overflow-hidden text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Offre claire & sans mauvaise surprise
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Tout ce dont votre établissement a besoin pour vendre en ligne,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              sans commissions cachées
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-lg">
            Testez la plateforme complète pendant <strong>14 jours gratuitement</strong>. Sans carte bancaire, sans engagement.
          </p>
        </div>

        {/* Multi-profile Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-xl">
            {pricingTiers.map((tier) => (
              <button
                key={tier.count}
                onClick={() => setSelectedProfileCount(tier.count)}
                className={`relative px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedProfileCount === tier.count
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{tier.label}</span>
                {tier.discount && (
                  <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-md font-bold ${
                    selectedProfileCount === tier.count ? 'bg-slate-950 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {tier.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: What's included (Value Stack) */}
          <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-700/70">
                <div>
                  <h3 className="text-xl font-bold text-white">Ce qui est inclus dans votre abonnement</h3>
                  <p className="text-sm text-slate-400 mt-1">Chaque profil dispose de son espace indépendant et dédié</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <Zap className="w-3.5 h-3.5" /> Activation immédiate
                </div>
              </div>

              <div className="space-y-5">
                {stackItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="text-sm sm:text-base font-semibold text-white">{item.title}</h4>
                        <span className="text-xs font-mono text-slate-400 sm:text-right">{item.value}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee reminder */}
            <div className="mt-8 pt-6 border-t border-slate-700/70 flex items-center gap-3 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Garantie 14 jours d’essai à 100% sans frais</strong> : si la plateforme ne vous apporte pas satisfaction, vous ne payez strictement rien.
              </span>
            </div>
          </div>

          {/* Right: The Pricing Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-800 to-slate-850 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-lg">
              14 jours offerts
            </div>

            <div>
              <div className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
                Formule Pro & Autonome
              </div>
              <h3 className="text-2xl font-bold text-white">
                {currentTier.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-6">
                {currentTier.desc}
              </p>

              {/* Price display */}
              <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/60 mb-6 text-center">
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
                  Pendant 14 jours
                </div>
                <div className="text-3xl font-extrabold text-emerald-400 mb-2">
                  0 FCFA <span className="text-xs text-slate-400 font-normal">/ 14 jours</span>
                </div>
                <div className="h-px w-full bg-slate-800 my-3" />
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
                  Puis ensuite seulement
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {currentTier.price.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-slate-400 text-sm font-semibold">FCFA / mois</span>
                </div>
                {selectedProfileCount > 1 && (
                  <p className="text-xs text-amber-300 font-semibold mt-2">
                    Soit {currentTier.perStore.toLocaleString('fr-FR')} FCFA / mois par établissement ({currentTier.discount})
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-2">
                  Aucun frais de transaction • 0% de commission sur vos encaissements
                </p>
              </div>

              {/* Key Highlights */}
              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mise en ligne en moins de 15 minutes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Paiements MTN, Moov & Celtiis direct sur votre numéro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aucun engagement, résiliation en 1 clic</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Support humain direct par WhatsApp</span>
                </li>
              </ul>
            </div>

            <div>
              <Link
                to="/register"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base shadow-xl hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Démarrer mes 14 jours gratuits</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-center text-[11px] text-slate-400 mt-3">
                Configuration immédiate sans carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingValueStack;
