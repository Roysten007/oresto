import React from "react";
import { ShieldCheck, Zap } from "lucide-react";

export function LandingPaymentMarquee() {
  const operators = [
    { name: "MTN Mobile Money", badge: "Direct Marchand", color: "bg-yellow-400 text-yellow-950" },
    { name: "Moov Money", badge: "Sans délai", color: "bg-blue-600 text-white" },
    { name: "Celtiis Cash", badge: "Instantané", color: "bg-emerald-600 text-white" },
    { name: "Wave Bénin & UEMOA", badge: "0% retenue", color: "bg-sky-500 text-white" },
    { name: "Cartes Visa & Mastercard", badge: "Sécurisé", color: "bg-slate-900 text-white" },
  ];

  return (
    <section className="py-12 border-y border-violet-100/80 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="max-w-md">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#6633d6] mb-1">
              <Zap className="w-3.5 h-3.5" />
              Paiements 100% Locaux & Directs
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Encaissez directement sur vos comptes Mobile Money préférés sans intermédiaire.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {operators.map((op, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#fbfaff] border border-violet-100 shadow-[0_2px_10px_rgba(76,40,150,0.03)]"
              >
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${op.color}`}>
                  {op.name.split(" ")[0]}
                </span>
                <span className="text-xs font-bold text-slate-800">{op.name}</span>
                <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">• {op.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPaymentMarquee;
