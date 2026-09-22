import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall } from 'lucide-react';

export const LandingFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment je reçois l'argent de mes clients ?",
      a: "Directement sur votre propre compte Mobile Money (MTN MoMo, Moov Money ou Celtiis Cash). Oresto ne touche jamais à votre argent et ne prélève aucune commission sur vos ventes (0%). Dès qu'un client valide son paiement, les fonds arrivent immédiatement sur votre numéro marchand ou personnel.",
    },
    {
      q: "Mes clients doivent-ils télécharger une application pour commander ?",
      a: "Non, absolument aucune application à installer ! Vos clients scannent simplement votre QR code sur table/comptoir ou cliquent sur votre lien dans votre bio Instagram, TikTok ou statut WhatsApp. Votre vitrine s'ouvre en 1 seconde chrono sur n'importe quel smartphone.",
    },
    {
      q: "Je n'ai pas d'ordinateur, puis-je tout gérer depuis mon smartphone ?",
      a: "Oui, à 100%. Tout le tableau de bord Oresto est conçu pour être géré depuis votre smartphone Android ou iPhone. Vous ajoutez des photos de plats ou produits, modifiez vos prix, activez ou désactivez un article en rupture de stock en quelques secondes.",
    },
    {
      q: "Comment fonctionne l'essai gratuit de 14 jours ?",
      a: "Vous créez votre compte sans renseigner aucune carte bancaire ni avancer d'argent. Pendant 14 jours entiers, vous profitez de toutes les fonctionnalités pro (site en ligne, QR codes, alertes temps réel, assistant IA). Si après 14 jours vous souhaitez continuer, l'abonnement est de 5 000 FCFA / mois par établissement, résiliable quand vous voulez.",
    },
    {
      q: "J'ai plusieurs activités (un restaurant et une boutique), comment ça marche ?",
      a: "Oresto gère des profils totalement étanches et indépendants. Votre restaurant a son menu et ses options de table, tandis que votre boutique a sa gestion de stock et tailles. Vous pouvez gérer vos établissements avec un tarif dégressif dès le 2ème profil (9 000 F/mois pour 2, 12 000 F/mois pour 3).",
    },
    {
      q: "Que se passe-t-il si j'ai besoin d'aide pour mettre en ligne mes photos et mes prix ?",
      a: "Notre équipe locale basée au Bénin vous accompagne pas à pas. En plus de l'assistant IA intégré à votre compte, vous pouvez contacter directement notre équipe support sur WhatsApp au +229 01 43 40 53 61 pour qu'on vous aide à démarrer rapidement.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Questions Fréquentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tout ce que vous devez savoir avant de commencer
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Des réponses claires et transparentes sur le fonctionnement de la plateforme.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-semibold text-base sm:text-lg text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/80 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp direct help callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Vous avez une question spécifique ?</h4>
              <p className="text-xs sm:text-sm text-slate-400">Échangez directement avec un conseiller Oresto au Bénin sur WhatsApp.</p>
            </div>
          </div>
          <a
            href="https://wa.me/2290143405361?text=Bonjour%20Oresto%2C%20j'ai%20une%20question%20concernant%20la%20plateforme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+229 01 43 40 53 61</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingFAQ;
