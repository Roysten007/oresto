import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Bot, 
  Globe, 
  Zap, 
  Smartphone, 
  Store, 
  ChevronRight, 
  CheckCircle2,
  Lock,
  Rocket,
  MessageSquare,
  CreditCard,
  Target,
  BarChart3,
  Globe2
} from "lucide-react";

/* ─── Shared Components ─── */

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
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto <span className="text-primary">Connect</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm">
            <a href="#concept" className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Concept</a>
            <a href="#iza" className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">IZA AI</a>
            <a href="#market" className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Marché</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login" className="px-5 py-2 rounded-full font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Connexion</Link>
            <Link to="/register" className="px-6 py-2 bg-black text-white rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Essayer</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-48 pb-32 px-6">
        <motion.div style={{ opacity, scale }} className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-black font-sub text-[10px] font-black uppercase tracking-widest mb-10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              L'infrastructure cloud du commerce local
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="font-heading text-5xl md:text-8xl lg:text-9xl font-[900] leading-[0.85] tracking-tighter mb-10 uppercase italic">
              Digitalisez votre <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-primary to-orange-600">Commerce.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-16">
            <p className="text-xl md:text-2xl text-muted-foreground font-body leading-relaxed">
              Oresto Connect est une <strong>Platform as a Service (PaaS)</strong> qui permet aux restaurateurs et commerçants de créer leur application web de vente premium en quelques minutes.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="group w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-full font-sub text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.1)] hover:scale-105 transition-all">
              Créer ma boutique <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-8 py-5 rounded-full bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 size={18} className="text-emerald-500" /> Sans programmation
            </div>
          </FadeIn>
        </motion.div>

        {/* Ambient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* ─── Core Concept ─── */}
      <section id="concept" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Site Factory", 
                icon: Rocket, 
                desc: "Générateur d'application web pour commerçants. Une interface fluide pour vos clients dès le premier clic.",
                color: "bg-blue-500"
              },
              { 
                title: "IZA AI Assistant", 
                icon: Bot, 
                desc: "Intelligence artificielle opérationnelle pour vous aider dans la gestion quotidienne de votre activité.",
                color: "bg-primary"
              },
              { 
                title: "Local Native", 
                icon: Globe, 
                desc: "Pensé pour l'Afrique de l'Ouest avec l'intégration de WhatsApp et des solutions de Mobile Money.",
                color: "bg-emerald-500"
              }
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full p-10 rounded-[48px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg`}>
                    <pillar.icon size={26} />
                  </div>
                  <h3 className="font-heading text-2xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic opacity-80">{pillar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─── */}
      <section className="py-32 px-6 bg-gray-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Comment ça marche ?</h2>
              <p className="text-xl text-muted-foreground mt-4 italic">Trois étapes pour lancer votre présence digitale.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />
            
            {[
              { step: "01", title: "Inscription", desc: "Créez votre compte commerçant en moins de 60 secondes.", icon: Users },
              { step: "02", title: "Configuration", desc: "Configurez votre catalogue et vos modes de paiement avec l'aide d'IZA.", icon: Layout },
              { step: "03", title: "Lancement", desc: "Votre application est prête. Partagez votre lien et commencez à vendre.", icon: Rocket }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.2}>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm relative text-center group hover:border-primary/30 transition-all">
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

      {/* ─── IZA AI Section ─── */}
      <section id="iza" className="py-32 px-6 bg-[#0a0a0a] text-white relative overflow-hidden rounded-[60px] mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
                  <Bot size={14} /> Intelligence Opérationnelle
                </div>
                <h2 className="font-heading text-5xl md:text-7xl font-black leading-[0.95] uppercase tracking-tighter mb-10">
                  Gérez avec <br/>
                  <span className="text-primary italic">L'IA IZA.</span>
                </h2>
                <p className="text-xl text-white/50 mb-12 leading-relaxed max-w-xl">
                  IZA vous aide à analyser vos ventes et à optimiser votre catalogue pour une meilleure gestion de votre commerce.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Aide à la gestion des stocks",
                    "Optimisation du catalogue",
                    "Suivi de l'activité",
                    "Interface intelligente"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 text-xs font-sub font-black uppercase tracking-widest opacity-60">
                      <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                        <CheckCircle2 size={12} />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={0.2} className="relative aspect-square flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-orange-600/5 rounded-[60px] border border-white/5 flex items-center justify-center relative overflow-hidden">
                <Bot size={100} className="text-primary opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,88,12,0.05),transparent_70%)]" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Market/Local Ecosystem ─── */}
      <section id="market" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn className="space-y-8">
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary">Le Marché Local</p>
              <h2 className="font-heading text-4xl md:text-7xl font-[900] leading-[0.9] uppercase tracking-tighter">
                Une solution adaptée au <span className="text-muted-foreground">terrain.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                Oresto Connect est conçu pour fonctionner avec les outils déjà utilisés par vos clients.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <Smartphone className="text-primary" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Mobile Money</span>
                </div>
                <div className="flex items-center gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <MessageSquare className="text-primary" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="grid grid-cols-2 gap-6">
              <div className="p-10 rounded-[48px] bg-emerald-50/50 border border-emerald-100 flex flex-col items-center text-center gap-4">
                <CreditCard className="text-emerald-500" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Paiements</span>
              </div>
              <div className="p-10 rounded-[48px] bg-blue-50/50 border border-blue-100 flex flex-col items-center text-center gap-4 mt-8">
                <Target className="text-blue-500" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Proximité</span>
              </div>
              <div className="p-10 rounded-[48px] bg-orange-50/50 border border-orange-100 flex flex-col items-center text-center gap-4">
                <BarChart3 className="text-orange-500" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Gestion</span>
              </div>
              <div className="p-10 rounded-[48px] bg-gray-50 border border-gray-200 flex flex-col items-center text-center gap-4 mt-8">
                <Globe2 className="text-black" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">PaaS</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="pt-32 pb-16 px-6 bg-black text-white rounded-t-[60px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <FadeIn>
              <h2 className="font-heading text-6xl md:text-9xl font-[900] leading-none uppercase tracking-tighter mb-12 italic">
                Prêt à <br/>
                <span className="text-primary">Démarrer ?</span>
              </h2>
              <Link to="/register" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-sub text-sm font-black uppercase tracking-widest hover:scale-105 transition-all">
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
              <p className="text-white/40 text-xs leading-relaxed max-w-xs italic opacity-60">
                Plateforme de digitalisation pour le commerce et la restauration.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8">
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
                  <li><a href="#concept" className="hover:text-primary transition-colors">Site Factory</a></li>
                  <li><a href="#iza" className="hover:text-primary transition-colors">IZA AI</a></li>
                  <li><a href="#market" className="hover:text-primary transition-colors">Marché</a></li>
                </ul>
              </div>
            </div>

            <div className="text-right space-y-4 flex flex-col justify-end">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 Oresto Connect</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">L'infrastructure de votre croissance</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
