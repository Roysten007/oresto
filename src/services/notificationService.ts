import { ref, push, set } from "firebase/database";
import { Database } from "firebase/database";

export interface AppNotification {
  id?: string;
  type: "welcome_trial" | "j_minus_7" | "j_minus_3" | "d_day" | "blocked" | "restricted" | "payment_confirmed" | "info" | "warning";
  title: string;
  message: string;
  actionUrl?: string;
  channelUsed: "in_app" | "whatsapp" | "email";
  status: "sent" | "failed" | "read";
  createdAt: number;
}

/**
 * Stub d'envoi WhatsApp API Business.
 */
export async function sendWhatsAppNotification(phone: string, message: string): Promise<boolean> {
  console.log(`[WHATSAPP STUB] Envoi à ${phone} : "${message}"`);
  if (!phone) {
    console.warn("[WHATSAPP STUB] Numéro de téléphone absent.");
    return false;
  }
  return true;
}

/**
 * Stub d'envoi Email.
 */
export async function sendEmailNotification(email: string, subject: string, body: string): Promise<boolean> {
  console.log(`[EMAIL STUB] Envoi à ${email} : [${subject}] ${body}`);
  if (!email) {
    console.warn("[EMAIL STUB] Adresse email absente.");
    return false;
  }
  return true;
}

/**
 * Modèle de notifications d'abonnement Oresto
 */
export async function dispatchVendorNotification(
  db: Database,
  vendorId: string,
  type: AppNotification["type"],
  data: {
    plan?: string;
    trialEndsAt?: number;
    nextBillingDate?: number;
    paymentUrl?: string;
    phone?: string;
    email?: string;
    isFirstPayment?: boolean;
  }
) {
  const formattedDate = (ts?: number) =>
    ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  let title = "Notification Oresto";
  let message = "";
  let actionUrl = data.paymentUrl || "/vendor/dashboard";

  switch (type) {
    case "welcome_trial":
      title = "🎉 Bienvenue sur Oresto Pro !";
      message = `Votre essai gratuit est actif jusqu'au ${formattedDate(data.trialEndsAt)}. Votre formule Oresto Pro est à 5 000 FCFA / mois sans engagement.`;
      break;

    case "j_minus_7":
      title = "⏳ Échéance dans 1 semaine (J-7)";
      message = `Votre abonnement Oresto Pro arrive à échéance dans 7 jours (Montant : 5 000 FCFA). Réglez dès maintenant pour continuer sans interruption.`;
      break;

    case "j_minus_3":
      title = "⏳ Échéance d'abonnement dans 3 jours (J-3)";
      message = `Votre abonnement Oresto Pro arrive à échéance dans 3 jours. Réglez dès maintenant pour anticiper en toute sérénité.`;
      break;

    case "d_day":
      title = "⚠️ Échéance aujourd'hui — 3 jours de grâce";
      message = `Votre abonnement Oresto Pro est arrivé à échéance. Vous bénéficiez de 3 jours de grâce pour régler avant le blocage de votre boutique.`;
      break;

    case "blocked":
    case "restricted":
      title = "🚫 Espace boutique bloqué (Impayé)";
      message = `Le délai de grâce de 3 jours est expiré. Votre espace commerçant et vos commandes sont bloqués. Réglez dès maintenant votre abonnement pour débloquer immédiatement votre compte.`;
      break;

    case "payment_confirmed":
      title = "✅ Paiement confirmé !";
      message = `Merci ! Votre abonnement Oresto Pro est actif jusqu'au ${formattedDate(data.nextBillingDate)}.`;
      break;

    default:
      message = "Mise à jour concernant votre compte vendeur.";
  }

  // 1. Notification In-App
  const notifRef = push(ref(db, `notifications/${vendorId}`));
  const notifId = notifRef.key || `notif_${Date.now()}`;

  const notificationRecord: AppNotification = {
    id: notifId,
    type,
    title,
    message,
    actionUrl,
    channelUsed: "in_app",
    status: "sent",
    createdAt: Date.now(),
  };

  await set(notifRef, notificationRecord);

  // 2. Repli WhatsApp
  if (data.phone) {
    await sendWhatsAppNotification(data.phone, `${title}\n${message}\n${actionUrl}`);
  }

  // 3. Repli Email
  if (data.email) {
    await sendEmailNotification(data.email, title, `${message}\nLien : ${actionUrl}`);
  }

  return notificationRecord;
}
