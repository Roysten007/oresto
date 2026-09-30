import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import LandingHero, { BusinessSector } from '../components/landing/LandingHero';
import LandingPaymentMarquee from '../components/landing/LandingPaymentMarquee';
import LandingProblem from '../components/landing/LandingProblem';
import LandingPivot from '../components/landing/LandingPivot';
import LandingSolution from '../components/landing/LandingSolution';
import LandingIzaSection from '../components/landing/LandingIzaSection';
import LandingReviews from '../components/landing/LandingReviews';
import LandingValueStack from '../components/landing/LandingValueStack';
import LandingAffiliateSection from '../components/landing/LandingAffiliateSection';
import LandingChoiceComparison from '../components/landing/LandingChoiceComparison';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFinalCTA from '../components/landing/LandingFinalCTA';
import LandingWhatsAppFloat from '../components/landing/LandingWhatsAppFloat';

const AIChatBot = React.lazy(() => import('../components/AIChatBot'));

export default function ProLanding() {
  const [activeSector, setActiveSector] = useState<BusinessSector>('restaurant');

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sub selection:bg-orange-100 selection:text-[#EA580C] overflow-x-hidden">
      {/* Sticky Navigation Flottante */}
      <Navbar />

      <main>
        {/* 1. Hero Section épuré (strictement 3 lignes, boutons, badges réassurance) */}
        <LandingHero
          activeSector={activeSector}
          onSelectSector={setActiveSector}
        />

        {/* 2. Identification chirurgicale du problème */}
        <div id="probleme">
          <LandingProblem activeSector={activeSector} />
        </div>

        {/* 3. Le Pivot (WhatsApp DMs vs Véritable machine de vente Oresto) */}
        <LandingPivot />

        {/* 4. La Solution Oresto pour chaque profil */}
        <div id="fonctionnalites">
          <LandingSolution activeSector={activeSector} />
        </div>

        {/* 5. Bandeau Opérateurs Mobile Money (MTN MoMo, Moov, Celtiis, Wave, 0% commission) */}
        <LandingPaymentMarquee />

        {/* 6. Section Dédiée IZA AI : L'Assistant IA Commercial connecté */}
        <LandingIzaSection />

        {/* 7. Retours d'expérience & Avis commerçants vérifiés */}
        <LandingReviews />

        {/* 8. Offre & Tarifs transparents (3 formules en cartes côte à côte, 0% commission) */}
        <div id="tarifs">
          <LandingValueStack activeSector={activeSector} />
        </div>

        {/* 9. Devenir Partenaire & Affiliation (20% récurrents) */}
        <LandingAffiliateSection />

        {/* 10. Le Choix : Statu Quo vs Automatiser avec Oresto (juste avant la FAQ) */}
        <LandingChoiceComparison />

        {/* 11. FAQ & Traitement des objections réelles */}
        <div id="faq">
          <LandingFAQ />
        </div>

        {/* 12. Appel à l'action final */}
        <LandingFinalCTA />
      </main>

      {/* Bouton WhatsApp flottant */}
      <LandingWhatsAppFloat />

      {/* Assistant IA Flottant IZA */}
      <React.Suspense fallback={null}>
      <AIChatBot mode="landing" />
      </React.Suspense>

      {/* Footer officiel */}
      <Footer />
    </div>
  );
}
