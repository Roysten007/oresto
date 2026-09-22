import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

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
          ? "bg-[#fbfaff]/85 backdrop-blur-md border-b border-violet-100/80 shadow-[0_4px_20px_-4px_rgba(76,40,150,0.06)] py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#6633d6] text-white flex items-center justify-center font-bold text-base shadow-[0_4px_12px_rgba(102,51,214,0.35)] group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#0f0a1f]">
                Oresto
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#6633d6]">
                Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#solutions" className="hover:text-[#6633d6] transition-colors">
              Solutions
            </a>
            <a href="#fonctionnalites" className="hover:text-[#6633d6] transition-colors">
              Fonctionnalités
            </a>
            <a href="#demo" className="hover:text-[#6633d6] transition-colors">
              Démo en direct
            </a>
            <a href="#tarifs" className="hover:text-[#6633d6] transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-[#6633d6] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop Action Buttons (10% Accent) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 hover:text-[#6633d6] transition-colors px-3 py-2"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6633d6] hover:bg-[#5727c7] text-white text-xs font-bold shadow-[0_8px_20px_-4px_rgba(102,51,214,0.45)] hover:shadow-[0_12px_24px_-4px_rgba(102,51,214,0.6)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Essai gratuit 14 jours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#6633d6] hover:bg-violet-50 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-violet-100 px-6 py-6 shadow-xl space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-semibold text-slate-700">
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#6633d6]"
            >
              Solutions (3 Profils)
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#6633d6]"
            >
              Fonctionnalités
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#6633d6]"
            >
              Démo en direct
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#6633d6]"
            >
              Tarifs (5 000 FCFA / mois)
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-[#6633d6]"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold text-sm"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-3 rounded-full bg-[#6633d6] text-white font-bold text-sm shadow-[0_8px_20px_-4px_rgba(102,51,214,0.45)]"
            >
              Démarrer l'essai 14 jours
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
