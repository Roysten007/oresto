import React from "react";
import { Link } from "react-router-dom";

export function LandingChoiceComparison() {
  return (
    <section className="py-20 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contrast Comparison Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight">
            Deux manières de gérer votre commerce aujourd'hui
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium max-w-xl mx-auto">
            Laquelle choisissez-vous pour les prochains mois ?
          </p>
        </div>

        {/* Dual Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Option 1: Statu Quo */}
          <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 font-sub font-bold text-xs mb-5">
                <i className="fa-solid fa-circle-xmark text-red-500 text-sm"></i>
                Option 1 : Le statu quo épuisant
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-600 font-sub">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 font-bold shrink-0">•</span>
                  <span>Passer vos journées à recopier les mêmes prix et envoyer des photos sur WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 font-bold shrink-0">•</span>
                  <span>Perdre des clients le soir ou aux heures de pointe parce que personne n'est dispo pour répondre</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 font-bold shrink-0">•</span>
                  <span>Vérifier manuellement les captures MoMo et gérer les erreurs de commande</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs text-zinc-400 font-sub font-medium text-center">
              Résultat : temps perdu et chiffre d'affaires plafonné.
            </div>
          </div>

          {/* Option 2 : Oresto Pro (Recommended) */}
          <div className="p-8 rounded-3xl bg-white border-2 border-[#FF6B00] shadow-[0_12px_36px_rgba(255,107,0,0.12)] flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6 bg-[#FF6B00] text-white text-[10px] font-sub font-bold px-3 py-1 rounded-full shadow-sm">
              Choix recommandé
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#EA580C] font-sub font-bold text-xs mb-5">
                <i className="fa-solid fa-circle-check text-[#FF6B00] text-sm"></i>
                Option 2 : Automatiser avec Oresto
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-800 font-sub font-medium">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check text-[#FF6B00] shrink-0 mt-0.5 text-xs"></i>
                  <span>Un site vitrine pro &amp; vos QR codes opérationnels en 12 minutes chrono</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check text-[#FF6B00] shrink-0 mt-0.5 text-xs"></i>
                  <span>Les commandes arrivent avec adresses et paiements MoMo déjà validés à 100%</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check text-[#FF6B00] shrink-0 mt-0.5 text-xs"></i>
                  <span>Un assistant IA 24h/24 et un support humain local dédié par WhatsApp</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs text-[#EA580C] font-sub font-bold text-center">
              Résultat : sérénité quotidienne et commandes démultipliées.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingChoiceComparison;
