import React, { useState } from "react";
import { BusinessSector } from "./LandingHero";
import { Smartphone, Bell, Check, ShoppingBag, ArrowRight, Zap, RefreshCw } from "lucide-react";

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
    <section id="demo" className="py-24 bg-[#fbfaff] relative border-t border-violet-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-[#6633d6] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            SIMULATION EN DIRECT
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f0a1f] tracking-tight leading-tight">
            Voyez comment une vente se passe en{" "}
            <span className="font-accent italic text-[#6633d6]">
              temps réel
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Passez une commande test à gauche et observez instantanément la notification sonore et le ticket apparaître dans le tableau de bord gérant à droite.
          </p>
        </div>

        {/* The Interactive Dual-Panel Demo Container (30% Surface, 10% Accent) */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-violet-100/90 shadow-float p-6 sm:p-10 max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Customer View Phone Simulator */}
            <div className="lg:col-span-6 bg-[#fbfaff] rounded-2xl p-6 border border-violet-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-violet-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#6633d6]" />
                    <span className="text-xs font-bold text-slate-800">Écran de votre client</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Sans application</span>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-[#0f0a1f]">{item.name}</h4>
                    <span className="text-sm font-extrabold text-[#6633d6]">
                      {item.price.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-violet-50/70 border border-violet-100 text-xs">
                    <Check className="w-3.5 h-3.5 text-[#6633d6] shrink-0" />
                    <span className="text-slate-700 text-[11px] font-medium">
                      Paiement Mobile Money direct sélectionné (MTN / Moov / Celtiis)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {!orderPlaced ? (
                  <button
                    onClick={handleSimulateOrder}
                    className="w-full py-3.5 px-4 rounded-full bg-[#6633d6] hover:bg-[#5727c7] text-white font-extrabold text-sm shadow-[0_8px_20px_-4px_rgba(102,51,214,0.45)] transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Valider ma commande test (Gratuit)</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                      ✅ Commande transmise & paiement MoMo validé !
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-violet-200 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Recommencer la simulation</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Merchant Command Dashboard Simulator */}
            <div className="lg:col-span-6 bg-[#fbfaff] rounded-2xl p-6 border border-violet-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-violet-100">
                  <div className="flex items-center gap-2">
                    <Bell className={`w-4 h-4 ${alertBeep ? "text-[#6633d6] animate-bounce" : "text-slate-400"}`} />
                    <span className="text-xs font-bold text-slate-800">Votre tableau de bord gérant</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    En ligne
                  </span>
                </div>

                {alertBeep && (
                  <div className="mb-4 p-3 rounded-xl bg-violet-100 border border-violet-200 text-[#6633d6] text-xs font-extrabold flex items-center gap-2 animate-pulse">
                    <Bell className="w-4 h-4" />
                    <span>DING ! Nouvelle commande reçue à l'instant</span>
                  </div>
                )}

                {orderPlaced ? (
                  <div className="bg-white rounded-2xl p-5 border-2 border-violet-300 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">Commande #TEST-01</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Payé par MTN MoMo
                      </span>
                    </div>
                    <div className="py-2 border-y border-slate-100">
                      <p className="text-sm font-bold text-[#0f0a1f]">{item.name}</p>
                      <p className="text-xs text-slate-500">Client : {item.customer}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Net perçu par vous :</span>
                      <span className="text-base font-extrabold text-[#6633d6]">
                        {item.price.toLocaleString("fr-FR")} FCFA (0% frais)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 flex flex-col items-center justify-center text-center p-6 bg-white/60 rounded-2xl border border-dashed border-violet-200 text-slate-400">
                    <Bell className="w-8 h-8 text-violet-300 mb-2" />
                    <p className="text-xs font-semibold">En attente d'une commande...</p>
                    <p className="text-[11px] text-slate-400 mt-1">Cliquez sur « Valider ma commande test » à gauche</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-violet-100 text-center">
                <span className="text-[11px] text-slate-500 font-medium">
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
