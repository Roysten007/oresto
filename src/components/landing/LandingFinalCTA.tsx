import React from "react";
import { ArrowRight, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingFinalCTA() {
  return (
    <section className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-100/50 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Contrast Comparison Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
            Deux manières de gérer votre commerce aujourd'hui
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium max-w-xl mx-auto">
            Laquelle choisissez-vous pour les prochains mois ?
          </p>
        </div>

        {/* Dual Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-stretch">
          
          {/* Option 1: Statu Quo */}
          <div className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 font-sub font-bold text-xs uppercase tracking-wider mb-5">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
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
            <div className="absolute -top-3.5 right-6 bg-[#FF6B00] text-white text-[10px] font-sub font-black uppercase px-3 py-1 rounded-full shadow-sm">
              Choix Recommandé
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#EA580C] font-sub font-black text-xs uppercase tracking-wider mb-5">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                Option 2 : Automatiser avec Oresto
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-zinc-800 font-sub font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <span>Un site vitrine pro & vos QR codes opérationnels en 12 minutes chrono</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <span>Les commandes arrivent avec adresses et paiements MoMo déjà validés à 100%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                  <span>Un assistant IA 24h/24 et un support humain local dédié par WhatsApp</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-zinc-100 text-xs text-[#EA580C] font-sub font-bold text-center">
              Résultat : sérénité quotidienne et commandes démultipliées.
            </div>
          </div>

        </div>

        {/* Master CTA Banner Box in Structured Dark (#0A0A0A) */}
        <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[36px] border border-zinc-800 p-8 sm:p-14 text-white text-center shadow-dark-card relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight mb-4 uppercase">
              Passez au niveau supérieur dès aujourd'hui
            </h3>
            <p className="text-zinc-300 font-sub text-base sm:text-lg mb-8 font-normal leading-relaxed">
              Activez vos 14 jours gratuits. Configurez votre catalogue ou menu, imprimez vos QR codes et recevez vos premières commandes sans débourser un centime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Activer mes 14 jours d'essai gratuit</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-sub font-semibold text-zinc-400 uppercase tracking-wide">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Résiliation en 1 clic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                <span>Assistance Bénin au +229 01 43 40 53 61</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingFinalCTA;
