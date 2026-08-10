import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, ChevronRight, CheckCircle2, Shield,
  CreditCard, Smartphone, MessageSquare, MessageCircle,
  Star, Truck, Compass, Building, Utensils, Flame, Home, Search, RefreshCw
} from "lucide-react";

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

export default function ClientLanding() {
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
              Oresto
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm">
            <a href="#offres" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Découverte</a>
            <a href="#fidelite" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Fidélité</a>
            <a href="#terrain" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Paiements</a>
            <a href="#confiance" className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Sécurité</a>
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
            <Link to="/register" className="px-4 py-2 sm:px-6 sm:py-2.5 bg-primary text-white rounded-full font-sub text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(234,88,12,0.3)]">S'inscrire</Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Client ─── */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 px-6">
        <motion.div className="max-w-5xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-primary shadow-sm mb-8">
              <Compass size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Le meilleur du Bénin à portée de main</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-[900] leading-[0.9] tracking-tighter mb-8 uppercase text-foreground">
              Trouvez le bon <span className="text-primary italic block">établissement</span> où que vous soyez.
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} className="max-w-2xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed italic opacity-85">
              Restaurants, hôtels, maquis ou auberges : découvrez, commandez en ligne ou réservez en quelques clics, où que vous soyez au Bénin.
            </p>
          </FadeIn>

          <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/app/decouvrir" className="group w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(234,88,12,0.3)] hover:scale-105 transition-all">
              <Search size={18} /> Découvrir près de moi
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-black text-white font-sub text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
              Créer mon compte
            </Link>
          </FadeIn>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-[120px]" />
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

      {/* ─── Ce qu'Oresto vous offre ─── */}
      <section id="offres" className="py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Expérience Simplifiée</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Ce qu'Oresto vous offre</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Compass, title: "Découverte Géolocalisée", desc: "Localisez instantanément les restaurants, hôtels, maquis et auberges ouverts autour de vous.", color: "bg-blue-50/60", iconColor: "text-blue-500" },
              { icon: Smartphone, title: "Commande & Réservation Directes", desc: "Consultez les menus ou les chambres disponible(s), réservez et payez en Mobile Money en quelques secondes.", color: "bg-orange-50/60", iconColor: "text-primary" },
              { icon: Truck, title: "Suivi en Temps Réel", desc: "Suivez l'état de votre commande ou confirmation de réservation étape par étape jusqu'à la livraison.", color: "bg-emerald-50/60", iconColor: "text-emerald-500" },
              { icon: MessageCircle, title: "Chat Direct Établissement", desc: "Discutez en direct avec le responsable de l'établissement pour préciser vos demandes spéciales.", color: "bg-purple-50/60", iconColor: "text-purple-500" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="h-full">
                <div className={`p-8 rounded-[32px] ${item.color} border border-white h-full space-y-4 hover:shadow-xl transition-all`}>
                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${item.iconColor} shadow-sm`}>
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-heading font-black text-lg uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pensé pour chez vous ─── */}
      <section id="terrain" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn className="space-y-6">
              <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary">Ancrage Local</p>
              <h2 className="font-heading text-3xl md:text-5xl font-[900] leading-[0.95] uppercase tracking-tighter">
                Pensé pour <span className="text-primary italic block">chez vous.</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed italic">
                Oresto s'adapte à vos habitudes quotidiennes au Bénin et en Afrique de l'Ouest : paiements Mobile Money rapides, intégration WhatsApp et livraisons de proximité.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <Smartphone className="text-primary flex-shrink-0" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Mobile Money</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <MessageSquare className="text-primary flex-shrink-0" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <Truck className="text-primary flex-shrink-0" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Livraison Rapide</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                  <CreditCard className="text-primary flex-shrink-0" size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Espèces / Cash</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2} className="h-full">
              <div className="p-10 rounded-[36px] bg-black text-white space-y-6 shadow-2xl relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <Zap size={24} fill="currentColor" />
                </div>
                <h3 className="font-heading text-2xl font-black uppercase tracking-tighter">Commandez & Réservez en toute simplicité</h3>
                <p className="text-white/60 text-sm leading-relaxed italic">
                  Aucun parcours complexe. Choisissez votre lieu préféré, réservez ou commandez, et payez avec MTN MoMo ou Moov Money en toute sécurité.
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-sub font-black uppercase tracking-widest text-primary">
                  <CheckCircle2 size={16} /> Confirmation instantanée
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Avantages Fidélité ─── */}
      <section id="fidelite" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="font-sub text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-3">Programme Client</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter">Vos avantages fidélité</h2>
            <p className="text-base text-muted-foreground mt-3 italic max-w-xl mx-auto">
              Chaque commande ou réservation sur Oresto vous cumule des points automatiquement utilisables pour des réductions.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "1 pt / 100 FCFA", desc: "Gagnez 1 point automatiquement pour chaque tranche de 100 FCFA dépensée sur vos établissements favoris." },
              { icon: Truck, title: "+5 pts Bonus Livraison", desc: "Chaque livraison effectuée via Oresto vous crédite immédiatement de 5 points de fidélité supplémentaires." },
              { icon: Zap, title: "Récompenses Automatiques", desc: "Convertissez directement vos points en réductions ou plats offerts lors de vos prochaines visites." },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-lg transition-all text-center">
                  <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <f.icon size={22} />
                  </div>
                  <h4 className="font-heading font-black text-lg uppercase tracking-tighter">{f.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed italic">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Confidentialité & Sécurité Client ─── */}
      <section id="confiance" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="p-8 md:p-14 rounded-[36px] bg-white border border-gray-100 shadow-xl text-center">
              <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={26} />
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                Confidentialité & <span className="text-primary italic">Sécurité</span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8 italic">
                Vos données personnelles et votre numéro de téléphone ne sont jamais revendus. Vos échanges tchat avec les établissements sont privés et sécurisés.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Données privées & protégées", "Transactions Mobile Money sécurisées", "Messagerie chiffrée"].map((tag, i) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA Final Client ─── */}
      <footer className="pt-20 pb-12 px-6 bg-black text-white rounded-t-[48px]">
        <div className="max-w-5xl mx-auto text-center space-y-8 mb-16">
          <FadeIn>
            <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-[900] uppercase tracking-tighter italic">
              Prêt à <span className="text-primary">découvrir ?</span>
            </h2>
            <p className="text-white/60 text-base md:text-lg italic max-w-lg mx-auto mt-4">
              Rejoignez des milliers de clients et profitez du meilleur du commerce local au Bénin.
            </p>
            <div className="pt-8">
              <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-full font-sub text-xs sm:text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
                Créer mon compte gratuitement <ChevronRight size={18} />
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40 font-sub">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="font-heading text-lg font-black tracking-tighter text-white uppercase">Oresto</span>
          </div>

          <div className="flex items-center gap-6 font-bold uppercase tracking-widest text-[10px]">
            <Link to="/?select=true" className="text-primary hover:underline flex items-center gap-1">
              <RefreshCw size={10} /> Changer de profil
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">Connexion</Link>
            <Link to="/register" className="hover:text-white transition-colors">Inscription</Link>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest">© 2026 Oresto • Tous droits réservés</p>
        </div>
      </footer>

    </div>
  );
}
