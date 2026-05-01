import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  Layout
} from "lucide-react";

/* ─── Reveal Component (Standard CSS Animation) ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `all 600ms ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-foreground selection:bg-primary selection:text-white">
      
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="font-heading text-2xl font-black tracking-tighter uppercase">Oresto <span className="text-primary">Connect</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <a href="#vision" className="hover:text-primary transition-colors">Vision</a>
            <a href="#iza" className="hover:text-primary transition-colors">IZA AI</a>
            <a href="#confidentiality" className="hover:text-primary transition-colors">Sécurité</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2.5 rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Connexion</Link>
            <Link to="/register" className="px-6 py-2.5 bg-black text-white rounded-full font-sub text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Rejoindre</Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Reveal delay={100} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles size={14} /> L'application web qui révolutionne la restauration
          </Reveal>
          
          <Reveal delay={200}>
            <h1 className="font-heading text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 uppercase">
              Ne créez pas un site. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Lancez un empire.</span>
            </h1>
          </Reveal>

          <Reveal delay={300} className="max-w-2xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed">
              Oresto Connect n'est pas un catalogue. C'est une <strong>PaaS (Platform as a Service)</strong> qui génère instantanément votre application web de vente premium, pilotée par une intelligence artificielle de pointe.
            </p>
          </Reveal>

          <Reveal delay={400} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="group w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[24px] font-sub text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
              Démarrer mon restaurant <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 px-6 py-4 rounded-[24px] bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 size={16} className="text-emerald-500" /> Site prêt en 2 minutes
            </div>
          </Reveal>
        </div>

        {/* Floating elements simulation */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[140px] -z-10" />
      </section>

      {/* ─── The Concept: Site Factory ─── */}
      <section id="vision" className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal delay={100}>
              <div className="space-y-6">
                <p className="font-sub text-[10px] font-black uppercase tracking-[0.3em] text-primary">Le Concept : Site Factory</p>
                <h2 className="font-heading text-4xl md:text-6xl font-black leading-tight uppercase tracking-tighter">
                  Une présence digitale <br/>
                  <span className="text-muted-foreground">sans la complexité.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Qu'il s'agisse d'un petit restaurant de quartier ou d'un établissement premium, notre application web vous offre une infrastructure complète. Vous vous connectez, vous configurez votre identité, et votre site est prêt à encaisser vos premières commandes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  {[
                    { title: "Dashboard Unifié", desc: "Suivez vos ventes et clients en temps réel.", icon: Layout },
                    { title: "Design Premium", desc: "Des interfaces qui donnent faim.", icon: Globe },
                    { title: "Paiement Direct", desc: "WhatsApp, MoMo & Cash.", icon: ShieldCheck },
                    { title: "Zéro Code", desc: "Concentrez-vous sur votre cuisine.", icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary shrink-0">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-sm uppercase tracking-tight">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={300} className="relative">
              <div className="aspect-square bg-white rounded-[60px] shadow-2xl border border-gray-100 p-4 overflow-hidden group">
                <div className="h-full w-full bg-gray-50 rounded-[48px] border border-gray-100 flex items-center justify-center relative overflow-hidden">
                   <div className="text-center p-8">
                      <Store size={80} className="mx-auto text-primary/20 mb-6 group-hover:scale-110 transition-transform duration-700" />
                      <p className="font-heading text-xl font-black uppercase">Aujourd'hui : Restaurants</p>
                      <p className="text-sm text-muted-foreground mt-2 italic">Demain : Boutiques, Pharmacies, Epiceries...</p>
                   </div>
                   <div className="absolute top-0 right-0 p-6">
                      <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Phase 1</span>
                   </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── IZA AI Section ─── */}
      <section id="iza" className="py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Reveal delay={100} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-sub text-[10px] font-black uppercase tracking-widest mb-8">
              <Bot size={14} className="text-primary" /> Intelligence Artificielle Opérationnelle
            </Reveal>
            <Reveal delay={200}>
              <h2 className="font-heading text-4xl md:text-7xl font-black leading-none uppercase tracking-tighter mb-8">
                Rencontrez <span className="text-primary italic">IZA</span>. <br/>
                <span className="text-white/40">Votre nouvelle directrice.</span>
              </h2>
            </Reveal>
            <Reveal delay={300} className="max-w-2xl mx-auto">
              <p className="text-lg text-white/60 leading-relaxed">
                IZA n'est pas un chatbot classique. C'est une intelligence intégrée qui analyse vos performances, suggère des optimisations de menu et gère vos clients pendant que vous cuisinez.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { title: "Analyse Temps Réel", desc: "IZA surveille vos stocks et vos pics de commande.", icon: TrendingUp },
               { title: "Assistance Vendeur", desc: "Posez-lui des questions sur votre business, elle répond.", icon: Bot },
               { title: "Automatisation", desc: "IZA peut modifier vos prix ou fermer votre boutique sur simple commande vocale.", icon: Zap }
             ].map((feature, i) => (
               <Reveal key={i} delay={400 + (i * 100)} className="p-10 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="font-heading text-xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
               </Reveal>
             ))}
          </div>
        </div>
      </section>

      {/* ─── Why Oresto Connect? ─── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tighter">Pourquoi nous ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: "Vitesse", text: "Déployez votre application web de vente en moins de 120 secondes chrono.", icon: Zap },
              { label: "Autonomie", text: "Prenez le contrôle total de votre design, vos prix et vos livraisons.", icon: Smartphone },
              { label: "Visibilité", text: "Un site premium optimisé pour le référencement et le partage social.", icon: Globe },
              { label: "Croissance", text: "Rejoignez un écosystème conçu pour multiplier votre chiffre d'affaires.", icon: TrendingUp }
            ].map((reason, i) => (
              <Reveal key={i} delay={i * 100} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-primary mb-8 border border-gray-100 shadow-sm">
                  <reason.icon size={32} />
                </div>
                <h4 className="font-heading font-black text-sm uppercase tracking-widest mb-4">{reason.label}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{reason.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Confidentiality & Data ─── */}
      <section id="confidentiality" className="py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Reveal delay={100} className="p-12 md:p-20 rounded-[60px] bg-white border border-gray-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <ShieldCheck size={200} className="text-black" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 text-primary">
                <Lock size={28} />
                <h2 className="font-heading text-3xl font-black uppercase tracking-tighter">Données & Confidentialité</h2>
              </div>
              <div className="space-y-8 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Votre business, vos données. Oresto Connect utilise une infrastructure **Firebase sécurisée** où chaque utilisateur possède son propre environnement cloisonné.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="font-heading font-black text-xs uppercase tracking-widest text-foreground">Stockage Isolé</h5>
                    <p className="text-xs">Vos conversations avec IZA et vos historiques de vente sont inaccessibles aux autres utilisateurs.</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-heading font-black text-xs uppercase tracking-widest text-foreground">Transparence Totale</h5>
                    <p className="text-xs">Nous ne vendons jamais vos données. Nous fournissons l'outil, vous possédez le résultat.</p>
                  </div>
                </div>
                <p className="text-sm italic pt-8 border-t border-gray-100">
                  En utilisant Oresto Connect, vous acceptez notre engagement sur la protection de la vie privée et la sécurité de vos informations opérationnelles.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer / Final CTA ─── */}
      <footer className="py-32 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal delay={100}>
            <h2 className="font-heading text-5xl md:text-8xl font-black leading-none uppercase tracking-tighter mb-12">
              Prêt à dominer <br/>
              <span className="text-primary italic">le digital ?</span>
            </h2>
          </Reveal>
          <Reveal delay={200} className="mb-20">
            <Link to="/register" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-[28px] font-sub text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Lancer mon App Web <ChevronRight size={20} />
            </Link>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left pt-20 border-t border-white/10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                <span className="font-heading text-lg font-black tracking-tighter uppercase">Oresto</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs">
                La première plateforme de Site Factory pilotée par IA pour la restauration et le commerce en Afrique de l'Ouest.
              </p>
            </div>
            <div>
              <h5 className="font-sub text-[10px] font-black uppercase tracking-widest text-white mb-6">Plateforme</h5>
              <ul className="space-y-4 text-white/40 text-xs">
                <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Inscription</Link></li>
                <li><a href="#iza" className="hover:text-primary transition-colors">Fonctionnalités IA</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-sub text-[10px] font-black uppercase tracking-widest text-white mb-6">Légal</h5>
              <ul className="space-y-4 text-white/40 text-xs">
                <li><a href="#confidentiality" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Conditions Générales</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div className="text-right flex flex-col justify-between">
              <p className="font-sub text-[10px] font-black uppercase tracking-widest text-white">© 2026 Oresto Connect</p>
              <div className="flex justify-end gap-4 mt-6">
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer"><Store size={14} /></div>
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer"><Bot size={14} /></div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
