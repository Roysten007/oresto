import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Smartphone, Zap, Store, UtensilsCrossed, Building2 } from "lucide-react";

export type BusinessSector = "restaurant" | "ecommerce" | "hotel";

interface LandingHeroProps {
  activeSector: BusinessSector;
  onSelectSector: (sector: BusinessSector) => void;
}

export default function LandingHero({ activeSector, onSelectSector }: LandingHeroProps) {
  const sectorData = {
    restaurant: {
      badge: "RESTAURANTS & MAQUIS",
      headline: "la carte digitale de votre restaurant",
      desc: "Menu interactif avec QR Code sur tables, commandes à emporter ou livraison, et encaissement Mobile Money direct sans commission.",
      sampleStore: "L'Atelier du Chef & Grillades",
      sampleLocation: "Haie Vive, Cotonou",
      kpiToday: "19 commandes servies",
      kpiRevenue: "92 500 FCFA",
      orderItem: "Poulet Braisé & Alloco",
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
          {/* SasPay-style Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100/80 border border-violet-200/70 text-[#6633d6] text-xs font-bold tracking-wide mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#6633d6] animate-pulse" />
            <span>NOUVEAU • 14 JOURS D'ESSAI 100% GRATUITS SANS CARTE</span>
          </div>

          {/* Main Huge Typography Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-[#0f0a1f] tracking-tight leading-[1.08] mb-6">
            La couche tout-en-un pour{" "}
            <span className="font-accent italic text-[#6633d6]">
              vendre & encaisser
            </span>{" "}
            sans intermédiaire.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed mb-8">
            Créez votre site professionnel en 12 minutes. Vos clients commandent en 3 clics, et vous recevez l'argent directement par Mobile Money (0% de commission).
          </p>

          {/* Dual Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#6633d6] hover:bg-[#5727c7] text-white font-extrabold text-sm sm:text-base shadow-[0_10px_24px_-6px_rgba(102,51,214,0.45)] hover:shadow-[0_16px_32px_-6px_rgba(102,51,214,0.6)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Démarrer mes 14 jours gratuits</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-violet-50/60 text-slate-700 font-bold text-sm sm:text-base border border-violet-200/80 shadow-sm transition-all"
            >
              Voir la démo en direct
            </a>
          </div>

          {/* Micro Reassurances */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#6633d6]" />
              <span>Aucune carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#6633d6]" />
              <span>Mise en ligne en 12 minutes chrono</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#6633d6]" />
              <span>0% commission MoMo</span>
            </div>
          </div>
        </div>

        {/* 3-Profile Selector Tabs (SasPay Style) */}
        <div id="solutions" className="max-w-2xl mx-auto mb-10">
          <div className="p-1.5 rounded-full bg-white border border-violet-100 shadow-[0_4px_20px_-4px_rgba(76,40,150,0.06)] grid grid-cols-3 gap-1">
            <button
              onClick={() => onSelectSector("restaurant")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "restaurant"
                  ? "bg-[#6633d6] text-white shadow-[0_4px_12px_rgba(102,51,214,0.35)]"
                  : "text-slate-600 hover:text-[#6633d6] hover:bg-violet-50"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0" />
              <span>Restaurant</span>
            </button>

            <button
              onClick={() => onSelectSector("ecommerce")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "ecommerce"
                  ? "bg-[#6633d6] text-white shadow-[0_4px_12px_rgba(102,51,214,0.35)]"
                  : "text-slate-600 hover:text-[#6633d6] hover:bg-violet-50"
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Boutique</span>
            </button>

            <button
              onClick={() => onSelectSector("hotel")}
              className={`py-3 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeSector === "hotel"
                  ? "bg-[#6633d6] text-white shadow-[0_4px_12px_rgba(102,51,214,0.35)]"
                  : "text-slate-600 hover:text-[#6633d6] hover:bg-violet-50"
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>Hôtel</span>
            </button>
          </div>
        </div>

        {/* Floating High-Fidelity Mockup Container (SasPay Signature) */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl sm:rounded-[32px] border border-violet-100/90 shadow-float p-6 sm:p-10 relative">
            
            {/* Window Top Bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-xs font-mono text-slate-400 ml-3">oresto.app/{activeSector === 'restaurant' ? 'le-chef' : activeSector === 'ecommerce' ? 'moda-cotonou' : 'villa-oasis'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#6633d6] bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                <span className="w-2 h-2 rounded-full bg-[#6633d6] animate-ping" />
                <span>En direct • Ventes actives</span>
              </div>
            </div>

            {/* Split View Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Live Customer Mobile Experience */}
              <div className="lg:col-span-5 bg-[#fbfaff] rounded-2xl p-5 border border-violet-100/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6633d6]">Vitrine Client</span>
                    <h3 className="text-base font-extrabold text-[#0f0a1f]">{current.sampleStore}</h3>
                    <p className="text-[11px] text-slate-500">{current.sampleLocation}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-violet-100 text-[#6633d6] flex items-center justify-center text-xs font-bold">
                    QR
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-violet-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{current.orderItem}</h4>
                    <span className="text-xs font-extrabold text-[#6633d6]">{current.orderPrice}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                    Ajouté au panier
                  </span>
                </div>

                {/* Instant Mobile Money checkout simulator */}
                <div className="bg-white rounded-xl p-4 border border-violet-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Paiement direct sécurisé :</span>
                    <span className="font-extrabold text-slate-900">{current.momoMethod}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-violet-50/70 border border-violet-100 text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#6633d6] shrink-0" />
                    <span className="text-slate-700 text-[11px] leading-tight">
                      Paiement validé immédiatement sur le compte du propriétaire.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Merchant Command Center */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Real-time KPIs Banner */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#fbfaff] border border-violet-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Activité du jour</span>
                    <p className="text-lg sm:text-xl font-extrabold text-[#0f0a1f] mt-1">{current.kpiToday}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#fbfaff] border border-violet-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6633d6]">Encaissé (0% frais)</span>
                    <p className="text-lg sm:text-xl font-extrabold text-[#6633d6] mt-1">{current.kpiRevenue}</p>
                  </div>
                </div>

                {/* Live Order Card in merchant dashboard */}
                <div className="p-5 rounded-2xl bg-white border-2 border-violet-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold text-slate-900">Nouvelle commande confirmée</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">À l'instant</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-[#0f0a1f]">{current.orderItem}</p>
                      <p className="text-xs text-slate-500">{current.orderStatus}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#6633d6]">{current.orderPrice}</span>
                      <p className="text-[10px] font-bold text-emerald-600">Reçu via {current.momoMethod}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Réf : {current.momoRef}</span>
                    <span className="font-bold text-[#6633d6]">Commission prélevée : 0 FCFA</span>
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
