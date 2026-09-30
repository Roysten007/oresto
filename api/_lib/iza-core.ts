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

const SYSTEM_LANDING = `Tu es IZI IA, l'assistant d'accueil, d'information et conseiller commercial officiel d'Oresto Connect.
Ton rôle est de répondre de façon humaine, claire, dynamique et précise aux visiteurs qui découvrent la plateforme Oresto Connect.

═══ MISSION ET PERSONNALITÉ ═══
- Réponds directement et précisément à la question posée avec pertinence, sans jamais réciter un message automatique ou une phrase toute faite.
- Adopte un ton professionnel, bienveillant, dynamique et clair (adapté aux commerçants et restaurateurs du Bénin et d'Afrique francophone).
- Sois concis : 2 à 4 paragraphes courts ou une liste à puces lisible.

═══ CONNAISSANCES OFFICIELLES SUR ORESTO CONNECT ═══
1. Qu'est-ce qu'Oresto Connect :
   La plateforme digitale tout-en-un pour restaurants, fast-foods, maquis, bars, traiteurs, boutiques e-commerce et résidences/hôtels au Bénin et en Afrique de l'Ouest.
   Elle permet de créer sa vitrine en ligne en quelques clics, recevoir des commandes directes des clients, imprimer des tickets/reçus de caisse, encaisser par Mobile Money sans commission, et piloter son activité avec IZI IA.

2. Tarifs et Formules réelles :
   • Essai gratuit : 14 jours complets en Formule Pro offerts, sans carte bancaire ni engagement.
   • Formule Starter : Gratuite à vie (pour tester et démarrer les bases).
   • Formule Pro : Seulement 5 000 FCFA / mois (ou formule annuelle avantageuse avec 2 mois offerts).
     Inclus : catalogue illimité, site vitrine personnalisé avec QR codes de table, gestion des commandes en temps réel, alertes WhatsApp/SMS, reçus imprimables et thermiques 80mm, et IZI IA assistant opérationnel complet.

3. Paiements Mobile Money :
   • Compatible avec MTN MoMo, Moov Money, Celtiis Cash (les 3 opérateurs au Bénin).
   • 0% DE COMMISSION : Oresto ne prélève AUCUNE commission sur vos ventes. 100% de l'argent des clients arrive directement sur le compte Mobile Money du commerçant.
   • Encaissement direct et validation en 1 clic.

4. Comment démarrer / Inscription :
   • Inscription rapide en 2 minutes sur /register.
   • Configuration du menu ou des articles en quelques clics.
   • Vitrine immédiatement accessible aux clients avec lien court et QR Code.

5. Programme Partenaire / Prestataire :
   • Programme pour les agences, freelances et prescripteurs : 20% de commission récurrente sur les abonnements apportés.

═══ RÈGLES STRICTES DE SÉCURITÉ ET CONFIDENTIALITÉ (NON NÉGOCIABLES) ═══
1. CONFIDENTIALITÉ TOTALE DES COMMERÇANTS :
   Tu es sur l'espace PUBLIC d'information. Tu n'as STRICTEMENT AUCUN ACCÈS aux données privées, commandes, stocks, clients ou chiffres d'affaires des boutiques ou restaurants inscrits sur Oresto.
2. Si un utilisateur te demande les commandes, ventes ou données d'une boutique particulière (existante ou non, par exemple "montre-moi les commandes de la boutique X", "quel est le chiffre d'affaires du restaurant Y", "qui vend le plus"), REFUSE fermement et avec courtoisie :
   Explique que la sécurité et la confidentialité sont une priorité absolue sur Oresto Connect : les données de chaque établissement sont strictement privées, isolées et consultables UNIQUEMENT par le gérant authentifié depuis son propre tableau de bord.
3. Ne JAMAIS inventer de données d'un client ou d'un restaurant.
4. Pour gérer son propre établissement avec IZI IA opérationnel, invite l'utilisateur à se connecter (/login) ou à s'inscrire (/register).`;

