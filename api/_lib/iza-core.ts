/**
 * IZI IA — Moteur multi-provider : Gemini → NVIDIA NIM → Mistral
 * Deux modes distincts :
 *  • "landing"   → FAQ Oresto (plateforme, tarifs, fonctionnalités) — aucun accès opérationnel
 *  • "dashboard" → Assistant opérationnel complet (commandes, stocks, stats, actions Firebase)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Types ───────────────────────────────────────────────────────────────────

export type IZAMode = "landing" | "dashboard";

export interface IZARequestBody {
  message: string;
  history?: { role: string; content: string }[];
  platformContext?: string;
  mode?: IZAMode;
}

export interface IZAResponse {
  text: string;
  functionCalls?: { name: string; args: Record<string, any> }[];
}


// ─── System prompts ──────────────────────────────────────────────────────────

const SYSTEM_LANDING = `Tu es IZI IA, l'assistant de vente et d'information d'Oresto Connect.
Ton rôle EXCLUSIF est de répondre aux questions des visiteurs sur la plateforme Oresto.

CE QUE TU PEUX FAIRE :
- Expliquer ce qu'est Oresto Connect (plateforme de gestion pour restaurants, boutiques, hôtels au Bénin/Afrique)
- Détailler les fonctionnalités : vitrine web, commandes, paiement Mobile Money (MTN MoMo, Moov Money, Celtiis), reçus, IZI IA
- Donner les tarifs : Formule Starter (gratuit) et Pro (5 000 FCFA/mois) avec 14 jours d'essai gratuit
- Expliquer la politique 0% de commission sur les transactions
- Répondre aux questions sur le processus d'inscription
- Orienter vers /register pour démarrer l'essai gratuit
- Expliquer le programme de parrainage prestataire (20% récurrents)

CE QUE TU NE DOIS ABSOLUMENT PAS FAIRE :
- Parler de commandes, stocks ou chiffres d'affaires d'un établissement spécifique
- Prétendre avoir accès aux données d'un restaurant ou boutique
- Effectuer des actions (modifier prix, créer promos, etc.)

Sois chaleureux, vendeur et concis. Réponds en français.`;

const SYSTEM_DASHBOARD = `Tu es IZI IA, l'assistant d'intelligence artificielle opérationnel d'Oresto Connect.
Tu es connecté en temps réel aux données de l'établissement transmises dans le contexte JSON.

═══ RÈGLES ABSOLUES ═══
1. Ne JAMAIS inventer de chiffres. Utilise UNIQUEMENT les données du contexte JSON fourni.
2. Si une donnée est absente du contexte, dis-le honnêtement.
3. Devise : FCFA. Commission Oresto : 0% (jamais de frais).

═══ LECTURE DU CONTEXTE ═══
Le contexte JSON contient :
- vendorName, vendorId, isOpen : info établissement
- totalRevenue, todayRevenue, totalOrders, todayOrders, avgOrder : métriques
- activeOrders[] : commandes EN COURS (pending/preparing/delivering) — chaque objet a un champ "id" (ID Firebase réel) et "shortId" (#XXXX)
- recentOrdersList[] : 10 dernières commandes — chaque objet a "id" (ID Firebase) et "statusLabel"
- productsList[] : catalogue — chaque objet a "id" (ID Firebase), "name", "price", "available"
- lowStockAlerts[] : produits avec stock faible
- topProducts[] : top 3 plats les plus vendus

═══ CE QUE TU PEUX FAIRE ═══
• Analyser et expliquer les ventes, CA, commandes, panier moyen, tendances
• Citer les commandes actives avec leur numéro court (#XXXX) et leur statut
• Alerter sur les commandes qui attendent depuis longtemps (minutesAgo > 15 = urgent)
• Lister les produits, leurs prix, leur disponibilité
• AGIR via function calls :
  - update_product_price(productId, newPrice) : modifier le prix d'un plat — utilise l'ID Firebase du productsList
  - toggle_shop_status(isOpen) : ouvrir ou fermer l'établissement
  - update_order_status(orderId, newStatus) : changer le statut d'une commande — utilise l'ID Firebase de activeOrders ou recentOrdersList
  - create_promo(code, discount, minOrder?) : créer un code promo
  - send_notification(message, target, notifType?) : envoyer une notif
  - add_new_product(name, price, category?, description?) : ajouter un plat/article

═══ EXEMPLES DE RÉPONSES ATTENDUES ═══
• "Commandes actives" → liste activeOrders avec numéro, plats, statut, minutes d'attente
• "Ferme la boutique" → appelle toggle_shop_status(false) et confirme
• "Mets le Capitaine Braisé à 6000 F" → trouve l'ID dans productsList et appelle update_product_price
• "Valide la commande #042" → trouve l'ID Firebase dans recentOrdersList et appelle update_order_status
• "Top plats" → affiche topProducts avec nombres de ventes

Sois concis, direct et actionnable. Réponds en français.`;


// ─── Function calls (dashboard uniquement) ───────────────────────────────────

const DASHBOARD_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "update_product_price",
        description: "Mettre à jour le prix d'un produit dans le catalogue du vendeur",
        parameters: {
          type: "OBJECT",
          properties: {
            productId: { type: "STRING", description: "ID du produit à modifier" },
            newPrice: { type: "NUMBER", description: "Nouveau prix en FCFA" },
          },
          required: ["productId", "newPrice"],
        },
      },
      {
        name: "toggle_shop_status",
        description: "Ouvrir ou fermer la boutique pour les commandes",
        parameters: {
          type: "OBJECT",
          properties: {
            isOpen: { type: "BOOLEAN", description: "true pour ouvrir, false pour fermer" },
          },
          required: ["isOpen"],
        },
      },
      {
        name: "send_notification",
        description: "Envoyer une notification push/in-app à un groupe d'utilisateurs",
        parameters: {
          type: "OBJECT",
          properties: {
            message: { type: "STRING", description: "Contenu du message" },
            target: { type: "STRING", description: "Cible: 'all', 'vendors', 'clients' ou ID" },
            notifType: { type: "STRING", description: "Type: 'info', 'promo', 'alert'" },
          },
          required: ["message", "target"],
        },
      },
      {
        name: "update_order_status",
        description: "Mettre à jour le statut d'une commande",
        parameters: {
          type: "OBJECT",
          properties: {
            orderId: { type: "STRING", description: "ID de la commande" },
            newStatus: {
              type: "STRING",
              description: "Nouveau statut: 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'",
            },
          },
          required: ["orderId", "newStatus"],
        },
      },
      {
        name: "create_promo",
        description: "Créer un code promo pour la boutique du vendeur",
        parameters: {
          type: "OBJECT",
          properties: {
            code: { type: "STRING", description: "Code promo (ex: PROMO10)" },
            discount: { type: "NUMBER", description: "Montant de la réduction en FCFA" },
            minOrder: { type: "NUMBER", description: "Montant minimum de commande en FCFA (optionnel)" },
          },
          required: ["code", "discount"],
        },
      },
      {
        name: "add_new_product",
        description: "Ajouter un nouveau produit/plat au catalogue du vendeur",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING", description: "Nom du plat ou produit" },
            price: { type: "NUMBER", description: "Prix en FCFA" },
            category: { type: "STRING", description: "Catégorie du produit" },
            description: { type: "STRING", description: "Courte description" },
          },
          required: ["name", "price"],
        },
      },
    ],
  },
];

// ─── Fallback local landing (FAQ Oresto) ─────────────────────────────────────

function landingFallback(message: string): IZAResponse {
  const msg = message.toLowerCase().trim();

  if (msg.includes("prix") || msg.includes("tarif") || msg.includes("combien") || msg.includes("abonnement") || msg.includes("formule")) {
    return {
      text: `💰 **Tarifs Oresto Connect :**\n\n` +
        `• **Formule Starter :** Gratuit — vitrine de base\n` +
        `• **Formule Pro :** 5 000 FCFA/mois — toutes les fonctionnalités, IZI IA incluse\n` +
        `• **Essai gratuit :** 14 jours Pro offerts sans carte bancaire\n` +
        `• **Commission :** 0% sur toutes vos transactions\n\n` +
        `👉 Démarrez votre essai gratuit sur **/register**`,
    };
  }

  if (msg.includes("fonctionnalit") || msg.includes("fait quoi") || msg.includes("vitrine") || msg.includes("comment")) {
    return {
      text: `⚡ **Ce qu'Oresto fait pour vous :**\n\n` +
        `• 🌐 **Vitrine web** générée en 5 minutes\n` +
        `• 📦 **Gestion des commandes** en temps réel\n` +
        `• 📱 **Paiement Mobile Money** direct — 0% de commission\n` +
        `• 🧾 **Reçus & tickets de caisse** certifiés avec QR Code\n` +
        `• 🤖 **IZI IA** — assistant IA connecté à vos données\n` +
        `• 📊 **Statistiques** chiffre d'affaires, commandes, panier moyen\n\n` +
        `Tout ça pour **5 000 FCFA/mois**, 14 jours gratuits !`,
    };
  }

  if (msg.includes("inscription") || msg.includes("inscrire") || msg.includes("commencer") || msg.includes("essai")) {
    return {
      text: `🚀 **Démarrer avec Oresto :**\n\n` +
        `1. Allez sur **/register**\n` +
        `2. Renseignez votre établissement\n` +
        `3. Votre vitrine est créée instantanément\n` +
        `4. **14 jours d'essai Pro gratuit** — aucune carte requise\n\n` +
        `En moins de 5 minutes, vous êtes en ligne ! 🎉`,
    };
  }

  if (msg.includes("momo") || msg.includes("paiement") || msg.includes("mobile money") || msg.includes("commission")) {
    return {
      text: `📱 **Paiement Mobile Money Oresto :**\n\n` +
        `• Vos clients paient directement sur votre compte MoMo personnel\n` +
        `• **MTN MoMo, Moov Money, Celtiis Cash** — les 3 opérateurs\n` +
        `• **0% de commission** prélevée par Oresto\n` +
        `• Validation en 1 clic depuis votre dashboard`,
    };
  }

  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("bonsoir")) {
    return {
      text: `Bonjour ! 👋 Je suis **IZI IA**, l'assistante d'Oresto Connect.\n\n` +
        `Je peux vous renseigner sur :\n` +
        `• 💰 Les tarifs et formules\n` +
        `• ⚡ Les fonctionnalités\n` +
        `• 📱 Le paiement Mobile Money sans commission\n` +
        `• 🚀 Comment démarrer votre essai gratuit\n\nQue souhaitez-vous savoir ?`,
    };
  }

  return {
    text: `👋 Je suis **IZI IA**, l'assistant d'information d'Oresto Connect.\n\n` +
      `Je réponds à vos questions sur la plateforme : tarifs, fonctionnalités, Mobile Money, inscription.\n\n` +
      `Pour gérer vos commandes et accéder à votre assistant opérationnel, [créez votre compte gratuit](/register). 🚀`,
  };
}

