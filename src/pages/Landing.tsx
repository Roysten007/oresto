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
  Users,
  MousePointer2,
  Cpu
} from "lucide-react";

/* ─── Shared Styles & Components ─── */

const FadeIn = ({ children, delay = 0, y = 20, direction = "up" }: any) => {
  const initialY = direction === "up" ? y : direction === "down" ? -y : 0;
  const initialX = direction === "left" ? y : direction === "right" ? -y : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: initialY, x: initialX }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const BentoCard = ({ children, className = "", delay = 0 }: any) => (
  <FadeIn delay={delay}>
    <div className={`relative overflow-hidden rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 group ${className}`}>
      {children}
    </div>
  </FadeIn>
);

const Highlight = ({ children, className = "" }: any) => (
  <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 font-black italic ${className}`}>
    {children}
  </span>
);

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-primary selection:text-white font-body overflow-x-hidden">
      
      {/* ─── Grain Overlay ─── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto <span className="text-primary/80">Connect</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
            <a href="#concept" className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all">Le Concept</a>
            <a href="#iza" className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all">IZA AI</a>
            <a href="#market" className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all">Ecosystème</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">Connexion</Link>
            <Link to="/register" className="px-8 py-3 bg-white text-black rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">Rejoindre</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10">
              <FadeIn direction="left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} className="animate-pulse" /> Platform as a Service v2.0
                </div>
              </FadeIn>
              
              <FadeIn delay={0.1} direction="left">
                <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-[900] leading-[0.85] tracking-tighter uppercase italic">
                  Don't just <br/>
                  <Highlight>sell.</Highlight> <br/>
                  Dominate.
                </h1>
              </FadeIn>

              <FadeIn delay={0.2} direction="left" className="max-w-xl">
                <p className="text-lg md:text-xl text-white/50 font-body leading-relaxed">
                  L'infrastructure cloud d'Afrique de l'Ouest qui transforme votre commerce en empire digital en <span className="text-white">120 secondes</span>. Piloté par IZA, votre directrice IA.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} direction="left" className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/register" className="group w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-2xl font-sub text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.4)] hover:scale-[1.02] transition-all">
                  Lancer mon App <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-3 text-white/40 font-sub text-[10px] font-black uppercase tracking-widest">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-white/10" />)}
                  </div>
                  <span>+500 commerçants</span>
                </div>
              </FadeIn>
            </div>

            {/* Visual Hero Element */}
            <FadeIn delay={0.4} direction="right" className="relative">
              <div className="aspect-square relative flex items-center justify-center">
                 {/* The Generated Image as a focal point */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-[100px] animate-pulse" />
                 <img 
                   src="/oresto_hero_abstract_1777632939449.png" 
                   alt="Oresto Connect Visual" 
                   className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_50px_rgba(234,88,12,0.2)] rounded-[60px]"
                 />
                 
                 {/* Floating Badges */}
                 <div className="absolute top-10 right-0 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl z-20 animate-bounce" style={{ animationDuration: "5s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center"><TrendingUp size={16} /></div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Revenue</p>
                        <p className="text-sm font-black tracking-tight">+124%</p>
                      </div>
                    </div>
                 </div>
              </div>
            </FadeIn>
          </div>
        </motion.div>

        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      </section>

      {/* ─── Bento Grid Features ─── */}
      <section id="concept" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main Feature - Site Factory */}
            <BentoCard className="md:col-span-8 p-12 flex flex-col justify-between min-h-[400px]">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary"><Rocket size={24} /></div>
                <h3 className="font-heading text-4xl font-black uppercase tracking-tighter">Site Factory</h3>
                <p className="text-white/50 max-w-md">Déployez une application web premium, SEO-optimisée et ultra-rapide en moins de temps qu'il n'en faut pour infuser un thé.</p>
              </div>
              <div className="flex items-center gap-4 pt-8">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Auto-Scaling Infrastructure</span>
              </div>
            </BentoCard>

            {/* Small Card - Local Pay */}
            <BentoCard className="md:col-span-4 p-8 bg-emerald-500/5 border-emerald-500/20">
              <div className="space-y-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><CreditCard size={20} /></div>
                <h4 className="font-heading text-xl font-black uppercase">Local Pay Native</h4>
                <p className="text-sm text-white/40">Wave, Orange Money, MoMo et Cash. Tous vos flux financiers centralisés.</p>
              </div>
            </BentoCard>

            {/* AI Center */}
            <BentoCard className="md:col-span-4 p-8 bg-primary/5 border-primary/20">
              <div className="space-y-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center"><Cpu size={20} /></div>
                <h4 className="font-heading text-xl font-black uppercase">Core IA : IZA</h4>
                <p className="text-sm text-white/40">Une intelligence qui ne se contente pas de répondre, elle agit sur votre business.</p>
              </div>
            </BentoCard>

            {/* Big Analytics Card */}
            <BentoCard className="md:col-span-8 p-12 bg-blue-500/5 border-blue-500/20 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h3 className="font-heading text-4xl font-black uppercase tracking-tighter italic">Operational <br/> Intelligence</h3>
                <p className="text-white/50">Suivez chaque commande, chaque client et chaque franc en temps réel avec des analytics prédictifs.</p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest">Real-time sync</div>
                  <div className="px-4 py-2 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-widest">Global CDN</div>
                </div>
              </div>
              <div className="w-full md:w-64 h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                <TrendingUp size={60} className="text-blue-500 opacity-20" />
              </div>
            </BentoCard>

          </div>
        </div>
      </section>

      {/* ─── IZA AI Core ─── */}
      <section id="iza" className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
              <Bot size={14} /> AI Operating System
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h2 className="font-heading text-5xl md:text-8xl font-black leading-none uppercase tracking-tighter italic">
              IZA isn't <br/>
              <span className="text-white/20 italic font-[900]">just a chatbot.</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            {[
              { label: "Analyse", text: "IZA surveille vos stocks et prédit vos ruptures avant qu'elles n'arrivent.", icon: Search },
              { label: "Action", text: "Modifiez vos prix ou vos menus par simple commande vocale.", icon: MousePointer2 },
              { label: "Relation", text: "Gère les retours clients et fidélise votre audience 24/7.", icon: MessageSquare }
            ].map((f, i) => (
              <FadeIn key={i} delay={0.2 + (i * 0.1)}>
                <div className="space-y-6 text-left p-10 rounded-[40px] border border-white/5 bg-white/[0.02]">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary"><f.icon size={22} /></div>
                  <h4 className="font-heading text-xl font-black uppercase tracking-widest">{f.label}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{f.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Market Section ─── */}
      <section id="market" className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn direction="left">
               <h2 className="font-heading text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                 Engineered <br/>
                 for West Africa.
               </h2>
               <p className="text-xl text-white/40 mt-12 italic leading-relaxed max-w-xl">
                 "Nous avons supprimé la friction technologique pour laisser place à la croissance. Oresto Connect parle le langage de vos clients : WhatsApp et Mobile Money."
               </p>
            </FadeIn>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Smartphone, label: "Mobile First" },
                { icon: Globe, label: "Local Edge" },
                { icon: ShieldCheck, label: "Secure Data" },
                { icon: Users, label: "Social Commerce" }
              ].map((item, i) => (
                <BentoCard key={i} delay={i * 0.1} className="p-8 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-primary"><item.icon size={20} /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </BentoCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA / Footer ─── */}
      <footer className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-16">
            <FadeIn>
              <h2 className="font-heading text-6xl md:text-[160px] font-[900] leading-[0.7] uppercase tracking-tighter italic">
                Ready to <br/>
                <Highlight className="text-primary">Expand?</Highlight>
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link to="/register" className="inline-flex items-center gap-4 px-16 py-8 bg-white text-black rounded-3xl font-sub text-base font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.1)]">
                Create My App <ChevronRight size={24} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mt-48 pt-20 border-t border-white/5">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white"><Zap size={16} fill="currentColor" /></div>
                <span className="font-heading text-xl font-black uppercase tracking-tighter">Oresto</span>
              </div>
              <p className="text-white/20 text-xs leading-relaxed max-w-xs italic">
                La PaaS d'Afrique de l'Ouest qui redéfinit le commerce premium.
              </p>
            </div>
            
            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Resources</h5>
              <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest text-white/60">
                <li><Link to="/login" className="hover:text-primary transition-all">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-all">Inscription</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40">Social</h5>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer"><MessageSquare size={18} /></div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer"><Globe size={18} /></div>
              </div>
            </div>

            <div className="text-right space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 ORESTO CONNECT</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">THE INFRASTRUCTURE OF GROWTH</p>
            </div>
          </div>
        </div>

        {/* Ambient Footer Light */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[150px] -z-10" />
      </footer>

    </div>
  );
}
