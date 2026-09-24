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

export default function LandingEcommerce() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Puis-je ajouter plusieurs photos et des variantes (tailles, couleurs) ?",
      a: "Oui ! Vos fiches produits supportent jusqu'à 4 photos HD, des prix barrés pour les soldes (-20%, -30%), les pointures/tailles (S, M, L, XL, 42, 43) et le choix des couleurs."
    },
    {
      q: "Comment fonctionne la livraison et le suivi de colis ?",
      a: "Vos clients renseignent leur adresse et leur quartier lors du paiement. Vous visualisez directement les colis à expédier depuis votre tableau de bord."
    },
    {
      q: "Y a-t-il une commission sur les ventes d'articles ?",
      a: "Non. 0% de commission. Vous encaissez 100% du prix de vos articles directement sur votre compte MTN MoMo, Moov Money ou Celtiis Cash."
    },
    {
      q: "Quel est le tarif de l'abonnement Boutique Pro ?",
      a: "La formule unique est à 5 000 FCFA / mois tout inclus, sans engagement ni commission. Vous profitez de 14 jours d'essai gratuit sans carte bancaire."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white text-base shadow-md shadow-primary/25">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tight uppercase text-gray-900 block leading-none">
                Oresto <span className="text-primary">Boutique</span>
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">E-Commerce & Vente en Ligne</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900">
              Connexion
            </Link>
            <Link
              to="/register?sector=ecommerce"
              className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              Lancer ma Boutique
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary text-xs font-black uppercase tracking-wider shadow-sm">
              <i className="fa-solid fa-boxes-stacked"></i>
              ESPACE DÉDIÉ E-COMMERCE & BOUTIQUES • 0% COMMISSION
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-heading font-black text-3xl sm:text-5xl md:text-6xl text-gray-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Vendez vos articles en ligne <span className="text-primary">sans passer vos journées sur WhatsApp.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Fini d'envoyer 50 photos dans les DM. Donnez à vos clients une boutique moderne avec fiches multi-photos, sélection des tailles, prix soldés et encaissements MoMo en direct.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register?sector=ecommerce"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3"
              >
                <span>Créer ma Boutique E-Commerce (14 jours offerts)</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-2.5">
              Prêt en 12 minutes • Multi-photos & Variantes S/M/L • 0% de commission
            </p>
          </FadeIn>
        </div>

        {/* Real Live Boutique Showcase */}
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
          <FadeIn delay={0.4}>
            <div className="p-6 sm:p-8 rounded-[36px] bg-[#0A0A0A] border-4 border-gray-800 text-white shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Boutique Prestige & Tech • Command Center E-Commerce
                  </h3>
                  <p className="text-xs text-gray-400">Catalogue en direct • 8 colis prêts à l'expédition</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs rounded-full">
                  142 000 FCFA encaissés (0% comm)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#089 • Cotonou Express</span>
                    <span className="text-emerald-400">✅ MoMo Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">Sneakers Streetwear Urban</p>
                  <p className="text-[11px] text-gray-400">Pointure: 42 • Couleur: Noir/Blanc</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">18 500 F</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-bold rounded-lg text-[10px]">📦 Colis Prêt</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#088 • Calavi Arconville</span>
                    <span className="text-emerald-400">✅ Moov Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">Smartwatch Ultra Pro 4G</p>
                  <p className="text-[11px] text-gray-400">Bracelet: Orange Titane</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">29 000 F</span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-lg text-[10px]">🚚 En Expédition</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>#087 • Porto-Novo</span>
                    <span className="text-emerald-400">✅ MoMo Reçu</span>
                  </div>
                  <p className="font-heading font-black text-sm text-white">Robe Soirée Satin Prestige</p>
                  <p className="text-[11px] text-gray-400">Taille: M • Couleur: Émeraude</p>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="font-black text-primary">15 000 F</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg text-[10px]">✓ Livré</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* 3 Avantages Boutique */}
      <section className="py-16 bg-gray-50 border-t border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-primary flex items-center justify-center text-lg">
              <i className="fa-solid fa-images"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">Multi-photos & Variantes</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Présentez vos articles sous tous les angles avec choix des tailles, pointures, couleurs et prix soldés.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-boxes-packing"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">Gestion des stocks</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Suivi automatique des quantités disponibles. Plus aucune commande passée sur un article épuisé.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <h3 className="font-heading font-black text-base text-gray-900">Bannières & Codes Promo</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bandeau d'annonces de livraison gratuite en haut de votre boutique et coupons de réduction pour vos abonnés.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="font-heading font-black text-2xl text-center text-gray-900">Questions fréquentes E-Commerçants</h2>
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
            to="/register?sector=ecommerce"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 shadow-xl shadow-primary/25"
          >
            <span>Lancer ma boutique à 5 000 FCFA / mois</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-gray-500 text-xs text-center border-t border-white/10">
        <p>© 2026 Oresto Boutique — La puissance du e-commerce africain sans commission.</p>
      </footer>
    </div>
  );
}
