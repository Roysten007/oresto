import React from "react";
import { Link } from "react-router-dom";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  business: string;
  location: string;
  sector: string;
  sectorColor: string;
  avatarText: string;
  avatarBg: string;
  quote: string;
  highlightMetric: string;
  metricLabel: string;
  rating: number;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "resto",
    name: "Aminata Sawadogo",
    role: "Gérante",
    business: "Saveurs du Bénin (Restaurant & Grillades)",
    location: "Cotonou • Haie Vive",
    sector: "Restaurant",
    sectorColor: "bg-orange-50 text-orange-600 border-orange-200",
    avatarText: "AS",
    avatarBg: "bg-orange-500",
    quote:
      "Avant, mon équipe passait le coup de feu de midi à épeler les prix du jour au téléphone pendant que les clients en salle attendaient. Avec Oresto, les clients scannent le QR code ou cliquent sur notre bio Instagram, commandent et paient par MTN MoMo. Le ticket arrive tout de suite en cuisine. En plus, on ne verse plus un seul franc de commission aux intermédiaires.",
    highlightMetric: "+180 000 F",
    metricLabel: "économisés en commissions le 1er mois",
    rating: 5,
  },
  {
    id: "boutique",
    name: "Koffi Mensah",
    role: "Fondateur",
    business: "KiffStyle Store (Mode & Prêt-à-porter)",
    location: "Cotonou • Cadjehoun",
    sector: "Boutique & Mode",
    sectorColor: "bg-purple-50 text-purple-600 border-purple-200",
    avatarText: "KM",
    avatarBg: "bg-purple-500",
    quote:
      "Je perdais un temps fou à répondre à 50 messages WhatsApp par jour pour envoyer des photos et des prix, sans compter la vérification des fausses captures MoMo. Aujourd'hui, mon catalogue est à jour avec les stocks restants. Le client valide en 3 clics et je ne m'occupe plus que d'expédier les colis.",
    highlightMetric: "3h gagnées",
    metricLabel: "chaque jour sur les conversations WhatsApp",
    rating: 5,
  },
  {
    id: "hotel",
    name: "Clarisse Agbo",
    role: "Propriétaire",
    business: "Résidence Palmier Royal (Meublés & Suites)",
    location: "Fidjrossè • Plage",
    sector: "Hôtel & Résidence",
    sectorColor: "bg-blue-50 text-blue-600 border-blue-200",
    avatarText: "CA",
    avatarBg: "bg-blue-500",
    quote:
      "Payer 20% de commission sur chaque nuitée aux plateformes de réservation internationales diminuait fortement notre rentabilité. Avec Oresto, les clients de la diaspora et les voyageurs locaux réservent en direct avec un acompte sécurisé par Mobile Money. C'est simple, net et transparent.",
    highlightMetric: "0% retenu",
    metricLabel: "sur les réservations et nuitées",
    rating: 5,
  },
  {
    id: "partenaire",
    name: "Marc Dossou",
    role: "Consultant & Apporteur d'Affaires",
    business: "Partenaire Indépendant Oresto",
    location: "Calavi • Arconville",
    sector: "Partenaire Affilié",
    sectorColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    avatarText: "MD",
    avatarBg: "bg-emerald-500",
    quote:
      "J'ai simplement recommandé Oresto à quelques restaurateurs et commerçants de mon entourage. Ils ont tous basculé sur la formule payante après leurs 14 jours d'essai car l'outil leur fait gagner de l'argent. Chaque mois, je reçois automatiquement mes 20% de commissions par virement MoMo.",
    highlightMetric: "20% récurrents",
    metricLabel: "encaissés chaque mois à vie",
    rating: 5,
  },
];

export default function LandingReviews() {
  return (
    <section id="avis" className="py-24 bg-[#FAFAFA] relative border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-4">
            <i className="fa-solid fa-star text-amber-500"></i>
            <span>Retours d'expérience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight">
            Ils ont remplacé le bricolage WhatsApp par{" "}
            <span className="text-[#FF6B00]">Oresto</span>.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-normal leading-relaxed">
            Découvrez comment des restaurateurs, commerçants et gestionnaires de résidences développent leur activité en toute indépendance.
          </p>
        </div>

        {/* Carrousel Défilant en Continu sur Une Seule Ligne */}
        <div className="relative w-full overflow-hidden my-8 sm:my-12 select-none">
          {/* Dégradés latéraux d'atténuation gauche et droite */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 md:w-56 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 md:w-56 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent z-20"
            aria-hidden="true"
          />

          {/* Marquee Track à défilement fluide infini */}
          <div className="flex w-max items-stretch gap-6 sm:gap-8 animate-scroll-left hover:[animation-play-state:paused] py-4 px-4 cursor-grab active:cursor-grabbing">
            {[...REVIEWS, ...REVIEWS].map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="w-[320px] sm:w-[400px] md:w-[450px] shrink-0 bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm hover:shadow-float hover:border-orange-300/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Card Bar: Sector & Stars */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-sub font-bold border ${review.sectorColor}`}
                    >
                      <span>{review.sector}</span>
                    </span>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-sm text-zinc-700 font-sub leading-relaxed mb-6 italic">
                    « {review.quote} »
                  </p>
                </div>

                {/* Bottom Card: Metric highlight & Author */}
                <div className="pt-4 border-t border-zinc-100 space-y-4">
                  {/* Metric pill */}
                  <div className="flex items-baseline gap-2 bg-orange-50/60 border border-orange-100/80 rounded-2xl px-3.5 py-2">
                    <span className="text-base font-heading font-black text-[#FF6B00]">
                      {review.highlightMetric}
                    </span>
                    <span className="text-xs font-sub font-medium text-zinc-600 line-clamp-1">
                      {review.metricLabel}
                    </span>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl ${review.avatarBg} text-white flex items-center justify-center font-heading font-black text-xs shrink-0 shadow-sm`}
                    >
                      {review.avatarText}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-sm text-zinc-950 truncate">
                          {review.name}
                        </h4>
                        <i
                          className="fa-solid fa-circle-check text-emerald-600 text-xs shrink-0"
                          title="Client vérifié"
                        ></i>
                      </div>
                      <p className="text-xs text-zinc-500 font-sub truncate">
                        {review.role} • {review.business}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-sub">
                        {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateur de pause au survol */}
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] font-sub font-medium text-zinc-400">
            <i className="fa-solid fa-arrows-left-right text-[10px]"></i>
            <span>Défilement continu automatique • Survolez avec la souris pour figer la lecture</span>
          </div>
        </div>

        {/* Reassurance & CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-lg sm:text-xl text-white">
              Prêt à rejoindre ces entrepreneurs ?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sub">
              Créez votre site et testez toutes les fonctionnalités pendant 14 jours gratuits, sans carte bancaire.
            </p>
          </div>

          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2 group shrink-0"
          >
            <span>Démarrer mes 14 jours gratuits</span>
            <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
          </Link>
        </div>

      </div>
    </section>
  );
}
