import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Bot, Globe, Zap, Smartphone, ChevronRight,
  CheckCircle2, Lock, Rocket, MessageSquare, CreditCard,
  Target, BarChart3, Globe2, Users, Layout, MessageCircle,
  Shield, FileText, Star, Truck
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

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.98]);

  return (
    <div className="min-h-screen w-full bg-white text-foreground selection:bg-primary selection:text-white font-body overflow-x-hidden">

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase">
              Oresto <span className="text-primary">Connect</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
            <a href="#concept" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Concept</a>
            <a href="#experience" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Expérience</a>
            <a href="#iza" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">IZA AI</a>
            <a href="#market" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Marché</a>
            <a href="#legal" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">CGU</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login" className="px-5 py-2 rounded-full font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Connexion</Link>
            <Link to="/register" className="px-6 py-2.5 bg-black text-white rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Essayer</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-44 pb-28 px-6">
        <motion.div style={{ opacity, scale }} className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-black font-sub text-[10px] font-black uppercase tracking-widest mb-10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              L'infrastructure complète du commerce local
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-heading text-5xl md:text-8xl lg:text-9xl font-[900] leading-[0.85] tracking-tighter mb-10 uppercase italic">
              Vendez plus.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-primary to-orange-600">Fidélisez mieux.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-16">
            <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed">
              Oresto Connect est une <strong>Platform as a Service (PaaS)</strong> : une application de vente, un système de messagerie intégré, un chatbot IA, des points de fidélité, et bien plus — le tout en quelques minutes.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="group w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-full font-sub text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.15)] hover:scale-105 transition-all">
              Créer ma boutique <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-8 py-5 rounded-full bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 size={18} className="text-emerald-500" /> Sans programmation
            </div>
          </FadeIn>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* ─── Core Pillars ─── */}
      <section id="concept" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Ce qu'inclut Oresto Connect</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Une plateforme, tout l'essentiel.</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Site Factory", icon: Rocket, desc: "Générez votre application web de vente en quelques minutes. Interface premium, catalogue dynamique, zéro code.", color: "bg-blue-500" },
              { title: "IZA AI Director", icon: Bot, desc: "Intelligence artificielle intégrée : analyse des ventes, gestion du catalogue, assistance à la décision en temps réel.", color: "bg-primary" },
              { title: "Écosystème Local", icon: Globe, desc: "Adapté à l'Afrique de l'Ouest : Mobile Money, WhatsApp, livraison de proximité, paiement cash.", color: "bg-emerald-500" },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full p-10 rounded-[48px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg`}>
                    <p.icon size={26} />
                  </div>
                  <h3 className="font-heading text-2xl font-black uppercase tracking-tighter mb-4">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic text-sm">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Client Experience Section ─── */}
      <section id="experience" className="py-28 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Expérience Client</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Vos clients adorent l'expérience.</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto italic">
              Oresto Connect ne se limite pas aux commerçants. L'application client est pensée pour être fluide, engageante et fidélisante.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageCircle, title: "Messagerie Restaurant–Client", desc: "Vos clients peuvent échanger directement avec le restaurant via un chat intégré à la commande.", color: "bg-blue-50", iconColor: "text-blue-500" },
              { icon: Bot, title: "Chatbot IA", desc: "IZA répond aux questions fréquentes des clients 24h/24, automatiquement et avec précision.", color: "bg-orange-50", iconColor: "text-primary" },
              { icon: Star, title: "Points de Fidélité", desc: "1 point par 100 FCFA dépensés + 5 points bonus avec la livraison. Récompenses automatiques.", color: "bg-amber-50", iconColor: "text-amber-500" },
              { icon: Truck, title: "Suivi en Temps Réel", desc: "Vos clients suivent leur commande étape par étape, de la préparation à la livraison.", color: "bg-emerald-50", iconColor: "text-emerald-500" },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`p-8 rounded-[40px] ${f.color} border border-white h-full space-y-4 hover:shadow-lg transition-all`}>
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${f.iconColor} shadow-sm`}>
                    <f.icon size={24} />
                  </div>
                  <h4 className="font-heading font-black text-base uppercase tracking-tighter">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Comment ça marche ?</h2>
            <p className="text-xl text-muted-foreground mt-4 italic">Trois étapes pour lancer votre présence digitale.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Inscription", desc: "Créez votre compte commerçant en moins de 60 secondes.", icon: Users },
              { step: "02", title: "Configuration", desc: "Paramétrez votre catalogue, vos modes de livraison et de paiement avec l'aide d'IZA.", icon: Layout },
              { step: "03", title: "Lancement", desc: "Votre application est live. Partagez votre lien et commencez à recevoir des commandes.", icon: Rocket },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm text-center group hover:border-primary/30 transition-all">
                  <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <s.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Étape {s.step}</span>
                  <h4 className="font-heading text-xl font-black uppercase tracking-tighter mb-4">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic opacity-80">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IZA AI ─── */}
      <section id="iza" className="py-28 px-6 bg-[#0a0a0a] text-white overflow-hidden rounded-[60px] mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
                <Bot size={14} /> Intelligence Opérationnelle
              </div>
              <h2 className="font-heading text-5xl md:text-7xl font-black leading-[0.95] uppercase tracking-tighter mb-10">
                Gérez avec <br/><span className="text-primary italic">IZA AI.</span>
              </h2>
              <p className="text-xl text-white/50 mb-10 leading-relaxed max-w-xl">
                IZA analyse vos données pour vous suggérer des optimisations de menu, répondre à vos clients automatiquement, et vous aider dans les tâches administratives quotidiennes.
              </p>
              <div className="space-y-4">
                {["Analyse des stocks et des ventes", "Gestion du catalogue simplifiée", "Chatbot client 24h/24", "Rapports de performance"].map((f, i) => (
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
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-orange-600/5 rounded-[60px] border border-white/5 flex items-center justify-center relative overflow-hidden">
                <Bot size={100} className="text-primary opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.05),transparent_70%)]" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Market / Local ─── */}
      <section id="market" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn className="space-y-8">
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary">Marché Local</p>
              <h2 className="font-heading text-4xl md:text-7xl font-[900] leading-[0.9] uppercase tracking-tighter">
                Adapté au <span className="text-muted-foreground">terrain.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                Oresto Connect est conçu pour fonctionner avec les outils que vos clients utilisent déjà au quotidien en Afrique de l'Ouest.
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
            <FadeIn delay={0.2} className="grid grid-cols-2 gap-6">
              {[
                { icon: CreditCard, label: "Paiements flexibles", color: "text-emerald-500", bg: "bg-emerald-50/50 border-emerald-100" },
                { icon: Target, label: "SEO Proximité", color: "text-blue-500", bg: "bg-blue-50/50 border-blue-100", offset: true },
                { icon: BarChart3, label: "Tableau de bord", color: "text-orange-500", bg: "bg-orange-50/50 border-orange-100" },
                { icon: Globe2, label: "Hébergement Cloud", color: "text-gray-700", bg: "bg-gray-50 border-gray-200", offset: true },
              ].map((item, i) => (
                <div key={i} className={`p-10 rounded-[48px] ${item.bg} border flex flex-col items-center text-center gap-4 ${item.offset ? "mt-8" : ""}`}>
                  <item.icon className={item.color} size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Security ─── */}
      <section className="py-28 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="p-12 md:p-20 rounded-[56px] bg-white border border-gray-100 shadow-xl text-center">
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Lock size={28} />
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                Confidentialité & <span className="text-primary italic">Sécurité</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10 italic">
                Vos données commerciales et celles de vos clients sont stockées dans un espace isolé et sécurisé. Aucune donnée n'est partagée entre commerçants.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Données isolées par commerçant", "Hébergement Firebase", "Connexion sécurisée"].map((tag, i) => (
                  <span key={i} className="px-5 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Shield size={12} className="text-primary" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CGU Summary ─── */}
      <section id="legal" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Conditions d'utilisation</p>
            <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Transparence & <span className="text-primary italic">Confiance</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: "Accès & Compte", desc: "L'inscription est gratuite. Chaque commerçant dispose d'un espace personnel et sécurisé. Toute utilisation abusive entraîne la suspension du compte." },
              { icon: Shield, title: "Données personnelles", desc: "Vos données et celles de vos clients ne sont jamais revendues. Elles sont utilisées uniquement pour faire fonctionner la plateforme." },
              { icon: MessageCircle, title: "Messagerie & Chat", desc: "Les échanges via la messagerie intégrée sont privés. Oresto Connect ne lit pas le contenu de vos conversations." },
              { icon: Star, title: "Points de Fidélité", desc: "Les points sont crédités automatiquement après chaque commande validée. Ils ne sont pas convertibles en argent, uniquement en avantages sur la plateforme." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <h4 className="font-heading font-black text-lg uppercase tracking-tighter">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3} className="text-center mt-10">
            <p className="text-xs text-muted-foreground italic opacity-60">
              En utilisant Oresto Connect, vous acceptez l'ensemble de ces conditions. Pour toute question, contactez-nous via le Centre d'aide.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="pt-28 pb-16 px-6 bg-black text-white rounded-t-[60px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="font-heading text-6xl md:text-9xl font-[900] leading-none uppercase tracking-tighter mb-12 italic">
                Prêt à <br/><span className="text-primary">Démarrer ?</span>
              </h2>
              <Link to="/register" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-sub text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]">
                Essayer gratuitement <ChevronRight size={20} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-16 border-t border-white/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs italic">
                Plateforme PaaS de digitalisation pour le commerce et la restauration en Afrique de l'Ouest.
              </p>
            </div>

            <div className="flex flex-wrap gap-10">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Navigation</h5>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                  <li><Link to="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Sections</h5>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><a href="#concept" className="hover:text-primary transition-colors">Concept</a></li>
                  <li><a href="#experience" className="hover:text-primary transition-colors">Expérience Client</a></li>
                  <li><a href="#iza" className="hover:text-primary transition-colors">IZA AI</a></li>
                  <li><a href="#legal" className="hover:text-primary transition-colors">CGU</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-end items-end text-right space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 Oresto Connect</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">L'infrastructure de votre croissance</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
