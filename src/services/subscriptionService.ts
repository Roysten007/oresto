import { ref, get, update, Database } from "firebase/database";
import { VendorProfile } from "@/data/mockData";
import { dispatchVendorNotification } from "./notificationService";

export const MAKETOU_SIMULATION_MODE = true;

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
 * Génère un lien ou panier Maketou simulé pour le renouvellement
 */
export function generateMaketouInvoice(vendorId: string, plan: "starter" | "pro") {
  const amount = plan === "pro" ? 5000 : 3000;
  const invoiceId = `inv_mkt_${vendorId}_${Date.now()}`;
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // Valide 7 jours

  return {
    id: invoiceId,
    plan,
    amount,
    paymentUrl: `/vendor/dashboard?pay_invoice=true&inv=${invoiceId}&amt=${amount}`,
    createdAt: Date.now(),
    expiresAt,
  };
}

/**
 * Exécute la vérification quotidienne du cycle d'abonnement pour tous les vendeurs
 * (Simule le comportement d'une Cloud Function Firebase scheduled)
 */
export async function runSubscriptionBillingCheck(db: Database) {
  try {
    const snap = await get(ref(db, "vendors"));
    if (!snap.exists()) return;

    const vendorsData = snap.val();
    const now = Date.now();
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

    for (const vendorId of Object.keys(vendorsData)) {
      const v = vendorsData[vendorId] as VendorProfile;
      const plan = v.subscriptionPlan || "starter";
      const status = v.subscriptionStatus || "trial";
      const dueDate = v.nextBillingDate || v.trialEndsAt || calculateTrialDates().trialEndsAt;

      // 1. Relance J-3 : À 3 jours de l'échéance (ou fin d'essai)
      if (now >= dueDate - THREE_DAYS_MS && now < dueDate && !v.pendingInvoice) {
        const invoice = generateMaketouInvoice(vendorId, plan);
        await update(ref(db, `vendors/${vendorId}`), {
          pendingInvoice: invoice,
        });

        await dispatchVendorNotification(db, vendorId, "j_minus_3", {
          plan,
          nextBillingDate: dueDate,
          paymentUrl: invoice.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
        });
      }

      // 2. Le Jour J : Si non payé
      if (now >= dueDate && now < dueDate + THREE_DAYS_MS && status !== "pending_payment" && status !== "restricted" && status !== "active") {
        await update(ref(db, `vendors/${vendorId}`), {
          subscriptionStatus: "pending_payment",
        });

        await dispatchVendorNotification(db, vendorId, "d_day", {
          plan,
          nextBillingDate: dueDate,
          paymentUrl: v.pendingInvoice?.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
        });
      }

      // 3. J+3 : Passage en compte restreint
      if (now >= dueDate + THREE_DAYS_MS && status !== "restricted") {
        await update(ref(db, `vendors/${vendorId}`), {
          subscriptionStatus: "restricted",
        });

        await dispatchVendorNotification(db, vendorId, "restricted", {
          plan,
          nextBillingDate: dueDate,
          paymentUrl: v.pendingInvoice?.paymentUrl,
          phone: v.phone,
          email: (v as any).email,
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
  const currentPlan = v.subscriptionPlan || "starter";
  const amount = currentPlan === "pro" ? 5000 : 3000;
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const newNextBillingDate = Date.now() + THIRTY_DAYS_MS;

  const paymentRecord = {
    id: invoiceId || `pay_${Date.now()}`,
    plan: currentPlan,
    amount,
    date: new Date().toISOString(),
    status: "paid" as const,
    method: "Maketou Mobile Money",
  };

  const history = v.paymentHistory || [];
  const updatedHistory = [paymentRecord, ...history];

  await update(ref(db, `vendors/${vendorId}`), {
    subscriptionStatus: "active",
    nextBillingDate: newNextBillingDate,
    pendingInvoice: null,
    paymentHistory: updatedHistory,
  });

  await dispatchVendorNotification(db, vendorId, "payment_confirmed", {
    plan: currentPlan,
    nextBillingDate: newNextBillingDate,
    phone: v.phone,
    email: (v as any).email,
  });

  return { success: true, nextBillingDate: newNextBillingDate };
}

/**
 * Change la formule d'abonnement d'un vendeur (Starter <-> Pro)
 */
export async function updateVendorSubscriptionPlan(
  db: Database,
  vendorId: string,
  newPlan: "starter" | "pro"
) {
  await update(ref(db, `vendors/${vendorId}`), {
    subscriptionPlan: newPlan,
  });
  return { success: true, plan: newPlan };
}
