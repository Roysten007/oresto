import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                ORESTO
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  PRO
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#probleme" className="hover:text-amber-400 transition-colors">
              Pourquoi Oresto ?
            </a>
            <a href="#solution" className="hover:text-amber-400 transition-colors">
              Fonctionnalités
            </a>
            <a href="#demo" className="hover:text-amber-400 transition-colors">
              Démo en direct
            </a>
            <a href="#tarifs" className="hover:text-amber-400 transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all group"
            >
              <span>Essai gratuit 14 jours</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a href="#probleme" className="py-2 hover:text-amber-400" onClick={() => setOpen(false)}>
              Pourquoi Oresto ?
            </a>
            <a href="#solution" className="py-2 hover:text-amber-400" onClick={() => setOpen(false)}>
              Fonctionnalités
            </a>
            <a href="#demo" className="py-2 hover:text-amber-400" onClick={() => setOpen(false)}>
              Démo en direct
            </a>
            <a href="#tarifs" className="py-2 hover:text-amber-400" onClick={() => setOpen(false)}>
              Tarifs (5 000 FCFA)
            </a>
            <a href="#faq" className="py-2 hover:text-amber-400" onClick={() => setOpen(false)}>
              Questions Fréquentes
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <Link
              to="/login"
              className="text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="text-center py-3 rounded-xl bg-amber-500 text-slate-950 text-sm font-extrabold uppercase tracking-wider"
              onClick={() => setOpen(false)}
            >
              Démarrer l'essai 14 jours
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
