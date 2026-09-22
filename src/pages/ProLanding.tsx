import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import LandingHero, { BusinessSector } from '../components/landing/LandingHero';
import LandingProblem from '../components/landing/LandingProblem';
import LandingPivot from '../components/landing/LandingPivot';
import LandingSolution from '../components/landing/LandingSolution';
import LandingInteractiveDemo from '../components/landing/LandingInteractiveDemo';
import LandingValueStack from '../components/landing/LandingValueStack';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingFinalCTA from '../components/landing/LandingFinalCTA';
import LandingWhatsAppFloat from '../components/landing/LandingWhatsAppFloat';

export default function ProLanding() {
  const [activeSector, setActiveSector] = useState<BusinessSector>('restaurant');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar />

      <main>
        {/* 1. Hero Section with Sector Switcher & Live Command Center */}
        <LandingHero
          activeSector={activeSector}
          onSelectSector={setActiveSector}
        />

        {/* 2. Surgical Problem Identification */}
        <div id="probleme">
          <LandingProblem activeSector={activeSector} />
        </div>

        {/* 3. The Belief-Shift Pivot (DMs vs Dedicated Sales Engine) */}
        <LandingPivot />

        {/* 4. The Solution: 3 Pillars Tailored to Each Profile */}
        <div id="solution">
          <LandingSolution activeSector={activeSector} />
        </div>

        {/* 5. Interactive Demo (Customer Experience + Instant Merchant Alert) */}
        <div id="demo">
          <LandingInteractiveDemo
            activeSector={activeSector}
            onSelectSector={setActiveSector}
          />
        </div>

        {/* 6. Value Stack & Honest Pricing (14 days free trial -> 5,000 FCFA/mo, 0% commission) */}
        <div id="tarifs">
          <LandingValueStack activeSector={activeSector} />
        </div>

        {/* 7. FAQ & Objection Handling */}
        <div id="faq">
          <LandingFAQ />
        </div>

        {/* 8. Final Contrast & High-Intent CTA */}
        <LandingFinalCTA />
      </main>

      {/* Floating WhatsApp Action (+229 01 43 40 53 61) */}
      <LandingWhatsAppFloat />

      {/* Modernized Footer */}
      <Footer />
    </div>
  );
}
