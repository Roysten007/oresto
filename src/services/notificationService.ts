import { ref, push, set, serverTimestamp } from "firebase/database";
import { Database } from "firebase/database";

export interface AppNotification {
  id?: string;
  type: "welcome_trial" | "j_minus_3" | "d_day" | "restricted" | "payment_confirmed" | "info" | "warning";
  title: string;
  message: string;
  actionUrl?: string;
  channelUsed: "in_app" | "whatsapp" | "email";
  status: "sent" | "failed" | "read";
  createdAt: number;
}

/**
  * Stub d'envoi WhatsApp API Business.
  * Si l'API WhatsApp n'est pas encore en place, enregistre proprement la tentative sans bloquer le flux.
  */
export async function sendWhatsAppNotification(phone: string, message: string): Promise<boolean> {
  console.log(`[WHATSAPP STUB] Envoi à ${phone} : "${message}"`);
  // En production, brancher ici l'API WhatsApp Business ou service tier (ex: Twilio / Meta Cloud API)
  if (!phone) {
    console.warn("[WHATSAPP STUB] Numéro de téléphone absent.");
    return false;
  }
  return true; // Simulé avec succès
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
    plan?: "starter" | "pro";
    trialEndsAt?: number;
    nextBillingDate?: number;
    paymentUrl?: string;
    phone?: string;
    email?: string;
  }
) {
  const planLabel = data.plan === "pro" ? "Pro (5 000 FCFA/mois)" : "Starter (3 000 FCFA/mois)";
  const formattedDate = (ts?: number) =>
    ts ? new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  let title = "Notification Oresto";
  let message = "";
  let actionUrl = data.paymentUrl || "/vendor/dashboard";

  switch (type) {
    case "welcome_trial":
      title = "🎉 Bienvenue sur Oresto !";
      message = `Votre essai gratuit est actif jusqu'au ${formattedDate(data.trialEndsAt)}. Profitez de la plateforme en toute liberté.`;
      break;

    case "j_minus_3":
      title = "⏳ Échéance d'abonnement proche (J-3)";
      message = `Votre abonnement Oresto ${planLabel} se renouvelle dans 3 jours. Payez dès maintenant pour continuer sans interruption.`;
      break;

    case "d_day":
      title = "⚠️ Abonnement à échéance aujourd'hui";
      message = `Votre abonnement Oresto arrive à échéance aujourd'hui. Réglez maintenant pour éviter toute coupure de vos ventes.`;
      break;

    case "restricted":
      title = "🚫 Accès commandes temporairement suspendu";
      message = `Votre accès aux commandes/réservations est temporairement suspendu faute de paiement. Réglez votre abonnement pour réactiver votre boutique.`;
      break;

    case "payment_confirmed":
      title = "✅ Paiement confirmé !";
      message = `Merci ! Votre abonnement ${planLabel} est actif jusqu'au ${formattedDate(data.nextBillingDate)}.`;
      break;

    default:
      message = "Mise à jour concernant votre compte vendeur.";
  }

  // 1. Notification In-App (Obligatoire dans Firebase RTDB)
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

  // 2. Repli WhatsApp (si numéro renseigné)
  if (data.phone) {
    await sendWhatsAppNotification(data.phone, `${title}\n${message}\n${actionUrl}`);
  }

  // 3. Repli Email (si email renseigné)
  if (data.email) {
    await sendEmailNotification(data.email, title, `${message}\nLien : ${actionUrl}`);
  }

  return notificationRecord;
}