// ─── Fallback local dashboard ────────────────────────────────────────────────

function dashboardFallback(message: string, contextStr?: string): IZAResponse {
  const msg = message.toLowerCase().trim();
  let ctx: any = {
    vendorName: "Mon Établissement",
    totalRevenue: 0,
    totalOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
    avgOrder: 0,
    rating: 4.9,
    reviewCount: 0,
    isOpen: true,
    recentOrdersList: [],
    productsList: [],
  };

  if (contextStr) {
    try {
      const parsed = JSON.parse(contextStr);
      ctx = { ...ctx, ...parsed };
    } catch {}
  }

  if (msg.includes("chiffre") || msg.includes("ca") || msg.includes("vente") || msg.includes("gain") || msg.includes("stat") || msg.includes("revenu")) {
    return {
      text: `📊 **Statistiques de ${ctx.vendorName} :**\n\n` +
        `• **CA du Jour :** **${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Commandes du Jour :** **${ctx.todayOrders || 0}**\n` +
        `• **Panier Moyen :** **${Number(ctx.avgOrder || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Total Historique :** **${Number(ctx.totalRevenue || 0).toLocaleString("fr-FR")} FCFA** (${ctx.totalOrders || 0} commandes)\n` +
        `• **Commission Oresto :** **0 FCFA** ✅\n` +
        `• **Note Clients :** ⭐ **${ctx.rating}/5** (${ctx.reviewCount} avis)`,
    };
  }

  if (msg.includes("commande") || msg.includes("order") || msg.includes("livraison") || msg.includes("cuisine")) {
    const orders = ctx.recentOrdersList?.length > 0
      ? ctx.recentOrdersList.map((o: any) => `- **${o.id}** : ${o.items} • **${Number(o.total).toLocaleString("fr-FR")} F** (${o.payment} • ${o.status})`).join("\n")
      : "Aucune commande récente.";
    return {
      text: `📦 **Commandes de ${ctx.vendorName} :**\n\n${orders}\n\n📊 **Aujourd'hui :** ${ctx.todayOrders || 0} commandes`,
    };
  }

  return {
    text: `⚡ **IZI IA (${ctx.vendorName}) :**\n\n` +
      `J'ai reçu votre demande : *« ${message} »*.\n\n` +
      `• **CA du jour :** ${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA — **Commission : 0 FCFA**\n\n` +
      `Posez-moi vos questions sur vos ventes, commandes ou votre carte !`,
  };
}