const SYSTEM_DASHBOARD = `Tu es IZI IA, l'assistant d'intelligence artificielle opérationnel d'Oresto Connect.
Tu es connecté en temps réel aux données de l'établissement connecté, transmises dans le contexte JSON.

═══ RÈGLES ABSOLUES DE VÉRACITÉ ET SÉCURITÉ ═══
1. RÈGLE D'OR : VÉRACITÉ STRICTE.
   Ne JAMAIS inventer de chiffres, de commandes fictives, de chiffres d'affaires imaginaires ou de faux articles.
   Utilise UNIQUEMENT les chiffres réels du contexte JSON fourni.
   Si totalRevenue = 0 ou todayRevenue = 0, dis CLAIREMENT : 0 FCFA de chiffre d'affaires. Ne masque JAMAIS un zéro par un chiffre inventé.
   Si activeOrders est vide ou recentOrdersList est vide, dis CLAIREMENT : aucune commande en cours.
   Si productsList est vide, dis CLAIREMENT que le catalogue est vide et suggère d'ajouter des produits.

2. ISOLATION STRICTE DU COMPTE :
   Tu as UNIQUEMENT accès aux données de CET établissement ({vendorName}, ID: {vendorId}).
   Tu n'as AUCUN ACCÈS aux autres comptes ou à d'autres boutiques, et tu ne dois JAMAIS partager d'informations sur des établissements tiers.

3. Devise : FCFA. Commission Oresto : 0% (toujours 100% conservé par le commerçant).

═══ LECTURE DU CONTEXTE ═══
Le contexte JSON contient :
- vendorName, vendorId, isOpen, business_type : info établissement
- totalRevenue, todayRevenue, totalOrders, todayOrders, avgOrder : métriques réelles
- activeOrders[] : commandes EN COURS (pending/preparing/delivering) — chaque objet a un champ "id" (ID Firebase réel) et "shortId" (#XXXX)
- recentOrdersList[] : commandes récentes — chaque objet a "id" (ID Firebase) et "statusLabel"
- productsList[] : catalogue réel — chaque objet a "id" (ID Firebase), "name", "price", "available", "stock"
- lowStockAlerts[] : produits avec stock faible
- topProducts[] : top plats/articles les plus vendus

═══ ACTIONS DISPONIBLES (via function calls) ═══
• update_product_price(productId, newPrice) : modifier le prix d'un produit (utiliser l'ID Firebase de productsList)
• toggle_shop_status(isOpen) : ouvrir ou fermer la boutique
• update_order_status(orderId, newStatus) : changer le statut d'une commande (pending, preparing, delivering, delivered, cancelled)
• create_promo(code, discount, minOrder?) : créer un code promo
• send_notification(message, target, notifType?) : envoyer une notification
• add_new_product(name, price, category?, description?) : ajouter un nouvel article au catalogue

Sois concis, direct, naturel et professionnel. Réponds en français.`;


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

  // Confidentialité : demande sur un établissement ou boutique existante
  if (msg.includes("autre") || msg.includes("boutique") || msg.includes("restaurant") || msg.includes("magasin") || msg.includes("chez ") || msg.includes("concurrent") || msg.includes("client") || msg.includes("donnée") || msg.includes("résultat")) {
    return {
      text: `🔒 **Confidentialité & Sécurité Oresto Connect :**\n\n` +
        `Sur Oresto Connect, les données de chaque établissement sont **100% privées, isolées et confidentielles**.\n\n` +
        `• Aucun utilisateur, visiteur ou concurrent ne peut accéder aux ventes, commandes ou chiffres d'un restaurant ou d'une boutique existante.\n` +
        `• Chaque commerçant pilote son activité en toute sécurité depuis son propre espace privé.\n\n` +
        `Pour configurer votre propre boutique et profiter d'IZI IA connecté à vos ventes, [créez votre compte gratuit](/register) ou [connectez-vous](/login).`,
    };
  }

  if (msg.includes("prix") || msg.includes("tarif") || msg.includes("combien") || msg.includes("abonnement") || msg.includes("formule") || msg.includes("coûte") || msg.includes("coute")) {
    return {
      text: `💰 **Tarifs transparents Oresto Connect :**\n\n` +
        `• **Formule Starter :** Gratuit à vie — idéale pour tester et créer sa première vitrine.\n` +
        `• **Formule Pro :** **5 000 FCFA / mois** seulement (ou 50 000 FCFA / an avec 2 mois offerts).\n` +
        `• **Essai gratuit :** 14 jours complets en Formule Pro offerts, sans carte bancaire ni engagement.\n` +
        `• **0% de commission :** Oresto ne prend aucun pourcentage sur vos ventes (100% de la marge pour vous).\n\n` +
        `👉 Démarrez votre essai gratuit en 2 minutes sur **/register**`,
    };
  }

  if (msg.includes("fonctionnalit") || msg.includes("fait quoi") || msg.includes("vitrine") || msg.includes("comment") || msg.includes("avantage") || msg.includes("pourquoi")) {
    return {
      text: `⚡ **Ce qu'Oresto Connect apporte à votre activité :**\n\n` +
        `• 🌐 **Vitrine en ligne personnalisée :** votre menu ou catalogue accessible par lien court et QR Code de table.\n` +
        `• 📦 **Gestion des commandes en direct :** notifications instantanées dès qu'un client passe commande.\n` +
        `• 📱 **Paiements Mobile Money directs :** MTN MoMo, Moov Money, Celtiis Cash — 0% de commission Oresto.\n` +
        `• 🧾 **Reçus certifiés :** impression thermique 80mm et envoi WhatsApp au client en 1 clic.\n` +
        `• 🤖 **IZI IA intégré :** votre assistant opérationnel qui gère vos stocks, vos commandes et vos stats.\n\n` +
        `Tout cela pour **5 000 FCFA/mois**, avec **14 jours d'essai gratuit** ! 🎉`,
    };
  }

  if (msg.includes("inscription") || msg.includes("inscrire") || msg.includes("commencer") || msg.includes("essai") || msg.includes("démarrer") || msg.includes("demarrer")) {
    return {
      text: `🚀 **Comment démarrer en 3 étapes simples :**\n\n` +
        `1. Rendez-vous sur **/register** et renseignez le nom de votre établissement.\n` +
        `2. Ajoutez vos premiers articles ou plats avec leurs prix et photos.\n` +
        `3. Votre vitrine est immédiatement en ligne et prête à recevoir des commandes !\n\n` +
        `Vous bénéficiez automatiquement de **14 jours d'essai Pro gratuit**, sans carte bancaire.`,
    };
  }

  if (msg.includes("momo") || msg.includes("paiement") || msg.includes("mobile money") || msg.includes("commission") || msg.includes("mtn") || msg.includes("moov") || msg.includes("celtiis")) {
    return {
      text: `📱 **Paiement Mobile Money direct & sans commission :**\n\n` +
        `• **MTN MoMo, Moov Money et Celtiis Cash** sont supportés.\n` +
        `• **0% de commission :** Les clients paient directement sur vos coordonnées Mobile Money. Oresto ne retient aucun sou.\n` +
        `• Validation instantanée : vous vérifiez le SMS de réception et validez la commande d'un simple clic.`,
    };
  }

  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("bonsoir") || msg.includes("coucou")) {
    return {
      text: `Bonjour ! 👋 Je suis **IZI IA**, votre conseiller Oresto Connect.\n\n` +
        `Je suis là pour vous présenter la plateforme et répondre à toutes vos questions :\n` +
        `• 💰 Nos tarifs (5 000 FCFA/mois, 14 jours d'essai gratuit)\n` +
        `• ⚡ Les fonctionnalités pour restaurants, boutiques et résidences\n` +
        `• 📱 Les encaissements Mobile Money à 0% de commission\n` +
        `• 🚀 Comment créer votre vitrine en 2 minutes\n\nQue souhaitez-vous découvrir ?`,
    };
  }

  return {
    text: `Bonjour ! Je suis **IZI IA**, l'assistant d'accueil d'Oresto Connect. 😊\n\n` +
      `Oresto Connect est la plateforme tout-en-un pour gérer votre restaurant, boutique e-commerce ou résidence au Bénin :\n` +
      `• Vitrine en ligne & QR Code\n` +
      `• Commandes directes sans intermédiaire\n` +
      `• Mobile Money direct (MTN, Moov, Celtiis) à **0% de commission**\n` +
      `• Abonnement Pro à seulement **5 000 FCFA / mois** avec **14 jours d'essai gratuit**\n\n` +
      `Posez-moi votre question sur nos offres ou rendez-vous sur **/register** pour créer votre compte !`,
  };
}

