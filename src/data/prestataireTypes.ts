export interface Prestataire {
  uid: string;
  nom: string;
  telephone: string;
  ville: string;
  email: string;
  code_referral: string;
  date_inscription: string;
  statut: "actif" | "inactif";
  total_gagne?: number;
  total_en_attente?: number;
}

export interface Commission {
  id: string;
  prestataire_id: string;
  client_id: string;
  client_name: string;
  client_category?: string;
  client_city?: string;
  mois: string; // format "YYYY-MM" (ex: "2026-08")
  montant_abonnement: number;
  montant_commission: number; // 20%
  statut: "en_attente" | "paye";
  date_paiement: string | null;
  created_at: string;
}

export interface ReferredClient {
  id: string;
  name: string;
  category: string;
  city: string;
  joinedDate: string;
  subscriptionPlan: "starter" | "pro";
  subscriptionStatus: "active" | "trial" | "pending_payment" | "restricted";
  monthlyCommission: number;
}
