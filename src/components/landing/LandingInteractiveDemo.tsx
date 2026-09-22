import React, { useState } from "react";
import { BusinessSector } from "./LandingHero";

interface LandingInteractiveDemoProps {
  activeSector: BusinessSector;
  onSelectSector: (sector: BusinessSector) => void;
}

export default function LandingInteractiveDemo({ activeSector, onSelectSector }: LandingInteractiveDemoProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [alertBeep, setAlertBeep] = useState(false);

  const demoItems = {
    restaurant: {
      name: "Poulet Braisé & Alloco Pimenté",
      desc: "Spécialité marinée aux épices du Bénin, banane plantain frite dorée.",
      price: 4500,
      customer: "Amina K. (Table 04)",
      tag: "Restaurant",
    },
    ecommerce: {
      name: "Ensemble Wax Moderne (Taille L)",
      desc: "Coton 100% supérieur, finitions haute couture faites main à Cotonou.",
      price: 22000,
      customer: "Marcelle D. (Livraison Haie Vive)",
      tag: "Boutique",
    },
    hotel: {
      name: "Suite Vue Lagune (2 Nuitées)",
      desc: "Climatisation, lit King size, petit-déjeuner inclus et terrasse privée.",
      price: 80000,
      customer: "Jean-Paul E. (Réservation Directe)",
      tag: "Hôtel",
    },
  };

  const item = demoItems[activeSector];

  const handleSimulateOrder = () => {
    setOrderPlaced(true);
    setAlertBeep(true);
    setTimeout(() => {
      setAlertBeep(false);
    }, 2500);
  };

  const handleReset = () => {
    setOrderPlaced(false);
    setAlertBeep(false);
  };

  return (
    <section id="demo" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-4">
            <i className="fa-solid fa-bolt"></i>
            <span>SIMULATION EN DIRECT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
            Voyez comment une vente se passe en{" "}
            <span className="text-[#FF6B00]">
              temps réel
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium">
            Passez une commande test à gauche et observez instantanément la notification sonore et le ticket apparaître dans le tableau de bord gérant à droite.
          </p>
        </div>

        {/* Structured Dark Demo Section (#0A0A0A) */}
        <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[36px] border border-zinc-800 shadow-dark-card p-6 sm:p-10 max-w-5xl mx-auto text-white">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Customer View Phone Simulator */}
            <div className="lg:col-span-6 bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-mobile-screen-button text-[#FF6B00]"></i>
                    <span className="text-xs font-sub font-bold text-white uppercase tracking-wider">Écran de votre client</span>
                  </div>
                  <span className="text-[10px] font-sub font-semibold text-zinc-400">Sans application à installer</span>
                </div>

                <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 shadow-sm mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-sub font-bold text-white">{item.name}</h4>
                    <span className="text-sm font-heading font-black text-[#FF6B00]">
                      {item.price.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sub leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-orange-950/20 border border-orange-900/40 text-xs">
                    <i className="fa-solid fa-check text-[#FF6B00] shrink-0 text-xs"></i>
                    <span className="text-zinc-300 text-[11px] font-sub font-medium">
                      Paiement Mobile Money direct sélectionné (MTN / Moov / Celtiis)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {!orderPlaced ? (
                  <button
                    onClick={handleSimulateOrder}
                    className="w-full py-4 px-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2.5 group active:scale-95"
                  >
                    <span>Valider ma commande test (Gratuit)</span>
                    <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800/80 text-emerald-400 text-xs font-sub font-bold text-center flex items-center justify-center gap-2">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Commande transmise & paiement MoMo validé !</span>
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-sub font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-rotate-right text-xs"></i>
                      <span>Recommencer la simulation</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Merchant Command Dashboard Simulator */}
            <div className="lg:col-span-6 bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid fa-bell ${alertBeep ? "text-[#FF6B00] animate-bounce" : "text-zinc-400"}`}></i>
                    <span className="text-xs font-sub font-bold text-white uppercase tracking-wider">Votre tableau de bord gérant</span>
                  </div>
                  <span className="text-[10px] font-sub font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    En direct
                  </span>
                </div>

                {alertBeep && (
                  <div className="mb-4 p-3 rounded-xl bg-orange-950/60 border border-orange-800 text-[#FF6B00] text-xs font-sub font-black flex items-center gap-2 animate-pulse">
                    <i className="fa-solid fa-bell"></i>
                    <span>DING ! Nouvelle commande reçue à l'instant</span>
                  </div>
                )}

                {orderPlaced ? (
                  <div className="bg-zinc-950 rounded-2xl p-5 border-2 border-orange-500/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-400">Commande #TEST-01</span>
                      <span className="text-[10px] font-sub font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Payé par MTN MoMo
                      </span>
                    </div>
                    <div className="py-2 border-y border-zinc-800">
                      <p className="text-sm font-heading font-bold text-white">{item.name}</p>
                      <p className="text-xs text-zinc-400 font-sub">Client : {item.customer}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs font-sub">
                      <span className="text-zinc-400 font-medium">Net perçu par vous :</span>
                      <span className="text-base font-heading font-black text-[#FF6B00]">
                        {item.price.toLocaleString("fr-FR")} FCFA (0% frais)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center p-6 bg-zinc-950/60 rounded-2xl border border-dashed border-zinc-800 text-zinc-500">
                    <i className="fa-solid fa-bell text-2xl text-zinc-600 mb-2"></i>
                    <p className="text-xs font-sub font-bold">En attente d'une commande...</p>
                    <p className="text-[11px] text-zinc-500 mt-1 font-sub">Cliquez sur « Valider ma commande test » à gauche</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-800 text-center">
                <span className="text-[11px] text-zinc-400 font-sub font-medium">
                  Les fonds arrivent à 100% sur votre propre compte Mobile Money.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export { LandingInteractiveDemo };
