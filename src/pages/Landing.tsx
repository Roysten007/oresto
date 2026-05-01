import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Bot, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Store, 
  UtensilsCrossed, 
  ChevronRight, 
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Layout,
  MessageSquare,
  CreditCard,
  Rocket,
  Search,
  Users
} from "lucide-react";

/* ─── Premium Components ─── */

const FadeIn = ({ children, delay = 0, y = 20 }: { children: React.ReactNode, delay?: number, y?: number }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/60 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[32px] ${className}`}>
    {children}
  </div>
);

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.95]);

  return (
    <div className="min-h-screen w-full bg-white text-foreground selection:bg-primary selection:text-white font-body overflow-x-hidden">
      
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <GlassCard className="px-6 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto <span className="text-primary">Connect</span></span>
          </GlassCard>
          
          <div className="hidden md:flex items-center">
            <GlassCard className="px-8 py-3 flex gap-8 font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <a href="#concept" className="hover:text-primary transition-colors">Le Concept</a>
              <a href="#iza" className="hover:text-primary transition-colors">IZA AI</a>
              <a href="#market" className="hover:text-primary transition-colors">Marché</a>
              <a href="#securite" className="hover:text-primary transition-colors">Sécurité</a>
            </GlassCard>
          </div>

          <GlassCard className="px-4 py-2 flex items-center gap-2">
            <Link to="/login" className="px-5 py-2 rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Connexion</Link>
            <Link to="/register" className="px-6 py-2 bg-black text-white rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Rejoindre</Link>
          </GlassCard>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-48 pb-32 px-6">
        <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-3 p-1.5 pr-5 rounded-full bg-gray-50 border border-gray-100 text-black font-sub text-[10px] font-black uppercase tracking-widest mb-10">
              <span className="px-3 py-1.5 bg-primary text-white rounded-full shadow-sm flex items-center gap-1">
                <Sparkles size={12} /> PaaS v2.0
              </span>
              <span className="opacity-80">Plus qu'un site, une infrastructure de croissance</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="font-heading text-5xl md:text-8xl lg:text-[110px] font-[900] leading-[0.85] tracking-tighter mb-10 uppercase italic">
              Ne créez pas un site.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-primary to-orange-600">Lancez un empire.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-3xl mx-auto mb-16">
            <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed">
              Oresto Connect est la première <strong>Platform as a Service (PaaS)</strong> d'Afrique de l'Ouest qui génère instantanément votre application de vente premium, pilotée par une IA opérationnelle de pointe.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="group w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-full font-sub text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:scale-105 transition-all">
              Démarrer mon restaurant <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-8 py-5 rounded-full bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 size={18} className="text-emerald-500" /> Déploiement en 120 secondes
            </div>
          </FadeIn>
        </motion.div>

        {/* Dynamic Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[140px]" />
        </div>
      </section>

      {/* ─── The 3 Pillars Section ─── */}
      <section id="concept" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-4">Comprendre Oresto Connect</p>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Trois piliers pour votre succès</h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Site Factory", 
                icon: Rocket, 
                desc: "Générez instantanément une application web premium personnalisée à votre image. Pas de code, juste du résultat.",
                color: "bg-blue-500"
              },
              { 
                title: "IZA AI Director", 
                icon: Bot, 
                desc: "Une IA qui ne se contente pas de parler. Elle analyse vos ventes, gère vos clients et pilote votre boutique.",
                color: "bg-primary"
              },
              { 
                title: "Local Ecosystem", 
                icon: Globe, 
                desc: "Intégration native des réalités locales : WhatsApp, Mobile Money, Cash et logistique de proximité.",
                color: "bg-emerald-500"
              }
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full p-10 rounded-[48px] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all group">
                  <div className={`w-16 h-16 ${pillar.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-transform`}>
                    <pillar.icon size={30} />
                  </div>
                  <h3 className="font-heading text-2xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic">"{pillar.desc}"</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IZA AI Feature ─── */}
      <section id="iza" className="py-32 px-6 bg-black text-white relative overflow-hidden rounded-[80px] mx-4 md:mx-10 my-20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
                  <Bot size={14} /> Intelligence Opérationnelle
                </div>
                <h2 className="font-heading text-5xl md:text-8xl font-black leading-[0.9] uppercase tracking-tighter mb-10">
                  Rencontrez <span className="text-primary italic">IZA</span>.<br/>
                  <span className="text-white/30">Votre nouvelle directrice.</span>
                </h2>
                <p className="text-xl text-white/50 mb-12 leading-relaxed max-w-xl">
                  IZA n'est pas un chatbot. C'est une intelligence intégrée qui analyse vos performances en temps réel, optimise votre menu et gère vos clients pendant que vous vous concentrez sur votre cuisine.
                </p>
                
                <div className="space-y-6">
                  {[
                    "Analyse prédictive des stocks et ventes",
                    "Modification du catalogue par commande vocale",
                    "Assistance client automatisée 24/7",
                    "Rapports de performance quotidiens"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-sub font-black uppercase tracking-widest opacity-80">
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                        <CheckCircle2 size={14} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={0.2} className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-orange-600/20 rounded-[80px] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.1),transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                <Bot size={120} className="text-primary animate-pulse" />
                
                {/* Floating UI elements simulation */}
                <div className="absolute top-10 right-10 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 animate-bounce" style={{ animationDuration: "3s" }}>
                  <TrendingUp className="text-primary mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Ventes +24%</p>
                </div>
                <div className="absolute bottom-20 left-10 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 animate-bounce" style={{ animationDuration: "4s" }}>
                  <Users className="text-emerald-500 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Nouveaux Clients: 12</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Local Realities Section ─── */}
      <section id="market" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-10 rounded-[48px] bg-emerald-50 border border-emerald-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <Smartphone size={24} />
                  </div>
                  <h4 className="font-heading font-black text-xl uppercase tracking-tighter">MoMo Native</h4>
                  <p className="text-sm text-emerald-900/60 leading-relaxed">Intégration fluide de Mobile Money (Orange, MTN, Wave).</p>
                </div>
                <div className="p-10 rounded-[48px] bg-blue-50 border border-blue-100 space-y-4 mt-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="font-heading font-black text-xl uppercase tracking-tighter">WhatsApp</h4>
                  <p className="text-sm text-blue-900/60 leading-relaxed">Notifications et gestion des commandes via WhatsApp.</p>
                </div>
                <div className="p-10 rounded-[48px] bg-orange-50 border border-orange-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg">
                    <CreditCard size={24} />
                  </div>
                  <h4 className="font-heading font-black text-xl uppercase tracking-tighter">Cash & Collect</h4>
                  <p className="text-sm text-orange-900/60 leading-relaxed">Gestion flexible du paiement à la livraison et du retrait.</p>
                </div>
                <div className="p-10 rounded-[48px] bg-gray-100 border border-gray-200 space-y-4 mt-8">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg">
                    <Search size={24} />
                  </div>
                  <h4 className="font-heading font-black text-xl uppercase tracking-tighter">SEO Local</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">Soyez trouvé par vos clients de proximité instantanément.</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn className="order-1 lg:order-2 space-y-8">
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary">Le Marché</p>
              <h2 className="font-heading text-4xl md:text-7xl font-[900] leading-tight uppercase tracking-tighter">
                L'infrastructure du commerce <span className="text-muted-foreground">en Afrique de l'Ouest.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                "Nous avons conçu Oresto Connect pour répondre aux réalités du terrain. Pas de barrières technologiques, juste des outils qui fonctionnent là où vous êtes."
              </p>
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200" />
                  ))}
                </div>
                <p className="text-sm font-sub font-black uppercase tracking-widest">+500 commerçants nous font confiance</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Security Section ─── */}
      <section id="securite" className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="p-16 md:p-24 rounded-[64px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 opacity-5">
                  <ShieldCheck size={300} />
               </div>
               <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-black text-white rounded-[24px] flex items-center justify-center mx-auto mb-10 shadow-2xl">
                    <Lock size={32} />
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Vos données, <span className="text-primary italic">votre empire.</span></h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                    Votre business est sacré. Chaque utilisateur d'Oresto Connect bénéficie d'un environnement **Firebase cloisonné** et ultra-sécurisé. Vos conversations avec IZA et vos données clients ne quittent jamais votre espace privé.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-6 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest">Chiffrement AES-256</span>
                    <span className="px-6 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest">Hébergement Firebase</span>
                    <span className="px-6 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest">RGPD Compliant</span>
                  </div>
               </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Future Vision ─── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Demain, nous irons encore plus loin</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">Oresto Connect commence avec la restauration, mais l'infrastructure est prête pour tout type de commerce.</p>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Restaurants", status: "Actuel", icon: UtensilsCrossed, active: true },
              { label: "Boutiques", status: "Bientôt", icon: Store, active: false },
              { label: "Pharmacies", status: "Bientôt", icon: Zap, active: false },
              { label: "Epiceries", status: "Bientôt", icon: Smartphone, active: false }
            ].map((cat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`p-10 rounded-[40px] text-center border transition-all ${cat.active ? 'bg-white border-primary shadow-xl scale-105' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-6 ${cat.active ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <cat.icon size={24} />
                  </div>
                  <h4 className="font-heading font-black text-sm uppercase tracking-widest mb-2">{cat.label}</h4>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${cat.active ? 'text-primary' : 'text-gray-400'}`}>{cat.status}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="pt-32 pb-20 px-6 bg-black text-white rounded-t-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <FadeIn>
              <h2 className="font-heading text-6xl md:text-[140px] font-[900] leading-[0.8] uppercase tracking-tighter mb-16 italic">
                Prêt à dominer<br/>
                <span className="text-primary italic">le digital ?</span>
              </h2>
              <Link to="/register" className="inline-flex items-center gap-5 px-16 py-8 bg-white text-black rounded-full font-sub text-base font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)]">
                Lancer mon App Web <ChevronRight size={24} />
              </Link>
            </FadeIn>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pt-20 border-t border-white/10">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="font-heading text-2xl font-black tracking-tighter uppercase">Oresto</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs italic">
                "La super-app de commerce et de restauration d'Afrique de l'Ouest. Propulsée par l'IA, conçue pour l'excellence."
              </p>
            </div>
            
            <div>
              <h5 className="font-sub text-[10px] font-black uppercase tracking-widest text-white mb-8 opacity-40">Navigation</h5>
              <ul className="space-y-4 text-sm font-sub font-black uppercase tracking-widest">
                <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
                <li><a href="#iza" className="hover:text-primary transition-colors">IZA AI Director</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-sub text-[10px] font-black uppercase tracking-widest text-white mb-8 opacity-40">Plateforme</h5>
              <ul className="space-y-4 text-sm font-sub font-black uppercase tracking-widest">
                <li><a href="#market" className="hover:text-primary transition-colors">Marché Local</a></li>
                <li><a href="#concept" className="hover:text-primary transition-colors">Concept PaaS</a></li>
                <li><a href="#securite" className="hover:text-primary transition-colors">Confidentialité</a></li>
              </ul>
            </div>

            <div className="text-right flex flex-col justify-between items-end">
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer group">
                    <Store size={20} className="group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer group">
                    <Bot size={20} className="group-hover:scale-110 transition-transform" />
                 </div>
              </div>
              <div className="space-y-2 mt-20">
                <p className="font-sub text-[10px] font-black uppercase tracking-[0.3em] text-white/40">© 2026 Oresto Connect</p>
                <p className="text-[10px] font-sub font-black uppercase tracking-widest text-primary italic">Designed for Impact</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