// ─── Provider : Gemini ────────────────────────────────────────────────────────

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash-8b", "gemini-1.5-flash-latest", "gemini-1.5-flash"];

async function tryGemini(
  apiKey: string,
  geminiHistory: { role: "user" | "model"; parts: { text: string }[] }[],
  systemInstruction: string,
  toolList: any[] | null,
  enrichedMessage: string,
): Promise<IZAResponse | null> {
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        ...(toolList ? { tools: toolList as any } : {}),
      });
      const chat = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessage(enrichedMessage);
      const response = result.response;

      const functionCalls: { name: string; args: Record<string, any> }[] = [];
      try {
        const rawCalls = response.functionCalls();
        if (rawCalls?.length) {
          for (const c of rawCalls) functionCalls.push({ name: c.name, args: c.args as Record<string, any> });
        }
      } catch {}

      let text = "";
      try { text = response.text(); } catch {}

      if (text || functionCalls.length > 0) {
        console.log(`[IZI] Gemini OK (${modelName})`);
        return { text, functionCalls };
      }
    } catch (err: any) {
      console.warn(`[IZI] Gemini ${modelName} KO:`, err?.message);
    }
  }
  return null;
}

// ─── Provider : NVIDIA NIM ────────────────────────────────────────────────────

async function tryNvidia(
  apiKey: string,
  systemPrompt: string,
  plainHistory: { role: string; content: string }[],
  enrichedMessage: string,
): Promise<IZAResponse | null> {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...plainHistory.map(h => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
      { role: "user", content: enrichedMessage },
    ];
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "meta/llama-3.1-70b-instruct", messages, temperature: 0.5, max_tokens: 1024 }),
    });
    if (!res.ok) { console.warn("[IZI] NVIDIA KO:", res.status); return null; }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    if (text) { console.log("[IZI] NVIDIA OK"); return { text }; }
  } catch (err: any) {
    console.warn("[IZI] NVIDIA KO:", err?.message);
  }
  return null;
}

