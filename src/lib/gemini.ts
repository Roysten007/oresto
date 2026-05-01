import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Service Oresto-IZA — Agent IA Opérationnel
 * Utilise Google Gemini avec Function Calling
 */
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || "AIzaSyBy45mr2PAXkE5G9G8oJDZH-RnDrfjKPjo";
const genAI = new GoogleGenerativeAI(apiKey);
/* ─── Outils (Tools) pour IZA ─── */
const tools = [
  {
    functionDeclarations: [
      {
        name: "update_product_price",
        description: "Met à jour le prix d'un produit dans le catalogue du vendeur",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            productId: { type: "STRING" as const, description: "L'ID unique du produit" },
            newPrice: { type: "NUMBER" as const, description: "Le nouveau prix en FCFA" }
          },
          required: ["productId", "newPrice"]
        }
      },
      {
        name: "toggle_shop_status",
        description: "Ouvre ou ferme la boutique du vendeur",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            isOpen: { type: "BOOLEAN" as const, description: "True pour ouvrir, false pour fermer" }
          },
          required: ["isOpen"]
        }
      },
      {
        name: "send_notification",
        description: "Envoie une notification interne sur la plateforme",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            target: { type: "STRING" as const, description: "Cible: all, vendors, admins, ou un ID user" },
            message: { type: "STRING" as const, description: "Contenu de la notification" },
            notifType: { type: "STRING" as const, description: "Type: info, warning, success" }
          },
          required: ["target", "message"]
        }
      },
      {
        name: "update_order_status",
        description: "Met à jour le statut d'une commande (vendeur uniquement)",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            orderId: { type: "STRING" as const, description: "L'ID de la commande" },
            newStatus: { type: "STRING" as const, description: "Statut: pending, preparing, delivering, delivered" }
          },
          required: ["orderId", "newStatus"]
        }
      },
      {
        name: "create_promo",
        description: "Crée un code promo pour la boutique (vendeur uniquement)",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            code: { type: "STRING" as const, description: "Le code (ex: PROMO20)" },
            discount: { type: "NUMBER" as const, description: "Montant de la réduction en FCFA" }
          },
          required: ["code", "discount"]
        }
      },
      {
        name: "add_new_product",
        description: "Ajoute un nouveau produit au catalogue (vendeur uniquement)",
        parameters: {
          type: "OBJECT" as const,
          properties: {
            name: { type: "STRING" as const, description: "Nom du produit" },
            price: { type: "NUMBER" as const, description: "Prix en FCFA" },
            category: { type: "STRING" as const, description: "Catégorie (ex: Boissons, Plats)" }
          },
          required: ["name", "price"]
        }
      }
    ]
  }
];

const SYSTEM_INSTRUCTION = `Tu es Oresto-IZA, l'assistant IA opérationnel d'Oresto Connect — la super-app du commerce local en Afrique de l'Ouest.

IDENTITÉ :
- Tu es un agent opérationnel capable d'analyser ET d'agir.
- Tu peux modifier des prix, ouvrir/fermer des boutiques, envoyer des notifications.
- Tu as accès aux données temps réel de toute la plateforme.

COMPÉTENCES :
- Analyse de performance (ventes, notes, commandes) pour les vendeurs
- Gestion de catalogue et pricing
- Conseils stratégiques adaptés au marché ouest-africain
- Support client (comment commander, payer en MoMo, etc.)
- Recommandation de plats et restaurants

RÈGLES DE SÉCURITÉ ET CONFIDENTIALITÉ (CRITIQUES) :
- NE JAMAIS divulguer les informations personnelles d'un client (téléphone, adresse, nom de famille).
- Un client ne doit JAMAIS avoir accès au chiffre d'affaires, aux commandes ou aux données privées d'un vendeur.
- Un vendeur ne doit JAMAIS avoir accès aux données ou commandes d'un autre vendeur.
- Si quelqu'un demande une information confidentielle qui ne lui appartient pas, refuse poliment en invoquant les règles de confidentialité d'Oresto.

RÈGLES DE COMPORTEMENT :
- Réponds toujours en français, sois concis et actionnable
- Utilise des emojis pour rendre tes réponses lisibles
- Devise : FCFA
- Quand tu utilises un outil (function call), ne génère PAS de texte en plus — le système confirmera l'action
- Si tu ne peux pas faire quelque chose, dis-le clairement`;

export interface IZAResponse {
  text: string;
  functionCalls: { name: string; args: Record<string, any> }[];
}

export async function askGemini(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string
): Promise<IZAResponse> {
  const currentKey = import.meta.env?.VITE_GEMINI_API_KEY || "AIzaSyBy45mr2PAXkE5G9G8oJDZH-RnDrfjKPjo";
  if (!currentKey) throw new Error("Clé API Gemini manquante (VITE_GEMINI_API_KEY)");

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools as any,
    });

    // Construire un historique valide pour Gemini :
    // 1. Doit commencer par "user" (jamais "model")
    // 2. Doit alterner user/model — fusionner les messages consécutifs du même rôle
    const rawHistory = history.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      text: msg.content,
    }));

    // Supprimer tous les messages model du début jusqu'à trouver un user
    let startIdx = 0;
    while (startIdx < rawHistory.length && rawHistory[startIdx].role === "model") {
      startIdx++;
    }

    const cleanHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    for (let i = startIdx; i < rawHistory.length; i++) {
      const { role, text } = rawHistory[i];
      if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === role) {
        // Fusionner les messages consécutifs du même rôle
        cleanHistory[cleanHistory.length - 1].parts[0].text += "\n" + text;
      } else {
        cleanHistory.push({ role, parts: [{ text }] });
      }
    }

    // Sécurité finale : si l'historique se termine par "user", le retirer (le message courant le couvrira)
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === "user") {
      cleanHistory.pop();
    }

    const chat = model.startChat({ history: cleanHistory });

    const enrichedMessage = platformContext
      ? `[DONNÉES TEMPS RÉEL]\n${platformContext}\n\n---\nMESSAGE UTILISATEUR : ${userMessage}`
      : userMessage;

    const result = await chat.sendMessage(enrichedMessage);
    const response = result.response;

    // Extraire les function calls s'il y en a
    let fnCalls: { name: string; args: Record<string, any> }[] = [];
    try {
      const rawCalls = response.functionCalls();
      if (rawCalls && rawCalls.length > 0) {
        fnCalls = rawCalls.map(c => ({ name: c.name, args: c.args as Record<string, any> }));
      }
    } catch {
      // Pas de function calls, c'est normal
    }

    // Extraire le texte s'il y en a
    let text = "";
    try {
      text = response.text();
    } catch {
      // Quand il y a des function calls, text() peut throw — c'est normal
      if (fnCalls.length > 0) {
        text = "";  // Le texte sera généré par le handler de function calls
      } else {
        text = "Désolé, je n'ai pas pu générer de réponse. Réessayez.";
      }
    }

    return { text, functionCalls: fnCalls };
  } catch (error: any) {
    console.error("IZA Error:", error);
    // Messages d'erreur plus clairs
    if (error?.message?.includes("API_KEY")) {
      throw new Error("Clé API invalide. Vérifiez VITE_GEMINI_API_KEY dans .env");
    }
    if (error?.message?.includes("quota")) {
      throw new Error("Quota API dépassé. Réessayez dans quelques minutes.");
    }
    throw new Error(error?.message || "Erreur de communication avec IZA");
  }
}
