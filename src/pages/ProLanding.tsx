import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FadeIn = ({ children, delay = 0, y = 20, className = "" }: { children: React.ReactNode, delay?: number, y?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
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
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Auto-cycle through the live flow schema
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setActiveFlowStep((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  // Solutions concrètes aux problèmes du quotidien
  const solutions = [
    {
      id: 0,
      icon: "fa-solid fa-comments",
      painTitle: "Fini le désordre des commandes sur WhatsApp",
      painDesc: "Passer 20 minutes à envoyer des photos floues du menu, dicter les prix au téléphone et noter les commandes sur un bout de papier avec des erreurs d'ingrédients...",
      solutionTitle: "Votre carte interactive claire & instantanée",
      solutionDesc: "Votre client parcourt vos plats ou chambres avec photos et prix exacts, choisit ses options, et valide son panier en 30 secondes. Vous recevez une commande structurée et nette.",
      impact: "Gain de 2 heures par jour & 0 erreur de commande",
      tag: "Organisation & Sérénité"
    },
    {
      id: 1,
      icon: "fa-solid fa-money-bill-transfer",
      painTitle: "Fini les vérifications douteuses de paiements",
      painDesc: "Attendre le SMS de transfert MoMo, demander des captures d'écran par messages séparés, vérifier 10 fois si l'argent est bien arrivé avant de cuisiner...",
      solutionTitle: "Paiement Mobile Money direct & validé dans le chat",
      solutionDesc: "Le client trouve votre numéro MoMo directement dans la discussion de sa commande, effectue son transfert et vous prévient en 1 clic avec preuve. Vous validez d'un geste et la cuisine commence.",
      impact: "Encaissement sécurisé à 100% sans intermédiaire",
      tag: "Paiements Simplifiés"
    },
    {
      id: 2,
      icon: "fa-solid fa-percent",
      painTitle: "Fini les commissions de 25% à 30% qui mangent vos marges",
      painDesc: "Travailler dur du matin au soir pour que des applications intermédiaires prennent jusqu'au tiers du prix de chaque plat que vous préparez...",
      solutionTitle: "100% de vos bénéfices vous reviennent (0% de commission)",
      solutionDesc: "Oresto Connect n'est pas un intermédiaire gourmand, mais votre outil de travail indépendant. L'argent de chaque vente va directement de la poche du client à la vôtre.",
      impact: "Conservez l'intégralité de ce que vous gagnez",
      tag: "Rentabilité Protégée"
    },
    {
      id: 3,
      icon: "fa-solid fa-magnifying-glass-location",
      painTitle: "Fini d'être invisible pour les clients qui cherchent où manger",
      painDesc: "Des dizaines de personnes cherchent chaque jour un restaurant, un maquis ou une auberge dans votre quartier mais ne vous trouvent nulle part sur Internet...",
      solutionTitle: "Votre vitrine visible et référencée sur Google",
      solutionDesc: "Un site web optimisé qui apparaît dans les recherches Google locales, un lien propre à mettre en bio Instagram / TikTok et des QR Codes sur vos tables pour commander sur place.",
      impact: "+40% de nouveaux clients découvrent votre établissement",
      tag: "Visibilité Locale"
    },
    {
      id: 4,
      icon: "fa-solid fa-chart-pie",
      painTitle: "Fini les calculs manuels stressants le soir à la fermeture",
      painDesc: "Devoir refaire les comptes à la main, recompter les tickets pour savoir combien vous avez vendu dans la journée ou ce qui a le mieux marché...",
      solutionTitle: "Un tableau de bord qui compte tout pour vous en temps réel",
      solutionDesc: "Chaque commande validée alimente automatiquement votre chiffre d'affaires du jour et de la semaine. Vous savez exactement ce que vous avez encaissé en un coup d'œil.",
      impact: "Clarté financière totale sans prise de tête",
      tag: "Gestion Simplifiée"
    },
    {
      id: 5,
      icon: "fa-solid fa-hotel",
      painTitle: "Fini les conflits de réservations de chambres",
      painDesc: "Pour les hôtels et auberges : répondre au téléphone à des heures tardives pour confirmer si une chambre est disponible, risquer les doublons...",
      solutionTitle: "Gestion fluide des nuitées et chambres en ligne",
      solutionDesc: "Présentez vos chambres (Standard, Deluxe, Suites), affichez vos tarifs par nuitée et recevez les réservations directement avec coordonnées du client.",
      impact: "Disponibilités claires 24h/24 sans friction",
      tag: "Hôtellerie & Auberges"
    }
  ];

  // Schéma interactif illustré des étapes
  const flowSteps = [
    {
      step: 1,
      title: "Le Client commande sur votre vitrine",
      short: "1. Choix du plat & Panier",
      icon: "fa-solid fa-mobile-screen-button",
      desc: "Le client ouvre votre site ou scanne le QR Code sur sa table. Il choisit son Poulet Braisé & Alloco (3 500 F) et valide son panier en 2 clics.",
      mockupType: "client_order",
      highlight: "Zéro application à installer pour le client"
    },
    {
      step: 2,
      title: "Paiement Mobile Money direct dans le Chat",
      short: "2. MoMo & Preuve dans le chat",
      icon: "fa-solid fa-money-bill-transfer",
      desc: "Dans la discussion de commande, votre numéro MoMo (MTN / Moov) est affiché avec un bouton 'Copier'. Le client transfère et clique sur 'J'ai envoyé le paiement'.",
      mockupType: "chat_payment",
      highlight: "Aucun risque d'erreur de numéro"
    },
    {
      step: 3,
      title: "Le Restaurateur valide d'un seul clic",
      short: "3. Validation en 1 clic",
      icon: "fa-solid fa-circle-check",
      desc: "Vous recevez l'alerte sur votre téléphone, vérifiez la réception et cliquez sur 'Valider réception paiement'. La commande passe immédiatement en cuisine.",
      mockupType: "vendor_validation",
      highlight: "Bulle verte de confirmation automatique"
    },
    {
      step: 4,
      title: "Votre Chiffre d'Affaires s'actualise en direct",
      short: "4. CA & Comptabilité en direct",
      icon: "fa-solid fa-chart-line",
      desc: "Votre tableau de bord intègre automatiquement les 3 500 FCFA dans vos ventes du jour. Tout est tracé, clair et prêt pour la clôture du soir.",
      mockupType: "dashboard_update",
      highlight: "Comptes du soir prêts instantanément"
    }
  ];

  const faqs = [
    { 
      q: "Comment Oresto m'aide concrètement au quotidien ?", 
      a: "Oresto supprime la charge mentale liée à la prise de commande, aux explications répétitives de menus et à la vérification des paiements. Vos clients commandent en autonomie, vous encaissez sans intermédiaire et vous suivez vos ventes en temps réel." 
    },
    { 
      q: "Mes clients doivent-ils télécharger une application ?", 
      a: "Non, absolument pas ! Vos clients cliquent simplement sur votre lien ou scannent le QR Code sur leur table avec leur smartphone. Le site s'ouvre instantanément dans leur navigateur, sans téléchargement ni inscription obligatoire." 
    },
    { 
      q: "Comment se passent les paiements Mobile Money ?", 
      a: "Le paiement se fait directement entre votre client et votre compte Mobile Money (MTN MoMo, Moov Money, Celtiis). Oresto fournit le cadre interactif dans le chat de commande pour que le client voie votre numéro, envoie sa preuve et que vous validiez d'un clic." 
    },
    { 
      q: "Est-ce difficile à configurer si je ne m'y connais pas en informatique ?", 
      a: "C'est conçu spécialement pour être ultra-simple. En 12 minutes, vous renseignez le nom de votre établissement, ajoutez vos plats ou chambres avec leurs prix, et votre site est opérationnel. Aucune connaissance technique requise." 
    },
    { 
      q: "Combien coûte la solution après les 14 jours d'essai gratuit ?", 
      a: "L'essai est 100% gratuit pendant 14 jours sans carte bancaire. Ensuite, le tarif est de seulement 5 000 FCFA / mois (avec 50% de réduction pour votre premier mois, soit 2 500 FCFA). 0% de commission sur vos ventes." 
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white text-foreground selection:bg-primary selection:text-white font-body overflow-x-hidden">
      
      {/* ─── Navigation ─── */}
      <motion.nav 
        style={{ backgroundColor: navBg, borderBottom: `1px solid`, borderBottomColor: navBorder }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
              <i className="fa-solid fa-utensils text-lg"></i>
            </div>
            <span className="font-heading text-2xl font-black tracking-tighter uppercase text-foreground">
              Oresto <span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm">
            <a href="#solutions" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Vos Solutions</a>
            <a href="#schema-anime" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary font-bold">Schéma en Direct</a>
            <a href="#comparatif" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Avant / Après</a>
            <a href="#tarifs" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Tarifs</a>
            <a href="#faq" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Questions</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="px-4 py-2.5 rounded-full font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <i className="fa-solid fa-arrow-right-to-bracket mr-1.5"></i> Connexion
            </Link>
            <Link to="/register?role=vendor" className="px-5 py-2.5 bg-primary text-white rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
              <i className="fa-solid fa-hand-holding-hand"></i> Démarrer sans frais
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden">
        <motion.div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          <FadeIn delay={0.05}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-widest shadow-sm">
              <i className="fa-solid fa-heart-pulse text-sm"></i> Conçu pour faciliter la vie des restaurateurs et hôteliers
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-[900] leading-[0.92] tracking-tighter uppercase text-foreground">
              Moins de stress, <br />
              <span className="text-primary italic">plus de sérénité</span> pour votre restaurant.
            </h1>
          </FadeIn>

          <FadeIn delay={0.25} className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
              Nous apportons des <strong>solutions concrètes aux défis de votre quotidien</strong> : automatisez vos commandes, sécurisez vos encaissements Mobile Money, rendez votre établissement visible sur Google et <strong>conservez 100% de vos bénéfices</strong> sans commission.
            </p>
          </FadeIn>

          <FadeIn delay={0.35} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
            <a 
              href="#schema-anime" 
              className="group w-full sm:w-auto px-9 py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
            >
              <i className="fa-solid fa-play"></i>
              Voir le schéma illustré en direct
              <i className="fa-solid fa-arrow-down group-hover:translate-y-1 transition-transform"></i>
            </a>
            <Link 
              to="/register?role=vendor" 
              className="flex items-center gap-2 px-7 py-5 rounded-full bg-white border border-gray-200 shadow-sm font-sub text-xs font-black uppercase tracking-widest text-foreground hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-clock text-primary"></i> Essai gratuit de 14 jours
            </Link>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={0.4} className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-bold pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              <span>Zéro commission prélevée sur vos ventes</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              <span>Paiement direct Mobile Money (MTN & Moov)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              <span>Accessible sans connaissances informatiques</span>
            </div>
          </FadeIn>
        </motion.div>

        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[140px]" />
        </div>
      </section>

      {/* ─── NOUVEAU SCHÉMA ILLUSTRÉ & DYNAMIQUE : COMMENT ÇA MARCHE EN IMAGES ─── */}
      <section id="schema-anime" className="py-24 px-6 bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white rounded-[48px] mx-4 md:mx-10 my-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <FadeIn className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
              <i className="fa-solid fa-diagram-project"></i> Démonstration Visuelle Interactive
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">
              Comment tout se déroule, <span className="text-primary">étape par étape</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Cliquez sur les étapes ou laissez l'animation vous montrer la simplicité de l'expérience entre votre client et votre cuisine.
            </p>
          </FadeIn>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flowSteps.map((s, idx) => {
              const active = activeFlowStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveFlowStep(idx);
                    setAutoPlay(false);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-2 ${
                    active 
                      ? "bg-white/15 border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      active ? "bg-primary text-white" : "bg-white/10 text-gray-400"
                    }`}>
                      <i className={s.icon}></i>
                    </span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-xs uppercase tracking-tight text-white">{s.short}</h4>
                  </div>
                  {active && (
                    <motion.div 
                      layoutId="activeGlow" 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-primary" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Interactive Illustration Canvas */}
          <div className="p-8 sm:p-12 rounded-[40px] bg-white/5 border border-white/15 backdrop-blur-xl grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Step Explanation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">
                Étape {flowSteps[activeFlowStep].step} sur 4
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white leading-tight">
                {flowSteps[activeFlowStep].title}
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                {flowSteps[activeFlowStep].desc}
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-3 text-xs font-bold text-emerald-400">
                <i className="fa-solid fa-circle-check text-base shrink-0"></i>
                <span>{flowSteps[activeFlowStep].highlight}</span>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setActiveFlowStep((prev) => (prev === 0 ? 3 : prev - 1));
                    setAutoPlay(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <span className="text-xs font-mono text-gray-400">
                  {activeFlowStep + 1} / 4
                </span>
                <button
                  onClick={() => {
                    setActiveFlowStep((prev) => (prev + 1) % 4);
                    setAutoPlay(false);
                  }}
                  className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-white transition-colors shadow-lg shadow-primary/30"
                >
                  <i className="fa-solid fa-chevron-right text-xs"></i>
                </button>
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white ml-auto"
                >
                  {autoPlay ? "⏸ Pause animation" : "▶ Lecture auto"}
                </button>
              </div>
            </div>

            {/* Right: Live Visual Mockup Illustration */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFlowStep}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-md bg-white text-gray-900 rounded-[36px] p-6 sm:p-7 shadow-2xl border-4 border-gray-800 space-y-4"
                >
                  {/* Mockup Top Status Bar */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 text-xs text-gray-500 font-bold">
                    <span className="flex items-center gap-1.5 text-primary">
                      <i className="fa-solid fa-store"></i> Chez Maman (Cotonou)
                    </span>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded-full">
                      12:30 • Live
                    </span>
                  </div>

                  {/* 1. MOCKUP ÉCRAN COMMANDE CLIENT */}
                  {flowSteps[activeFlowStep].mockupType === "client_order" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-sm">
                          🍗
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-heading font-black text-sm text-gray-900">Poulet Braisé & Alloco</h5>
                          <p className="text-[10px] text-gray-500 font-medium">Piment maison + oignons grillés</p>
                        </div>
                        <span className="font-heading font-black text-sm text-primary">3 500 F</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-gray-50 flex justify-between text-xs font-bold text-gray-700">
                        <span>Panier : 1 article</span>
                        <span className="text-primary font-black">Total : 3 500 FCFA</span>
                      </div>

                      <div className="w-full py-3.5 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md">
                        <i className="fa-solid fa-cart-shopping"></i> Valider ma commande
                      </div>
                    </div>
                  )}

                  {/* 2. MOCKUP CHAT PAIEMENT MOMO */}
                  {flowSteps[activeFlowStep].mockupType === "chat_payment" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      {/* Message Resto */}
                      <div className="p-3 rounded-2xl bg-gray-100 text-xs text-gray-800 space-y-1">
                        <p className="font-bold text-[10px] text-primary uppercase tracking-wider">Restaurant Chez Maman :</p>
                        <p>Bonjour ! Pour régler vos 3 500 F, effectuez le transfert MoMo au <strong>97 00 00 00</strong>. Merci !</p>
                      </div>

                      {/* Carte MoMo interactive */}
                      <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-primary block">Numéro MTN MoMo</span>
                          <span className="font-mono font-black text-sm text-gray-900">97 00 00 00</span>
                        </div>
                        <button className="px-3 py-1.5 rounded-xl bg-black text-white text-[10px] font-bold">
                          Copier
                        </button>
                      </div>

                      {/* Action Client */}
                      <div className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md">
                        <i className="fa-solid fa-paper-plane"></i> 💸 J'ai envoyé le paiement
                      </div>
                    </div>
                  )}

                  {/* 3. MOCKUP VALIDATION RESTAURATEUR */}
                  {flowSteps[activeFlowStep].mockupType === "vendor_validation" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Alerte Paiement Reçu</span>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">MoMo 3 500 F</span>
                        </div>
                        <p className="text-xs text-blue-900 font-medium">Le client a déclaré avoir effectué le transfert de 3 500 FCFA.</p>
                      </div>

                      <div className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        <i className="fa-solid fa-circle-check"></i> ✅ Valider & Lancer en cuisine
                      </div>

                      <p className="text-[10px] text-center text-gray-400 font-medium italic">
                        La bulle verte de confirmation est envoyée instantanément au client.
                      </p>
                    </div>
                  )}

                  {/* 4. MOCKUP ACTUALISATION DASHBOARD & CA */}
                  {flowSteps[activeFlowStep].mockupType === "dashboard_update" && (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="p-4 rounded-2xl bg-gray-900 text-white space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chiffre d'Affaires du Jour</span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-2xl font-black text-emerald-400">+3 500 F</span>
                          <span className="text-[10px] text-gray-400">Total : 42 000 FCFA</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <i className="fa-solid fa-utensils text-emerald-600"></i> Commande #084
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-black uppercase">
                          En cuisine 🍽️
                        </span>
                      </div>

                      <p className="text-[10px] text-center text-emerald-700 font-bold">
                        ✓ Vente comptabilisée • 100% encaissé sur votre Mobile Money
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION DÉFIS ➔ SOLUTIONS ─── */}
      <section id="solutions" className="py-24 px-6 bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <FadeIn className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
              <i className="fa-solid fa-hand-holding-medical"></i> Résolution de vos Problèmes Réels
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">
              À chaque difficulté de votre journée, <span className="text-primary">une solution simple</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Nous avons analysé ce qui vous fait perdre du temps, de l'énergie et de l'argent, pour créer les réponses exactes dont votre établissement a besoin.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((item, idx) => (
              <FadeIn key={item.id} delay={idx * 0.08} className="h-full">
                <div className="p-8 rounded-[36px] bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg shadow-sm">
                        <i className={item.icon}></i>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                        {item.tag}
                      </span>
                    </div>

                    {/* Problème */}
                    <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-100 space-y-1">
                      <p className="text-[11px] font-bold text-red-700 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-xmark"></i> Le Problème :
                      </p>
                      <p className="text-xs text-red-900/80 leading-relaxed italic">
                        "{item.painDesc}"
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
                      <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-600"></i> La Solution Oresto :
                      </p>
                      <h4 className="font-heading font-black text-sm text-emerald-950">{item.solutionTitle}</h4>
                      <p className="text-xs text-emerald-900/80 leading-relaxed">
                        {item.solutionDesc}
                      </p>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-black text-primary">
                    <i className="fa-solid fa-arrow-trend-up"></i>
                    <span>{item.impact}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TABLEAU AVANT / APRÈS : TRANSFORMATION DU QUOTIDIEN ─── */}
      <section id="comparatif" className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Transformation Réelle
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">
              Votre quotidien : Sans Oresto vs Avec Oresto
            </h2>
            <p className="text-sm text-muted-foreground">
              Voici concrètement comment votre travail change dès la mise en place d'Oresto Connect.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="overflow-x-auto rounded-[36px] bg-white border border-gray-200 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-gray-500">Votre Situation</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-red-600 bg-red-50/30">
                    <i className="fa-solid fa-circle-xmark mr-1"></i> Sans Oresto (Stress & Pertes)
                  </th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-emerald-700 bg-emerald-50/50">
                    <i className="fa-solid fa-circle-check mr-1"></i> Avec Oresto Connect (Sérénité)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { 
                    situation: "Prise de commande", 
                    before: "Messages WhatsApp brouillons, clients impatients, plats mal notés", 
                    after: "Site interactif clair : le client choisit et valide son panier en autonomie" 
                  },
                  { 
                    situation: "Paiement client", 
                    before: "Numéro MoMo dicté, attente incertaine du SMS de transfert", 
                    after: "Numéro MoMo visible avec copie 1-clic, alerte dans le chat et validation immédiate" 
                  },
                  { 
                    situation: "Commissions sur vos ventes", 
                    before: "20% à 30% prélevés par des applications intermédiaires", 
                    after: "0% de commission : 100% de l'argent va directement sur votre compte" 
                  },
                  { 
                    situation: "Visibilité sur Google", 
                    before: "Invisible lorsqu'un client cherche un restaurant dans votre ville", 
                    after: "Vitrine optimisée SEO Local apparaissant en 1ère page des recherches" 
                  },
                  { 
                    situation: "Fermeture & Comptes du soir", 
                    before: "Calculs manuels sur carnet, erreurs de caisse et fatigue", 
                    after: "Tableau de bord automatique qui calcule votre CA encaissé en direct" 
                  },
                  { 
                    situation: "Assistance & Conseils", 
                    before: "Seul face à vos doutes pour fixer vos prix ou créer des offres", 
                    after: "Assistant IA IZA disponible 24h/24 pour optimiser vos menus et marges" 
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-bold text-foreground">{row.situation}</td>
                    <td className="p-5 text-gray-500 bg-red-50/10">{row.before}</td>
                    <td className="p-5 font-bold text-emerald-800 bg-emerald-50/30 flex items-center gap-2">
                      <i className="fa-solid fa-check text-emerald-600 shrink-0"></i>
                      <span>{row.after}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      {/* ─── TARIFICATION TRANSPARENTE ET ACCESSIBLE ─── */}
      <section id="tarifs" className="py-24 px-6 bg-gradient-to-b from-gray-50 via-white to-orange-50/30 border-y border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
              <i className="fa-solid fa-handshake-simple"></i> Un Partenaire Accessible & Loyal
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Une formule unique à 5 000 FCFA / mois
            </h2>
            <p className="text-sm font-bold text-primary">
              🎉 14 Jours d'Essai Gratuit • 50% de Réduction sur le 1er mois payant (2 500 FCFA) • 0% de Commission
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-black text-white rounded-[40px] border-2 border-primary/50 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                      Formule Tout Inclus Oresto Pro
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                      0% de Commission
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-5xl sm:text-6xl font-black tracking-tighter text-white">5 000</span>
                      <span className="text-sm font-bold text-gray-400">FCFA / mois</span>
                    </div>
                    <p className="text-xs text-primary font-bold mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Premier mois à seulement <strong>2 500 FCFA</strong> (-50% de bienvenue)
                    </p>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    Tout ce qu'il vous faut pour simplifier votre quotidien et développer votre activité, sans aucun frais caché.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs font-semibold text-gray-200">
                    {[
                      "Site Web autonome sur-mesure",
                      "0% de commission sur vos ventes",
                      "Catalogue illimité (Plats & Chambres)",
                      "Commandes directes & WhatsApp",
                      "Paiements Mobile Money dans le chat",
                      "Assistant IA Opérationnel IZA",
                      "Référencement SEO Google Local",
                      "Support d'accompagnement 7j/7",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <i className="fa-solid fa-check text-primary shrink-0 text-xs"></i>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center items-center text-center p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Essayez sans risque
                  </span>
                  <p className="text-xs text-gray-300">
                    14 jours d'essai gratuit. Aucune carte bancaire requise. Vous ne payez que si vous êtes satisfait.
                  </p>
                  <Link 
                    to="/register?role=vendor" 
                    className="w-full py-4 rounded-full bg-primary text-white font-sub text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-rocket"></i> Commencer mon essai gratuit
                  </Link>
                  <p className="text-[10px] text-gray-400">
                    Paiement Mobile Money lors du renouvellement
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Questions Fréquentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Des réponses claires et directes à toutes vos interrogations.
            </p>
          </FadeIn>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:border-primary/40 transition-colors">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-foreground hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-heading">{faq.q}</span>
                    <i className={`fa-solid fa-plus shrink-0 transform transition-transform ${openFaq === i ? "rotate-45 text-primary" : "text-gray-400"}`}></i>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL & FOOTER ─── */}
      <footer className="pt-24 pb-12 px-6 bg-black text-white rounded-t-[48px] mt-12">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <FadeIn>
              <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-[900] leading-tight uppercase tracking-tighter italic">
                Prêt à simplifier la gestion<br />
                <span className="text-primary">de votre établissement ?</span>
              </h2>
              <p className="text-base text-gray-400 max-w-xl mx-auto mt-4">
                Rejoignez les professionnels qui gagnent du temps et gardent 100% de leurs marges avec Oresto Connect.
              </p>
              <div className="pt-8">
                <Link to="/register?role=vendor" className="inline-flex items-center gap-4 px-8 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)]">
                  Créer mon site sans engagement <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10 text-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto Connect</span>
              </div>
              <p className="text-white/50 leading-relaxed max-w-xs">
                La solution digitale créée pour apporter des réponses concrètes aux besoins réels de la restauration et de l'hôtellerie en Afrique.
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <h4 className="font-black uppercase tracking-widest text-white/40 text-[10px]">Espace Membre</h4>
                <ul className="space-y-2 text-gray-300 font-semibold">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Connexion Espace Commerçant</Link></li>
                  <li><Link to="/register?role=vendor" className="hover:text-primary transition-colors">Créer un Compte Gratuit</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-black uppercase tracking-widest text-white/40 text-[10px]">Explorer</h4>
                <ul className="space-y-2 text-gray-300 font-semibold">
                  <li><a href="#solutions" className="hover:text-primary transition-colors">Nos Solutions</a></li>
                  <li><a href="#schema-anime" className="hover:text-primary transition-colors">Schéma Illustré</a></li>
                  <li><a href="#comparatif" className="hover:text-primary transition-colors">Avant / Après</a></li>
                  <li><a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between md:items-end md:text-right space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">© 2026 Oresto Connect • Tous droits réservés</p>
              <p className="text-gray-500 text-[11px]">Développé pour les restaurateurs et hôteliers</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
