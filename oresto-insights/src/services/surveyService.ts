import { db } from "@/lib/firebase";
import { ref, push, set, get, onValue } from "firebase/database";
import { SurveyResponse } from "@/types/survey";

const DB_NODE = "survey_responses";
const LOCAL_STORAGE_KEY = "oresto_insights_responses_cache";

/**
 * Soumettre une réponse au questionnaire Oresto Insights
 * Enregistrement direct dans la base de données Firebase Realtime Database
 */
export async function submitSurveyResponse(data: Omit<SurveyResponse, "id" | "createdAt">): Promise<{ success: boolean; id?: string; error?: string }> {
  const timestamp = new Date().toISOString();
  const tempId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const completeData: SurveyResponse = {
    ...data,
    id: tempId,
    createdAt: timestamp,
  };

  // Enregistrement direct et sécurisé dans la base de données Firebase
  if (db) {
    try {
      const newRef = push(ref(db, DB_NODE));
      completeData.id = newRef.key || tempId;
      await set(newRef, completeData);
      return { success: true, id: completeData.id };
    } catch (err: any) {
      console.error("[Oresto Insights] Erreur enregistrement Firebase:", err);
      return { success: false, error: "Erreur lors de l'enregistrement dans la base de données." };
    }
  }

  return { success: false, error: "Connexion à la base de données indisponible." };
}

/**
 * Récupérer toutes les réponses en temps réel pour le tableau de bord administrateur
 * Accès réservé aux administrateurs authentifiés via Firebase Realtime Database
 */
export function subscribeToSurveyResponses(callback: (responses: SurveyResponse[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }

  const responsesRef = ref(db, DB_NODE);
  const unsubscribe = onValue(
    responsesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: SurveyResponse[] = Object.keys(val).map((k) => ({
          id: k,
          ...val[k],
        }));
        // Trier par date décroissante (plus récent en premier)
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(list);
      } else {
        callback([]);
      }
    },
    (err) => {
      console.warn("[Oresto Insights] Erreur lecture Firebase (Accès réservé aux administrateurs):", err);
      callback([]);
    }
  );

  return () => unsubscribe();
}



/**
 * Injecter un jeu de données initial réaliste d'étude de marché au Bénin (Seeding)
 */