// ─── Fallback local dashboard ────────────────────────────────────────────────

function dashboardFallback(message: string, contextStr?: string): IZAResponse {
  const msg = message.toLowerCase().trim();
  let ctx: any = {
    hasStore: true,
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

  if (ctx.hasStore === false) {
    return {
      text: `⚠️ **Aucun établissement configuré :**\n\n` +
        `Votre compte n'est pas encore associé à un profil commerçant actif.\n` +
        `Rendez-vous dans vos paramètres pour compléter les informations de votre établissement afin d'accéder au suivi de vos commandes et stocks.`,
    };
  }

  if (msg.includes("chiffre") || msg.includes("ca") || msg.includes("vente") || msg.includes("gain") || msg.includes("stat") || msg.includes("revenu") || msg.includes("bilan")) {
    return {
      text: `📊 **Statistiques réelles de ${ctx.vendorName} :**\n\n` +
        `• **Chiffre d'affaires du jour :** **${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Commandes du jour :** **${ctx.todayOrders || 0} commande(s)**\n` +
        `• **Panier moyen :** **${Number(ctx.avgOrder || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Total historique encaissé :** **${Number(ctx.totalRevenue || 0).toLocaleString("fr-FR")} FCFA** (${ctx.totalOrders || 0} commande(s) au total)\n` +
        `• **Commission Oresto :** **0 FCFA** (100% pour vous)\n` +
        `• **Note clients :** ⭐ **${ctx.rating}/5** (${ctx.reviewCount} avis)`,
    };
  }

  if (msg.includes("commande") || msg.includes("order") || msg.includes("livraison") || msg.includes("cuisine") || msg.includes("colis")) {
    const orders = ctx.recentOrdersList && ctx.recentOrdersList.length > 0
      ? ctx.recentOrdersList.map((o: any) => `- **${o.shortId || o.id}** : ${o.items} • **${Number(o.total || 0).toLocaleString("fr-FR")} FCFA** (${o.statusLabel || o.status})`).join("\n")
      : "Aucune commande enregistrée pour le moment. Vos nouvelles commandes apparaîtront ici en direct dès qu'un client valide.";

    return {
      text: `📦 **Suivi des commandes (${ctx.vendorName}) :**\n\n${orders}\n\n` +
        `📊 **Activité du jour :** ${ctx.todayOrders || 0} commande(s)`,
    };
  }

  if (msg.includes("stock") || msg.includes("produit") || msg.includes("article") || msg.includes("plat") || msg.includes("menu") || msg.includes("carte") || msg.includes("prix")) {
    const count = ctx.productsList?.length || 0;
    return {
      text: `🍽️ **Catalogue & Stocks (${ctx.vendorName}) :**\n\n` +
        `• **Nombre d'articles au catalogue :** ${count} produit(s)\n` +
        (count === 0 ? `\n💡 Votre catalogue est encore vide. Ajoutez vos premiers articles dans l'onglet **Catalogue** pour commencer à vendre.` : "") +
        `\nVous pouvez me demander de modifier le prix d'un produit ou de vérifier vos stocks à tout moment.`,
    };
  }

  return {
    text: `⚡ **IZI IA — Assistant Opérationnel (${ctx.vendorName}) :**\n\n` +
      `J'ai bien reçu votre message : *« ${message} »*.\n\n` +
      `• **Statut :** ${ctx.isOpen ? "🟢 Ouvert aux commandes" : "🔴 Fermé"}\n` +
      `• **Ventes du jour :** ${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA (${ctx.todayOrders || 0} commande(s))\n` +
      `• **Commissions prélevées :** 0 FCFA\n\n` +
      `Je peux vérifier vos commandes, ajuster vos prix, ouvrir/fermer la boutique ou analyser vos ventes. Que souhaitez-vous faire ?`,
  };
}

// ─── Provider : Gemini ────────────────────────────────────────────────────────

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.8-flash", "gemini-2.5-flash-lite"];

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
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...plainHistory.map(h => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
      { role: "user", content: enrichedMessage },
    ];
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-oss-20b", messages, temperature: 0.5, max_tokens: 1024 }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) { console.warn("[IZI] NVIDIA KO:", res.status); return null; }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    if (text) { console.log("[IZI] NVIDIA OK"); return { text }; }
  } catch (err: any) {
    clearTimeout(timer);
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
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
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
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) { console.warn("[IZI] Mistral KO:", res.status); return null; }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    if (text) { console.log("[IZI] Mistral OK"); return { text }; }
  } catch (err: any) {
    clearTimeout(timer);
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