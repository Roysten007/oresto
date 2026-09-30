import { ref, get, update, Database } from "firebase/database";
import { VendorProfile } from "@/data/mockData";
import { dispatchVendorNotification } from "./notificationService";

export const MAKETOU_SIMULATION_MODE = true;

// Tarifs officiels Oresto
export const MONTHLY_PLAN_PRICE = 5000;
export const ANNUAL_PLAN_PRICE = 50000; // 10 mois payés + 2 mois offerts (économie de 10 000 FCFA)
export const STANDARD_PLAN_PRICE = MONTHLY_PLAN_PRICE;

export const ORESTO_PLANS = {
  monthly: {
    id: "monthly",
    name: "Formule Mensuelle",
    price: MONTHLY_PLAN_PRICE,
    period: "mois",
    description: "5 000 FCFA par mois sans engagement, payable par Mobile Money. Résiliable à tout moment.",
    badge: "Sans engagement",
    billingCycleMonths: 1,
    features: [
      "Site Web autonome sur-mesure (Site Factory)",
      "0% de commission sur vos ventes (100% pour vous)",
      "Catalogue illimité (Plats / Articles / Chambres)",
      "Commandes directes & intégration WhatsApp",
      "Paiements Mobile Money (MTN & Moov)",
      "Assistant IA Opérationnel IZI intégré",
      "Support technique 7j/7"
    ]
  },
  annual: {
    id: "annual",
    name: "Formule Annuelle (2 mois offerts)",
    price: ANNUAL_PLAN_PRICE,
    period: "an",
    description: "50 000 FCFA au lieu de 60 000 FCFA : vous payez 10 mois et bénéficiez de 12 mois complets !",
    badge: "2 mois offerts — Économisez 10 000 F",
    billingCycleMonths: 12,
    features: [
      "Tous les avantages de la Formule Mensuelle",
      "2 mois 100% offerts (10 000 FCFA d'économie directe)",
      "Tranquillité d'esprit pendant 1 an complet",
      "Priorité sur les mises à jour et nouvelles fonctionnalités",
      "Badge Établissement Certifié Oresto"
    ]
  }
};

export const PLANS: Record<string, { name: string; price: number; features: string[] }> = {
  monthly: ORESTO_PLANS.monthly,
  annual: ORESTO_PLANS.annual,
  pro: ORESTO_PLANS.monthly,
  starter: ORESTO_PLANS.monthly
};

export const TRIAL_DURATION_DAYS = 14;
export const TRIAL_DURATION_MS = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Calcul automatique de la période d'essai gratuit (14 jours sans carte bancaire)
 */
export function calculateTrialDates(registrationTime = Date.now()): { trialStartedAt: number; trialEndsAt: number } {
  return {
    trialStartedAt: registrationTime,
    trialEndsAt: registrationTime + TRIAL_DURATION_MS,
  };
}

/**
 * Génère un lien ou panier Maketou pour le renouvellement
 */
export function generateMaketouInvoice(vendorId: string, isFirstPayment = false) {
  const amount = STANDARD_PLAN_PRICE;
  const invoiceId = `inv_mkt_${vendorId}_${Date.now()}`;
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // Valide 7 jours

  return {
    id: invoiceId,
    plan: "pro",
    amount,
    isFirstPayment,
    paymentUrl: `/vendor/dashboard?pay_invoice=true&inv=${invoiceId}&amt=${amount}`,
    createdAt: Date.now(),
    expiresAt,
  };
}

/**
 * Exécute la vérification quotidienne du cycle d'abonnement pour tous les vendeurs
 * Règles :
 * - J-7 : Début des notifications et émission facture
 * - Jour J : Passage en pending_payment avec 3 jours de grâce
 * - J+3 : Blocage complet de la boutique (statut "blocked") si non payé
 */