export async function seedRealisticMarketData(): Promise<number> {
  const seeds: Omit<SurveyResponse, "id">[] = [
    {
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      establishmentType: "Restaurant",
      establishmentAge: "1 à 3 ans",
      city: "Cotonou",
      employeeCount: "6–10",
      orderChannels: ["Sur place", "WhatsApp", "Téléphone"],
      websiteStatus: "Non",
      noWebsiteReasons: ["Trop compliqué à gérer", "Je préfère WhatsApp"],
      menuMethod: "Image envoyée sur WhatsApp",
      orderManagement: "WhatsApp",
      problems: [
        "Trop de commandes dispersées sur WhatsApp",
        "Difficulté à gérer les livraisons",
        "Manque de statistiques sur les ventes",
        "Difficulté à suivre les revenus",
      ],
      biggestProblem: "Pendant le coup de feu de midi, on reçoit 20 messages WhatsApp à la fois, le serveur oublie des commandes et on perd de l'argent sur les livraisons.",
      featureScores: {
        vitrine: 5,
        qr_menu: 5,
        online_orders: 5,
        whatsapp_orders: 5,
        order_management: 5,
        stock_management: 4,
        table_reservation: 4,
        delivery_management: 5,
        stats: 5,
        momo_payments: 5,
        multi_establishment: 2,
        ai_assistant: 4,
      },
      preferredPricingModel: "Payer un abonnement mensuel fixe",
      acceptableSubscription: "5 000 – 10 000 FCFA",
      acceptableCommission: "0 %",
      paymentMethods: ["MTN Mobile Money", "Moov Money", "Espèces"],
      concerns: ["Difficulté d'utilisation", "Prix"],
      expectations: "Une solution simple que mes serveurs peuvent utiliser sur un smartphone sans formation compliquée.",
      wantsToTest: "Oui",
      name: "Gildas Houndégnon",
      establishmentName: "Saveurs d'Afrique Cotonou",
      whatsapp: "+229 97 12 34 56",
      email: "saveursdafrique.cotonou@gmail.com",
      contactCity: "Cotonou",
      contactConsent: true,
    },
    {
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      establishmentType: "Maquis",
      establishmentAge: "3 à 5 ans",
      city: "Abomey-Calavi",
      employeeCount: "3–5",
      orderChannels: ["Sur place", "WhatsApp"],
      websiteStatus: "Non",
      noWebsiteReasons: ["Trop cher", "Je n'en vois pas l'utilité"],
      menuMethod: "Menu papier",
      orderManagement: "Cahier papier",
      problems: [
        "Difficulté à suivre les commandes",
        "Difficulté à gérer les stocks",
        "Difficulté à suivre les revenus",
      ],
      biggestProblem: "Le soir les serveurs notent mal les boissons sur les cahiers et les caisses ne tombent jamais juste.",
      featureScores: {
        vitrine: 3,
        qr_menu: 4,
        online_orders: 4,
        whatsapp_orders: 4,
        order_management: 5,
        stock_management: 5,
        table_reservation: 2,
        delivery_management: 3,
        stats: 5,
        momo_payments: 5,
        multi_establishment: 1,
        ai_assistant: 3,
      },
      preferredPricingModel: "Payer un abonnement mensuel fixe",
      acceptableSubscription: "2 500 – 5 000 FCFA",
      acceptableCommission: "0 %",
      paymentMethods: ["MTN Mobile Money", "Celtiis", "Espèces"],
      concerns: ["Paiements", "Commission sur les ventes"],
      expectations: "Que l'argent des clients arrive directement sur mon Momo sans frais cachés.",
      wantsToTest: "Oui",
      name: "Tantie Mariam",
      establishmentName: "Maquis La Détente Calavi",
      whatsapp: "+229 96 44 22 11",
      contactCity: "Abomey-Calavi",
      contactConsent: true,
    },
    {
      createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      establishmentType: "Fast-food",
      establishmentAge: "Moins de 1 an",
      city: "Cotonou",
      employeeCount: "3–5",
      orderChannels: ["WhatsApp", "Instagram", "Téléphone"],
      websiteStatus: "Non",
      noWebsiteReasons: ["Je ne sais pas comment en créer un", "Je n'ai pas encore eu le temps"],
      menuMethod: "Image envoyée sur WhatsApp",
      orderManagement: "WhatsApp",
      problems: [
        "Trop de commandes dispersées sur WhatsApp",
        "Erreurs dans les commandes",
        "Difficulté à gérer les livraisons",
        "Peu de visibilité sur internet",
      ],
      biggestProblem: "Les clients sur Instagram et WhatsApp posent 50 fois les mêmes questions de prix et envoient des adresses incomplètes pour la livraison.",
      featureScores: {
        vitrine: 5,
        qr_menu: 4,
        online_orders: 5,
        whatsapp_orders: 5,
        order_management: 5,
        stock_management: 3,
        table_reservation: 2,
        delivery_management: 5,
        stats: 4,
        momo_payments: 5,
        multi_establishment: 3,
        ai_assistant: 5,
      },
      preferredPricingModel: "Un petit abonnement + un petit pourcentage",
      acceptableSubscription: "5 000 – 10 000 FCFA",
      acceptableCommission: "2–3 %",
      paymentMethods: ["MTN Mobile Money", "Moov Money"],
      concerns: ["Problèmes techniques", "Difficulté d'utilisation"],
      expectations: "Une vitrine avec lien dans ma bio Instagram où les gens cliquent, choisissent le burger et ça génère le bon de livraison direct.",
      wantsToTest: "Oui",
      name: "Kévin Tossou",
      establishmentName: "Burger Spot Haie Vive",
      whatsapp: "+229 61 88 99 00",
      email: "burgerspot.cotonou@gmail.com",
      contactCity: "Cotonou",
      contactConsent: true,
    },
    {
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      establishmentType: "Traiteur",
      establishmentAge: "3 à 5 ans",
      city: "Porto-Novo",
      employeeCount: "6–10",
      orderChannels: ["Téléphone", "WhatsApp", "Facebook"],
      websiteStatus: "Non",
      noWebsiteReasons: ["Trop cher", "Je préfère WhatsApp"],
      menuMethod: "PDF",
      orderManagement: "Excel / Google Sheets",
      problems: [
        "Menu difficile à mettre à jour",
        "Difficulté à attirer de nouveaux clients",
        "Difficulté à suivre les revenus",
      ],
      biggestProblem: "Changer les prix des formules sur les PDF est fastidieux, les clients ont toujours de vieux menus.",
      featureScores: {
        vitrine: 5,
        qr_menu: 3,
        online_orders: 4,
        whatsapp_orders: 5,
        order_management: 4,
        stock_management: 3,
        table_reservation: 2,
        delivery_management: 4,
        stats: 4,
        momo_payments: 5,
        multi_establishment: 2,
        ai_assistant: 3,
      },
      preferredPricingModel: "Payer un abonnement mensuel fixe",
      acceptableSubscription: "5 000 – 10 000 FCFA",
      acceptableCommission: "0 %",
      paymentMethods: ["MTN Mobile Money", "Moov Money", "Espèces"],
      concerns: ["Manque de confiance"],
      expectations: "Pouvoir mettre à jour mes forfaits événements en temps réel.",
      wantsToTest: "Peut-être",
      name: "Clarisse Agboton",
      establishmentName: "Prestige Délices Traiteur",
      whatsapp: "+229 95 33 22 11",
      contactCity: "Porto-Novo",
      contactConsent: true,
    },
    {
      createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      establishmentType: "Hôtel avec restaurant",
      establishmentAge: "Plus de 5 ans",
      city: "Cotonou",
      employeeCount: "11–20",
      orderChannels: ["Sur place", "Téléphone", "Site internet"],
      websiteStatus: "Oui, mais il n'est plus vraiment utilisé",
      menuMethod: "Menu papier",
      orderManagement: "Logiciel",
      problems: [
        "Difficulté à gérer les réservations",
        "Menu difficile à mettre à jour",
        "Erreurs dans les commandes",
      ],
      biggestProblem: "Le site actuel a été fait par une agence il y a 4 ans et nous ne pouvons rien modifier nous-mêmes sans payer des frais.",
      featureScores: {
        vitrine: 4,
        qr_menu: 5,
        online_orders: 4,
        whatsapp_orders: 4,
        order_management: 4,
        stock_management: 4,
        table_reservation: 5,
        delivery_management: 3,
        stats: 5,
        momo_payments: 5,
        multi_establishment: 5,
        ai_assistant: 4,
      },
      preferredPricingModel: "Payer un abonnement mensuel fixe",
      acceptableSubscription: "15 000 – 25 000 FCFA",
      acceptableCommission: "0 %",
      paymentMethods: ["Carte bancaire", "MTN Mobile Money", "Moov Money", "Espèces"],
      concerns: ["Support client", "Problèmes techniques"],
      expectations: "Une équipe support locale joignable rapidement en cas de souci avec les QR codes des chambres.",
      wantsToTest: "Oui",
      name: "Arnaud Dossou",
      establishmentName: "Résidence Hôtelière Le Flamboyant",
      whatsapp: "+229 97 50 50 50",
      email: "direction@leflamboyant-cotonou.com",
      contactCity: "Cotonou",
      contactConsent: true,
    },
    {
      createdAt: new Date(Date.now() - 32 * 3600 * 1000).toISOString(),
      establishmentType: "Café / snack",
      establishmentAge: "1 à 3 ans",
      city: "Parakou",
      employeeCount: "3–5",
      orderChannels: ["Sur place", "WhatsApp"],
      websiteStatus: "Non",
      noWebsiteReasons: ["Je ne sais pas comment en créer un"],
      menuMethod: "QR Code",
      orderManagement: "Cahier papier",
      problems: [
        "Peu de visibilité sur internet",
        "Manque de statistiques sur les ventes",
        "Difficulté à attirer de nouveaux clients",
      ],
      biggestProblem: "Les jeunes de Parakou aiment les QR codes mais notre solution actuelle ne permet pas de passer commande.",
      featureScores: {
        vitrine: 5,
        qr_menu: 5,
        online_orders: 5,
        whatsapp_orders: 4,
        order_management: 4,
        stock_management: 3,
        table_reservation: 3,
        delivery_management: 3,
        stats: 4,
        momo_payments: 5,
        multi_establishment: 2,
        ai_assistant: 3,
      },
      preferredPricingModel: "Une formule gratuite limitée + des formules payantes",
      acceptableSubscription: "2 500 – 5 000 FCFA",
      acceptableCommission: "Moins de 2 %",
      paymentMethods: ["MTN Mobile Money", "Espèces"],
      concerns: ["Prix", "Paiements"],
      expectations: "Un tarif adapté aux commerces de l'intérieur du pays, pas uniquement aligné sur Cotonou.",
      wantsToTest: "Oui",
      name: "Bio Souleymane",
      establishmentName: "Pause Gourmande Parakou",
      whatsapp: "+229 97 88 11 22",
      contactCity: "Parakou",
      contactConsent: true,
    },
  ];

  let added = 0;
  for (const s of seeds) {
    await submitSurveyResponse(s);
    added++;
  }
  return added;
}

