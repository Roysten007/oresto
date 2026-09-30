import React from "react";

export interface DashboardScreenshot {
  id: string;
  title: string;
  sectorBadge: string;
  badgeColor: string;
  sectorIcon: string;
  urlPill: string;
  statusBadge: string;
  src: string;
  mobileSrc: string;
  alt: string;
  description: string;
}

const DASHBOARDS: DashboardScreenshot[] = [
  {
    id: "restaurant",
    title: "Tableau de bord restaurant & fast-food",
    sectorBadge: "Restaurant",
    badgeColor: "bg-orange-500/10 text-orange-600 border-orange-200/60",
    sectorIcon: "fa-utensils",
    urlPill: "oresto.app/resto/commandes-live",
    statusBadge: "Cuisine ouverte • Synchronisé MoMo",
    src: "/screenshots/dashboard-restaurant.jpg",
    mobileSrc: "/screenshots/dashboard-restaurant-mobile.jpg",
    alt: "Tableau de bord Restaurant Oresto - Commandes en direct, suivi cuisine et encaissements Mobile Money",
    description: "Commandes cuisine en direct, livreurs, recettes 100% MoMo sans commission et QR codes de table.",
  },
  {
    id: "boutique",
    title: "Tableau de bord e-commerce & vente en ligne",
    sectorBadge: "Boutique",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-200/60",
    sectorIcon: "fa-bag-shopping",
    urlPill: "oresto.app/boutique/expeditions",
    statusBadge: "Boutique ouverte • 0% commission",
    src: "/screenshots/dashboard-boutique.jpg",
    mobileSrc: "/screenshots/dashboard-boutique-mobile.jpg",
    alt: "Tableau de bord E-commerce Oresto - Ventes boutique, suivi des colis, alertes stock critique",
    description: "Gestion des commandes, colis à expédier, alertes de stock critique et paiements MoMo automatiques.",
  },
  {
    id: "hotel",
    title: "Tableau de bord hôtel & résidences meublées",
    sectorBadge: "Hôtel & résidence",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-200/60",
    sectorIcon: "fa-hotel",
    urlPill: "oresto.app/hotel/reservations",
    statusBadge: "Réception ouverte • 75% occupé",
    src: "/screenshots/dashboard-hotel.jpg",
    mobileSrc: "/screenshots/dashboard-hotel-mobile.jpg",
    alt: "Tableau de bord Hôtel Oresto - Gestion des nuitées, arrivées check-in et état des chambres en direct",
    description: "Suivi des réservations et arrivées en temps réel, calendrier des nuitées et encaissements directs.",
  },
  {
    id: "partenaire",
    title: "Espace apporteur d'affaires & affiliation",
    sectorBadge: "Partenaire",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200/60",
    sectorIcon: "fa-handshake",
    urlPill: "oresto.app/partenaire/commissions",
    statusBadge: "Commission permanente 20%",
    src: "/screenshots/dashboard-apporteur.jpg",
    mobileSrc: "/screenshots/dashboard-apporteur-mobile.jpg",
    alt: "Espace Apporteur d'Affaires Oresto - Lien de parrainage personnel et commissions récurrentes MoMo",
    description: "Lien de parrainage WhatsApp, 20% de commissions récurrentes chaque mois sur chaque client parrainé.",
  },
];

export default function HeroDashboardCarousel() {
  // Duplication de la liste pour défilement infini 100% continu sans saccade
  const loopedDashboards = [...DASHBOARDS, ...DASHBOARDS];

  return (
    <div className="relative w-full overflow-hidden mt-10 sm:mt-14 select-none">
      {/* Halo lumineux doux en arrière plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-gradient-to-r from-orange-400/10 via-amber-300/10 to-orange-400/10 blur-3xl pointer-events-none rounded-full" />

      {/* Dégradés latéraux d'atténuation (Fade out progressif sur les bords gauche et droit) */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 md:w-56 lg:w-72 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 md:w-56 lg:w-72 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-20"
        aria-hidden="true"
      />

      {/* Marquee Track à défilement fluide infini */}
      <div className="flex w-max items-center gap-6 sm:gap-8 lg:gap-10 animate-scroll-left hover:[animation-play-state:paused] py-4 px-4">
        {loopedDashboards.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="relative flex-shrink-0 w-[min(330px,calc(100vw-32px))] sm:w-[500px] md:w-[600px] lg:w-[660px] rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-zinc-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col text-left transition-transform duration-300"
          >
            {/* Header façon Navigateur Mac / App Dashboard */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-zinc-50/90 border-b border-zinc-200/80">
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-red-600/30 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-amber-600/30 inline-block" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-emerald-600/30 inline-block" />
              </div>

              {/* URL pill central */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/80 shadow-xs max-w-[210px] sm:max-w-xs">
                <i className="fa-solid fa-lock text-[10px] text-emerald-600"></i>
                <span className="text-[11px] sm:text-xs font-mono font-medium text-zinc-600 truncate">
                  {item.urlPill}
                </span>
              </div>

              {/* Badge secteur / statut */}
              <div className="flex items-center gap-2">
                <span
                  className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sub font-bold border ${item.badgeColor}`}
                >
                  <i className={`fa-solid ${item.sectorIcon} text-[9px]`}></i>
                  <span>{item.sectorBadge}</span>
                </span>
                <span className="inline-flex sm:hidden w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Vue d'écran / Screenshot */}
            <div className="relative w-full bg-zinc-100 overflow-hidden aspect-[16/9.4]">
              <img
                src={item.src}
                srcSet={`${item.mobileSrc} 400w, ${item.src} 720w`}
                sizes="(max-width: 640px) 330px, 660px"
                alt={item.alt}
                width="720"
                height="410"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Sous-barre descriptive avec micro-stats */}
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-sub font-bold text-zinc-900 truncate text-[11px] sm:text-xs">
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-sub font-semibold text-zinc-500 shrink-0">
                {item.statusBadge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Petit indicateur d'interaction discret */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] font-sub font-medium text-zinc-400">
        <i className="fa-solid fa-arrows-left-right text-[10px] text-zinc-400"></i>
        <span>Défilement automatique • Survolez pour mettre en pause</span>
      </div>
    </div>
  );
}
