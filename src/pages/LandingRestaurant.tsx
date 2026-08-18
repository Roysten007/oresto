import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

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

export default function LandingRestaurant() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Mes clients au restaurant doivent-ils télécharger une application ?",
      a: "Non. Ils scannent simplement le QR Code posé sur leur table ou cliquent sur votre lien WhatsApp. La carte du restaurant s'ouvre instantanément dans leur navigateur."
    },
    {
      q: "Comment fonctionne l'encaissement Mobile Money à table ou en livraison ?",
      a: "Le client choisit ses plats, sélectionne 'Payer par MoMo' et effectue son transfert directement vers votre numéro MTN MoMo, Moov ou Celtiis. Vous recevez 100% de l'argent sans intermédiaire."
    },
    {
      q: "Puis-je changer mes plats du jour facilement ?",
      a: "Oui, depuis votre smartphone en 10 secondes. Vous pouvez ajouter un plat, marquer une rupture de stock en cuisine ou activer les suggestions du chef."
    },
    {
      q: "Quel est le prix après le premier mois ?",
      a: "5 000 FCFA / mois tout inclus, sans engagement ni commission. Vous profitez de -25% immédiats dès votre inscription (3 750 FCFA le 1er mois)."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white text-base shadow-md shadow-primary/25">
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tight uppercase text-gray-900 block leading-none">
                Oresto <span className="text-primary">Resto</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Restaurants & Maquis</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">
              Connexion
            </Link>
            <Link
              to="/register?sector=restaurant"
              className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              Lancer mon Restaurant (-25%)
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-wider shadow-sm">
              <i className="fa-solid fa-utensils"></i>
              ESPACE DÉDIÉ RESTAURATION & MAQUIS • 0% COMMISSION
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Cuisinez l'esprit tranquille. Vos commandes repas <span className="text-primary">s'automatisent en direct.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Fini le téléphone qui sonne pendant le coup de feu pour dicter le menu. Vos clients commandent et paient par MoMo sur leur table ou en livraison sans intermédiaire.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register?sector=restaurant"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3"
              >
                <span>Créer ma Carte Restaurant (-25% : 3 750 F)</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-2.5">
              Prêt en 12 minutes • QR Code tables inclus • 0% de commission sur vos repas
            </p>
          </FadeIn>
        </div>

        {/* Real Live Restaurant Showcase */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
          <FadeIn delay={0.4}>
            <div className="p-6 sm:p-8 rounded-[36px] bg-[#0A0A0A] border-4 border-gray-800 text-white shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Le Maquis Étoilé • Command Center Restaurant
                  </h3>
                  <p className="text-xs text-gray-400">Service du midi • 19 commandes servies aujourd'hui</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs rounded-full">
                  87 500 FCFA encaissés (0% comm)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#042 • Table 4</span>
                    <span className="text-emerald-400">✅ MoMo Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">1x Poulet Braisé & Alloco</p>
                  <p className="text-[11px] text-gray-400">Sans piment • 1x Djama Pils</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">5 500 F</span>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-primary font-bold rounded-lg text-[10px]">🔥 En Cuisine</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#041 • Livraison Haie Vive</span>
                    <span className="text-emerald-400">✅ Moov Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">1x Capitaine Braisé Grand Format</p>
                  <p className="text-[11px] text-gray-400">Attiéké double • Sauce verte</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">6 000 F</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-lg text-[10px]">🛵 En Livraison</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#040 • À Emporter</span>
                    <span className="text-emerald-400">✅ Celtiis Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">2x Chawarma Viande Spécial</p>
                  <p className="text-[11px] text-gray-400">Fromage supplémentaire</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">4 000 F</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg text-[10px]">✓ Prêt</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* 3 Avantages Resto */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-primary flex items-center justify-center text-lg">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">QR Code sur vos tables</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vos clients s'assoient, scannent et commandent. Vos serveurs n'ont plus qu'à apporter les plats.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">0% Commission repas</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vous gardez 100% de la marge sur vos grillades, boissons et spécialités. L'argent arrive direct sur votre MoMo.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-fire-burner"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">Sérénité en cuisine</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vos bons de commande sont nets et précis. Plus d'erreur sur les accompagnements ou les piments.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="font-heading font-black text-2xl text-center text-gray-900">Questions fréquentes Restaurateurs</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl border border-gray-200 bg-white">
              <h4 className="font-heading font-bold text-sm text-gray-900 mb-1">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center">
          <Link
            to="/register?sector=restaurant"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/25"
          >
            <span>Lancer mon restaurant à 3 750 FCFA (-25%)</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-gray-500 text-xs text-center border-t border-white/10">
        <p>© 2026 Oresto Resto — La sérénité pour les restaurateurs et maquis.</p>
      </footer>
    </div>
  );
}
