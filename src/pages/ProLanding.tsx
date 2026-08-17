import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight, 
  Bot, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Rocket, 
  BarChart3, 
  Globe2, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  Globe, 
  Store, 
  Clock, 
  Activity, 
  Users, 
  ShoppingBag, 
  Plus,
  Search,
  TrendingUp,
  CreditCard,
  QrCode,
  DollarSign,
  Award,
  Sparkles,
  Smartphone,
  Layers,
  HeartHandshake
} from "lucide-react";

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

  const isBeforeOct12026 = Date.now() < Date.UTC(2026, 9, 1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Simulateur de Rentabilité / ROI
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(600000);
  const commissionLossWithCompetitors = Math.round(monthlyRevenue * 0.25); // 25% chez les plateformes tierces
  const orestoCost = 5000;
  const netSavedPerMonth = commissionLossWithCompetitors - orestoCost;
  const netSavedPerYear = netSavedPerMonth * 12;

  const faqs = [
    { 
      q: "En quoi Oresto est plus rentable que les plateformes de livraison classiques ?", 
      a: "Les plateformes tierces prélèvent entre 20% et 30% sur CHAQUE commande que vous cuisinez. Avec Oresto Pro, vous payez uniquement un forfait fixe de 5 000 FCFA/mois et conservez 100% de vos marges (0% de commission). L'argent va directement sur votre compte Mobile Money." 
    },
    { 
      q: "Comment le SEO et le référencement Google aident mon restaurant ?", 
      a: "Chaque vitrine Oresto est optimisée pour le SEO local avec microdonnées Schema.org, balises OpenGraph, vitesse de chargement instantanée et géolocalisation. Lorsqu'un client recherche 'restaurant à proximité', 'maquis Cotonou' ou 'meilleur brunch', votre établissement apparaît en tête des résultats Google sans dépenser en publicité." 
    },
    { 
      q: "Comment mes clients paient-ils leurs commandes ?", 
      a: "Tout se déroule directement dans la conversation intégrée sur votre site : votre client choisit ses plats ou chambres, visualise votre numéro MoMo (MTN MoMo, Moov Money, Celtiis), effectue son transfert et vous alerte en 1 clic. Vous validez la réception et l'encaissement est instantanément comptabilisé sur votre tableau de bord." 
    },
    { 
      q: "Combien de temps faut-il pour créer et lancer mon site web ?", 
      a: "Moins de 12 minutes chrono ! Le Site Factory Oresto génère automatiquement votre vitrine professionnelle. Vous n'avez qu'à ajouter vos plats ou chambres avec leurs prix, personnaliser vos couleurs et votre logo, et votre site est immédiatement prêt à recevoir des commandes." 
    },
    { 
      q: "Que se passe-t-il après la date d'échéance de l'abonnement ?", 
      a: "Nous vous envoyons des notifications de rappel dès J-7. À l'échéance, vous disposez d'un délai de grâce de 3 jours pendant lequel votre site reste actif. Si aucun règlement n'est effectué à J+3, l'espace se met en pause et se réactive instantanément dès votre paiement Mobile Money de 5 000 F (ou 2 500 F pour votre premier mois)." 
    },
    { 
      q: "Est-ce adapté aux hôtels, auberges et traiteurs ?", 
      a: "Oui, à 100% ! Oresto gère parfaitement les réservations de nuitées de chambres, suites, tables de restaurant, commandes à emporter et prestations traiteur." 
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
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase text-foreground">
              Oresto <span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-border shadow-sm">
            <a href="#roi" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Rentabilité</a>
            <a href="#avantages" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Les 4 Piliers</a>
            <a href="#seo" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">SEO & Google</a>
            <a href="#flow" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Fonctionnement</a>
            <a href="#tarifs" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary font-bold">Tarifs</a>
            <a href="#faq" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="px-3 sm:px-4 py-2 rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              Connexion
            </Link>
            <Link to="/register?role=vendor" className="px-4 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
              Lancer ma boutique
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden">
        <motion.div className="max-w-5xl mx-auto text-center relative z-10">
          
          {isBeforeOct12026 && (
            <FadeIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
                <Sparkles size={15} /> Offre de Lancement National : 100% Gratuit jusqu'au 1er Octobre 2026
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.15}>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-[900] leading-[0.92] tracking-tighter mb-8 uppercase text-foreground">
              Développez vos ventes, <br />
              <span className="text-primary italic">gagnez du temps</span> et maîtrisez 100% de vos marges.
            </h1>
          </FadeIn>

          <FadeIn delay={0.25} className="max-w-3xl mx-auto mb-10">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
              La plateforme SaaS tout-en-un pour <strong>restaurants, maquis, hôtels, auberges et traiteurs</strong>. Votre propre site web haute performance, prise de commande directe, paiements Mobile Money tracés en temps réel et <strong>0% de commission</strong>.
            </p>
          </FadeIn>

          <FadeIn delay={0.35} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
            <Link 
              to="/register?role=vendor" 
              className="group w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.25)] hover:scale-105 transition-all"
            >
              Créer mon site en 12 minutes <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#roi" 
              className="flex items-center gap-3 px-6 py-4 rounded-full bg-white border border-gray-200 shadow-sm font-sub text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-gray-50 transition-colors"
            >
              Calculer mes gains financiers ↓
            </a>
          </FadeIn>

          {/* Social Proof Badges */}
          <FadeIn delay={0.4} className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>0% de commission sur vos ventes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Site optimisé Google SEO Local</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Mobile Money MTN & Moov direct</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>Assistant IA IZA 24h/24</span>
            </div>
          </FadeIn>
        </motion.div>

        {/* Ambient background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[140px]" />
        </div>
      </section>

      {/* ─── SIMULATEUR DE RENTABILITÉ / ROI (Business Impact) ─── */}
      <section id="roi" className="py-20 px-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white rounded-[48px] mx-4 md:mx-10 my-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          <FadeIn className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Rentabilité Immédiate & Zéro Commission
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">
              Combien d'argent perdez-vous <span className="text-primary">avec les commissions ?</span>
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              Les plateformes tierces prélèvent en moyenne 25% de votre chiffre d'affaires. Avec Oresto, tout votre chiffre reste dans votre poche pour seulement 5 000 FCFA/mois.
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="p-8 sm:p-12 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-md grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-6">
              <label className="text-xs font-black uppercase tracking-wider text-gray-300 block">
                Votre Chiffre d'Affaires Mensuel Estimé :
              </label>
              
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-primary">
                    {monthlyRevenue.toLocaleString()} FCFA
                  </span>
                  <span className="text-xs text-gray-400">par mois</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="5000000"
                  step="100000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>200 000 F</span>
                  <span>2 500 000 F</span>
                  <span>5 000 000 F</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span>Commission perdue ailleurs (25%) :</span>
                  <span className="text-red-400 font-bold">-{commissionLossWithCompetitors.toLocaleString()} F/mois</span>
                </div>
                <div className="flex justify-between">
                  <span>Forfait Oresto Pro (0% commission) :</span>
                  <span className="text-emerald-400 font-bold">5 000 F/mois</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col justify-center items-center text-center p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-orange-500/10 border-2 border-primary/40 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                Votre Bénéfice Net Économisé
              </span>
              <p className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight">
                +{netSavedPerMonth.toLocaleString()} <span className="text-lg font-bold">FCFA / mois</span>
              </p>
              <p className="text-xs font-bold text-emerald-400">
                Soit +{netSavedPerYear.toLocaleString()} FCFA préservés chaque année !
              </p>
              <Link
                to="/register?role=vendor"
                className="w-full py-4 rounded-2xl bg-primary text-white font-sub text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/30"
              >
                Garder 100% de mes revenus
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── LES 4 PILIERS DE CROISSANCE ─── */}
      <section id="avantages" className="py-24 px-6 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-7xl mx-auto space-y-16">
          <FadeIn className="text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">
              L'Accélérateur de votre Établissement
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Les 4 Piliers pour Faire Évoluer votre Activité
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Une solution conçue pour résoudre les vrais défis des restaurateurs et hôteliers au quotidien.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "1. Gagner un Temps Précieux",
                desc: "Fini les heures passées à dicter les menus et gérer les messages désordonnés sur WhatsApp. Votre vitrine prend les commandes avec précision 24h/24 sans aucune erreur de saisie.",
                badge: "Gain de 15h/semaine",
                color: "bg-blue-500/10 text-blue-600 border-blue-200"
              },
              {
                icon: Users,
                title: "2. Attirer Plus de Clients",
                desc: "Partagez votre lien personnalisé sur Instagram, TikTok, Facebook et statuts WhatsApp. Placez des QR Codes sur vos tables pour que les clients commandent instantanément depuis leur smartphone.",
                badge: "+40% de commandes",
                color: "bg-orange-500/10 text-orange-600 border-orange-200"
              },
              {
                icon: BarChart3,
                title: "3. Contrôle & Gestion Totale",
                desc: "Suivez votre Chiffre d'Affaires en temps réel, gérez vos stocks, vos plats et vos chambres en un clic. Encaissez via Mobile Money en direct sans intermédiaire bancaire complexe.",
                badge: "Vision 360° en direct",
                color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
              },
              {
                icon: Search,
                title: "4. Visibilité SEO Google",
                desc: "Votre site est indexé et optimisé pour le référencement naturel local. Lorsqu'un client cherche où manger ou loger dans votre ville, votre restaurant apparaît en 1ère position.",
                badge: "Trafic organique gratuit",
                color: "bg-purple-500/10 text-purple-600 border-purple-200"
              },
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className="p-8 rounded-[36px] bg-white border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-primary shadow-sm">
                      <pillar.icon size={26} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${pillar.color} inline-block`}>
                      {pillar.badge}
                    </span>
                    <h3 className="font-heading text-xl font-black uppercase tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center text-primary text-[10px] font-black uppercase tracking-wider gap-1">
                    <span>Inclus dans Oresto Pro</span> <ChevronRight size={12} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOCUS SEO & RÉFÉRENCEMENT GOOGLE ─── */}
      <section id="seo" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <FadeIn className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black uppercase tracking-widest">
              <Search size={14} /> Référencement Google Local & Grande Envergure
            </div>

            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
              Soyez le premier restaurant trouvé <span className="text-primary">sur Google</span>
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              93% des expériences en ligne commencent par un moteur de recherche. Sans site web structuré, vos concurrents captent vos clients potentiels. Avec Oresto, chaque restaurant bénéficie automatiquement :
            </p>

            <div className="space-y-3 pt-2">
              {[
                { title: "Balisage Schema.org / Restaurant Schema", desc: "Google reconnaît vos horaires, menus, plats et tarifs pour les afficher directement dans les résultats enrichis." },
                { title: "Vitesse de Chargement Ultra-Rapide (Mobile-First)", desc: "Des pages optimisées qui se chargent en moins de 0.8 seconde, favorisées par l'algorithme Google." },
                { title: "Indexation Instantanée & Partage Réseaux Sociaux", desc: "Aperçus soignés avec photos et descriptions lors du partage de votre lien sur WhatsApp et Facebook." },
                { title: "Mots-Clés Géolocalisés Automatiques", desc: "Positionnement optimal sur 'restaurant à [votre ville]', 'meilleur maquis', 'auberge', 'livraison repas'." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="lg:col-span-6">
            <div className="p-8 rounded-[40px] bg-gray-900 text-white border-2 border-border shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] font-mono text-gray-400">google.com/search?q=restaurant+cotonou</span>
              </div>

              {/* Fake Google Result Preview */}
              <div className="p-5 rounded-2xl bg-white text-gray-900 space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-bold text-emerald-700">oresto.app/r/votre-restaurant</span>
                  <span>›</span>
                  <span>Menu & Commande</span>
                </div>
                <h4 className="font-heading text-lg font-black text-blue-800 hover:underline cursor-pointer">
                  Chez Maman — Restaurant & Spécialités Africaines | Commande en Ligne
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Découvrez la carte complète de Chez Maman : Alloco, Tchigan, Poulet Bicyclette. Commandez en direct sans commission, paiement Mobile Money MTN & Moov. Livraison rapide.
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 pt-1">
                  <span>⭐⭐⭐⭐⭐ 4.9 (128 avis)</span>
                  <span>• Ouvert jusqu'à 23h00</span>
                  <span>• 0% Commission</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" /> Position Google garantie
                </span>
                <span className="text-emerald-400 font-bold">Inclus sans surcoût</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TABLEAU COMPARATIF : SANS ORESTO vs AVEC ORESTO ─── */}
      <section className="py-24 px-6 bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Comparatif Objectif
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">
              Pourquoi Oresto change totalement la donne
            </h2>
          </FadeIn>

          <FadeIn delay={0.1} className="overflow-x-auto rounded-[36px] bg-white border border-gray-200 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-gray-500">Fonctionnalité</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-red-500">Sans Oresto (Traditionnel)</th>
                  <th className="p-5 font-black uppercase text-[10px] tracking-widest text-emerald-600 bg-emerald-50/50">Avec Oresto Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "Commission sur les commandes", before: "20% à 30% prélevés sur vos plats", after: "0% — 100% des revenus pour vous" },
                  { label: "Prise de commande", before: "Messages WhatsApp désordonnés et erreurs", after: "Site pro avec panier, adresses et notes" },
                  { label: "Encaissement", before: "Numéro dicté à la main, vérifications floues", after: "Chat interactif MoMo avec preuve & validation 1-clic" },
                  { label: "Présence Google / SEO", before: "Invisible lors des recherches locales", after: "Vitrine optimisée SEO Local en 1ère page" },
                  { label: "Tableau de Bord & Suivi CA", before: "Carnet papier ou calculs manuels", after: "Dashboard en temps réel avec statistiques de vente" },
                  { label: "Intelligence Artificielle", before: "Aucune assistance", after: "Assistant IZA 24h/24 pour booster vos marges" },
                  { label: "Tarif", before: "Plusieurs centaines de milliers de F en commissions", after: "5 000 FCFA/mois tout compris (2 500 F 1er mois)" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-bold text-foreground">{row.label}</td>
                    <td className="p-5 text-gray-500">{row.before}</td>
                    <td className="p-5 font-bold text-emerald-700 bg-emerald-50/30 flex items-center gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0" />
                      <span>{row.after}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section id="flow" className="py-20 px-6 bg-black text-white rounded-[48px] mx-4 md:mx-10 my-10 shadow-2xl">
        <div className="max-w-5xl mx-auto space-y-16">
          <FadeIn className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Flux 100% Automatisé
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              De la commande au paiement en 5 étapes fluides
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Le client choisit", desc: "Il visite votre vitrine en ligne, consulte vos plats ou chambres et valide son panier." },
              { step: "2", title: "Alerte instantanée", desc: "La commande arrive en direct sur votre Dashboard et ouvre le chat de commande." },
              { step: "3", title: "Coordonnées MoMo", desc: "Un clic pour envoyer vos instructions de transfert MTN MoMo ou Moov Money." },
              { step: "4", title: "Le client transfère", desc: "Il effectue son paiement et clique sur 'J'ai envoyé le paiement' avec preuve." },
              { step: "5", title: "Validation & CA", desc: "Vous validez en 1 clic : la commande passe en cuisine et votre CA s'actualise." },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-base shadow-lg shadow-primary/30">
                  {s.step}
                </div>
                <h3 className="font-heading text-base font-bold uppercase tracking-tight text-white">{s.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{s.desc}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
              🔒 <span className="text-white">Oresto n'est jamais intermédiaire financier. Vous recevez 100% de l'argent de vos clients directement sur votre propre numéro Mobile Money.</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── IZA AI ASSISTANT ─── */}
      <section id="iza" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
              <Bot size={14} /> Intelligence Opérationnelle Intégrée
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
              IZA : Votre Directrice Commerciale Virtuelle 24h/24
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Propulsée par les modèles d'intelligence artificielle les plus avancés, IZA vous conseille au quotidien pour maximiser la rentabilité de votre établissement :
            </p>
            <div className="space-y-3 pt-2">
              {[
                "Rédige des descriptions de plats captivantes et vendeuses pour votre carte.",
                "Calcule vos marges brutes et suggère les prix optimaux selon vos coûts.",
                "Crée des offres promotionnelles adaptées aux heures creuses pour lisser votre chiffre.",
                "Analyse vos statistiques de vente hebdomadaires et vous donne des recommandations concrètes."
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-semibold text-foreground">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="p-8 rounded-[40px] bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-2 border-border shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">IZA Assistant Pro</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">● En ligne & prêt à vous aider</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/10 text-gray-200 max-w-[85%]">
                "Comment puis-je augmenter mon panier moyen pour le déjeuner du jeudi ?"
              </div>
              <div className="p-3.5 rounded-2xl bg-primary/20 border border-primary/30 text-white max-w-[90%] ml-auto space-y-1.5">
                <p className="font-bold text-primary">💡 Recommandation IZA :</p>
                <p className="text-[11px] leading-relaxed">
                  Créez une formule 'Menu Express' à 3 500 F combinant votre plat le plus rapide (Riz Sénégalais) avec une boisson fraîche maison. Cela augmentera votre marge de 22% tout en réduisant le temps d'attente à midi !
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TARIFS TRANSPARENTS ─── */}
      <section id="tarifs" className="py-24 px-6 bg-gradient-to-b from-gray-50 via-white to-orange-50/30 border-y border-gray-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
              ✨ Une Offre Unique & Transparente
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Tout Oresto Pro pour seulement 5 000 FCFA/mois
            </h2>
            <p className="text-sm font-bold text-primary">
              🎉 100% Gratuit jusqu'au 1er Octobre 2026 • 50% de Réduction sur le 1er mois payant (2 500 FCFA)
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-black text-white rounded-[40px] border-2 border-primary/50 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">
                      Formule Complète Oresto Pro
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
                    Digitalisez votre établissement avec toutes les fonctionnalités incluses, sans frais cachés ni commission sur vos commandes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs font-semibold text-gray-200">
                    {[
                      "Site Web autonome sur-mesure",
                      "0% de commission sur vos ventes",
                      "Catalogue illimité (Plats & Chambres)",
                      "Commandes directes & WhatsApp",
                      "Paiements Mobile Money intégrés",
                      "Assistant IA Opérationnel IZA",
                      "SEO Google Local Optimisé",
                      "Support prioritaire 7j/7",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <Check size={14} className="text-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center items-center text-center p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Commencez sans carte bancaire
                  </span>
                  <p className="text-xs text-gray-300">
                    Testez gratuitement jusqu'au 1er octobre 2026. Créez votre vitrine en quelques minutes.
                  </p>
                  <Link 
                    to="/register?role=vendor" 
                    className="w-full py-4 rounded-full bg-primary text-white font-sub text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.4)]"
                  >
                    Créer ma boutique maintenant
                  </Link>
                  <p className="text-[10px] text-gray-400">
                    Paiement Mobile Money uniquement lors du renouvellement
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ COMMERCIALE ─── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Questions Fréquentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Tout ce que vous devez savoir pour développer sereinement votre activité avec Oresto.
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
                    <Plus size={20} className={`shrink-0 transform transition-transform ${openFaq === i ? "rotate-45 text-primary" : "text-gray-400"}`} />
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
                Passez à la vitesse supérieure.<br />
                <span className="text-primary">Votre restaurant le mérite.</span>
              </h2>
              <p className="text-base text-gray-400 max-w-xl mx-auto mt-4">
                Rejoignez la nouvelle génération d'établissements autonomes, rentables et visibles sur Google.
              </p>
              <div className="pt-8">
                <Link to="/register?role=vendor" className="inline-flex items-center gap-4 px-8 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)]">
                  Lancer mon site gratuitement <ChevronRight size={18} />
                </Link>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10 text-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto Connect</span>
              </div>
              <p className="text-white/50 leading-relaxed max-w-xs">
                La plateforme SaaS de référence pour la création de sites web et la gestion des commandes pour la restauration et l'hôtellerie en Afrique.
              </p>
            </div>

            <div className="flex flex-wrap gap-12">
              <div className="space-y-3">
                <h4 className="font-black uppercase tracking-widest text-white/40 text-[10px]">Navigation</h4>
                <ul className="space-y-2 text-gray-300 font-semibold">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Connexion Espace Vendeur</Link></li>
                  <li><Link to="/register?role=vendor" className="hover:text-primary transition-colors">Créer un Compte</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-black uppercase tracking-widest text-white/40 text-[10px]">Plateforme</h4>
                <ul className="space-y-2 text-gray-300 font-semibold">
                  <li><a href="#roi" className="hover:text-primary transition-colors">Calculateur de Gains</a></li>
                  <li><a href="#avantages" className="hover:text-primary transition-colors">Les 4 Piliers</a></li>
                  <li><a href="#seo" className="hover:text-primary transition-colors">Référencement SEO</a></li>
                  <li><a href="#tarifs" className="hover:text-primary transition-colors">Tarifs & Offres</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between md:items-end md:text-right space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">© 2026 Oresto Connect • Tous droits réservés</p>
              <p className="text-gray-500 text-[11px]">Conçu avec passion pour la gastronomie & l'hospitalité</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
