import React from "react";
import { Link } from "react-router-dom";

export function LandingAffiliateSection() {
  return (
    <section className="py-24 bg-white relative border-t border-zinc-200 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container Banner (30% Surface, 10% Accent) */}
        <div className="bg-[#FAFAFA] rounded-3xl sm:rounded-[36px] border border-zinc-200/90 shadow-sm p-8 sm:p-12 max-w-4xl mx-auto">
          
          <div className="space-y-6 text-center sm:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold">
              <i className="fa-solid fa-handshake"></i>
              <span>Programme partenaires &amp; apporteurs d'affaires</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-heading font-black text-zinc-950 tracking-tight leading-tight">
              Gagnez des <span className="text-[#FF6B00]">revenus passifs</span> en recommandant Oresto.
            </h2>

            <p className="text-base text-zinc-600 font-sub font-normal leading-relaxed max-w-2xl">
              Vous connaissez des gérants de restaurants, maquis, boutiques ou résidences ? 
              Aidez-les à digitaliser leur commerce et encaissez <strong>20% de commission récurrente chaque mois</strong> sur chacun de leurs abonnements, versé directement sur votre compte Mobile Money.
            </p>

            {/* 3 Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs text-left">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-sm mb-3 font-bold border border-orange-100">
                  <i className="fa-solid fa-coins"></i>
                </div>
                <h4 className="font-heading font-bold text-sm text-zinc-900 mb-1">1 000 F / mois</h4>
                <p className="text-xs text-zinc-500 font-sub leading-snug">Par établissement actif parrainé à vie</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm mb-3 font-bold border border-emerald-100">
                  <i className="fa-solid fa-mobile-screen-button"></i>
                </div>
                <h4 className="font-heading font-bold text-sm text-zinc-900 mb-1">Paiement MoMo direct</h4>
                <p className="text-xs text-zinc-500 font-sub leading-snug">Versé sur MTN, Moov ou Celtiis</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs text-left">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center text-sm mb-3 font-bold border border-zinc-200">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h4 className="font-heading font-bold text-sm text-zinc-900 mb-1">Tableau de bord dédié</h4>
                <p className="text-xs text-zinc-500 font-sub leading-snug">Suivi de vos gains en temps réel</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/devenir-prestataire"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Découvrir le programme &amp; Devenir Partenaire</span>
                <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
              </Link>
              <Link
                to="/prestataire/login"
                className="text-xs font-sub font-bold text-zinc-600 hover:text-zinc-950 underline underline-offset-4"
              >
                Déjà partenaire ? Se connecter
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingAffiliateSection;
