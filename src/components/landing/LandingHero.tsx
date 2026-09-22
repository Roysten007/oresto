import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export type BusinessSector = "restaurant" | "ecommerce" | "hotel";

interface LandingHeroProps {
  activeSector: BusinessSector;
  onSelectSector: (sector: BusinessSector) => void;
}

export default function LandingHero({ activeSector, onSelectSector }: LandingHeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectorPreviews = {
    restaurant: {
      tag: "SPÉCIAL RESTAURANTS, MAQUIS & FAST-FOODS",
      title: "L'Atelier du Chef & Grillades",
      badge: "Command Center Resto",
      subtitle: "Service du midi • 19 repas servis aujourd'hui",
      kpi: "87 500 F encaissés",
      items: [
        { label: "Table 4 • Poulet Braisé & Alloco", status: "En cuisine", time: "Il y a 3 min", price: "5 500 F", momo: "MTN MoMo reçu" },
        { label: "Livraison #08 • Carpe Royale Braisée", status: "Prêt livreur", time: "Il y a 8 min", price: "7 000 F", momo: "Moov Money reçu" },
        { label: "Table 1 • Brochettes de Filet de Bœuf", status: "Servi", time: "Il y a 14 min", price: "4 000 F", momo: "Espèces" }
      ],
      features: ["Menu interactif QR Code sur tables", "Zéro commission sur vos repas", "Mise à jour des plats du jour en 10s"]
    },
    ecommerce: {
      tag: "SPÉCIAL BOUTIQUES, VÊTEMENTS & ACCESSOIRES",
      title: "KiffStyle & Sneaker Store",
      badge: "Command Center E-Commerce",
      subtitle: "Catalogue direct • 12 colis expédiés cette semaine",
      kpi: "142 000 F encaissés",
      items: [
        { label: "Sneakers Air Urban • Pointure 42 (Noir)", status: "Colis prêt", time: "Il y a 5 min", price: "18 500 F", momo: "MTN MoMo reçu" },
        { label: "Ensemble Polo Coton Bio • Taille L", status: "En cours", time: "Il y a 11 min", price: "12 000 F", momo: "Moov Money reçu" },
        { label: "Montre Chrono Minimalist Gold", status: "Expédié", time: "Il y a 22 min", price: "24 000 F", momo: "Celtiis Cash reçu" }
      ],
      features: ["Fiches multi-photos & sélection des tailles", "Gestion instantanée du stock", "Adresses de livraison précises sans DM"]
    },
    hotel: {
      tag: "SPÉCIAL HÔTELS, RÉSIDENCES & AUBERGES",
      title: "Palmier Royal Résidence & Suites",
      badge: "Command Center Hôtel",
      subtitle: "Planning direct • 8 suites occupées ce week-end",
      kpi: "230 000 F encaissés",
      items: [
        { label: "Suite Junior Deluxe • 3 Nuits (Arrivée 14h)", status: "Confirmé", time: "Aujourd'hui", price: "75 000 F", momo: "Acompte MoMo reçu" },
        { label: "Chambre Executive King • 2 Nuits", status: "Check-in prêt", time: "Demain", price: "60 000 F", momo: "Solde réglé" },
        { label: "Résidence Meublée F3 • Séjour 5 Nuits", status: "En cours", time: "Ce vendredi", price: "150 000 F", momo: "Caution reçue" }
      ],
      features: ["Réservation de nuitées sans intermédiaire", "Encaissement des acomptes direct", "Fini les réservations fantômes sans suite"]
    }
  };

  const currentPreview = sectorPreviews[activeSector];

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-white pt-6 pb-20 sm:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-orange-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 relative z-30">
        <nav className="flex items-center justify-between py-4 px-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-bolt text-lg"></i>
            </div>
            <div>
              <span className="font-heading font-black text-xl tracking-tighter uppercase text-white block leading-none">
                ORESTO
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary block mt-0.5">
                SaaS Métier
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-white/70">
            <a href="#probleme" className="hover:text-primary transition-colors no-underline">Le Problème</a>
            <a href="#solution" className="hover:text-primary transition-colors no-underline">La Solution</a>
            <a href="#demo" className="hover:text-primary transition-colors no-underline">Démonstration</a>
            <a href="#pricing" className="hover:text-primary transition-colors no-underline">Tarifs</a>
            <a href="#faq" className="hover:text-primary transition-colors no-underline">FAQ</a>
          </div>

          {/* Right Action */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-white/80 hover:text-white transition-colors no-underline"
            >
              Connexion
            </Link>
            <Link
              to={`/register?sector=${activeSector}`}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-orange-600 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary/30 active:scale-95 no-underline flex items-center gap-2"
            >
              <span>Essai Gratuit 14 Jours</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white/80 hover:text-white"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <a href="#probleme" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-white/80 uppercase">Le Problème</a>
            <a href="#solution" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-white/80 uppercase">La Solution</a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-white/80 uppercase">Démonstration</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-white/80 uppercase">Tarifs</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-xs font-bold text-white/80 uppercase">FAQ</a>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link to="/login" className="w-full py-2.5 text-center text-xs font-bold text-white bg-white/5 rounded-xl">Connexion</Link>
              <Link to={`/register?sector=${activeSector}`} className="w-full py-3 text-center text-xs font-black uppercase tracking-wider text-white bg-primary rounded-xl">Essai Gratuit 14 Jours</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Hero Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
        
        {/* Top Guarantee Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-primary/40 text-primary text-xs font-black uppercase tracking-widest mb-6 shadow-sm shadow-primary/10"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>14 JOURS D'ESSAI 100% GRATUIT • 0% DE COMMISSION • MOMO DIRECT</span>
        </motion.div>

        {/* Powerful Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6"
        >
          Transformez votre commerce en <span className="text-primary underline decoration-primary/30 decoration-wavy">machine de vente</span> en ligne.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-10"
        >
          Sans dépendre des intermédiaires, sans payer 25% de commission, et sans passer vos journées à renvoyer des photos dans les DM WhatsApp. Votre site pro opérationnel en 12 minutes.
        </motion.p>

        {/* The 3 Profile Switcher Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl mx-auto mb-10 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-1 shadow-xl"
        >
          <button
            type="button"
            onClick={() => onSelectSector("restaurant")}
            className={`flex-1 py-3 px-3 rounded-xl font-heading text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeSector === "restaurant"
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-utensils"></i>
            <span>Restaurant</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSector("ecommerce")}
            className={`flex-1 py-3 px-3 rounded-xl font-heading text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeSector === "ecommerce"
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-bag-shopping"></i>
            <span>Boutique</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSector("hotel")}
            className={`flex-1 py-3 px-3 rounded-xl font-heading text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              activeSector === "hotel"
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <i className="fa-solid fa-hotel"></i>
            <span>Hôtel</span>
          </button>
        </motion.div>

        {/* CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
        >
          <Link
            to={`/register?sector=${activeSector}`}
            className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-primary hover:bg-orange-600 text-white font-heading font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 no-underline"
          >
            <span>Démarrer mes 14 jours d'essai gratuit</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-6 py-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 no-underline"
          >
            <i className="fa-solid fa-play text-primary text-xs"></i>
            <span>Tester la démo en direct</span>
          </a>
        </motion.div>

        <p className="text-xs text-white/40 font-medium mb-12 sm:mb-16">
          <i className="fa-solid fa-check text-emerald-400 mr-1.5"></i> Aucune carte bancaire requise 
          <span className="mx-2">•</span>
          <i className="fa-solid fa-bolt text-primary mr-1.5"></i> Votre site prêt en 12 minutes 
          <span className="mx-2">•</span>
          <i className="fa-solid fa-lock text-white/60 mr-1.5"></i> Annulation libre en 1 clic
        </p>

        {/* Live Interactive Command Center Preview Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="max-w-4xl mx-auto rounded-[32px] sm:rounded-[40px] bg-[#121212] border-2 border-white/10 p-5 sm:p-8 shadow-2xl text-left relative overflow-hidden"
        >
          {/* Header of the mock dashboard */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-mono">
                  SYSTÈME ACTIF • ENCAISSEMENT DIRECT
                </span>
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
                {currentPreview.title}
              </h2>
              <p className="text-xs text-white/50">{currentPreview.subtitle}</p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs flex items-center gap-2">
              <i className="fa-solid fa-wallet text-sm"></i>
              <span>{currentPreview.kpi} (0% commission)</span>
            </div>
          </div>

          {/* 3 Real-time Order Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {currentPreview.items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between text-[11px] font-bold text-white/50">
                  <span>{item.time}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-[10px]"></i> {item.momo}
                  </span>
                </div>
                <p className="font-heading font-bold text-sm text-white line-clamp-1">{item.label}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="font-heading font-black text-primary text-sm">{item.price}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sector Key Benefits list */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 text-xs text-white/70">
            {currentPreview.features.map((feat, fidx) => (
              <div key={fidx} className="flex items-center gap-2">
                <i className="fa-solid fa-check text-primary"></i>
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
