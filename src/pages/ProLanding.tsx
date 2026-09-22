import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import LandingHero, { BusinessSector } from '../components/landing/LandingHero';
import LandingPaymentMarquee from '../components/landing/LandingPaymentMarquee';
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
    <div className="min-h-screen bg-[#fbfaff] text-[#0f0a1f] font-jakarta selection:bg-violet-200 selection:text-[#6633d6] overflow-x-hidden">
      {/* Sticky Navigation Flottante */}
      <Navbar />

      <main>
        {/* 1. Hero Section with Sector Switcher & Live Command Center (SasPay Style) */}
        <LandingHero
          activeSector={activeSector}
          onSelectSector={setActiveSector}
        />

        {/* 2. Payment Operators Marquee (MTN MoMo, Moov, Celtiis, Wave, 0% commission) */}
        <LandingPaymentMarquee />

        {/* 3. Surgical Problem Identification */}
        <div id="probleme">
          <LandingProblem activeSector={activeSector} />
        </div>

        {/* 4. The Belief-Shift Pivot (WhatsApp DMs vs Dedicated Sales Engine) */}
        <LandingPivot />

        {/* 5. The Solution: 3 Pillars Tailored to Each Profile */}
        <div id="solution">
          <LandingSolution activeSector={activeSector} />
        </div>

        {/* 6. Interactive Demo (Customer Experience + Instant Merchant Alert) */}
        <div id="demo">
          <LandingInteractiveDemo
            activeSector={activeSector}
            onSelectSector={setActiveSector}
          />
        </div>

        {/* 7. Value Stack & Honest Pricing (14 days free trial -> 5,000 FCFA/mo, 0% commission) */}
        <div id="tarifs">
          <LandingValueStack activeSector={activeSector} />
        </div>

        {/* 8. FAQ & Objection Handling */}
        <div id="faq">
          <LandingFAQ />
        </div>

        {/* 9. Final Contrast & High-Intent CTA */}
        <LandingFinalCTA />
      </main>

      {/* Floating WhatsApp Action (+229 01 43 40 53 61) */}
      <LandingWhatsAppFloat />

      {/* Modernized SasPay-Style Footer */}
      <Footer />
    </div>
  );
}
