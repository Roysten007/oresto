import React from "react";

export function LandingPaymentMarquee() {
  const operators = [
    {
      name: "Celtiis Cash",
      badge: "Instantané • 100% Bénin",
      renderIcon: () => (
        <img
          src="/celtiis-logo.svg"
          alt="Celtiis Cash Bénin"
          width="36"
          height="36"
          loading="lazy"
          decoding="async"
          className="w-9 h-9 rounded-lg object-contain shadow-xs shrink-0"
        />
      ),
    },
    {
      name: "MTN Mobile Money",
      badge: "Direct Marchand • Bénin & UEMOA",
      renderIcon: () => (
        <img
          src="/mtn-momo-logo.svg"
          alt="MTN MoMo"
          width="36"
          height="36"
          loading="lazy"
          decoding="async"
          className="w-9 h-9 rounded-lg object-contain shrink-0"
        />
      ),
    },
    {
      name: "Moov Money",
      badge: "Sans délai • Moov Africa",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 border border-blue-200 shrink-0">
          <i className="fa-solid fa-bolt text-lg text-blue-600"></i>
        </div>
      ),
    },
    {
      name: "Wave Bénin & UEMOA",
      badge: "0% retenue • QR & Direct",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-50 border border-sky-200 shrink-0">
          <i className="fa-solid fa-money-bill-wave text-lg text-sky-500"></i>
        </div>
      ),
    },
    {
      name: "Orange Money",
      badge: "Afrique de l'Ouest & Centrale",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-50 border border-orange-200 shrink-0">
          <i className="fa-solid fa-money-check-dollar text-lg text-orange-500"></i>
        </div>
      ),
    },
    {
      name: "Cartes Visa",
      badge: "Cartes bancaires mondiales",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50/60 border border-blue-200/60 shrink-0">
          <i className="fa-brands fa-cc-visa text-2xl text-[#1434CB]"></i>
        </div>
      ),
    },
    {
      name: "Mastercard",
      badge: "Paiement international 3D Secure",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50/60 border border-red-200/60 shrink-0">
          <i className="fa-brands fa-cc-mastercard text-2xl text-[#EB001B]"></i>
        </div>
      ),
    },
    {
      name: "Apple Pay",
      badge: "Paiement 1-clic mondial",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 border border-zinc-300 shrink-0">
          <i className="fa-brands fa-cc-apple-pay text-2xl text-zinc-950"></i>
        </div>
      ),
    },
    {
      name: "Google Pay",
      badge: "Paiement Android & Web",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-50 border border-zinc-200 shrink-0">
          <i className="fa-brands fa-google-pay text-2xl text-zinc-800"></i>
        </div>
      ),
    },
    {
      name: "Stripe",
      badge: "135+ devises internationales",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50/60 border border-indigo-200/60 shrink-0">
          <i className="fa-brands fa-cc-stripe text-2xl text-[#635BFF]"></i>
        </div>
      ),
    },
    {
      name: "PayPal",
      badge: "Portefeuille international",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-50/60 border border-sky-200/60 shrink-0">
          <i className="fa-brands fa-cc-paypal text-2xl text-[#003087]"></i>
        </div>
      ),
    },
    {
      name: "American Express",
      badge: "Cartes de paiement Amex",
      renderIcon: () => (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-50/60 border border-cyan-200/60 shrink-0">
          <i className="fa-brands fa-cc-amex text-2xl text-[#007AC1]"></i>
        </div>
      ),
    },
  ];

  return (
    <section className="py-12 border-y border-zinc-200/80 bg-white/90 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        
        {/* En-tête centré façon saaspay.me */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-sub font-semibold text-zinc-500 mb-1.5">
            Adopté pour les paiements locaux et internationaux
          </p>
          <h2 className="text-lg sm:text-2xl font-heading font-black text-zinc-950 tracking-tight">
            Encaissez directement sans intermédiaire, de Cotonou à l'international
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3 text-xs font-sub font-semibold text-zinc-600">
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <i className="fa-solid fa-circle-check text-xs"></i>
              0% de commission Oresto
            </span>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#FF6B00]">
              <i className="fa-solid fa-bolt text-xs"></i>
              Versement direct sur vos comptes marchands
            </span>
            <span className="hidden sm:inline text-zinc-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-zinc-700">
              <i className="fa-solid fa-shield-halved text-xs"></i>
              Aucune rétention de trésorerie
            </span>
          </div>
        </div>

      </div>

      {/* Marquee Défilement Infini Continu */}
      <div className="relative w-full overflow-hidden">
        {/* Dégradés d'atténuation sur les bords gauche et droit */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div className="flex w-max items-center gap-4 sm:gap-6 animate-scroll-left hover:[animation-play-state:paused] py-2">
          {/* Double boucle pour défilement infini fluide */}
          {[...operators, ...operators].map((op, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-2xl bg-[#FAFAFA] border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-[#FF6B00]/40 transition-all shrink-0 cursor-default group"
            >
              {op.renderIcon()}
              <div className="flex flex-col text-left pr-1">
                <span className="text-xs font-sub font-black text-zinc-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
                  {op.name}
                </span>
                <span className="text-[10px] font-sub font-medium text-zinc-400">
                  {op.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingPaymentMarquee;
