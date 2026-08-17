import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  confirmVendorSubscriptionPayment, 
  updateVendorSubscriptionPlan,
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
  Lock
} from "lucide-react";
import { toast } from "sonner";

export default function VendorSubscription() {
  const { vendorProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const plan = vendorProfile?.subscriptionPlan || "starter";
  const subStatus = vendorProfile?.subscriptionStatus || "trial";
  const trialEndsAt = vendorProfile?.trialEndsAt || Date.now() + 30 * 24 * 60 * 60 * 1000;
  const nextBillingDate = vendorProfile?.nextBillingDate || trialEndsAt;
  const pendingInvoice = vendorProfile?.pendingInvoice;
  const paymentHistory = vendorProfile?.paymentHistory || [];

  const daysLeftInTrial = Math.max(0, Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)));
  const daysUntilDue = Math.max(0, Math.ceil((nextBillingDate - Date.now()) / (1000 * 60 * 60 * 24)));

  const handlePayNowSimulation = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, pendingInvoice?.id);
      toast.success("🎉 Paiement simulé avec succès ! Votre abonnement est réactivé.");
      setShowPaymentModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePlan = async (newPlan: "starter" | "pro") => {
    if (!db || !vendorProfile?.id) return;
    if (newPlan === plan) return;
    setIsProcessing(true);
    try {
      await updateVendorSubscriptionPlan(db, vendorProfile.id, newPlan);
      toast.success(`Formule mise à jour vers ${newPlan === "pro" ? "Pro" : "Starter"}`);
    } catch (err) {
      toast.error("Erreur de changement de formule.");
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
          Gérez votre formule, vos factures et votre cycle de facturation mensuel
        </p>
      </div>

      {/* Subscription Status Banner */}
      <div className="p-8 rounded-[36px] bg-card border-2 border-border shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Formule {plan === "pro" ? "PRO (0% comm)" : "STARTER (2% comm)"}
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
                  <Clock size={12} /> Paiement en attente
                </span>
              )}
              {subStatus === "restricted" && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1">
                  <Lock size={12} /> Restreint (Impayé)
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black tracking-tight">
              {subStatus === "trial" && `Gratuit jusqu'au ${new Date(trialEndsAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "active" && `Prochaine échéance le ${new Date(nextBillingDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {subStatus === "pending_payment" && "Renouvellement en cours — Action requise"}
              {subStatus === "restricted" && "Commandes suspendues — Veuillez régler votre abonnement"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              {subStatus === "trial" 
                ? "Profitez de toutes les fonctionnalités d'Oresto Connect sans frais jusqu'au lancement officiel."
                : `Facturation mensuelle de ${PLANS[plan].price.toLocaleString()} FCFA/mois via Mobile Money (Maketou).`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            {(subStatus === "pending_payment" || subStatus === "restricted") && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 hover:scale-105 transition-all flex items-center gap-2 animate-bounce"
              >
                <CreditCard size={16} /> Régler maintenant ({PLANS[plan].price.toLocaleString()} F)
              </button>
            )}
            {subStatus === "trial" && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 rounded-2xl border-2 border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-all"
              >
                Simuler le paiement Maketou
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-6">Nos Formules Officielles</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* STARTER */}
          <div className={`p-8 rounded-[36px] border-2 bg-card space-y-6 relative transition-all ${
            plan === "starter" ? "border-primary shadow-xl ring-2 ring-primary/20" : "border-border"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Formule de démarrage</span>
                <h3 className="text-2xl font-black tracking-tight">STARTER</h3>
              </div>
              {plan === "starter" && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-white">
                  Actuel
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-foreground">3 000</span>
                <span className="text-sm font-bold text-muted-foreground">FCFA / mois</span>
              </div>
              <p className="text-xs text-primary font-bold mt-1">2% de commission sur les commandes</p>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border">
              {[
                "Site Web autonome sur-mesure (Site Factory)",
                "Catalogue illimité (Plats & Chambres)",
                "Commandes en direct & WhatsApp",
                "Paiements Mobile Money (MTN & Moov)",
                "Support standard 7j/7"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-medium text-foreground">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button
              disabled={plan === "starter" || isProcessing}
              onClick={() => handleChangePlan("starter")}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                plan === "starter" 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-black text-white hover:bg-primary"
              }`}
            >
              {plan === "starter" ? "Votre formule actuelle" : "Basculer vers Starter"}
            </button>
          </div>

          {/* PRO */}
          <div className={`p-8 rounded-[36px] border-2 bg-card space-y-6 relative transition-all ${
            plan === "pro" ? "border-primary shadow-xl ring-2 ring-primary/20" : "border-border"
          }`}>
            <span className="absolute -top-3 right-8 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-white shadow-lg shadow-primary/25">
              Recommandé • 0% Commission
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary font-bold">Performance Maximale</span>
                <h3 className="text-2xl font-black tracking-tight">PRO</h3>
              </div>
              {plan === "pro" && (
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary text-white">
                  Actuel
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight text-foreground">5 000</span>
                <span className="text-sm font-bold text-muted-foreground">FCFA / mois</span>
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-1">✨ 0% de commission (100% de vos gains)</p>
            </div>

            <ul className="space-y-3 pt-4 border-t border-border">
              {[
                "Tout ce qui est inclus dans Starter",
                "0% de commission sur vos ventes",
                "Assistant IA Opérationnel IZA intégré",
                "Programme de fidélité & avis clients",
                "Statistiques financières avancées",
                "Support VIP prioritaire WhatsApp"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-medium text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button
              disabled={plan === "pro" || isProcessing}
              onClick={() => handleChangePlan("pro")}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                plan === "pro" 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20"
              }`}
            >
              {plan === "pro" ? "Votre formule actuelle" : "Passer à la formule Pro"}
            </button>
          </div>
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
                    <td className="py-4 px-4 uppercase font-black text-primary">{p.plan}</td>
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
                <span className="font-black text-foreground uppercase">{plan}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Période</span>
                <span className="font-bold text-foreground">1 Mois (Renouvellement)</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-border">
                <span>Montant à régler</span>
                <span className="text-primary">{PLANS[plan].price.toLocaleString()} FCFA</span>
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
