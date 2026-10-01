export type EstablishmentType =
  | "Restaurant"
  | "Maquis"
  | "Fast-food"
  | "Traiteur"
  | "Café / snack"
  | "Bar / lounge"
  | "Hôtel avec restaurant"
  | "Autre";

export type EstablishmentAge =
  | "Moins de 1 an"
  | "1 à 3 ans"
  | "3 à 5 ans"
  | "Plus de 5 ans";

export type CityBenin =
  | "Cotonou"
  | "Abomey-Calavi"
  | "Porto-Novo"
  | "Parakou"
  | "Abomey"
  | "Bohicon"
  | "Ouidah"
  | "Autre";

export type EmployeeCount =
  | "1–2"
  | "3–5"
  | "6–10"
  | "11–20"
  | "Plus de 20";

export type OrderChannel =
  | "Sur place"
  | "Téléphone"
  | "WhatsApp"
  | "Facebook"
  | "Instagram"
  | "Site internet"
  | "Application"
  | "Autre";

export type WebsiteStatus =
  | "Oui"
  | "Non"
  | "Oui, mais il n'est plus vraiment utilisé";

export type NoWebsiteReason =
  | "Trop cher"
  | "Je n'en vois pas l'utilité"
  | "Je ne sais pas comment en créer un"
  | "Je préfère WhatsApp"
  | "Trop compliqué à gérer"
  | "Je n'ai pas encore eu le temps"
  | "Autre";

export type MenuMethod =
  | "Menu papier"
  | "Image envoyée sur WhatsApp"
  | "PDF"
  | "QR Code"
  | "Site internet"
  | "Réseaux sociaux"
  | "Autre";

export type OrderManagementMethod =
  | "Cahier papier"
  | "WhatsApp"
  | "Téléphone"
  | "Excel / Google Sheets"
  | "Logiciel"
  | "Application"
  | "Autre";

export type RestaurantProblem =
  | "Trop de commandes dispersées sur WhatsApp"
  | "Erreurs dans les commandes"
  | "Difficulté à suivre les commandes"
  | "Difficulté à gérer les livraisons"
  | "Difficulté à gérer les stocks"
  | "Menu difficile à mettre à jour"
  | "Peu de visibilité sur internet"
  | "Difficulté à attirer de nouveaux clients"
  | "Difficulté à gérer les réservations"
  | "Manque de statistiques sur les ventes"
  | "Difficulté à suivre les revenus"
  | "Aucun problème majeur"
  | "Autre";

export type PricingModelPreference =
  | "Payer un abonnement mensuel fixe"
  | "Ne pas payer d'abonnement mais payer un pourcentage sur les ventes"
  | "Un petit abonnement + un petit pourcentage"
  | "Une formule gratuite limitée + des formules payantes"
  | "Je ne sais pas encore";

export type AcceptableSubscriptionTier =
  | "Moins de 2 500 FCFA / mois"
  | "2 500 – 5 000 FCFA"
  | "5 000 – 10 000 FCFA"
  | "10 000 – 15 000 FCFA"
  | "15 000 – 25 000 FCFA"
  | "Plus de 25 000 FCFA"
  | "Je ne paierais pas d'abonnement";

export type AcceptableCommissionTier =
  | "0 %"
  | "Moins de 2 %"
  | "2–3 %"
  | "3–5 %"
  | "Plus de 5 %"
  | "Je ne souhaite pas payer de commission";

export type PaymentMethod =
  | "MTN Mobile Money"
  | "Moov Money"
  | "Celtiis"
  | "Espèces"
  | "Carte bancaire"
  | "Autre";

export type AdoptionConcern =
  | "Prix"
  | "Commission sur les ventes"
  | "Difficulté d'utilisation"
  | "Manque de confiance"
  | "Paiements"
  | "Problèmes techniques"
  | "Support client"
  | "Je préfère WhatsApp"
  | "Autre";

export type WantsToTestStatus = "Oui" | "Peut-être" | "Non";

export interface FeatureRatingItem {
  id: string;
  title: string;
  description: string;
  score: number; // 1 to 5
}

export interface SurveyResponse {
  id: string;
  createdAt: string;

  // Étape 1 : Profil
  establishmentType: EstablishmentType | string;
  establishmentTypeOther?: string;
  establishmentAge: EstablishmentAge;
  city: CityBenin | string;
  cityOther?: string;
  employeeCount: EmployeeCount;

  // Étape 2 : Fonctionnement
  orderChannels: (OrderChannel | string)[];
  orderChannelsOther?: string;
  websiteStatus: WebsiteStatus;
  noWebsiteReasons?: (NoWebsiteReason | string)[];
  noWebsiteOther?: string;
  menuMethod: MenuMethod | string;
  menuMethodOther?: string;
  orderManagement: OrderManagementMethod | string;
  orderManagementOther?: string;

  // Étape 3 : Problèmes
  problems: (RestaurantProblem | string)[];
  problemsOther?: string;
  biggestProblem: string; // Verbatim texte libre

  // Étape 4 : Intérêt Fonctionnalités (1 to 5)
  featureScores: Record<string, number>;

  // Étape 5 : Modèle économique
  preferredPricingModel: PricingModelPreference;
  acceptableSubscription: AcceptableSubscriptionTier;
  acceptableCommission: AcceptableCommissionTier;

  // Étape 6 : Paiements et freins
  paymentMethods: (PaymentMethod | string)[];
  paymentMethodsOther?: string;
  concerns: (AdoptionConcern | string)[];
  concernsOther?: string;
  expectations: string; // Verbatim texte libre

  // Étape 7 : Contact & Bêta-test
  wantsToTest: WantsToTestStatus;
  name?: string;
  establishmentName?: string;
  whatsapp?: string;
  email?: string;
  contactCity?: string;
  contactConsent: boolean;

  // Métadonnées techniques
  completedAt?: string;
  userAgent?: string;
  durationSeconds?: number;
}

export interface SurveyFilterOptions {
  city?: string;
  establishmentType?: string;
  employeeCount?: string;
  pricingModel?: string;
  budget?: string;
  wantsToTest?: string;
  searchQuery?: string;
  hasWebsite?: string;
}
