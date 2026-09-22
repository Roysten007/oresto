import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingFinalCTA: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden text-white border-t border-slate-800">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#f59e0b15,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Contrast Comparison (Option A vs Option B) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Vous avez deux manières de gérer votre commerce aujourd'hui
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Laquelle choisissez-vous pour les prochains mois ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-stretch">
          {/* Option A: Status Quo */}
          <div className="p-8 rounded-3xl bg-slate-950/70 border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider mb-4">
                <XCircle className="w-5 h-5 shrink-0" />
                Option 1 : Le statu quo épuisant
              </div>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">•</span>
                  <span>Passer des heures à répéter les mêmes prix et envoyer des photos floues sur WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">•</span>
                  <span>Perdre des clients le soir ou le week-end parce que personne n'est dispo pour répondre en 2 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">•</span>
                  <span>Attendre les captures de paiement MoMo, vérifier manuellement chaque transaction et gérer les erreurs de commande</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
              Résultat : fatigue quotidienne et chiffre d'affaires plafonné.
            </div>
          </div>

          {/* Option B: Oresto */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 to-slate-950 border-2 border-amber-500/40 flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3.5 right-6 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
              Choix Recommandé
            </div>

            <div>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Option 2 : Automatiser avec Oresto
              </div>
              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Un site pro & un QR code élégant opérationnels en 15 minutes chrono</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Les commandes arrivent avec adresses, choix et paiements MoMo déjà validés à 100%</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Un assistant IA pour répondre 24h/24 et un support humain local réactif</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-amber-300 font-semibold text-center">
              Résultat : temps gagné, professionnalisme accru et ventes multipliées.
            </div>
          </div>
        </div>

        {/* Final CTA Box */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 text-center shadow-2xl shadow-amber-500/20 relative">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-slate-950">
            Passez au niveau supérieur dès aujourd'hui
          </h3>
          <p className="text-slate-900 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
            Activez votre essai gratuit de 14 jours. Configurez votre catalogue ou menu, imprimez votre QR code et recevez vos premières commandes sans dépenser un franc.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 font-black text-base shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Activer mes 14 jours d'essai gratuit</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-900 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Annulation en 1 clic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Assistance locale Bénin au +229 01 43 40 53 61</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFinalCTA;