/**
 * Exporter les réponses sous format CSV
 */
export function exportResponsesToCSV(responses: SurveyResponse[]): void {
  const headers = [
    "ID",
    "Date",
    "Type",
    "Ancienneté",
    "Ville",
    "Employés",
    "Canaux de commande",
    "A un site",
    "Méthode menu",
    "Gestion commandes",
    "Problèmes rencontrés",
    "Plus gros problème (Verbatim)",
    "Modèle éco préféré",
    "Budget abonnement",
    "Commission acceptable",
    "Moyens paiement",
    "Freins",
    "Attentes",
    "Souhaite tester",
    "Nom contact",
    "Établissement",
    "WhatsApp",
    "Email",
  ];

  const escapeCSV = (str: any) => {
    if (str === undefined || str === null) return '""';
    const val = Array.isArray(str) ? str.join(", ") : String(str);
    return `"${val.replace(/"/g, '""')}"`;
  };

  const rows = responses.map((r) => [
    escapeCSV(r.id),
    escapeCSV(r.createdAt),
    escapeCSV(r.establishmentType),
    escapeCSV(r.establishmentAge),
    escapeCSV(r.city),
    escapeCSV(r.employeeCount),
    escapeCSV(r.orderChannels),
    escapeCSV(r.websiteStatus),
    escapeCSV(r.menuMethod),
    escapeCSV(r.orderManagement),
    escapeCSV(r.problems),
    escapeCSV(r.biggestProblem),
    escapeCSV(r.preferredPricingModel),
    escapeCSV(r.acceptableSubscription),
    escapeCSV(r.acceptableCommission),
    escapeCSV(r.paymentMethods),
    escapeCSV(r.concerns),
    escapeCSV(r.expectations),
    escapeCSV(r.wantsToTest),
    escapeCSV(r.name || ""),
    escapeCSV(r.establishmentName || ""),
    escapeCSV(r.whatsapp || ""),
    escapeCSV(r.email || ""),
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");
  downloadFile(csvContent, `oresto_insights_reponses_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Exporter uniquement la liste des prospects chauds (Ceux qui souhaitent tester avec accord de contact)
 */
export function exportLeadsToCSV(responses: SurveyResponse[]): void {
  const qualifiedLeads = responses.filter((r) => r.contactConsent && (r.wantsToTest === "Oui" || r.wantsToTest === "Peut-être") && r.whatsapp);

  const headers = [
    "Nom",
    "Établissement",
    "Type",
    "Ville",
    "WhatsApp",
    "Email",
    "Intérêt",
    "Modèle préféré",
    "Budget",
    "Plus gros problème",
    "Date",
  ];

  const escapeCSV = (str: any) => {
    if (str === undefined || str === null) return '""';
    return `"${String(str).replace(/"/g, '""')}"`;
  };

  const rows = qualifiedLeads.map((r) => [
    escapeCSV(r.name || ""),
    escapeCSV(r.establishmentName || ""),
    escapeCSV(r.establishmentType),
    escapeCSV(r.city),
    escapeCSV(r.whatsapp || ""),
    escapeCSV(r.email || ""),
    escapeCSV(r.wantsToTest),
    escapeCSV(r.preferredPricingModel),
    escapeCSV(r.acceptableSubscription),
    escapeCSV(r.biggestProblem || ""),
    escapeCSV(r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : ""),
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\r\n");
  downloadFile(csvContent, `oresto_insights_leads_beta_${new Date().toISOString().split("T")[0]}.csv`, "text/csv;charset=utf-8;");
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
