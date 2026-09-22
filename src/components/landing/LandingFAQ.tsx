import React, { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, PhoneCall } from "lucide-react";

export function LandingFAQ() {
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
      q: "Que se passe-t-il si j'ai besoin d'aide pour configurer mon menu ou ma boutique ?",
      a: "Notre équipe locale basée au Bénin vous accompagne pas à pas. En plus de l'assistant IA intégré à votre compte, vous pouvez contacter directement notre équipe support sur WhatsApp au +229 01 43 40 53 61 pour qu'on vous aide à démarrer rapidement.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#fbfaff] relative border-t border-violet-100/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-[#6633d6] text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            QUESTIONS FRÉQUENTES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f0a1f] tracking-tight leading-tight">
            Tout ce que vous devez savoir avant de{" "}
            <span className="font-accent italic text-[#6633d6]">
              commencer
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Des réponses claires et sans jargon sur le fonctionnement de la plateforme.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-14">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-200 overflow-hidden bg-white border ${
                  isOpen
                    ? "border-[#6633d6]/40 shadow-[0_8px_30px_rgba(102,51,214,0.08)]"
                    : "border-violet-100 hover:border-violet-200"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-[#0f0a1f]">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#6633d6] text-white" : "bg-violet-50 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 mt-1 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Callout Card (SasPay style) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-violet-100/90 shadow-[0_8px_30px_rgba(76,40,150,0.04)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-[#6633d6] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0f0a1f] text-base sm:text-lg">Vous avez une question spécifique ?</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Échangez directement avec un conseiller Oresto au Bénin sur WhatsApp.</p>
            </div>
          </div>

          <a
            href="https://wa.me/2290143405361?text=Bonjour%20Oresto%2C%20j'ai%20une%20question%20sur%20la%20plateforme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#6633d6] hover:bg-[#5727c7] text-white font-bold text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(102,51,214,0.35)] transition-all shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+229 01 43 40 53 61</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default LandingFAQ;
