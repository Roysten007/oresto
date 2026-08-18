import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";

const FadeIn = ({ children, delay = 0, y = 20, className = "" }: { children: React.ReactNode, delay?: number, y?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function ProLanding() {
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]);
  const navBorder = useTransform(scrollY, [0, 50], ["transparent", "rgba(0, 0, 0, 0.05)"]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePreviewType, setActivePreviewType] = useState<"restaurant" | "ecommerce" | "hotel">("restaurant");

  const faqs = [
    {
      q: "Mes clients doivent-ils installer une application ?",
      a: "Non. Votre vitrine s'ouvre instantanément dans n'importe quel navigateur mobile en cliquant sur votre lien (ex: oresto.app/r/votre-nom) ou en scannant votre QR Code."
    },
    {
      q: "Comment suis-je payé par mes clients ?",
      a: "Directement sur votre compte MTN Mobile Money, Moov Money ou Celtiis Cash. L'argent ne transite par aucun compte tiers : 100% de vos recettes arrivent immédiatement sur votre propre téléphone."
    },
    {
      q: "Combien me coûte Oresto Pro après le premier mois ?",
      a: "La formule unique est à 5 000 FCFA par mois, tout inclus (Site Factory, Catalogue illimité, Encaissement MoMo 0% commission, Assistant IZI IA). Vous bénéficiez de -25% de réduction immédiate dès votre inscription (soit 3 750 FCFA le premier mois)."
    },
    {
      q: "Combien de temps faut-il pour créer et lancer mon site ?",
      a: "12 minutes chrono. Vous téléchargez votre logo, ajoutez vos spécialités ou vos articles avec leurs photos et tarifs, et votre site est en ligne immédiatement."
    },
    {
      q: "Est-ce adapté aux restaurants ET aux boutiques e-commerce ?",
      a: "Oui. Oresto Pro propose deux espaces 100% dédiés : l'espace Restaurant (Plats, Cuisine, Menus de la semaine) et l'espace Boutique E-Commerce (Multi-photos, Tailles/Couleurs, Gestion des stocks, Bannières d'annonces)."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* Sticky Top Navigation */}
      <motion.nav 
        style={{ backgroundColor: navBg, borderColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 transition-all"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white text-base shadow-md shadow-primary/25">
              <i className="fa-solid fa-store"></i>
            </div>
            <span className="font-heading font-black text-xl tracking-tight uppercase text-gray-900">
              Oresto <span className="text-primary">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link 
              to="/login"
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
            >
              <span>Activer à -25% (3 750 F)</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <header className="pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              0% DE COMMISSION • -25% DÈS LE 1ER MOIS (3 750 FCFA)
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Reprenez le contrôle de votre commerce <span className="text-primary">dès maintenant.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Encaissez 100% de vos commandes directement sur votre compte Mobile Money, sans payer la moindre commission, grâce à votre vitrine en ligne prête en 12 minutes.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 active:scale-95"
              >
                <span>Activer mon accès Oresto Pro à -25% (3 750 F)</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            
            <p className="text-[11px] text-gray-400 font-medium mt-2.5">
              Prêt en 12 minutes • 0% de commission • MTN MoMo, Moov Money & Celtiis direct
            </p>

          </FadeIn>
        </div>

        {/* Real Live Dashboard & Smartphone Mockup Illustration */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-16">
          <FadeIn delay={0.5}>
            <div className="p-4 sm:p-8 rounded-[40px] bg-[#0A0A0A] border-4 border-gray-800 shadow-2xl shadow-black/40 text-white space-y-6">
              
              {/* Mockup Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-bold text-white/70">
                    oresto.app/vendor/dashboard
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePreviewType("restaurant")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activePreviewType === "restaurant" ? "bg-primary text-white" : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    🍽️ Vue Restaurant
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewType("ecommerce")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activePreviewType === "ecommerce" ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    🛍️ Vue Boutique
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewType("hotel")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activePreviewType === "hotel" ? "bg-indigo-600 text-white" : "bg-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    🏨 Vue Hôtel & Auberge
                  </button>
                </div>
              </div>

              {/* Grid Content : Dashboard on Left, Mobile Storefront on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Real Dashboard Overview */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* KPI Cards Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">CA Encaissé (7j)</span>
                      <p className="font-heading font-black text-lg text-emerald-400">
                        {activePreviewType === "hotel" ? "2 450 000 F" : "1 250 000 F"}
                      </p>
                      <span className="text-[9px] text-emerald-500 font-mono">● 100% MoMo direct</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        {activePreviewType === "restaurant" ? "Repas Servis" : activePreviewType === "hotel" ? "Nuits Réservées" : "Colis Validés"}
                      </span>
                      <p className="font-heading font-black text-lg text-primary">
                        {activePreviewType === "hotel" ? "14 nuitées" : "19 du jour"}
                      </p>
                      <span className="text-[9px] text-white/60">Sans coupure</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">Commission</span>
                      <p className="font-heading font-black text-lg text-white">0 FCFA</p>
                      <span className="text-[9px] text-emerald-400 font-bold">0% prélevé</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                        {activePreviewType === "hotel" ? "Taux Remplissage" : "Panier Moyen"}
                      </span>
                      <p className="font-heading font-black text-lg text-white">
                        {activePreviewType === "hotel" ? "88%" : "4 600 F"}
                      </p>
                      <span className="text-[9px] text-white/60">Automatisé</span>
                    </div>
                  </div>

                  {/* Real Live Orders Card */}
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        {activePreviewType === "hotel" ? "Réservations de Séjours en Direct" : "Commandes Validées & Encaissées en Direct"}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-bold">● Synchronisé MoMo</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {activePreviewType === "restaurant" ? (
                        <>
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-primary text-xs">#042</span>
                              <div>
                                <p className="font-bold text-white">1x Poulet Braisé & Alloco</p>
                                <p className="text-[10px] text-white/50">Jean H. • Table 4 • 13:24</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">4 500 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                ✓ MoMo Reçu
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-primary text-xs">#041</span>
                              <div>
                                <p className="font-bold text-white">1x Capitaine Braisé</p>
                                <p className="text-[10px] text-white/50">Amina K. • Livraison Haie Vive • 13:10</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">6 000 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                                🛵 En Livraison
                              </span>
                            </div>
                          </div>
                        </>
                      ) : activePreviewType === "hotel" ? (
                        <>
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-indigo-400 text-xs">#RES-12</span>
                              <div>
                                <p className="font-bold text-white">Suite Royale Deluxe (3 nuits)</p>
                                <p className="text-[10px] text-white/50">Dr. Christian H. • Check-in 14h • Cadjehoun</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">114 750 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                ✓ -15% Long Séjour
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-indigo-400 text-xs">#RES-11</span>
                              <div>
                                <p className="font-bold text-white">Chambre Executive (1 nuit)</p>
                                <p className="text-[10px] text-white/50">Marc K. • Arrivée aujourd'hui</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">30 000 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                🏨 Confirmé
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-primary text-xs">#089</span>
                              <div>
                                <p className="font-bold text-white">1x Sneakers Streetwear (Pointure 42)</p>
                                <p className="text-[10px] text-white/50">Marc D. • Expédition Express • 12:45</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">18 500 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                ✓ MoMo Reçu
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-primary text-xs">#088</span>
                              <div>
                                <p className="font-bold text-white">1x Smartwatch Ultra Pro 4G</p>
                                <p className="text-[10px] text-white/50">Sophie T. • Cotonou • 11:30</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-emerald-400">29 000 F</p>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                📦 Colis Prêt
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* IZI IA Assistant Live Card */}
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center text-sm shrink-0 shadow-md">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-primary">Assistant IA IZI (Opérationnel 24h/24) :</p>
                      <p className="text-white/80 leading-relaxed">
                        {activePreviewType === "restaurant" 
                          ? "« Chef, vos ventes de midi ont rapporté 87 500 FCFA sur 19 commandes. Vos encaissements MoMo sont validés sans intermédiaire. »"
                          : activePreviewType === "hotel"
                          ? "« Réception : 2 nouvelles réservations pour ce week-end (144 750 FCFA encaissés). Climatisation et groupe 24h/24 confirmés. »"
                          : "« Boutique à jour : 8 colis prêts à l'expédition pour 142 000 FCFA encaissés. Zéro commission prélevée sur vos ventes. »"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Smartphone Live Customer View */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-[290px] rounded-[36px] bg-white text-gray-900 border-4 border-gray-700 shadow-2xl overflow-hidden text-xs flex flex-col">
                    
                    {/* Phone Status Bar */}
                    <div className="bg-gray-900 text-white p-3 flex justify-between items-center text-[10px]">
                      <span className="font-mono text-[9px] truncate">
                        {activePreviewType === "hotel" ? "oresto.app/r/palmier-royal" : activePreviewType === "ecommerce" ? "oresto.app/r/kiffstyle-store" : "oresto.app/r/latelier-du-chef"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[8px]">Ouvert</span>
                    </div>

                    {/* Store Header Banner */}
                    <div className={`h-20 text-white p-3 flex items-center gap-2.5 ${activePreviewType === "hotel" ? "bg-indigo-600" : activePreviewType === "ecommerce" ? "bg-purple-600" : "bg-primary"}`}>
                      <div className="w-10 h-10 rounded-xl bg-white text-gray-900 flex items-center justify-center font-heading font-black text-sm shadow-md">
                        {activePreviewType === "restaurant" ? "🍽️" : activePreviewType === "hotel" ? "🏨" : "🛍️"}
                      </div>
                      <div>
                        <h5 className="font-heading font-black text-xs leading-tight">
                          {activePreviewType === "restaurant" ? "L'Atelier du Chef" : activePreviewType === "hotel" ? "Palmier Royal Hôtel" : "KiffStyle Store"}
                        </h5>
                        <p className="text-[9px] text-white/80">Cotonou • 0% Commission</p>
                      </div>
                    </div>

                    {/* Products Grid in Phone */}
                    <div className="p-3 space-y-2 bg-gray-50 flex-1">
                      {activePreviewType === "restaurant" ? (
                        <>
                          <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-[11px]">Poulet Braisé & Alloco</p>
                              <p className="text-[9px] text-gray-400">Épices du terroir</p>
                              <span className="font-black text-primary text-xs">4 500 F</span>
                            </div>
                            <span className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">+</span>
                          </div>

                          <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-[11px]">Capitaine Braisé</p>
                              <p className="text-[9px] text-gray-400">Poisson frais du jour</p>
                              <span className="font-black text-primary text-xs">6 000 F</span>
                            </div>
                            <span className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">+</span>
                          </div>
                        </>
                      ) : activePreviewType === "hotel" ? (
                        <div className="space-y-2">
                          <div className="p-2 bg-white rounded-xl border border-gray-200 space-y-1">
                            <span className="bg-indigo-600 text-white text-[7px] font-black px-1 py-0.5 rounded">SUITE ROYALE</span>
                            <p className="font-bold text-[11px] truncate">Suite Vue Piscine (King Size)</p>
                            <p className="text-[9px] text-gray-500">Wi-Fi Fibre • Clim 24h • Petit-déj</p>
                            <p className="font-black text-indigo-600 text-xs">45 000 F / nuit</p>
                          </div>
                          <div className="p-2 bg-white rounded-xl border border-gray-200 space-y-1">
                            <p className="font-bold text-[11px] truncate">Chambre Executive Confort</p>
                            <p className="font-black text-indigo-600 text-xs">30 000 F / nuit</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white rounded-xl border border-gray-200 space-y-1">
                            <span className="bg-red-600 text-white text-[7px] font-black px-1 py-0.5 rounded">PROMO -25%</span>
                            <p className="font-bold text-[10px] truncate">Sneakers Urban</p>
                            <p className="font-black text-primary text-xs">18 500 F</p>
                          </div>

                          <div className="p-2 bg-white rounded-xl border border-gray-200 space-y-1">
                            <span className="bg-black text-white text-[7px] font-black px-1 py-0.5 rounded">BESTSELLER</span>
                            <p className="font-bold text-[10px] truncate">Smartwatch 4G</p>
                            <p className="font-black text-primary text-xs">29 000 F</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instant Action Button */}
                    <div className="p-2.5 bg-white border-t border-gray-100">
                      <Link
                        to={activePreviewType === "hotel" ? "/r/palmier-royal" : activePreviewType === "ecommerce" ? "/r/kiffstyle-store" : "/r/latelier-du-chef"}
                        className="py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase text-center flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary transition-colors"
                      >
                        <i className="fa-solid fa-eye text-xs"></i>
                        <span>Tester cette vitrine démo</span>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </FadeIn>
        </div>
      </header>

      {/* ─── BLOC 1 : LE PROBLÈME ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-b border-gray-150 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <FadeIn>
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-primary">1. Le problème quotidien</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 tracking-tight">
                Vous passez vos journées à faire du secrétariat au lieu d’encaisser.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Il est midi ou 19h. C'est l'heure où votre chiffre d'affaires devrait exploser.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-2">
              Au lieu de cela, votre téléphone n'arrête pas de sonner. Vous recevez 30 fois les mêmes messages :  
              *« Bonjour, envoyez-moi vos photos »*, *« C'est combien la portion ? »*, *« Envoyez votre numéro MoMo »*, *« Est-ce que c'est encore disponible ? »*
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-2">
              Vous perdez votre temps à chercher des photos dans votre galerie, à taper vos prix un par un et à vérifier des captures d'écran de transfert. Pendant ce temps, les clients pressés partent commander chez votre concurrent.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── BLOC 2 : LA FRUSTRATION ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <FadeIn>
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-red-600">2. Les conséquences réelles</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 tracking-tight">
                Ce que ce désordre vous coûte chaque jour.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-user-xmark"></i>
                </div>
                <h3 className="font-heading font-black text-base text-gray-900">Clients perdus</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  1 client sur 3 abandonne dès qu'il doit attendre votre réponse pour connaître un prix ou voir une photo.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-6 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-scissors"></i>
                </div>
                <h3 className="font-heading font-black text-base text-gray-900">Commissions abusives</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Les plateformes tierces vous prélèvent entre 15% et 25% sur chaque vente et bloquent vos fonds pendant des jours.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="p-6 rounded-3xl bg-red-50/60 border border-red-200/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-battery-quarter"></i>
                </div>
                <h3 className="font-heading font-black text-base text-gray-900">Épuisement mental</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vous passez vos soirées à recompter vos tickets et vos SMS MoMo à la main au lieu de vous reposer.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── BLOC 3 : LA SOLUTION ─── */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <FadeIn>
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-primary">3. La solution évidente</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                Un système autonome qui prend les commandes et encaisse pour vous.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black">
                  1
                </div>
                <h3 className="font-heading font-black text-base text-white">Vitrine en 1 seconde</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Vos clients ouvrent votre lien sans rien télécharger. Ils voient vos photos HD, vos options et vos prix exacts.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black">
                  2
                </div>
                <h3 className="font-heading font-black text-base text-white">MoMo direct 100% à vous</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Le client règle directement sur votre compte MTN MoMo, Moov ou Celtiis. Aucun pourcentage n'est prélevé.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black">
                  3
                </div>
                <h3 className="font-heading font-black text-base text-white">Commande validée</h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Vous recevez la commande propre avec le paiement validé. Vous n'avez plus qu'à servir ou expédier.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="pt-4 text-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
              >
                <span>Activer mon accès Oresto Pro à -25% (3 750 F)</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── BLOC 4 : LA PREUVE & L'OFFRE ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <FadeIn>
            <div className="space-y-3 text-center">
              <span className="text-xs font-black uppercase tracking-widest text-primary">4. Des chiffres vérifiables</span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 tracking-tight">
                Une offre limpide. Zéro condition cachée.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-8 sm:p-10 rounded-[36px] bg-card border-2 border-primary/40 shadow-xl space-y-6 max-w-xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                Formule Unique Oresto Pro
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-400 line-through text-lg font-bold">5 000 FCFA</span>
                  <span className="font-heading font-black text-4xl sm:text-5xl text-gray-900">3 750 FCFA</span>
                </div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  -25% de réduction immédiate sur votre 1er mois
                </p>
                <p className="text-xs text-gray-500 font-medium">Puis 5 000 FCFA / mois sans engagement</p>
              </div>

              <div className="space-y-2.5 text-xs text-left max-w-sm mx-auto pt-2 border-t border-border">
                {[
                  "Site Web & Vitrine autonome (Site Factory)",
                  "0% de commission sur toutes vos commandes",
                  "Encaissement direct sur votre numéro MoMo",
                  "Catalogue illimité & Fiches multi-photos",
                  "Assistant IA IZI opérationnel en direct",
                  "QR Codes vitrine et tables inclus",
                  "Support prioritaire 7j/7"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 font-bold text-gray-800">
                    <i className="fa-solid fa-circle-check text-emerald-500"></i>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="w-full py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 block"
              >
                <span>Rejoindre Oresto Pro à 3 750 FCFA</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── BLOC 5 : FAQ ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-border px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <FadeIn>
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">5. Questions fréquentes</span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-gray-900 tracking-tight">
                Tout ce que vous devez savoir.
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-5 text-left font-heading font-bold text-sm text-gray-900 flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid fa-chevron-down text-xs text-primary transition-transform ${openFaq === i ? "rotate-180" : ""}`}></i>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-[#0A0A0A] text-white px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeIn>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Reprenez le contrôle de votre commerce dès maintenant.
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto mt-3">
              Arrêtez de perdre des ventes sur WhatsApp. Offrez à vos clients une vitrine moderne et encaissez directement.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-primary text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30"
              >
                <span>Activer mon accès Oresto Pro à -25% (3 750 FCFA)</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <p className="text-[11px] text-gray-500 font-medium mt-3">
              Sans engagement • Prêt en 12 minutes • Encaissements Mobile Money directs
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black text-gray-400 text-xs border-t border-white/10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="font-heading font-black text-white text-sm">Oresto Connect</p>
            <p className="text-[11px] text-gray-500">La solution tout-en-un pour Restaurants, Boutiques et Hôtels en Afrique.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <Link to="/r/latelier-du-chef" className="text-gray-400 hover:text-white transition-colors">🍽️ Démo Restaurant</Link>
            <span>•</span>
            <Link to="/r/kiffstyle-store" className="text-gray-400 hover:text-white transition-colors">🛍️ Démo Boutique</Link>
            <span>•</span>
            <Link to="/r/palmier-royal" className="text-gray-400 hover:text-white transition-colors">🏨 Démo Hôtel</Link>
            <span>•</span>
            <Link to="/devenir-prestataire" className="text-primary font-bold hover:underline flex items-center gap-1">
              <span>🤝 Devenir Apporteur d'Affaires (20%)</span>
            </Link>
          </div>

          <p className="text-[11px] text-gray-600">© {new Date().getFullYear()} Oresto Connect.</p>
        </div>
      </footer>

    </div>
  );
}
