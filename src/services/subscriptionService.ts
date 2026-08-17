import { ref, get, update, Database } from "firebase/database";
import { VendorProfile } from "@/data/mockData";
import { dispatchVendorNotification } from "./notificationService";

export const MAKETOU_SIMULATION_MODE = true;

// Prix officiel unique Oresto Pro
export const STANDARD_PLAN_PRICE = 5000;
export const FIRST_MONTH_PRICE = 2500; // 50% de réduction pour le 1er mois

export const PLANS: Record<string, { name: string; price: number; firstMonthPrice: number; features: string[] }> = {
  pro: {
    name: "Oresto Pro",
    price: STANDARD_PLAN_PRICE,
    firstMonthPrice: FIRST_MONTH_PRICE,
    features: [
      "Site Web autonome sur-mesure (Site Factory)",
      "0% de commission sur vos ventes (100% pour vous)",
      "Catalogue illimité (Plats & Menus / Chambres & Nuitées)",
      "Commandes directes & intégration WhatsApp",
      "Paiements Mobile Money (MTN & Moov)",
      "Assistant IA Opérationnel IZA intégré",
      "Programme de fidélité & avis clients",
      "Support prioritaire 7j/7"
    ]
  },
  starter: {
    name: "Oresto Pro",
    price: STANDARD_PLAN_PRICE,
    firstMonthPrice: FIRST_MONTH_PRICE,
    features: [
      "Site Web autonome sur-mesure (Site Factory)",
      "0% de commission sur vos ventes",
      "Catalogue illimité",
      "Paiements Mobile Money",
      "Assistant IA Opérationnel IZA"
    ]
  }
};

// Date charnière du lancement officiel : 1er Septembre 2026 00:00:00 UTC
export const LAUNCH_DATE_TIMESTAMP = Date.UTC(2026, 8, 1, 0, 0, 0); // Mois 8 = Septembre en JS
// Date de fin d'essai pour tout compte créé avant le 1er Septembre 2026 : 1er Octobre 2026
export const LAUNCH_TRIAL_END_TIMESTAMP = Date.UTC(2026, 9, 1, 0, 0, 0); // Mois 9 = Octobre en JS

/**
 * Calcul automatique des dates d'essai gratuit selon la règle Oresto :
 * - Inscription < 1er septembre 2026 => trialEndsAt = 1er octobre 2026
 * - Inscription >= 1er septembre 2026 => trialEndsAt = date d'inscription + 30 jours
 */
export function calculateTrialDates(registrationTime = Date.now()): { trialStartedAt: number; trialEndsAt: number } {
  if (registrationTime < LAUNCH_DATE_TIMESTAMP) {
    return {
      trialStartedAt: LAUNCH_DATE_TIMESTAMP,
      trialEndsAt: LAUNCH_TRIAL_END_TIMESTAMP,
    };
  }

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  return {
    trialStartedAt: registrationTime,
    trialEndsAt: registrationTime + THIRTY_DAYS_MS,
  };
}

/**
 * Génère un lien ou panier Maketou pour le renouvellement avec -50% si 1er mois
 */
export function generateMaketouInvoice(vendorId: string, isFirstPayment = false) {
  const amount = isFirstPayment ? FIRST_MONTH_PRICE : STANDARD_PLAN_PRICE;
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
 * - J-7 : Début des notifications et émission facture (-50% si premier mois)
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
  invoiceId?: string
) {
  const snap = await get(ref(db, `vendors/${vendorId}`));
  if (!snap.exists()) throw new Error("Vendeur introuvable");

  const v = snap.val() as VendorProfile;
  const isFirstPayment = !v.paymentHistory || v.paymentHistory.length === 0;
  const amount = isFirstPayment ? FIRST_MONTH_PRICE : STANDARD_PLAN_PRICE;
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const newNextBillingDate = Date.now() + THIRTY_DAYS_MS;

  const paymentRecord = {
    id: invoiceId || `pay_${Date.now()}`,
    plan: "pro",
    amount,
    date: new Date().toISOString(),
    status: "paid" as const,
    method: "Maketou Mobile Money",
  };

  const history = v.paymentHistory || [];
  const updatedHistory = [paymentRecord, ...history];

  await update(ref(db, `vendors/${vendorId}`), {
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
    nextBillingDate: newNextBillingDate,
    pendingInvoice: null,
    paymentHistory: updatedHistory,
  });

  await dispatchVendorNotification(db, vendorId, "payment_confirmed", {
    plan: "pro",
    nextBillingDate: newNextBillingDate,
    phone: v.phone,
    email: (v as any).email,
  });

  return { success: true, nextBillingDate: newNextBillingDate };
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
