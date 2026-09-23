import React from "react";
import { Link } from "react-router-dom";

export function LandingFinalCTA() {
  return (
    <section className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-100/50 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Master CTA Banner Box in Structured Dark (#0A0A0A) */}
        <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[36px] border border-zinc-800 p-8 sm:p-14 text-white text-center shadow-dark-card relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight mb-4">
              Passez au niveau supérieur dès aujourd'hui
            </h3>
            <p className="text-zinc-300 font-sub text-base sm:text-lg mb-8 font-normal leading-relaxed">
              Activez vos 14 jours gratuits. Configurez votre catalogue ou menu, imprimez vos QR codes et recevez vos premières commandes sans débourser un centime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2.5 group active:scale-95"
              >
                <span>Activer mes 14 jours d'essai gratuit</span>
                <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-sub font-medium text-zinc-400">
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-[#FF6B00]"></i>
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check text-[#FF6B00]"></i>
                <span>Résiliation en 1 clic</span>
              </div>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-[#FF6B00]"></i>
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
