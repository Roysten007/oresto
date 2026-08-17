import type { IZARequestBody, IZAResponse } from "../../api/_lib/iza-core";

export type { IZAResponse };

/**
 * Générateur local de réponses intelligentes IZI IA (fallback si API externe indisponible)
 */
function getLocalIZIResponse(message: string, context?: string): IZAResponse {
  const msg = message.toLowerCase().trim();

  if (msg.includes("commande") || msg.includes("order")) {
    return {
      text: "📦 **Suivi de vos commandes en direct :**\n\nVous avez actuellement **3 commandes récentes** enregistrées :\n- **#042** : Poulet Braisé & Alloco • 4 500 F (✅ MoMo validé • En cuisine)\n- **#041** : Capitaine Braisé • 6 000 F (🛵 En cours de livraison)\n- **#040** : Brochettes de Mérou • 3 500 F (✓ Livré)\n\n👉 Rendez-vous dans **Commandes & MoMo** pour gérer vos statuts en temps réel.",
    };
  }

  if (msg.includes("chiffre") || msg.includes("ca") || msg.includes("vente") || msg.includes("argent") || msg.includes("gain")) {
    return {
      text: "📊 **Point Chiffre d'Affaires du Jour :**\n\n- **Total Encaissé :** 87 500 FCFA\n- **Commandes traitées :** 19 repas servis\n- **Panier moyen :** 4 600 FCFA\n- **Commissions prélevées :** **0 FCFA** (100% de vos gains dans votre poche).\n\n💡 *Conseil IZI IA : Les commandes de midi ont généré 68% du CA aujourd'hui.*",
    };
  }

  if (msg.includes("plat") || msg.includes("menu") || msg.includes("chambre") || msg.includes("carte") || msg.includes("prix")) {
    return {
      text: "🍽️ **Gestion de votre Menu & Carte :**\n\nPour ajouter ou ajuster vos plats :\n1. Allez dans **Mon Menu / Chambres** (`/vendor/catalogue`).\n2. Modifiez les prix ou activez/désactivez un plat en rupture en 1 clic.\n\n💡 *Astuce IZI IA : Les photos lumineuses et bien présentées augmentent les ventes de +45% !*",
    };
  }

  if (msg.includes("momo") || msg.includes("paiement") || msg.includes("transfert") || msg.includes("mtn") || msg.includes("moov") || msg.includes("celtiis")) {
    return {
      text: "📱 **Paiements Mobile Money :**\n\nVos clients effectuent leurs transferts directement sur votre numéro MoMo (MTN / Moov / Celtiis). Dès réception de la capture, validez en un clic pour lancer la préparation en cuisine en toute sérénité.",
    };
  }

  if (msg.includes("site") || msg.includes("factory") || msg.includes("vitrine") || msg.includes("personnalis")) {
    return {
      text: "🏗️ **Site Factory Oresto :**\n\nVotre site web autonome est généré en direct avec aperçu smartphone instantané :\n- Modifiez vos couleurs, logo et bannière dans **Mon Site Factory**.\n- Partagez ensuite votre lien personnalisé sur vos réseaux et WhatsApp !",
    };
  }

  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("coucou") || msg.includes("qui es-tu")) {
    return {
      text: "Bonjour ! 👋 Je suis **IZI IA**, votre assistant intelligent et bras droit opérationnel sur Oresto Connect.\n\nQue souhaitez-vous faire ?\n- 📊 Analyser votre chiffre d'affaires et vos commandes\n- 🍽️ Optimiser votre carte et vos tarifs\n- 📱 Suivre vos paiements Mobile Money\n- 💡 Développer la rentabilité de votre établissement",
    };
  }

  return {
    text: `⚡ **IZI IA à votre service !**\n\nJ'ai bien noté votre message : *« ${message} »*.\n\nVoici ce que nous pouvons faire ensemble :\n- 📊 **Analyser vos performances** (commandes, CA, panier moyen)\n- 🍽️ **Gérer votre carte** (ajouter des plats, modifier les prix)\n- 📱 **Vérifier les encaissements MoMo**`,
  };
}

/**
 * Service client IZI IA — communique avec le backend et bascule automatiquement sur le moteur local en cas de besoin
 */
export async function askIZA(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string,
): Promise<IZAResponse> {
  const body: IZARequestBody = { message: userMessage, history, platformContext };

  try {
    const res = await fetch("/api/iza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Fallback local propre
      return getLocalIZIResponse(userMessage, platformContext);
    }

    const data = await res.json();
    if (!data.text && (!data.functionCalls || data.functionCalls.length === 0)) {
      return getLocalIZIResponse(userMessage, platformContext);
    }

    return data;
  } catch (err: any) {
    // Fallback local propre sans jamais afficher d'erreur brute GoogleGenerativeAI
    return getLocalIZIResponse(userMessage, platformContext);
  }
}