export async function runSubscriptionBillingCheck(db: Database) {
  try {
    const snap = await get(ref(db, "vendors"));
    if (!snap.exists()) return;

    const vendorsData = snap.val();
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

    for (const vendorId of Object.keys(vendorsData)) {
      const v = vendorsData[vendorId] as VendorProfile;
      const status = v.subscriptionStatus || "trial";
      const dueDate = v.nextBillingDate || v.trialEndsAt || calculateTrialDates().trialEndsAt;
      const isFirstPayment = !v.paymentHistory || v.paymentHistory.length === 0;

      // 1. Relance J-7 : À 1 semaine de l'échéance (ou fin d'essai)
      if (now >= dueDate - SEVEN_DAYS_MS && now < dueDate && !v.pendingInvoice) {
        const invoice = generateMaketouInvoice(vendorId, isFirstPayment);
        await update(ref(db, `vendors/${vendorId}`), {
          pendingInvoice: invoice,
        });

        await dispatchVendorNotification(db, vendorId, "j_minus_7", {
          plan: "pro",
          trialEndsAt: v.trialEndsAt,
          nextBillingDate: dueDate,
          paymentUrl: invoice.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
          isFirstPayment,
        });
      }

      // 2. Le Jour J : Si non payé -> Période de grâce de 3 jours
      if (now >= dueDate && now < dueDate + THREE_DAYS_MS && status !== "pending_payment" && status !== "blocked" && status !== "restricted" && status !== "active") {
        await update(ref(db, `vendors/${vendorId}`), {
          subscriptionStatus: "pending_payment",
        });

        await dispatchVendorNotification(db, vendorId, "d_day", {
          plan: "pro",
          nextBillingDate: dueDate,
          paymentUrl: v.pendingInvoice?.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
          isFirstPayment,
        });
      }

      // 3. J+3 : Blocage complet si non régularisé
      if (now >= dueDate + THREE_DAYS_MS && status !== "blocked" && status !== "restricted") {
        await update(ref(db, `vendors/${vendorId}`), {
          subscriptionStatus: "blocked",
        });

        await dispatchVendorNotification(db, vendorId, "blocked", {
          plan: "pro",
          nextBillingDate: dueDate,
          paymentUrl: v.pendingInvoice?.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
          isFirstPayment,
        });
      }
    }
  } catch (err) {
    console.error("Erreur lors du check de facturation d'abonnement:", err);
  }
}

/**
 * Confirme le paiement Maketou d'un vendeur (appelé par le webhook Maketou ou la simulation UI)
 */
export async function confirmVendorSubscriptionPayment(
  db: Database,
  vendorId: string,
  invoiceId?: string,
  billingCycle: "monthly" | "annual" = "monthly"
) {
  const snap = await get(ref(db, `vendors/${vendorId}`));
  if (!snap.exists()) throw new Error("Vendeur introuvable");

  const v = snap.val() as VendorProfile;
  const isAnnual = billingCycle === "annual";
  const amount = isAnnual ? ANNUAL_PLAN_PRICE : MONTHLY_PLAN_PRICE;
  const durationMs = isAnnual ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const newNextBillingDate = Date.now() + durationMs;

  const paymentRecord = {
    id: invoiceId || `pay_${Date.now()}`,
    plan: isAnnual ? "annual" : "monthly",
    amount,
    date: new Date().toISOString(),
    status: "paid" as const,
    method: "Mobile Money (MTN / Moov)",
  };

  const history = v.paymentHistory || [];
  const updatedHistory = [paymentRecord, ...history];

  await update(ref(db, `vendors/${vendorId}`), {
    subscriptionPlan: isAnnual ? "annual" : "monthly",
    subscriptionStatus: "active",
    nextBillingDate: newNextBillingDate,
    pendingInvoice: null,
    paymentHistory: updatedHistory,
  });

  await dispatchVendorNotification(db, vendorId, "payment_confirmed", {
    plan: isAnnual ? "annual" : "monthly",
    nextBillingDate: newNextBillingDate,
    phone: v.phone,
    email: (v as any).email,
  });

  return { success: true, nextBillingDate: newNextBillingDate, amount };
}

/**
 * Change ou initialise la formule d'abonnement (défaut: pro)
 */
export async function updateVendorSubscriptionPlan(
  db: Database,
  vendorId: string,
  newPlan: string = "pro"
) {
  await update(ref(db, `vendors/${vendorId}`), {
    subscriptionPlan: "pro",
  });
  return { success: true, plan: "pro" };
}
