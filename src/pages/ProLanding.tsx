import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Bot, Globe, Zap, Smartphone, ChevronRight,
  CheckCircle2, Lock, Rocket, MessageSquare, CreditCard,
  Target, BarChart3, Globe2, Users, Layout, MessageCircle,
  Shield, FileText, Star, Truck, Utensils, Building, Flame, Home, RefreshCw, Check
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
              Oresto <span className="text-xs text-primary font-bold tracking-widest lowercase">Pro</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
            <a href="#concept" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Concept</a>
            <a href="#iza" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">IZA AI</a>
            <a href="#tarifs" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary font-bold">Tarifs</a>
            <a href="#experience" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Expérience</a>
            <a href="#legal" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">CGU</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              to="/?select=true" 
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-gray-100 hover:bg-gray-200 transition-all"
              title="Revenir au choix de profil"
            >
              <RefreshCw size={11} /> Profil
            </Link>
            <Link to="/login" className="px-3 sm:px-4 py-2 rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Connexion</Link>
            <Link to="/register" className="px-4 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)]">Essayer</Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Pro ─── */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 px-6">
        <motion.div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm mb-8">
              <span className="px-2 py-0.5 rounded-md bg-primary text-white font-black text-[8px] uppercase tracking-widest flex items-center gap-1">
                <Zap size={8} fill="currentColor" /> Nouveau
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">La super-app pour établissements locaux</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-[900] leading-[0.85] tracking-tighter mb-8 uppercase text-foreground">
              <span className="block">Ne créez pas un site.</span>
              <span className="text-primary italic block">Lancez un empire.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-3xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed italic opacity-85">
              Oresto Connect est une infrastructure complète (PaaS) avec messagerie, assistant IA et système de fidélité pour les restaurants, hôtels, maquis et auberges au Bénin.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="group w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.2)] hover:scale-105 transition-all">
              Démarrer mon établissement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 size={16} className="text-emerald-500" /> Prêt en 12 minutes
            </div>
          </FadeIn>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* ─── Bande Profils Établissements ─── */}
      <section className="py-8 bg-gray-50 border-y border-gray-100 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-16">
          {[
            { icon: Utensils, label: "Restaurants" },
            { icon: Building, label: "Hôtels" },
            { icon: Flame, label: "Maquis" },
            { icon: Home, label: "Auberges" },
          ].map((cat, i) => (
            <div key={i} className="flex items-center gap-3 text-foreground font-heading font-black text-sm uppercase tracking-wider opacity-80 hover:opacity-100 hover:text-primary transition-all">
              <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-primary">
                <cat.icon size={18} />
              </div>
              <span>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Core Pillars ─── */}
      <section id="concept" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Ce qu'inclut Oresto Connect</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Une plateforme, tout l'essentiel.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Site Factory", icon: Rocket, desc: "Générez votre application web de vente ou réservation en 12 minutes. Interface premium, catalogue dynamique, zéro code.", color: "bg-blue-500" },
              { title: "IZA AI Director", icon: Bot, desc: "Intelligence artificielle intégrée : analyse des ventes, gestion du catalogue ou chambres, assistance 24h/24.", color: "bg-primary" },
              { title: "Écosystème Local", icon: Globe, desc: "Adapté au Bénin & Afrique de l'Ouest : Mobile Money, WhatsApp, livraison de proximité, paiement cash.", color: "bg-emerald-500" },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className="h-full p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-heading text-xl font-black uppercase tracking-tighter mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic text-xs">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-20 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Comment ça marche ?</h2>
            <p className="text-lg text-muted-foreground mt-4 italic">Trois étapes pour lancer votre présence digitale.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Inscription", desc: "Créez votre compte établissement en moins de 60 secondes.", icon: Users },
              { step: "02", title: "Configuration", desc: "Paramétrez vos plats ou chambres, vos modes de livraison et de paiement avec IZA.", icon: Layout },
              { step: "03", title: "Lancement", desc: "Votre application est en ligne. Partagez votre lien et recevez vos premières réservations.", icon: Rocket },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="bg-white p-8 rounded-[28px] border border-gray-100 shadow-sm text-center group hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <s.icon size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Étape {s.step}</span>
                  <h3 className="font-heading text-lg font-black uppercase tracking-tighter mb-4">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Adapté au terrain ─── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn className="space-y-8">
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary">Marché Local</p>
              <h2 className="font-heading text-3xl md:text-5xl font-[900] leading-[0.9] uppercase tracking-tighter">
                Adapté au <span className="text-muted-foreground">terrain.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                Oresto Connect est conçu pour fonctionner avec les outils que vos clients utilisent déjà au quotidien.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                  <Smartphone className="text-primary flex-shrink-0" size={22} />
                  <span className="text-xs font-black uppercase tracking-widest">Mobile Money</span>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                  <MessageSquare className="text-primary flex-shrink-0" size={22} />
                  <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="h-full">
              <div className="grid grid-cols-2 gap-6 h-full">
                {[
                  { icon: CreditCard, label: "Paiements flexibles", color: "text-emerald-500", bg: "bg-emerald-50/50 border-emerald-100" },
                  { icon: Target, label: "SEO Proximité", color: "text-blue-500", bg: "bg-blue-50/50 border-blue-100" },
                  { icon: BarChart3, label: "Tableau de bord", color: "text-orange-500", bg: "bg-orange-50/50 border-orange-100" },
                  { icon: Globe2, label: "Hébergement Cloud", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
                ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[32px] ${item.bg} border flex flex-col items-center justify-center text-center gap-4 h-full shadow-sm`}>
                    <item.icon className={item.color} size={28} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── IZA AI ─── */}
      <section id="iza" className="py-20 px-6 bg-[#0a0a0a] text-white overflow-hidden rounded-[48px] mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
                <Bot size={14} /> Intelligence Opérationnelle
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-black leading-[0.95] uppercase tracking-tighter mb-10 max-w-[280px] md:max-w-none">
                Gérez avec <br/><span className="text-primary italic">IZA AI.</span>
              </h2>
              <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-xl">
                IZA analyse vos données pour vous suggérer des optimisations, répondre à vos clients automatiquement 24h/24, et simplifier votre gestion quotidienne.
              </p>
              <div className="space-y-4">
                {["Analyse des stocks et des ventes", "Gestion simplifiée du catalogue ou chambres", "Chatbot client 24h/24", "Rapports de performance"].map((f, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-sub font-black uppercase tracking-widest opacity-60">
                    <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary flex-shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="aspect-square flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-orange-600/5 rounded-[48px] border border-white/5 flex items-center justify-center relative overflow-hidden">
                <Bot size={100} className="text-primary opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.05),transparent_70%)]" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Vos clients adorent l'expérience ─── */}
      <section id="experience" className="py-20 px-6 bg-gray-50/30 mt-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Expérience Client</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Vos clients adorent l'expérience.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, title: "Messagerie Directe", desc: "Vos clients échangent directement avec votre établissement via un tchat intégré.", color: "bg-blue-50/60", iconColor: "text-blue-500" },
              { icon: Bot, title: "Chatbot IA 24/7", desc: "IZA répond aux questions des clients à toute heure, automatiquement.", color: "bg-orange-50/60", iconColor: "text-primary" },
              { icon: Star, title: "Points de Fidélité", desc: "Programme de points pour récompenser et fidéliser vos clients à chaque passage.", color: "bg-amber-50/60", iconColor: "text-amber-500" },
              { icon: Truck, title: "Suivi en Temps Réel", desc: "Vos clients suivent leur commande ou réservation étape par étape.", color: "bg-emerald-50/60", iconColor: "text-emerald-500" },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className={`p-6 rounded-[28px] ${f.color} border border-white h-full space-y-4 hover:shadow-lg transition-all`}>
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${f.iconColor} shadow-sm`}>
                    <f.icon size={20} />
                  </div>
                  <h4 className="font-heading font-black text-sm uppercase tracking-tighter">{f.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOUVELLE SECTION ABONNEMENT ─── */}
      <section id="tarifs" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Tarification Claire</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Un abonnement, pas de surprise</h2>
            <p className="text-base text-muted-foreground mt-3 italic max-w-lg mx-auto">
              Choisissez la formule adaptée aux ambitions de votre établissement.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Carte Starter */}
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-white rounded-[36px] border border-gray-200 p-8 sm:p-10 h-full flex flex-col justify-between shadow-sm hover:shadow-xl transition-all">
                <div className="space-y-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600">
                    Formule Starter
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-4xl sm:text-5xl font-black tracking-tighter">3 000</span>
                      <span className="text-sm font-bold text-gray-500">FCFA / mois</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 italic">Idéal pour lancer son établissement sans investissement lourd.</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs font-bold">
                    {[
                      "Site Factory complet (Web app)",
                      "Paiements Mobile Money & Espèces",
                      "Suivi commandes & réservations",
                      "Messagerie client directe",
                      "Commission de 2% par vente",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-gray-100">
                  <Link to="/register" className="block w-full py-4 rounded-full bg-black text-white text-center font-sub text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
                    Choisir Starter
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Carte Pro (Featured) */}
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-black text-white rounded-[36px] border-2 border-primary p-8 sm:p-10 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden transform md:-translate-y-2">
                <div className="absolute top-4 right-6 bg-primary text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  ★ Recommandé
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    Formule Pro
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-4xl sm:text-5xl font-black tracking-tighter text-white">5 000</span>
                      <span className="text-sm font-bold text-gray-400">FCFA / mois</span>
                    </div>
                    <p className="text-xs text-white/60 mt-2 italic">Pour maximiser votre rentabilité et automatiser votre gestion.</p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-bold">
                    {[
                      "Tout le plan Starter inclus",
                      "Assistant IA Opérationnel IZA 24h/24",
                      "0% de commission sur vos ventes",
                      "Programme de fidélité automatique",
                      "Support prioritaire 7j/7",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-white">
                        <Check size={16} className="text-primary flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-white/10 relative z-10">
                  <Link to="/register" className="block w-full py-4 rounded-full bg-primary text-white text-center font-sub text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.4)]">
                    Démarrer avec Pro
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section id="legal" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="p-8 md:p-14 rounded-[32px] bg-white border border-gray-100 shadow-xl text-center">
              <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-8">
                <Lock size={24} />
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-none">
                Confidentialité & <span className="text-primary italic">Sécurité</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 italic">
                Vos données commerciales et celles de vos clients sont stockées dans un espace isolé et sécurisé. Aucune donnée n'est partagée entre établissements.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Données isolées par établissement", "Hébergement Firebase", "Connexion sécurisée"].map((tag, i) => (
                  <span key={i} className="px-5 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Shield size={12} className="text-primary" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="pt-20 pb-16 px-6 bg-black text-white rounded-t-[48px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-7xl font-[900] leading-none uppercase tracking-tighter mb-8 italic">
                Prêt à <br/><span className="text-primary">Démarrer ?</span>
              </h2>
              <Link to="/register" className="inline-flex items-center gap-4 px-8 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-full font-sub text-[10px] sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]">
                Essayer gratuitement <ChevronRight size={18} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-12 border-t border-white/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto Pro</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs italic">
                Plateforme PaaS de digitalisation pour restaurants, hôtels, maquis et auberges au Bénin.
              </p>
            </div>

            <div className="flex flex-wrap gap-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Navigation</h3>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                  <li><Link to="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
                  <li><Link to="/?select=true" className="text-primary hover:underline flex items-center gap-1"><RefreshCw size={11} /> Changer de profil</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Sections</h3>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><a href="#concept" className="hover:text-primary transition-colors">Concept</a></li>
                  <li><a href="#iza" className="hover:text-primary transition-colors">IZA AI</a></li>
                  <li><a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a></li>
                  <li><a href="#experience" className="hover:text-primary transition-colors">Expérience</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-end items-end text-right space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 Oresto</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">L'infrastructure de votre croissance</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
