// WhatsApp utility functions

const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "";

/**
 * Open WhatsApp chat with a pre-filled message
 */
export function openWhatsApp(message: string, phone?: string) {
  const number = (phone || WHATSAPP_PHONE).replace(/[^0-9+]/g, "");
  if (!number) return;
  const url = `https://wa.me/${number.replace("+", "")}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/**
 * Generate a WhatsApp order message for a vendor
 */
export function getOrderWhatsAppMessage(orderDetails: {
  orderId: string;
  items: { name: string; qty: number }[];
  total: number;
  clientName: string;
}) {
  const itemsList = orderDetails.items
    .map((item) => `• ${item.qty}x ${item.name}`)
    .join("\n");

  return `🛒 *Nouvelle commande Oresto*\n\n📦 Commande #${orderDetails.orderId}\n👤 Client: ${orderDetails.clientName}\n\n${itemsList}\n\n💰 Total: ${orderDetails.total.toLocaleString()} FCFA\n\nMerci de confirmer la commande ! ✅`;
}

/**
 * Generate a WhatsApp support message
 */
export function getSupportWhatsAppMessage(topic: string) {
  return `Bonjour Oresto ! 👋\n\nJ'ai besoin d'aide concernant : ${topic}\n\nMerci !`;
}
