import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";

export default function VendorSubscription() {
  const { vendorProfile } = useAuth();
  const currentPlan = vendorProfile?.plan || "starter";

  const plans = [
    { id: "starter", name: "STARTER", price: "10 000", features: ["Fiche marketplace", "20 produits max", "50 commandes/mois", "Paiement Cash"] },
    { id: "pro", name: "PRO", price: "25 000", features: ["Tout Starter", "Catalogue illimité", "Commandes illimitées", "MTN & Moov MoMo", "Stats de base", "Badge Pro"] },
    { id: "premium", name: "PREMIUM", price: "50 000", features: ["Tout Pro", "Mise en avant", "Badge Vérifié", "Stats avancées", "Programme fidélité", "Codes promo", "WhatsApp Business"] },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Abonnement</h1>
      <div className="p-4 rounded-2xl bg-oresto-orange-light border border-primary/20">
        <p className="font-sub text-sm text-foreground">Votre plan actuel : <span className="font-bold text-primary">{currentPlan.toUpperCase()}</span> · Bienvenue sur Oresto !</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`rounded-2xl p-6 border ${plan.id === currentPlan ? "border-primary border-2" : "border-border"} bg-card`}>
            <h3 className="font-heading font-bold text-lg text-foreground">{plan.name}</h3>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{plan.price} <span className="text-sm font-normal text-muted-foreground">FCFA/mois</span></p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 font-body text-sm text-foreground"><Check size={14} className="text-primary" />{f}</li>
              ))}
            </ul>
            <button disabled={plan.id === currentPlan}
              className={`mt-4 w-full py-2.5 rounded-full font-sub text-sm btn-hover ${plan.id === currentPlan ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground"}`}>
              {plan.id === currentPlan ? "Plan actuel" : "Choisir"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
