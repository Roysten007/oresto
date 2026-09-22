import React from "react";

export function LandingPaymentMarquee() {
  const operators = [
    { name: "MTN Mobile Money", badge: "Direct Marchand", color: "bg-yellow-400 text-yellow-950" },
    { name: "Moov Money", badge: "Sans délai", color: "bg-blue-600 text-white" },
    { name: "Celtiis Cash", badge: "Instantané", color: "bg-emerald-600 text-white" },
    { name: "Wave Bénin & UEMOA", badge: "0% retenue", color: "bg-sky-500 text-white" },
    { name: "Cartes Visa & Mastercard", badge: "Sécurisé", color: "bg-zinc-900 text-white" },
  ];

  return (
    <section className="py-10 border-y border-zinc-200 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          
          <div className="max-w-md">
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-sub font-black uppercase tracking-wider text-[#FF6B00] mb-1">
              <i className="fa-solid fa-bolt"></i>
              Paiements 100% Locaux & Directs
            </div>
            <p className="text-sm font-sub font-bold text-zinc-800">
              Encaissez directement sur vos comptes Mobile Money préférés sans intermédiaire.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {operators.map((op, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FAFAFA] border border-zinc-200 shadow-sm"
              >
                <span className={`text-[10px] font-sub font-black uppercase px-2 py-0.5 rounded-full ${op.color}`}>
                  {op.name.split(" ")[0]}
                </span>
                <span className="text-xs font-sub font-bold text-zinc-900">{op.name}</span>
                <span className="text-[10px] font-sub font-semibold text-zinc-400 hidden sm:inline">• {op.badge}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default LandingPaymentMarquee;
