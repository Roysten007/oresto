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
    <section id="faq" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            QUESTIONS FRÉQUENTES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
            Tout ce que vous devez savoir avant de{" "}
            <span className="text-[#FF6B00]">
              commencer
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium">
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
                    ? "border-orange-500/50 shadow-md"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-zinc-950">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#FF6B00] text-white" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-zinc-600 font-sub text-sm sm:text-base leading-relaxed border-t border-zinc-100 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Callout Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0 border border-orange-100">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-black text-zinc-950 text-base sm:text-lg uppercase">Vous avez une question spécifique ?</h4>
              <p className="text-xs sm:text-sm text-zinc-500 font-sub">Échangez directement avec un conseiller Oresto au Bénin sur WhatsApp.</p>
            </div>
          </div>

          <a
            href="https://wa.me/2290143405361?text=Bonjour%20Oresto%2C%20j'ai%20une%20question%20sur%20la%20plateforme"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-braised transition-all shrink-0"
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