// ─── Provider : Mistral ───────────────────────────────────────────────────────

async function tryMistral(
  apiKey: string,
  systemPrompt: string,
  plainHistory: { role: string; content: string }[],
  enrichedMessage: string,
): Promise<IZAResponse | null> {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...plainHistory.map(h => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
      { role: "user", content: enrichedMessage },
    ];
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "mistral-small-latest", messages, temperature: 0.5, max_tokens: 1024 }),
    });
    if (!res.ok) { console.warn("[IZI] Mistral KO:", res.status); return null; }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    if (text) { console.log("[IZI] Mistral OK"); return { text }; }
  } catch (err: any) {
    console.warn("[IZI] Mistral KO:", err?.message);
  }
  return null;
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

export async function runIZA(
  body: IZARequestBody,
  keys: { gemini?: string; nvidia?: string; mistral?: string },
): Promise<IZAResponse> {
  const { message, history = [], platformContext, mode = "dashboard" } = body || {} as IZARequestBody;

  if (!message || typeof message !== "string") {
    throw new Error("Message utilisateur manquant.");
  }

  const isLanding = mode === "landing";
  const systemPrompt = isLanding ? SYSTEM_LANDING : SYSTEM_DASHBOARD;
  const toolList = isLanding ? null : DASHBOARD_TOOLS;

  // Enrichir le message avec le contexte (dashboard seulement)
  const enrichedMessage = (!isLanding && platformContext)
    ? `[DONNÉES TEMPS RÉEL]\n${platformContext}\n\n---\nMESSAGE : ${message}`
    : message;

  // Historique Gemini
  const rawHistory = history.map(m => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    text: m.content,
  }));
  let startIdx = 0;
  while (startIdx < rawHistory.length && rawHistory[startIdx].role === "model") startIdx++;
  const geminiHistory: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (let i = startIdx; i < rawHistory.length; i++) {
    const { role, text } = rawHistory[i];
    const last = geminiHistory[geminiHistory.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n" + text;
    } else {
      geminiHistory.push({ role, parts: [{ text }] });
    }
  }
  if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === "user") {
    geminiHistory.pop();
  }

  // Historique simple pour NVIDIA/Mistral (max 10 messages)
  const plainHistory = history.slice(0, -1).slice(-10);

  // ── Cascade : Gemini → NVIDIA → Mistral → Fallback local ──

  if (keys.gemini) {
    const result = await tryGemini(keys.gemini, geminiHistory, systemPrompt, toolList, enrichedMessage);
    if (result) return result;
  }

  if (keys.nvidia) {
    const result = await tryNvidia(keys.nvidia, systemPrompt, plainHistory, enrichedMessage);
    if (result) return result;
  }

  if (keys.mistral) {
    const result = await tryMistral(keys.mistral, systemPrompt, plainHistory, enrichedMessage);
    if (result) return result;
  }

  // Fallback local selon le mode
  console.warn("[IZI] Tous providers KO — fallback local");
  return isLanding ? landingFallback(message) : dashboardFallback(message, platformContext);
}