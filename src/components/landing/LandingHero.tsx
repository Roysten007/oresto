import React from "react";
import { Link } from "react-router-dom";

export type BusinessSector = "restaurant" | "ecommerce" | "hotel";

interface LandingHeroProps {
  activeSector: BusinessSector;
  onSelectSector: (sector: BusinessSector) => void;
}

export default function LandingHero({ activeSector, onSelectSector }: LandingHeroProps) {
  const sectorData = {
    restaurant: {
      badge: "RESTAURANTS, MAQUIS & FAST-FOODS",
      headline: "la carte digitale de votre restaurant",
      desc: "Menu interactif avec QR Code sur tables, commandes à emporter ou livraison, et encaissement Mobile Money direct sans commission.",
      sampleStore: "L'Atelier du Chef & Grillades",
      sampleLocation: "Haie Vive, Cotonou",
      kpiToday: "19 repas servis",
      kpiRevenue: "92 500 FCFA",
      orderItem: "Poulet Braisé & Alloco Pimenté",
      orderPrice: "5 500 FCFA",
      orderStatus: "En cuisine • Table 04",
      momoMethod: "MTN MoMo",
      momoRef: "MOMO-7492-BJ",
    },
    ecommerce: {
      badge: "BOUTIQUES & E-COMMERCE",
      headline: "le catalogue e-commerce de votre boutique",
      desc: "Fiches produits multi-photos, gestion des tailles et stocks en direct, et validation instantanée des paiements sans courir après les captures.",
      sampleStore: "Moda Cotonou Couture",
      sampleLocation: "Ganhi, Cotonou",
      kpiToday: "14 articles vendus",
      kpiRevenue: "145 000 FCFA",
      orderItem: "Robe Saharienne Lin Beige (Taille M)",
      orderPrice: "18 000 FCFA",
      orderStatus: "Prêt expédition • Colis #08",
      momoMethod: "Moov Money",
      momoRef: "MOOV-8821-BJ",
    },
    hotel: {
      badge: "HÔTELS & RÉSIDENCES",
      headline: "la plateforme de réservation de vos chambres",
      desc: "Galerie HD de vos suites, réservations directes sans les 20% de commission Booking, et cautions sécurisées par Mobile Money.",
      sampleStore: "Villa Oasis & Résidence Lounge",
      sampleLocation: "Fidjrossè Plage, Cotonou",
      kpiToday: "4 nuitées confirmées",
      kpiRevenue: "180 000 FCFA",
      orderItem: "Suite Océane Deluxe (2 Nuits)",
      orderPrice: "70 000 FCFA",
      orderStatus: "Arrivée Vendredi 15h",
      momoMethod: "Celtiis Cash",
      momoRef: "CELT-1094-BJ",
    },
  };

  const current = sectorData[activeSector];

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 overflow-hidden bg-hero-glow bg-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Centered Header Content */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          
          {/* Badge Pill with Orange Braisé Accent */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span>ESSAI 14 JOURS 100% GRATUIT • SANS CARTE BANCAIRE</span>
          </div>

          {/* Massif & Percutant Montserrat Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-heading font-black text-zinc-950 tracking-tight leading-[1.08] mb-6 uppercase">
            La plateforme tout-en-un pour{" "}
            <span className="text-[#FF6B00]">
              vendre & encaisser
            </span>{" "}
            sans intermédiaire.
          </h1>

          {/* Subtitle with Outfit font */}
          <p className="text-lg sm:text-xl text-zinc-600 font-sub font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Créez votre site professionnel en 12 minutes. Vos clients commandent en 3 clics, et vous recevez 100% de l'argent directement par Mobile Money (0% de commission).
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm sm:text-base uppercase tracking-wider shadow-braised hover:shadow-[0_16px_32px_-6px_rgba(255,107,0,0.55)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
            >
              <span>Démarrer mes 14 jours gratuits</span>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-sub font-bold text-sm sm:text-base border border-zinc-300 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-play text-xs text-[#FF6B00]"></i>
              <span>Voir la démo en direct</span>
            </a>
          </div>

          {/* Micro Reassurances with Font Awesome icons */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sub font-bold text-zinc-500 uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved text-[#FF6B00]"></i>
              <span>Aucune carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-[#FF6B00]"></i>
              <span>Mise en ligne en 12 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-bolt text-[#FF6B00]"></i>
              <span>0% de commission MoMo</span>
            </div>
          </div>
        </div>

        {/* 3-Profile Selector Tabs with Font Awesome icons */}
        <div id="solutions" className="max-w-2xl mx-auto mb-10">
          <div className="p-1.5 rounded-full bg-white border border-zinc-200 shadow-sm grid grid-cols-3 gap-1">
            <button
              onClick={() => onSelectSector("restaurant")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-sub font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "restaurant"
                  ? "bg-[#FF6B00] text-white shadow-braised font-black"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <i className="fa-solid fa-utensils"></i>
              <span>Restaurant</span>
            </button>

            <button
              onClick={() => onSelectSector("ecommerce")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-sub font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "ecommerce"
                  ? "bg-[#FF6B00] text-white shadow-braised font-black"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Boutique</span>
            </button>

            <button
              onClick={() => onSelectSector("hotel")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-sub font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "hotel"
                  ? "bg-[#FF6B00] text-white shadow-braised font-black"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
              }`}
            >
              <i className="fa-solid fa-hotel"></i>
              <span>Hôtel</span>
            </button>
          </div>
        </div>

        {/* Structured Dark Demo Mockup (#0A0A0A) */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[36px] border border-zinc-800 shadow-dark-card p-6 sm:p-10 relative text-white">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <span className="text-xs font-mono text-zinc-400 ml-3">
                  oresto.app/{activeSector === 'restaurant' ? 'le-chef' : activeSector === 'ecommerce' ? 'moda-cotonou' : 'villa-oasis'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-sub font-bold text-[#FF6B00] bg-orange-950/40 px-3 py-1 rounded-full border border-orange-800/50">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
                <span>En direct • Ventes actives</span>
              </div>
            </div>

            {/* Split View Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Live Customer Mobile Experience on dark slate */}
              <div className="lg:col-span-5 bg-zinc-900/90 rounded-2xl p-5 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-sub font-black uppercase tracking-wider text-[#FF6B00]">
                      Vitrine Client
                    </span>
                    <h3 className="text-base font-heading font-black text-white">{current.sampleStore}</h3>
                    <p className="text-[11px] text-zinc-400 font-sub">{current.sampleLocation}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-[#FF6B00] flex items-center justify-center text-xs font-bold border border-zinc-700">
                    <i className="fa-solid fa-qrcode"></i>
                  </div>
                </div>

                <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-sub font-bold text-white">{current.orderItem}</h4>
                    <span className="text-xs font-heading font-black text-[#FF6B00]">{current.orderPrice}</span>
                  </div>
                  <span className="text-[10px] font-sub font-bold px-2 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                    <i className="fa-solid fa-check text-[9px]"></i>
                    <span>Ajouté</span>
                  </span>
                </div>

                {/* Instant Mobile Money checkout simulator */}
                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-sub">
                    <span className="text-zinc-400 font-medium">Paiement direct sécurisé :</span>
                    <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {current.momoMethod}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-orange-950/20 border border-orange-900/40 text-xs">
                    <i className="fa-solid fa-shield-halved text-[#FF6B00] shrink-0"></i>
                    <span className="text-zinc-300 text-[11px] font-sub leading-tight">
                      Paiement versé directement sur le compte MoMo du gérant.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Merchant Command Center */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Real-time KPIs Banner */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] font-sub font-bold uppercase tracking-wider text-zinc-400">Activité du jour</span>
                    <p className="text-lg sm:text-xl font-heading font-black text-white mt-1">{current.kpiToday}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                    <span className="text-[10px] font-sub font-bold uppercase tracking-wider text-[#FF6B00]">Encaissé (0% frais)</span>
                    <p className="text-lg sm:text-xl font-heading font-black text-[#FF6B00] mt-1">{current.kpiRevenue}</p>
                  </div>
                </div>

                {/* Live Order Card in merchant dashboard */}
                <div className="p-5 rounded-2xl bg-zinc-900 border-2 border-orange-500/40 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-sub font-bold text-white">Nouvelle commande confirmée</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">À l'instant</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-zinc-800">
                    <div>
                      <p className="text-sm font-heading font-bold text-white">{current.orderItem}</p>
                      <p className="text-xs text-zinc-400 font-sub">{current.orderStatus}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-heading font-black text-[#FF6B00]">{current.orderPrice}</span>
                      <p className="text-[10px] font-sub font-bold text-emerald-400 flex items-center justify-end gap-1">
                        <i className="fa-solid fa-circle-check text-[9px]"></i>
                        <span>Reçu via {current.momoMethod}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-sub text-zinc-400">
                    <span>Réf : {current.momoRef}</span>
                    <span className="font-bold text-white">Commission prélevée : 0 FCFA</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export { LandingHero };
