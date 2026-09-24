import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  confirmVendorSubscriptionPayment, 
  STANDARD_PLAN_PRICE
} from "@/services/subscriptionService";
import { 
  Check, 
  CreditCard, 
  Clock, 
  History,
  Calendar,
  Lock
} from "lucide-react";
import { toast } from "sonner";

export default function VendorSubscription() {
  const { vendorProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subStatus = vendorProfile?.subscriptionStatus || "trial";
  
  // Parsing sécurisé des dates (nombre ou string ISO)
  const parseTimestamp = (val: any, fallback: number) => {
    if (!val) return fallback;
    if (typeof val === "number") return val;
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? fallback : parsed;
  };

  const trialEndsTime = parseTimestamp(vendorProfile?.trialEndsAt, Date.now() + 14 * 86400000);
  const nextBillingTime = parseTimestamp(vendorProfile?.nextBillingDate, trialEndsTime);

  const pendingInvoice = vendorProfile?.pendingInvoice;
  const paymentHistory = vendorProfile?.paymentHistory || [];

  const isFirstPayment = !paymentHistory || paymentHistory.length === 0;
  const payAmount = STANDARD_PLAN_PRICE;

  const daysLeftInTrial = Math.max(0, Math.ceil((trialEndsTime - Date.now()) / (1000 * 60 * 60 * 24)));
  const daysUntilDue = Math.max(0, Math.ceil((nextBillingTime - Date.now()) / (1000 * 60 * 60 * 24)));
  const graceDaysLeft = subStatus === "pending_payment" 
    ? Math.max(0, 3 - Math.floor((Date.now() - nextBillingTime) / (1000 * 60 * 60 * 24))) 
    : 3;

  const handlePayNowSimulation = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre abonnement Oresto Pro est actif.");
      setShowPaymentModal(false);
    } catch {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sub">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
          Mon <span className="text-[#FF6B00]">abonnement</span>
        </h1>
        <p className="text-xs text-zinc-500 font-sub mt-0.5">
          Formule unique Oresto Pro • Facturation mensuelle Mobile Money (0% commission sur vos ventes)
        </p>
      </div>

      {/* Subscription Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-50 text-[#FF6B00] border border-orange-200">
                Formule Oresto Pro (0% commission)
              </span>

              {subStatus === "trial" && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Essai gratuit actif ({daysLeftInTrial} jours restants)
                </span>
              )}
              {subStatus === "active" && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Abonnement actif
                </span>
              )}
              {subStatus === "pending_payment" && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Clock size={12} /> Période de grâce ({graceDaysLeft} jours restants)
                </span>
              )}
              {(subStatus === "blocked" || subStatus === "restricted") && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                  <Lock size={12} /> Bloqué (Impayé)
                </span>
              )}
            </div>

            <h2 className="font-heading font-black text-xl sm:text-2xl text-zinc-950">
              {subStatus === "trial" && `Gratuit jusqu'au ${new Date(trialEndsTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "active" && `Prochaine échéance le ${new Date(nextBillingTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "pending_payment" && `Échéance dépassée — ${graceDaysLeft} jours de grâce pour régulariser`}
              {(subStatus === "blocked" || subStatus === "restricted") && "Espace suspendu — Veuillez régler votre abonnement"}
            </h2>

            <p className="text-xs text-zinc-500 font-sub max-w-xl leading-relaxed">
              {subStatus === "trial" 
                ? `Profitez de toutes les fonctionnalités d'Oresto Pro sans frais pendant vos 14 jours d'essai. Formule à ${STANDARD_PLAN_PRICE.toLocaleString("fr-FR")} FCFA/mois sans engagement.`
                : `Abonnement mensuel de ${STANDARD_PLAN_PRICE.toLocaleString("fr-FR")} FCFA/mois payable directement par Mobile Money.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(subStatus === "pending_payment" || subStatus === "blocked" || subStatus === "restricted") && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 rounded-2xl bg-[#FF6B00] text-white font-sub font-bold text-xs shadow-xs hover:bg-[#EA580C] transition-all flex items-center gap-2"
              >
                <CreditCard size={15} /> Régler ({payAmount.toLocaleString("fr-FR")} F)
              </button>
            )}
            {subStatus === "trial" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sub font-bold text-xs border border-zinc-200 transition-colors"
              >
                Simuler le paiement Mobile Money ({payAmount.toLocaleString("fr-FR")} F)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cycle de Facturation Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-6">
        <h3 className="font-heading font-black text-sm text-zinc-950 flex items-center gap-2">
          <Calendar size={18} className="text-[#FF6B00]" />
          <span>Fonctionnement du cycle de facturation</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-[#FF6B00] inline-block">
              1. Relance J-7 (1 semaine avant)
            </span>
            <h4 className="font-heading font-bold text-xs text-zinc-900">Notification d'anticipation</h4>
            <p className="text-xs text-zinc-500 font-sub leading-relaxed">
              Une notification apparaît sur votre tableau de bord pour vous permettre d'anticiper le renouvellement sans interruption.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 inline-block">
              2. Jour J — Grâce de 3 jours
            </span>
            <h4 className="font-heading font-bold text-xs text-zinc-900">Délai de grâce actif</h4>
            <p className="text-xs text-zinc-500 font-sub leading-relaxed">
              À la date d'échéance, votre vitrine reste 100% active pendant 3 jours supplémentaires pour vous laisser le temps de régler.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200/60 space-y-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800 inline-block">
              3. J+3 — Suspension si impayé
            </span>
            <h4 className="font-heading font-bold text-xs text-zinc-900">Suspension temporaire</h4>
            <p className="text-xs text-zinc-500 font-sub leading-relaxed">
              Si aucun règlement n'a été fait après 3 jours de grâce, l'espace commerçant se met en pause jusqu'au règlement du montant.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Features Card */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-orange-200/80 bg-white space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#FF6B00]">Formule tout inclus</span>
            <h3 className="font-heading font-black text-2xl text-zinc-950">Oresto Pro</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl text-zinc-950">5 000</span>
            <span className="text-xs font-bold text-zinc-500">FCFA / mois</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full ml-2 border border-emerald-100">
              Sans engagement
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-100">
          {[
            "Site web vitrine autonome",
            "0% de commission sur vos ventes",
            "Catalogue illimité d'articles / plats",
            "Commandes directes & WhatsApp",
            "Paiements Mobile Money intégrés",
            "Assistant IA opérationnel",
            "QR codes de tables ou comptoir",
            "Support réactif 7j/7"
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-700">
              <div className="w-5 h-5 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0 border border-orange-100">
                <Check size={12} />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <History size={18} className="text-[#FF6B00]" />
            <h3 className="font-heading font-black text-sm text-zinc-950">Historique des paiements</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 text-[10px] font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Formule</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Référence</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p, idx) => (
                  <tr key={idx} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3.5 px-4 font-bold text-[#FF6B00]">Oresto Pro</td>
                    <td className="py-3.5 px-4 font-bold">{p.amount.toLocaleString("fr-FR")} FCFA</td>
                    <td className="py-3.5 px-4 text-zinc-500 font-mono">{p.invoiceId || p.paymentRef || "MOMO_DIRECT"}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                        Payé
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center border border-orange-100">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-zinc-950">Paiement Mobile Money</h3>
                  <p className="text-[10px] text-zinc-500 font-sub">Règlement direct par MoMo</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-950"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Formule</span>
                <span className="font-bold text-zinc-900">Oresto Pro (Tout inclus)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Engagement</span>
                <span className="font-bold text-emerald-700">Sans engagement (0% commission)</span>
              </div>
              <div className="flex justify-between font-heading font-black text-sm pt-2 border-t border-zinc-200">
                <span>Montant à régler</span>
                <span className="text-[#FF6B00]">{payAmount.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Le paiement est prélevé directement depuis votre compte Mobile Money. Votre abonnement est activé immédiatement.
            </p>

            <button
              disabled={isProcessing}
              onClick={handlePayNowSimulation}
              className="w-full py-3.5 rounded-2xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? "Validation en cours..." : `Confirmer le paiement (${payAmount.toLocaleString("fr-FR")} FCFA)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
