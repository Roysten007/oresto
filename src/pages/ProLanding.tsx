import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight, Bot, Zap, ChevronRight, CheckCircle2, Lock, Rocket, MessageSquare, 
  BarChart3, Globe2, Layout, MessageCircle, Shield, Check, Globe, Store, Clock, Activity, Users, ShoppingBag, Plus
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

  const faqs = [
    { q: "Comment mes clients me paient ?", a: "Mobile Money direct entre vous et vos clients. Oresto n'intervient pas dans la transaction." },
    { q: "Que se passe-t-il si je ne paie pas mon abonnement ?", a: "Vous avez 3 jours de grâce. Passé ce délai, votre site est temporairement suspendu jusqu'au paiement." },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui, nous utilisons Firebase/Google Cloud, les mêmes infrastructures que Google." },
    { q: "Puis-je personnaliser mon site ?", a: "Absolument ! Couleurs, logo, photos, menu — tout est personnalisable depuis le Site Factory." },
    { q: "Combien de temps pour créer mon site ?", a: "12 minutes en moyenne. Suivez les 6 étapes du Site Factory et votre site est en ligne." },
    { q: "Puis-je changer de formule ?", a: "Oui, vous pouvez passer de Starter à Pro (ou inversement) à tout moment." }
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
              Oresto
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
            <a href="#solution" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">La Solution</a>
            <a href="#flow" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Comment ça marche</a>
            <a href="#iza" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">IZA AI</a>
            <a href="#tarifs" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary font-bold">Tarifs</a>
            <a href="#faq" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="px-3 sm:px-4 py-2 rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Connexion</Link>
            <Link to="/register?role=vendor" className="px-4 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)]">Essayer</Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 px-6">
        <motion.div className="max-w-5xl mx-auto text-center relative z-10">
          {isBeforeOct12026 && (
            <FadeIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
                <Zap size={14} fill="currentColor" /> 🎉 Essai gratuit jusqu'au 1er octobre 2026 pour les premiers inscrits
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-[900] leading-[0.85] tracking-tighter mb-8 uppercase text-foreground">
              Le site pro de votre restaurant, <br />
              <span className="text-primary italic block mt-2">prêt en 12 minutes.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-3xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed italic opacity-85">
              Site auto-généré + Dashboard commandes + Chat client intégré. Le tout sans code, sans carte bancaire.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register?role=vendor" className="group w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.2)] hover:scale-105 transition-all">
              Créer mon site gratuitement <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#flow" className="flex items-center gap-3 px-6 py-4 rounded-full bg-white border border-gray-100 shadow-sm font-sub text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-gray-50 transition-colors">
              Voir comment ça marche ↓
            </a>
          </FadeIn>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* ─── LE PROBLÈME ─── */}
      <section className="py-20 px-6 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Un restaurant sans site web <span className="text-primary">perd des clients</span> chaque jour</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: "72%", desc: "des clients cherchent un restaurant en ligne avant de se déplacer", icon: Users },
              { stat: "3x", desc: "plus de commandes pour les restaurants avec un site web", icon: Rocket },
              { stat: "60%", desc: "des commandes sont perdues sans présence digitale", icon: Activity },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-[32px] bg-white border border-gray-100 text-center hover:shadow-lg transition-all h-full">
                  <div className={`w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <p.icon size={24} />
                  </div>
                  <h3 className="font-heading text-4xl font-black text-foreground mb-3">{p.stat}</h3>
                  <p className="text-muted-foreground font-medium text-sm leading-relaxed">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LA SOLUTION ─── */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">La Solution</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Tout ce dont votre restaurant a besoin</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Site auto-généré", icon: Globe, desc: "Un site professionnel à votre image, en quelques clics. Menu, horaires, avis, livraison — tout y est.", color: "bg-blue-500" },
              { title: "Dashboard commandes", icon: BarChart3, desc: "Suivez vos commandes en temps réel, gérez votre menu et analysez vos ventes depuis un seul endroit.", color: "bg-primary" },
              { title: "Chat intégré", icon: MessageCircle, desc: "Communiquez directement avec vos clients pour chaque commande. Confirmez les paiements en un clic.", color: "bg-emerald-500" },
            ].map((p, i) => (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className="h-full p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-heading text-xl font-black uppercase tracking-tighter mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic text-sm">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE (Flow) ─── */}
      <section id="flow" className="py-20 px-6 bg-black text-white rounded-[48px] mx-4 md:mx-10 my-10">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">De la commande au paiement, en 5 étapes simples</h2>
          </FadeIn>
          
          <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:border-l-0 md:flex md:flex-col md:items-center space-y-12">
            {[
              { step: "1", title: "Votre client commande", desc: "Il visite votre site, remplit son panier et lance sa commande." },
              { step: "2", title: "Vous recevez la commande", desc: "Une conversation s'ouvre automatiquement dans votre dashboard." },
              { step: "3", title: "Vous indiquez comment payer", desc: "Envoyez vos coordonnées Mobile Money directement dans le chat." },
              { step: "4", title: "Le client confirme", desc: "Il paie et envoie sa capture d'écran dans la conversation." },
              { step: "5", title: "Vous validez", desc: "Un clic pour confirmer le paiement et lancer la préparation." }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative pl-8 md:pl-0 md:w-1/2 md:even:ml-auto md:odd:mr-auto md:even:pl-12 md:odd:pr-12 md:odd:text-right flex flex-col md:block group">
                <div className="absolute left-[-21px] md:left-auto md:right-[-20px] md:group-even:left-[-20px] top-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black text-lg border-4 border-black z-10 text-white">
                  {s.step}
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                  <h3 className="font-heading text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm italic">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
            <div className="md:absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/10 hidden md:block -z-0"></div>
          </div>

          <FadeIn className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              💡 <span className="text-white/90">Oresto ne touche jamais à votre argent. La transaction se fait directement entre vous et votre client.</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── IZA AI ─── */}
      <section id="iza" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-sub text-[10px] font-black uppercase tracking-widest mb-8">
                <Bot size={14} /> Intelligence Opérationnelle
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-black leading-[0.95] uppercase tracking-tighter mb-6 max-w-[280px] md:max-w-none">
                IZA, votre assistante intelligente
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                IZA vous aide à gérer votre restaurant : répondre aux questions, optimiser votre menu, analyser vos ventes. Laissez l'IA travailler pour vous.
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="aspect-square flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-orange-600/10 rounded-[48px] border border-primary/20 flex items-center justify-center relative overflow-hidden">
                <Bot size={100} className="text-primary opacity-50" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── TARIFS ─── */}
      <section id="tarifs" className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Des tarifs transparents, sans surprise</h2>
            <p className="text-base text-primary font-bold mt-4">
              🎁 Essai gratuit jusqu'au 1er octobre 2026 pour les premiers inscrits
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Starter */}
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-white rounded-[36px] border border-gray-200 p-8 sm:p-10 h-full flex flex-col justify-between shadow-sm hover:shadow-xl transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between h-7">
                    <div className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600">
                      Starter
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-4xl sm:text-5xl font-black tracking-tighter">3 000</span>
                      <span className="text-sm font-bold text-gray-500">FCFA / mois</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100 text-sm font-bold min-h-[170px]">
                    {[
                      "Site basique",
                      "Dashboard de gestion",
                      "Chat client",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-gray-100">
                  <Link to="/register?role=vendor" className="block w-full py-4 rounded-full bg-black text-white text-center font-sub text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
                    Démarrer gratuitement
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Pro */}
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-black text-white rounded-[36px] border-2 border-primary p-8 sm:p-10 h-full flex flex-col justify-between shadow-2xl transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between h-7">
                    <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                      Pro
                    </div>
                    <div className="bg-primary text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      ★ Recommandé
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-4xl sm:text-5xl font-black tracking-tighter text-white">5 000</span>
                      <span className="text-sm font-bold text-gray-400">FCFA / mois</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10 text-sm font-bold min-h-[170px]">
                    {[
                      "Tout de l'offre Starter",
                      "Stats avancées",
                      "IZA AI (Assistante)",
                      "Support prioritaire",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-white">
                        <Check size={16} className="text-primary flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-white/10">
                  <Link to="/register?role=vendor" className="block w-full py-4 rounded-full bg-primary text-white text-center font-sub text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.4)]">
                    Démarrer gratuitement
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Foire Aux Questions</h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-foreground hover:bg-gray-50 transition-colors"
                  >
                    {faq.q}
                    <Plus size={20} className={`transform transition-transform ${openFaq === i ? "rotate-45 text-primary" : "text-gray-400"}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-muted-foreground text-sm italic border-t border-gray-100 pt-4">
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
      <footer className="pt-20 pb-10 px-6 bg-black text-white rounded-t-[48px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-7xl font-[900] leading-none uppercase tracking-tighter mb-8 italic">
                Prêt à digitaliser<br/><span className="text-primary">votre restaurant ?</span>
              </h2>
              <Link to="/register?role=vendor" className="inline-flex items-center gap-4 px-8 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-full font-sub text-[10px] sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]">
                Créer mon site maintenant <ChevronRight size={18} />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-12 border-t border-white/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="font-heading text-xl font-black tracking-tighter uppercase">Oresto</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-xs italic">
                La plateforme SaaS qui permet aux restaurants de créer leur site professionnel et gérer leurs commandes sans code.
              </p>
            </div>

            <div className="flex flex-wrap gap-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Navigation</h3>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><Link to="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                  <li><Link to="/register?role=vendor" className="hover:text-primary transition-colors">Créer mon site</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Sections</h3>
                <ul className="space-y-3 text-[11px] font-black uppercase tracking-widest">
                  <li><a href="#solution" className="hover:text-primary transition-colors">Solution</a></li>
                  <li><a href="#flow" className="hover:text-primary transition-colors">Comment ça marche</a></li>
                  <li><a href="#tarifs" className="hover:text-primary transition-colors">Tarifs</a></li>
                  <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-end items-end text-right space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 Oresto</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">CGU & Confidentialité</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
