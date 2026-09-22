import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAFA]/90 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo with Montserrat font-heading font-black */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-base shadow-braised group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-tight text-zinc-950 uppercase">
                Oresto
              </span>
              <span className="text-[10px] font-sub font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sub font-bold text-zinc-600">
            <a href="#solutions" className="hover:text-[#FF6B00] transition-colors">
              Solutions
            </a>
            <a href="#fonctionnalites" className="hover:text-[#FF6B00] transition-colors">
              Fonctionnalités
            </a>
            <a href="#demo" className="hover:text-[#FF6B00] transition-colors">
              Démo en direct
            </a>
            <a href="#tarifs" className="hover:text-[#FF6B00] transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-[#FF6B00] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons (10% Accent Orange Braisé) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-sub font-bold text-zinc-700 hover:text-zinc-950 transition-colors px-3 py-2"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-sub font-black uppercase tracking-wider shadow-braised hover:shadow-[0_12px_28px_-4px_rgba(255,107,0,0.5)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Essai gratuit 14 jours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-700 hover:text-[#FF6B00] hover:bg-zinc-100 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAFA]/98 backdrop-blur-xl border-b border-zinc-200 px-6 py-6 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-sub font-bold text-zinc-700">
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FF6B00]"
            >
              Solutions (3 Profils)
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FF6B00]"
            >
              Fonctionnalités
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FF6B00]"
            >
              Démo en direct
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FF6B00]"
            >
              Tarifs (5 000 FCFA / mois)
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#FF6B00]"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-4 border-t border-zinc-200 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-full border border-zinc-300 text-zinc-800 font-sub font-bold text-sm"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-3 rounded-full bg-[#FF6B00] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised"
            >
              Démarrer l'essai 14 jours
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
