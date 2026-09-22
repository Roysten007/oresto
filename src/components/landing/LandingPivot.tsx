import React from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPivot() {
  return (
    <section className="py-20 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Signature Card */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-zinc-200/90 shadow-float p-8 sm:p-14 relative overflow-hidden text-center sm:text-left">
          
          {/* Subtle Orange Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-6 border border-orange-200">
              <Lightbulb className="w-3.5 h-3.5" />
              La vérité sur votre commerce
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-heading font-black text-zinc-950 tracking-tight leading-snug mb-6 uppercase">
              Le problème ne vient ni de vos produits, ni de vos clients. Le problème est d'utiliser une{" "}
              <span className="text-[#FF6B00]">
                application de discussion
              </span>{" "}
              pour faire tourner un commerce.
            </h2>

            <div className="space-y-4 text-zinc-600 font-sub text-sm sm:text-base leading-relaxed mb-8">
              <p>
                WhatsApp est formidable pour échanger des nouvelles avec vos proches. Mais <strong>ce n'est ni un menu interactif, ni une caisse enregistreuse, ni un gestionnaire de stocks</strong>.
              </p>
              <p>
                Chaque seconde où un client doit attendre que vous soyez disponible pour lui épeler un prix ou lui envoyer une photo, c'est une vente directe qui part chez un concurrent plus rapide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2 group"
              >
                <span>Passer au moteur automatisé</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs font-sub font-bold text-zinc-500 uppercase tracking-wide">
                14 jours d'essai gratuit • Sans engagement
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export { LandingPivot };
