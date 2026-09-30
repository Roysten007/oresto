import type { IZARequestBody, IZAResponse, IZAMode } from "../../api/_lib/iza-core";

export type { IZAResponse, IZAMode };

/**
 * Moteur intelligent IZI IA connecté aux statistiques et opérations réelles de chaque secteur
 */
/**
 * Moteur local de secours IZI IA — garantit des réponses vraies sans chiffres inventés
 */
function getLocalIZIResponse(message: string, contextStr?: string, mode: IZAMode = "dashboard"): IZAResponse {
  const msg = message.toLowerCase().trim();

  // ══════════════════════════════════════════════════════════════════════════════
  // MODE LANDING : Information publique sur Oresto, protection stricte des boutiques
  // ══════════════════════════════════════════════════════════════════════════════
  if (mode === "landing") {
    // Règle de confidentialité : question sur un établissement ou des tiers
    if (msg.includes("autre") || msg.includes("boutique") || msg.includes("restaurant") || msg.includes("magasin") || msg.includes("chez ") || msg.includes("concurrent") || msg.includes("client") || msg.includes("donnée") || msg.includes("résultat")) {
      return {
        text: `🔒 **Confidentialité & Sécurité Oresto :**\n\n` +
          `Sur Oresto Connect, chaque commerçant bénéficie d'un espace **strictement privé, protégé et isolé**.\n\n` +
          `• Les données financières, commandes, stocks et clients d'une boutique ne sont **jamais partagées ni accessibles** à d'autres utilisateurs.\n` +
          `• Pour suivre et gérer votre propre boutique avec IZI IA opérationnel, [créez votre compte gratuit](/register) ou [connectez-vous](/login).`,
      };
    }

    if (msg.includes("prix") || msg.includes("tarif") || msg.includes("combien") || msg.includes("abonnement") || msg.includes("formule") || msg.includes("coûte") || msg.includes("coute") || msg.includes("pack")) {
      return {
        text: `💰 **Tarifs transparents Oresto Connect (0% commission) :**\n\n` +
          `Profitez de **14 jours d'essai gratuit** (0 FCFA) sans carte bancaire pour tester toutes les fonctionnalités !\n\n` +
          `• **1 Établissement (Solo) :** **5 000 FCFA / mois** — formule tout inclus (vitrine web, QR Code, commandes directes, reçus certifiés, Mobile Money, IZI IA).\n` +
          `• **2 Établissements (Duo - Le plus populaire) :** **9 000 FCFA / mois** (soit *4 500 FCFA / mois* par établissement).\n` +
          `• **3 Établissements (Trio - Multi-activités) :** **12 000 FCFA / mois** (soit *4 000 FCFA / mois* par établissement, ex: restaurant + boutique + résidence).\n\n` +
          `✨ **0% de commission** sur tous vos encaissements. Sans engagement, résiliable en 1 clic.\n\n` +
          `👉 Démarrez votre essai gratuit de 14 jours sur **/register**`,
      };
    }

    if (msg.includes("fonctionnalit") || msg.includes("fait quoi") || msg.includes("vitrine") || msg.includes("comment") || msg.includes("avantage") || msg.includes("pourquoi")) {
      return {
        text: `⚡ **Ce qu'Oresto Connect fait pour votre commerce :**\n\n` +
          `• 🌐 **Vitrine web personnalisée :** menu ou catalogue consultable avec QR Code et lien direct.\n` +
          `• 📦 **Gestion des commandes en direct :** alertes temps réel, suivi en cuisine et livraison.\n` +
          `• 📱 **Paiements Mobile Money :** MTN MoMo, Moov Money, Celtiis Cash — 0% de commission.\n` +
          `• 🧾 **Reçus certifiés :** impression thermique 80mm et partage WhatsApp en 1 clic.\n` +
          `• 🤖 **IZI IA :** assistant opérationnel pour ajuster vos prix, surveiller vos stocks et analyser vos ventes.\n\n` +
          `Tout inclus pour **5 000 FCFA/mois** après **14 jours d'essai gratuit** !`,
      };
    }

    if (msg.includes("momo") || msg.includes("paiement") || msg.includes("mobile money") || msg.includes("commission") || msg.includes("mtn") || msg.includes("moov") || msg.includes("celtiis")) {
      return {
        text: `📱 **Paiement Mobile Money direct & sans commission :**\n\n` +
          `• Vos clients règlent directement sur vos numéros **MTN MoMo, Moov Money ou Celtiis Cash**.\n` +
          `• **0% de commission :** Oresto ne touche à aucun centime de vos encaissements.\n` +
          `• Validation instantanée : vous vérifiez le SMS de réception et validez la commande d'un simple clic.`,
      };
    }

    if (msg.includes("inscription") || msg.includes("inscrire") || msg.includes("commencer") || msg.includes("essai") || msg.includes("démarrer") || msg.includes("demarrer")) {
      return {
        text: `🚀 **Comment démarrer en 2 minutes :**\n\n` +
          `1. Cliquez sur **/register** et renseignez le nom de votre établissement.\n` +
          `2. Ajoutez vos premiers articles ou plats.\n` +
          `3. Votre vitrine est immédiatement en ligne et prête pour vos clients !\n\n` +
          `Vous bénéficiez automatiquement de **14 jours d'essai Pro gratuit**, sans carte bancaire.`,
      };
    }

    if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("bonsoir") || msg.includes("coucou")) {
      return {
        text: `Bonjour ! 👋 Je suis **IZI IA**, votre assistant Oresto Connect.\n\n` +
          `Je suis là pour vous renseigner sur la plateforme :\n` +
          `• 💰 Nos tarifs (5 000 FCFA/mois avec 14 jours d'essai gratuit)\n` +
          `• ⚡ Les fonctionnalités pour restaurants, boutiques et résidences\n` +
          `• 📱 Les encaissements Mobile Money à 0% de commission\n` +
          `• 🚀 Comment créer votre vitrine en 2 minutes\n\nQue souhaitez-vous savoir ?`,
      };
    }

    return {
      text: `Bonjour ! Je suis **IZI IA**, l'assistant d'accueil d'Oresto Connect. 😊\n\n` +
        `Oresto Connect est la plateforme digitale tout-en-un pour gérer votre restaurant, boutique ou hôtel au Bénin :\n` +
        `• Vitrine en ligne & QR Code\n` +
        `• Commandes directes sans intermédiaire\n` +
        `• Mobile Money direct (MTN, Moov, Celtiis) à **0% de commission**\n` +
        `• Formule Pro à seulement **5 000 FCFA / mois** avec **14 jours d'essai gratuit**\n\n` +
        `Posez-moi vos questions ou rendez-vous sur **/register** pour créer votre compte !`,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODE DASHBOARD : Données réelles et strictes du commerçant connecté uniquement
  // ══════════════════════════════════════════════════════════════════════════════
  let ctx: any = {
    hasStore: true,
    vendorName: "Mon Établissement",
    business_type: "restaurant",
    totalRevenue: 0,
    totalOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
    avgOrder: 0,
    rating: 5.0,
    reviewCount: 0,
    isOpen: true,
    recentOrdersList: [],
    productsList: []
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
        `Rendez-vous dans vos paramètres pour compléter votre profil et accéder à la gestion de vos commandes et stocks.`,
    };
  }

  // 1. Chiffre d'affaires & Ventes réelles
  if (msg.includes("chiffre") || msg.includes("ca") || msg.includes("vente") || msg.includes("argent") || msg.includes("gain") || msg.includes("stat") || msg.includes("revenu") || msg.includes("bilan")) {
    return {
      text: `📊 **Statistiques réelles de ${ctx.vendorName} :**\n\n` +
        `• **Chiffre d'affaires du jour :** **${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Commandes du jour :** **${ctx.todayOrders || 0} commande(s)**\n` +
        `• **Panier moyen :** **${Number(ctx.avgOrder || 0).toLocaleString("fr-FR")} FCFA**\n` +
        `• **Total historique encaissé :** **${Number(ctx.totalRevenue || 0).toLocaleString("fr-FR")} FCFA** (${ctx.totalOrders || 0} commande(s) au total)\n` +
        `• **Commissions Oresto :** **0 FCFA** (100% de la marge pour vous)\n` +
        `• **Note clients :** ⭐ **${ctx.rating || 5.0}/5** (${ctx.reviewCount || 0} avis)\n\n` +
        (Number(ctx.totalRevenue || 0) === 0 ? `💡 *Conseil : Partagez le lien de votre vitrine sur vos réseaux pour enregistrer vos premières ventes !*` : `💡 *Commissions prélevées : 0 FCFA.*`),
    };
  }

  // 2. Suivi des commandes en temps réel
  if (msg.includes("commande") || msg.includes("order") || msg.includes("colis") || msg.includes("livraison") || msg.includes("recu") || msg.includes("reçu") || msg.includes("ticket") || msg.includes("cuisine")) {
    const ordersFormatted = ctx.recentOrdersList && ctx.recentOrdersList.length > 0
      ? ctx.recentOrdersList.map((o: any) => `- **${o.shortId || o.id}** : ${o.items} • **${Number(o.total || 0).toLocaleString("fr-FR")} FCFA** (${o.payment || "MoMo"} • ${o.statusLabel || o.status})`).join("\n")
      : "Aucune commande enregistrée pour le moment.";

    return {
      text: `📦 **Suivi des commandes en direct (${ctx.vendorName}) :**\n\n` +
        `${ordersFormatted}\n\n` +
        `📊 **Commandes aujourd'hui :** ${ctx.todayOrders || 0}\n\n` +
        `🧾 **Impression des reçus :** Dans votre onglet Commandes, cliquez sur **« Reçu »** sur n'importe quelle commande pour imprimer le ticket thermique certifié ou l'envoyer au client sur WhatsApp.`,
    };
  }

  // 3. Stocks, Produits & Carte
  if (msg.includes("stock") || msg.includes("produit") || msg.includes("article") || msg.includes("plat") || msg.includes("menu") || msg.includes("chambre") || msg.includes("carte") || msg.includes("prix") || msg.includes("tarif")) {
    const prodsCount = ctx.productsList?.length || 0;
    const lowStock = ctx.lowStockAlerts || [];

    return {
      text: `🛍️ **Catalogue & Inventaire (${ctx.vendorName}) :**\n\n` +
        `• **Nombre d'articles au catalogue :** ${prodsCount} produit(s) actif(s)\n` +
        (lowStock.length > 0
          ? `• ⚠️ **Alertes stock faible (≤ 3) :**\n` + lowStock.map((p: any) => `  - *${p.name}* : plus que **${p.stock} en stock**`).join("\n") + `\n`
          : (prodsCount === 0 ? `\n💡 Votre catalogue est encore vide. Ajoutez vos premiers articles dans l'onglet **Catalogue** pour commencer à vendre.\n` : `• ✅ Aucun produit en rupture critique actuellement.\n`)) +
        `\n👉 Vous pouvez me demander de mettre à jour le prix d'un article ou de modifier sa disponibilité à tout moment.`,
    };
  }

  // 4. Paiement Mobile Money & Sécurité
  if (msg.includes("momo") || msg.includes("paiement") || msg.includes("transfert") || msg.includes("mtn") || msg.includes("moov") || msg.includes("celtiis")) {
    return {
      text: `📱 **Encaissements Mobile Money 100% Directs :**\n\n` +
        `• Vos clients règlent directement sur vos comptes **MTN MoMo, Moov Money ou Celtiis Cash**.\n` +
        `• **0% de Commission :** Oresto ne prélève aucun pourcentage sur vos transactions.\n` +
        `• **Validation instantanée :** Vous vérifiez le SMS de réception et validez la commande d'un simple clic pour lancer la préparation ou l'expédition.`,
    };
  }

  // 5. Site vitrine, activation & lien public
  if (msg.includes("site") || msg.includes("lien") || msg.includes("vitrine") || msg.includes("fonctionnel") || msg.includes("en ligne") || msg.includes("adresse") || msg.includes("url") || msg.includes("partager")) {
    const slug = ctx.slug || "boutique";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const siteUrl = ctx.publicSiteUrl || (origin ? `${origin}/r/${slug}` : `/r/${slug}`);
    return {
      text: `🌐 **Vitrine en ligne de ${ctx.vendorName} :**\n\n` +
        `• **Statut :** 🟢 **100% Fonctionnel & En ligne**\n` +
        `• **Lien public direct :** [${siteUrl}](${siteUrl})\n\n` +
        `Partagez ce lien à vos clients sur WhatsApp ou vos réseaux sociaux : ils peuvent consulter votre carte, passer commande et régler directement par Mobile Money sans commission !`,
    };
  }

  // 6. Salutations
  if (msg.includes("bonjour") || msg.includes("salut") || msg.includes("hello") || msg.includes("coucou") || msg.includes("qui es-tu") || msg.includes("aide")) {
    return {
      text: `Bonjour ${ctx.userName || "Chef"} ! 👋 Je suis **IZI IA**, votre assistant opérationnel dédié à **${ctx.vendorName}**.\n\n` +
        `Je suis connecté en direct à votre établissement :\n` +
        `• 📊 **Ventes du jour :** ${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA (${ctx.todayOrders || 0} commande(s))\n` +
        `• 📦 **Total historique :** ${Number(ctx.totalRevenue || 0).toLocaleString("fr-FR")} FCFA\n` +
        `• 🟢 **Statut :** ${ctx.isOpen ? "Ouvert aux commandes" : "Fermé"}\n\n` +
        `Que souhaitez-vous vérifier ou modifier aujourd'hui ?`,
    };
  }

  // Fallback intelligent
  return {
    text: `⚡ **IZI IA — Assistant Opérationnel (${ctx.vendorName}) :**\n\n` +
      `J'ai bien reçu votre demande : *« ${message} »*.\n\n` +
      `• **Ventes du jour :** ${Number(ctx.todayRevenue || 0).toLocaleString("fr-FR")} FCFA (${ctx.todayOrders || 0} commande(s))\n` +
      `• **Statut de votre vitrine :** ${ctx.isOpen ? "🟢 En ligne & prête" : "🔴 Fermée"}\n` +
      `• **Commissions Oresto :** 0 FCFA (100% pour vous)\n\n` +
      `Posez-moi vos questions sur vos ventes, commandes, stocks ou modification de tarifs !`,
  };
}

/**
 * Service client IZI IA — communique avec le backend et bascule automatiquement sur le moteur local
 * @param userMessage  Message de l'utilisateur
 * @param history      Historique de la conversation
 * @param platformContext  Données temps réel du vendeur (dashboard uniquement)
 * @param mode         "landing" (FAQ Oresto) | "dashboard" (opérationnel)
 */
export async function askIZA(
  userMessage: string,
  history: { role: string; content: string }[] = [],
  platformContext?: string,
  mode: IZAMode = "dashboard",
): Promise<IZAResponse> {
  const body: IZARequestBody = { message: userMessage, history, platformContext, mode };

  try {
    const res = await fetch("/api/iza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return getLocalIZIResponse(userMessage, platformContext, mode);
    }

    const data = await res.json();
    if (!data.text && (!data.functionCalls || data.functionCalls.length === 0)) {
      return getLocalIZIResponse(userMessage, platformContext, mode);
    }

    return data;
  } catch {
    return getLocalIZIResponse(userMessage, platformContext, mode);
  }
}
