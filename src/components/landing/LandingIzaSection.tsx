import React, { useState } from "react";
import { Link } from "react-router-dom";

export interface ScenarioItem {
  id: string;
  icon: string;
  title: string;
  userPrompt: string;
  izaResponse: string;
  actionSummary: string;
  highlightMetric: string;
  highlightLabel: string;
  tag: string;
}

export function LandingIzaSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const scenarios: ScenarioItem[] = [
    {
      id: "stats",
      icon: "fa-solid fa-chart-pie",
      title: "Bilan du jour & recettes MoMo",
      userPrompt: "Combien on a encaissé aujourd'hui et quel est le plat le plus vendu ?",
      izaResponse:
        "Aujourd'hui, vous avez réalisé 142 500 FCFA sur 28 commandes.\n\n• 100% encaissé en direct par Mobile Money (0% de commission Oresto)\n• Top vente : Poulet Braisé & Alloco (14 portions)\n• Heure de pointe : 12h45 avec 9 commandes simultanées.",
      actionSummary: "Chiffres calculés en direct sur vos transactions MoMo",
      highlightMetric: "142 500 FCFA",
      highlightLabel: "Recettes MoMo directes du jour",
      tag: "Pilotage financier instantané",
    },
    {
      id: "menu",
      icon: "fa-solid fa-utensils",
      title: "Mettre à jour un prix ou un stock",
      userPrompt: "Passe le Tchigan à 3 500 F et désactive le Capitaine Braisé, c'est en rupture.",
      izaResponse:
        "C'est fait instantanément !\n\n• Tchigan mis à jour : 3 500 FCFA (affiché en direct sur votre vitrine web)\n• Capitaine Braisé : marqué en rupture (vos clients ne peuvent plus le commander).",
      actionSummary: "Modifications appliquées en 2 secondes sur votre site web",
      highlightMetric: "2 secondes",
      highlightLabel: "Pour actualiser votre carte ou catalogue",
      tag: "Gestion sans friction",
    },
    {
      id: "promo",
      icon: "fa-solid fa-bullhorn",
      title: "Lancer une offre spéciale",
      userPrompt: "Crée une offre -15% sur tous les packs apéro pour ce soir à partir de 18h.",
      izaResponse:
        "Offre programmée avec succès !\n\n• Bannière promo créée en tête de votre vitrine web\n• Réduction de 15% appliquée automatiquement au panier dès 18h00\n• Message d'annonce WhatsApp prêt à être partagé à vos clients.",
      actionSummary: "Bannière promo et remises activées automatiquement",
      highlightMetric: "+25% de ventes",
      highlightLabel: "Constaté lors des opérations flash",
      tag: "Marketing automatisé",
    },
    {
      id: "commandes",
      icon: "fa-solid fa-bell",
      title: "Alertes commandes & stocks",
      userPrompt: "IZA, y a-t-il des commandes qui attendent depuis plus de 15 minutes ?",
      izaResponse:
        "Attention, une commande nécessite votre attention :\n\n• Commande #482 (Aimé K. • Table 04) est en préparation depuis 18 minutes.\n• Contenu : 2x Poulet Braisé + Alloco.\n\nJ'ai prévenu le serveur sur son WhatsApp pour assurer un service impeccable.",
      actionSummary: "Surveillance proactive du temps de service",
      highlightMetric: "Table 04",
      highlightLabel: "Alerte service en cours",
      tag: "Surveillance cuisine & service",
    },
  ];

  const current = scenarios[activeTab];

  const handleOpenLiveBot = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("oresto:open-iza"));
    }
  };

  return (
    <section id="iza" className="py-10 sm:py-14 bg-[#09090B] text-white relative overflow-hidden border-t border-zinc-800">
      {/* Halo lumineux d'ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-tr from-[#FF6B00]/15 via-[#EA580C]/10 to-transparent blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-dark-dots opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* En-tête compact — taille de police et marges optimisées pour tenir sur 1 écran */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-[#FF6B00] text-[11px] font-sub font-bold mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping" />
            <span>Exclusivité Oresto • Assistant intelligent intégré</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black tracking-tight text-white mb-2 leading-tight">
            Rencontrez <span className="text-[#FF6B00]">IZA AI</span>, votre copilote 24h/24.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-sub font-normal max-w-xl mx-auto leading-relaxed">
            Parlez à IZA par message ou à la voix : elle est connectée en temps réel à vos commandes, vos stocks et vos encaissements Mobile Money.
          </p>
        </div>

        {/* Conteneur principal compact */}
        <div className="bg-zinc-950 rounded-2xl sm:rounded-3xl border border-zinc-800 shadow-2xl p-4 sm:p-6 relative">
          
          {/* Onglets de scénarios rapides */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-sub font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === idx
                    ? "bg-[#FF6B00] text-white shadow-braised scale-102"
                    : "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <i className={`${sc.icon} text-[11px]`}></i>
                <span>{sc.title}</span>
              </button>
            ))}
          </div>

          {/* Canvas de simulation en 2 colonnes bien proportionnées */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
            
            {/* Colonne gauche : Fenêtre de chat */}
            <div className="lg:col-span-7 bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 flex flex-col justify-between space-y-3">
              
              {/* En-tête du Chat */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#EA580C] text-white flex items-center justify-center font-heading font-black text-xs shadow-md">
                    <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-white text-xs">IZA AI</h4>
                      <span className="text-[9px] font-sub font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                        Connectée en direct
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-sub">Connectée à votre base &amp; Mobile Money</p>
                  </div>
                </div>

                <button
                  onClick={handleOpenLiveBot}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/60 hover:bg-orange-900/80 text-[#FF6B00] hover:text-white border border-orange-800/60 text-[11px] font-sub font-bold transition-all"
                  title="Ouvrir le chatbot"
                >
                  <i className="fa-solid fa-comments text-[10px]"></i>
                  <span>Tester en live</span>
                </button>
              </div>

              {/* Flux de messages */}
              <div className="space-y-3 font-sub py-1">
                {/* Message Utilisateur */}
                <div className="flex items-start justify-end gap-2">
                  <div className="bg-[#FF6B00] text-white px-3.5 py-2 rounded-xl rounded-tr-xs max-w-[85%] text-xs font-medium shadow-sm">
                    {current.userPrompt}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-300 font-bold shrink-0">
                    VOUS
                  </div>
                </div>

                {/* Réponse IZA */}
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-950 border border-orange-600/40 flex items-center justify-center text-[10px] text-[#FF6B00] font-black shrink-0">
                    <i className="fa-solid fa-bolt text-[9px]"></i>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl rounded-tl-xs max-w-[90%] text-xs leading-relaxed space-y-1.5">
                    <p className="whitespace-pre-line text-zinc-200">{current.izaResponse}</p>
                    <div className="pt-1.5 mt-1.5 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                      <i className="fa-solid fa-circle-check text-[10px]"></i>
                      <span>{current.actionSummary}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Champ de saisie simulé */}
              <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                <div className="flex-1 bg-zinc-950 rounded-lg px-3 py-1.5 border border-zinc-800 text-[11px] text-zinc-500 font-sub flex items-center justify-between">
                  <span>Demandez un chiffre, un plat ou une action...</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[9px] text-zinc-400">Micro actif</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenLiveBot}
                  className="w-8 h-8 rounded-lg bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center text-xs shadow-braised transition-all shrink-0"
                  title="Parler à IZA"
                >
                  <i className="fa-solid fa-microphone text-xs"></i>
                </button>
              </div>

            </div>

            {/* Colonne droite : Impact & Métrique concrète */}
            <div className="lg:col-span-5 bg-zinc-900/60 rounded-2xl p-4 sm:p-5 border border-zinc-800 flex flex-col justify-between space-y-3.5">
              
              <div>
                <span className="text-[10px] font-sub font-bold text-[#FF6B00] block mb-1">
                  {current.tag}
                </span>
                <h4 className="text-sm sm:text-base font-heading font-bold text-white leading-snug">
                  L'IA branchée sur votre vrai business.
                </h4>
                <p className="text-[11px] text-zinc-400 font-sub mt-1 leading-relaxed">
                  Pas de réponses théoriques : IZA applique vos ordres directement sur vos prix, vos stocks et calcule vos chiffres au franc près.
                </p>
              </div>

              {/* Carte Métrique Dynamique */}
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-0.5">
                <span className="text-[10px] font-sub font-medium text-zinc-400">
                  {current.highlightLabel}
                </span>
                <p className="text-xl sm:text-2xl font-heading font-black text-[#FF6B00]">
                  {current.highlightMetric}
                </p>
                <p className="text-[10px] text-zinc-500 font-sub">
                  Vérifié et actualisé en direct
                </p>
              </div>

              {/* 3 Avantages clés */}
              <div className="space-y-1.5 text-[11px] font-sub text-zinc-300">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-[#FF6B00] text-[10px]"></i>
                  <span>Commandes vocales &amp; texte en français</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-[#FF6B00] text-[10px]"></i>
                  <span>0% commission calculée automatiquement</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-check text-[#FF6B00] text-[10px]"></i>
                  <span>Inclus à 100% dans chaque formule</span>
                </div>
              </div>

              {/* CTA d'essai */}
              <div className="pt-1">
                <Link
                  to="/register"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-xs shadow-braised transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Tester IZA pendant 14 jours gratuits</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default LandingIzaSection;
