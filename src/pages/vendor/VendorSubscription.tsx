import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  confirmVendorSubscriptionPayment, 
  FIRST_MONTH_PRICE,
  STANDARD_PLAN_PRICE,
  PLANS 
} from "@/services/subscriptionService";
import { 
  Check, 
  Sparkles, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  History,
  CheckCircle2,
  Lock,
  Calendar,
  Bell
} from "lucide-react";
import { toast } from "sonner";

export default function VendorSubscription() {
  const { vendorProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subStatus = vendorProfile?.subscriptionStatus || "trial";
  const trialEndsAt = vendorProfile?.trialEndsAt || Date.now() + 30 * 24 * 60 * 60 * 1000;
  const nextBillingDate = vendorProfile?.nextBillingDate || trialEndsAt;
  const pendingInvoice = vendorProfile?.pendingInvoice;
  const paymentHistory = vendorProfile?.paymentHistory || [];

  const isFirstPayment = !paymentHistory || paymentHistory.length === 0;
  const payAmount = isFirstPayment ? FIRST_MONTH_PRICE : STANDARD_PLAN_PRICE;

  const daysLeftInTrial = Math.max(0, Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)));
  const daysUntilDue = Math.max(0, Math.ceil((nextBillingDate - Date.now()) / (1000 * 60 * 60 * 24)));
  const graceDaysLeft = subStatus === "pending_payment" ? Math.max(0, 3 - Math.floor((Date.now() - nextBillingDate) / (1000 * 60 * 60 * 24))) : 3;

  const handlePayNowSimulation = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre abonnement Oresto Pro est actif.");
      setShowPaymentModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
          Mon <span className="text-primary">Abonnement</span>
        </h1>
        <p className="font-sub text-sm text-muted-foreground mt-1">
          Formule unique Oresto Pro • Facturation mensuelle Mobile Money (Maketou)
        </p>
      </div>

      {/* Subscription Status Banner */}
      <div className="p-8 rounded-[36px] bg-card border-2 border-border shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Formule ORESTO PRO (0% comm)
              </span>
              {subStatus === "trial" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Essai Gratuit Actif ({daysLeftInTrial}j restants)
                </span>
              )}
              {subStatus === "active" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Abonnement Actif
                </span>
              )}
              {subStatus === "pending_payment" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
                  <Clock size={12} /> Période de grâce ({graceDaysLeft}j restants)
                </span>
              )}
              {(subStatus === "blocked" || subStatus === "restricted") && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1">
                  <Lock size={12} /> Bloqué (Impayé)
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              {subStatus === "trial" && `Gratuit jusqu'au ${new Date(trialEndsAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "active" && `Prochaine échéance le ${new Date(nextBillingDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "pending_payment" && `Échéance dépassée — ${graceDaysLeft} jours de grâce pour régulariser`}
              {(subStatus === "blocked" || subStatus === "restricted") && "Boutique suspendue — Veuillez régler votre abonnement"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {subStatus === "trial" 
                ? `Profitez de toutes les fonctionnalités d'Oresto Pro sans frais jusqu'au lancement officiel. Premier mois à ${FIRST_MONTH_PRICE.toLocaleString()} FCFA (-50%).`
                : `Abonnement mensuel de ${STANDARD_PLAN_PRICE.toLocaleString()} FCFA/mois via Mobile Money (Maketou).`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            {(subStatus === "pending_payment" || subStatus === "blocked" || subStatus === "restricted") && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-105 transition-all flex items-center gap-2 animate-bounce"
              >
                <CreditCard size={16} /> Régler ({payAmount.toLocaleString()} F)
              </button>
            )}
            {subStatus === "trial" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 rounded-2xl border-2 border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-all"
              >
                Simuler le paiement Maketou ({payAmount.toLocaleString()} F)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cycle de Facturation Timeline */}
      <div className="p-8 rounded-[36px] bg-card border-2 border-border space-y-6">
        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> Cycle de Facturation Oresto Pro
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary inline-block">
              1. Relance J-7 (1 semaine avant)
            </span>
            <h4 className="font-bold text-sm">Notification d'anticipation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le site commence à vous notifier sur votre tableau de bord et par message pour préparer votre renouvellement en toute sérénité.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 inline-block">
              2. Jour J — Grâce de 3 jours
            </span>
            <h4 className="font-bold text-sm">Délai de grâce actif</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              À la date limite, votre boutique reste active pendant 3 jours supplémentaires pour vous laisser le temps de finaliser le règlement.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 inline-block">
              3. J+3 — Suspension si impayé
            </span>
            <h4 className="font-bold text-sm">Blocage automatique</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Si aucun paiement n'est effectué après les 3 jours de grâce, l'espace commerçant et les commandes sur la vitrine se bloquent jusqu'au règlement.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Features Card */}
      <div className="p-8 rounded-[36px] border-2 border-primary/40 bg-card space-y-6 relative shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Formule Tout Inclus</span>
            <h3 className="text-2xl font-black tracking-tight">ORESTO PRO</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">5 000</span>
            <span className="text-sm font-bold text-muted-foreground">FCFA / mois</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-2">
              -50% 1er mois = 2 500 F
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          {[
            "Site Web autonome sur-mesure",
            "0% de commission sur vos ventes",
            "Catalogue illimité (Plats / Chambres)",
            "Commandes directes & WhatsApp",
            "Paiements Mobile Money intégrés",
            "Assistant IA Opérationnel IZA",
            "Programme fidélité & avis",
            "Support prioritaire 7j/7"
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Check size={12} />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="p-8 rounded-[36px] bg-card border-2 border-border shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <History size={20} className="text-primary" />
            <h3 className="text-lg font-black uppercase tracking-tight">Historique des Paiements</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-widest font-black">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Formule</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Référence Maketou</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((p, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-bold">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                    <td className="py-4 px-4 uppercase font-black text-primary">ORESTO PRO</td>
                    <td className="py-4 px-4 font-bold">{p.amount.toLocaleString()} FCFA</td>
                    <td className="py-4 px-4 text-muted-foreground font-mono">{p.invoiceId || p.paymentRef || "MAKETOU_SIM"}</td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase">
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

      {/* Maketou Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border-2 border-border p-8 rounded-[40px] shadow-2xl max-w-md w-full space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Paiement Mobile Money</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Passerelle Maketou</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground text-sm font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Formule</span>
                <span className="font-black text-foreground uppercase">ORESTO PRO</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Offre appliquée</span>
                <span className="font-bold text-emerald-600">
                  {isFirstPayment ? "50% de réduction (1er mois)" : "Tarif standard"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-border">
                <span>Montant à régler</span>
                <span className="text-primary">{payAmount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed italic">
              L'API Maketou génère une demande de paiement vers votre numéro MTN Mobile Money ou Moov Money.
            </p>

            <button
              disabled={isProcessing}
              onClick={handlePayNowSimulation}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? "Validation en cours..." : "Confirmer le paiement (Simulation)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
