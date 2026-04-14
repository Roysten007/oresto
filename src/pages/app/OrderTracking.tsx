import { useParams } from "react-router-dom";
import { mockOrders } from "@/data/mockData";
import { Phone } from "lucide-react";

const statusSteps = [
  { key: "pending", label: "Commande reçue", icon: "✅" },
  { key: "preparing", label: "En préparation", icon: "🔄" },
  { key: "delivering", label: "En route", icon: "🚀" },
  { key: "delivered", label: "Livré", icon: "✅" },
];

export default function OrderTracking() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === id);
  if (!order) return <div className="p-8 text-center font-body text-muted-foreground">Commande introuvable</div>;

  const currentIdx = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="font-heading text-xl font-bold text-foreground">Commande #{order.id}</h1>

      <div className="p-4 rounded-2xl bg-muted text-center">
        <span className="font-sub text-sm text-muted-foreground">Arrivée estimée</span>
        <p className="font-heading text-2xl font-bold text-foreground">~15 min</p>
      </div>

      {/* Timeline */}
      <div className="space-y-0 pl-4">
        {statusSteps.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step.icon}
                </div>
                {i < statusSteps.length - 1 && <div className={`w-0.5 h-8 ${done ? "bg-primary" : "bg-border"}`} />}
              </div>
              <div className="pb-6">
                <p className={`font-sub text-sm ${done ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{step.label}</p>
                {active && step.key === "preparing" && <span className="text-xs text-primary animate-pulse">En cours...</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map placeholder */}
      <div className="h-40 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-body text-sm">
        🗺️ Carte de suivi
      </div>

      {/* Delivery person */}
      {order.deliveryPerson && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading font-bold text-sm">
            {order.deliveryPerson[0]}
          </div>
          <div className="flex-1">
            <p className="font-sub text-sm font-medium text-foreground">{order.deliveryPerson}</p>
            <p className="font-body text-xs text-muted-foreground">Votre livreur</p>
          </div>
          <button className="px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-sub btn-hover">
            <Phone size={14} className="inline mr-1" /> Appeler
          </button>
        </div>
      )}

      {/* Order details */}
      <div className="p-4 rounded-2xl bg-card border border-border">
        <h3 className="font-heading font-semibold text-sm text-foreground mb-3">Détails de la commande</h3>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between py-1 font-body text-sm">
            <span className="text-foreground">{item.qty}x {item.name}</span>
            <span className="text-muted-foreground">{(item.price * item.qty).toLocaleString()} FCFA</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2 border-t border-border font-heading font-bold text-sm">
          <span>Total</span>
          <span className="text-primary">{order.total.toLocaleString()} FCFA</span>
        </div>
      </div>
    </div>
  );
}
