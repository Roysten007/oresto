import React from "react";
import { Link } from "react-router-dom";

export function LandingAffiliateSection() {
  return (
    <section className="py-24 bg-white relative border-t border-zinc-200 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container Banner (30% Surface, 10% Accent) */}
        <div className="bg-[#FAFAFA] rounded-3xl sm:rounded-[36px] border border-zinc-200/90 shadow-sm p-8 sm:p-14">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Pitch */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider">
                <i className="fa-solid fa-handshake"></i>
                <span>PROGRAMME PARTENAIRES & APPORTEURS D'AFFAIRES</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
                Gagnez des <span className="text-[#FF6B00]">revenus passifs</span> en recommandant Oresto.
              </h2>

              <p className="text-base text-zinc-600 font-sub font-normal leading-relaxed max-w-xl">
                Vous connaissez des gérants de restaurants, maquis, boutiques ou résidences ? 
                Aidez-les à digitaliser leur commerce et encaissez <strong>20% de commission récurrente chaque mois</strong> sur chacun de leurs abonnements, versé directement sur votre compte Mobile Money.
              </p>

              {/* 3 Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-zinc-200">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-sm mb-2 font-bold border border-orange-100">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <h4 className="font-heading font-bold text-xs uppercase text-zinc-900">1 000 F / mois</h4>
                  <p className="text-[11px] text-zinc-500 font-sub mt-0.5">Par établissement actif parrainé</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm mb-2 font-bold border border-emerald-100">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </div>
                  <h4 className="font-heading font-bold text-xs uppercase text-zinc-900">Paiement MoMo</h4>
                  <p className="text-[11px] text-zinc-500 font-sub mt-0.5">Versé sur MTN, Moov ou Celtiis</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center text-sm mb-2 font-bold border border-zinc-200">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <h4 className="font-heading font-bold text-xs uppercase text-zinc-900">Tableau de bord</h4>
                  <p className="text-[11px] text-zinc-500 font-sub mt-0.5">Suivi des gains en temps réel</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/devenir-prestataire"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span>Découvrir le programme & Devenir Partenaire</span>
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

            {/* Right Column: Earnings Projection Simulation */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A0A0A] rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-dark-card text-white space-y-5">
                
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-calculator text-[#FF6B00]"></i>
                    <span className="text-xs font-heading font-bold uppercase tracking-wider text-zinc-300">
                      Simulation de vos gains mensuels
                    </span>
                  </div>
                  <span className="text-[10px] font-sub font-bold px-2 py-0.5 rounded bg-orange-950 text-[#FF6B00] border border-orange-800">
                    20% Récurrent
                  </span>
                </div>

                <div className="space-y-3 font-sub text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <span className="text-zinc-400">10 commerces parrainés :</span>
                    <span className="font-heading font-black text-white text-sm">10 000 FCFA / mois</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <span className="text-zinc-400">25 commerces parrainés :</span>
                    <span className="font-heading font-black text-white text-sm">25 000 FCFA / mois</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/90 border border-orange-500/40">
                    <span className="text-zinc-300 font-bold">50 commerces parrainés :</span>
                    <span className="font-heading font-black text-[#FF6B00] text-base">50 000 FCFA / mois</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-orange-950/60 to-zinc-900 border border-orange-500/60">
                    <span className="text-white font-bold">100 commerces parrainés :</span>
                    <span className="font-heading font-black text-[#FF6B00] text-lg">100 000 FCFA / mois</span>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-400 font-sub leading-snug">
                  💡 Les commissions sont versées automatiquement chaque fin de mois directement sur votre compte Mobile Money.
                </p>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingAffiliateSection;
