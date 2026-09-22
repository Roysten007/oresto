import React from "react";

export function LandingPaymentMarquee() {
  const operators = [
    {
      name: "MTN Mobile Money",
      badge: "Direct Marchand • Bénin & UEMOA",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 110 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="110" height="34" rx="6" fill="#FFCC00" />
          <ellipse cx="28" cy="17" rx="18" ry="11" stroke="#000000" strokeWidth="2.2" fill="none" />
          <text x="28" y="21" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="12" fill="#000000" textAnchor="middle">MTN</text>
          <text x="72" y="21" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="13" fill="#002B49" textAnchor="middle">MoMo</text>
          <circle cx="94" cy="16" r="3.5" fill="#002B49" />
        </svg>
      ),
    },
    {
      name: "Moov Money",
      badge: "Sans délai • Moov Africa",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 115 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="115" height="34" rx="6" fill="#005DAA" />
          <path d="M10 24 C16 10, 26 10, 32 24" stroke="#FF7900" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <text x="42" y="21" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="13" fill="#FFFFFF">moov</text>
          <text x="80" y="21" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="11" fill="#FF7900">money</text>
        </svg>
      ),
    },
    {
      name: "Celtiis Cash",
      badge: "Instantané • Bénin",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 115 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="115" height="34" rx="6" fill="#008751" />
          <g transform="translate(8, 7)">
            <circle cx="10" cy="7" r="5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <circle cx="6" cy="13" r="5" stroke="#A3E635" strokeWidth="2" fill="none" />
            <circle cx="14" cy="13" r="5" stroke="#FFFFFF" strokeWidth="2" fill="none" />
          </g>
          <text x="36" y="21" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="12" fill="#FFFFFF" letterSpacing="0.5">celtiis</text>
          <text x="80" y="21" fontFamily="Montserrat, sans-serif" fontWeight="600" fontSize="11" fill="#A3E635">cash</text>
        </svg>
      ),
    },
    {
      name: "Wave Bénin & UEMOA",
      badge: "0% retenue • QR & Direct",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 95 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="95" height="34" rx="6" fill="#1DC3F9" />
          <g transform="translate(8, 6)">
            <ellipse cx="10" cy="11" rx="7" ry="9" fill="#FFFFFF" />
            <ellipse cx="11" cy="12" rx="4" ry="6" fill="#1DC3F9" />
            <circle cx="13" cy="7" r="1.2" fill="#000000" />
            <path d="M16 8 L20 10 L16 11 Z" fill="#FFA500" />
          </g>
          <text x="36" y="22" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="16" fill="#FFFFFF" letterSpacing="-0.5">wave</text>
        </svg>
      ),
    },
    {
      name: "Orange Money",
      badge: "Afrique de l'Ouest & Centrale",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 115 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="115" height="34" rx="6" fill="#18181B" />
          <rect x="7" y="7" width="20" height="20" rx="3" fill="#FF7900" />
          <text x="34" y="18" fontFamily="Outfit, sans-serif" fontWeight="800" fontSize="11" fill="#FF7900">orange</text>
          <text x="34" y="27" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="9" fill="#FFFFFF" letterSpacing="1">MONEY</text>
        </svg>
      ),
    },
    {
      name: "Visa",
      badge: "Cartes bancaires mondiales",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 75 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="75" height="34" rx="6" fill="#FFFFFF" stroke="#E4E4E7" />
          <g transform="translate(10, 8)">
            <path d="M18 15L21.2 2.5H25L21.8 15H18Z" fill="#1434CB" />
            <path d="M34.5 2.8C33.8 2.5 32.6 2.2 31.2 2.2C27.5 2.2 24.9 4.2 24.9 7C24.9 9.1 26.7 10.3 28.1 11C29.5 11.7 30 12.2 30 12.8C30 13.8 28.8 14.2 27.7 14.2C26.4 14.2 25.6 14 24.5 13.5L24 13.2L23.5 16.3C24.4 16.7 25.9 17 27.5 17C31.5 17 34.1 15 34.1 11.9C34.1 9.5 32.5 8.2 30.4 7.2C29.2 6.6 28.4 6.1 28.4 5.4C28.4 4.7 29.2 4.1 30.6 4.1C31.7 4.1 32.6 4.3 33.3 4.6L33.7 4.8L34.5 2.8Z" fill="#1434CB" />
            <path d="M40.3 10.7C40.6 9.8 41.9 6.1 41.9 6.1C41.9 6.1 42.2 5.2 42.4 4.6L42.6 5.9C43 7.5 44 12.3 44.2 13.4H39.2L40.3 10.7ZM45.7 2.5H42.7C41.8 2.5 41 3 40.7 3.8L35.3 16.9H39.3L40.1 14.6H45L45.4 16.9H49L45.7 2.5Z" fill="#1434CB" />
            <path d="M14.1 2.5L10.3 12.3L9.9 10.1C9.1 7.6 6.8 4.9 4.2 3.6L7.8 16.9H11.8L18.1 2.5H14.1Z" fill="#1434CB" />
            <path d="M7 2.5H0.8L0.7 2.7C5.5 3.9 9 7.3 9.9 10.1L8.7 3.7C8.5 2.8 7.8 2.5 7 2.5Z" fill="#F7B600" />
          </g>
        </svg>
      ),
    },
    {
      name: "Mastercard",
      badge: "Paiement international 3D Secure",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 75 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="75" height="34" rx="6" fill="#18181B" />
          <g transform="translate(18, 5)">
            <circle cx="12" cy="12" r="10" fill="#EB001B" />
            <circle cx="26" cy="12" r="10" fill="#F79E1B" />
            <path d="M19 5.5C21.2 7.3 22.6 9.5 22.6 12C22.6 14.5 21.2 16.7 19 18.5C16.8 16.7 15.4 14.5 15.4 12C15.4 9.5 16.8 7.3 19 5.5Z" fill="#FF5F00" />
          </g>
        </svg>
      ),
    },
    {
      name: "Apple Pay",
      badge: "Paiement 1-clic mondial",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 80 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="34" rx="6" fill="#000000" />
          <g transform="translate(12, 7)">
            <path d="M13.2 13.5C13.2 11.2 15.1 9.9 15.2 9.8C14.1 8.3 12.5 8.1 11.9 8C10.4 7.9 9 8.9 8.2 8.9C7.4 8.9 6.3 8 5.2 8C3.7 8 2.3 8.9 1.5 10.3C-0.1 13.1 1.1 17.2 2.6 19.4C3.4 20.5 4.2 21.6 5.4 21.5C6.6 21.4 7 20.8 8.3 20.8C9.6 20.8 10 21.5 11.2 21.5C12.4 21.5 13.2 20.4 13.9 19.3C14.8 18.1 15.1 16.9 15.2 16.8C15.1 16.7 13.2 15.9 13.2 13.5Z" fill="#FFFFFF" />
            <path d="M10.8 6.6C11.5 5.8 11.9 4.7 11.8 3.6C10.8 3.7 9.6 4.3 9 5.1C8.4 5.7 7.9 6.8 8.1 7.9C9.1 8 10.2 7.3 10.8 6.6Z" fill="#FFFFFF" />
            <text x="21" y="16" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="600" fontSize="13" fill="#FFFFFF">Pay</text>
          </g>
        </svg>
      ),
    },
    {
      name: "Google Pay",
      badge: "Paiement Android & Web",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 85 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="85" height="34" rx="6" fill="#FFFFFF" stroke="#E4E4E7" />
          <g transform="translate(10, 8)">
            <path d="M16 8.4C16 7.8 15.9 7.2 15.8 6.7H8.2V9.9H12.6C12.4 11 11.7 11.9 10.7 12.5V14.7H13.4C15 13.2 16 11 16 8.4Z" fill="#4285F4" />
            <path d="M8.2 16.4C10.4 16.4 12.3 15.7 13.4 14.7L10.7 12.5C10 13 9.2 13.3 8.2 13.3C6.1 13.3 4.3 11.8 3.6 9.9H0.8V12C2.2 14.8 5 16.4 8.2 16.4Z" fill="#34A853" />
            <path d="M3.6 9.9C3.4 9.4 3.3 8.9 3.3 8.2C3.3 7.5 3.4 7 3.6 6.5V4.4H0.8C0.3 5.4 0 6.7 0 8.2C0 9.7 0.3 11 0.8 12L3.6 9.9Z" fill="#FBBC05" />
            <path d="M8.2 3.1C9.4 3.1 10.5 3.5 11.3 4.3L13.5 2.1C12.2 0.8 10.4 0 8.2 0C5 0 2.2 1.6 0.8 4.4L3.6 6.5C4.3 4.6 6.1 3.1 8.2 3.1Z" fill="#EA4335" />
          </g>
          <text x="32" y="21" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="13" fill="#5F6368">Pay</text>
        </svg>
      ),
    },
    {
      name: "Stripe",
      badge: "135+ devises internationales",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 80 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="34" rx="6" fill="#635BFF" />
          <text x="40" y="22" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="15" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.5">stripe</text>
        </svg>
      ),
    },
    {
      name: "PayPal",
      badge: "Portefeuille international",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 90 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="90" height="34" rx="6" fill="#FFFFFF" stroke="#E4E4E7" />
          <g transform="translate(10, 8)">
            <path d="M8.5 3.5 L5.5 17.5 L2 17.5 L5 3.5 Z" fill="#003087" />
            <path d="M5.5 3.5 H10.5 C12.5 3.5 14 4.7 13.5 6.7 C13.1 8.7 11.5 9.9 9.5 9.9 H7.1 L6.3 13.9 H3.9 Z" fill="#0079C1" />
          </g>
          <text x="30" y="21" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="13" fill="#003087">Pay<tspan fill="#0079C1">Pal</tspan></text>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12 border-y border-zinc-200/80 bg-white/90 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        
        {/* En-tête centré façon saaspay.me */}
        <div className="text-center">
          <p className="text-xs sm:text-sm font-sub font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
            Adopté pour les paiements locaux et paiement international
          </p>
          <h2 className="text-lg sm:text-2xl font-heading font-black text-zinc-900 tracking-tight">
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
          {/* Première et deuxième passe pour boucle infinie parfaite */}
          {[...operators, ...operators].map((op, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/90 shadow-sm hover:shadow-md hover:border-[#FF6B00]/40 transition-all shrink-0 cursor-default group"
            >
              <div className="shrink-0 flex items-center justify-center">
                {op.logo}
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="text-xs font-sub font-bold text-zinc-900 group-hover:text-[#FF6B00] transition-colors leading-tight">
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
