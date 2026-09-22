import { Link } from "react-router-dom";
import { BusinessSector } from "./LandingHero";

interface LandingSolutionProps {
  activeSector: BusinessSector;
}

export default function LandingSolution({ activeSector }: LandingSolutionProps) {
  const pillars = [
    {
      num: "01",
      icon: "fa-solid fa-wand-magic-sparkles",
      title: "Votre Site Web Pro en 12 Minutes",
      subtitle: "Aucune application à télécharger pour vos clients",
      desc: "Vous obtenez une adresse web personnalisée (ex : oresto.app/r/votre-nom) fluide et ultrarapide sur n'importe quel smartphone. Vos clients cliquent sur votre bio Instagram/TikTok ou scannent le QR Code et commandent en 3 clics.",
      highlights: [
        "Ouverture immédiate dans WhatsApp, Chrome ou Safari",
        "Générateur de QR Codes personnalisés pour tables ou affiches",
        "Photos HD, variantes de tailles/couleurs et fiches détaillées"
      ]
    },
    {
      num: "02",
      icon: "fa-solid fa-money-bill-wave",
      title: "0% de Commission • MoMo Direct",
      subtitle: "100% de vos recettes arrivent sur votre téléphone",
      desc: "L'argent ne transite par aucun compte bancaire intermédiaire. Vos clients payent par MTN Mobile Money, Moov Money ou Celtiis Cash, et chaque franc arrive instantanément sur votre propre solde sans la moindre retenue.",
      highlights: [
        "Zéro commission prélevée sur vos ventes",
        "Notifications de paiement en temps réel",
        "Fini les arnaques aux fausses captures d'écran de virement"
      ]
    },
    {
      num: "03",
      icon: "fa-solid fa-chart-pie",
      title: "Un Tableau de Bord Pensé pour Votre Métier",
      subtitle: "Resto, Boutique ou Hôtel : chacun a ses propres outils",
      desc: "Pas de tableau de bord générique compliqué. Vous pilotez vos commandes en direct, mettez un produit en rupture de stock en 10 secondes, préparez vos expéditions ou gérez vos chambres d'hôtel en toute sérénité.",
      highlights: [
        "Vue claire sur vos recettes journalières nettes",
        "Gestion des ruptures de stock en 1 clic depuis votre mobile",
        "Historique des clients pour fidéliser les habitués"
      ]
    }
  ];

  return (
    <section id="solution" className="py-20 sm:py-28 bg-[#0D0D0D] text-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
            <i className="fa-solid fa-shield-halved"></i>
            LE MOTEUR ORESTO PRO
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            La solution complète qui automatise vos ventes et libère votre temps.
          </h2>
          <p className="text-white/60 text-sm sm:text-base font-medium">
            Trois piliers conçus sur-mesure pour les réalités du commerce en Afrique de l'Ouest :
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[36px] bg-[#141414] border border-white/5 flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
                    <i className={pillar.icon}></i>
                  </div>
                  <span className="font-heading font-black text-3xl text-white/20 group-hover:text-primary/40 transition-colors">
                    {pillar.num}
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl text-white mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs font-bold text-primary mb-4">
                  {pillar.subtitle}
                </p>
                <p className="text-xs text-white/60 leading-relaxed font-body mb-6">
                  {pillar.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-white/80">
                  {pillar.highlights.map((h, hidx) => (
                    <div key={hidx} className="flex items-center gap-2.5">
                      <i className="fa-solid fa-check text-primary text-[10px]"></i>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page Action Banner */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-primary/20 via-[#181818] to-primary/10 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-heading font-black text-2xl text-white">
              Prêt à installer votre vitrine en 12 minutes ?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl">
              Commencez avec 14 jours d'essai sans dépenser un franc. Votre site est mis en ligne instantanément.
            </p>
          </div>
          <Link
            to={`/register?sector=${activeSector}`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-orange-600 text-white font-heading font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/30 shrink-0 text-center no-underline"
          >
            <span>Démarrer mes 14 jours gratuits →</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
