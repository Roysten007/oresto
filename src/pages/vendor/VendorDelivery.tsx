import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Truck, 
  Users, 
  MapPin, 
  Clock
} from "lucide-react";

export default function VendorDelivery() {
  const { vendorProfile } = useAuth();
  const [deliveryMode, setDeliveryMode] = useState<string>("own");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Configuration <span className="text-primary">Livraison</span>
          </h1>
          <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
            Gérez vos modes de livraison et vos tarifs
          </p>
        </div>
      </div>

      {/* Modes de Livraison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: "own", icon: Truck, title: "Propres Livreurs", desc: "Utilisez votre équipe interne", color: "text-blue-500", bg: "bg-blue-500/10" },
          { id: "oresto", icon: Users, title: "Réseau Oresto", desc: "Livreurs tiers mutualisés", color: "text-orange-500", bg: "bg-orange-500/10", tag: "Beta" },
          { id: "pickup", icon: MapPin, title: "À Emporter", desc: "Click & Collect uniquement", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((mode) => (
          <button 
            key={mode.id}
            onClick={() => setDeliveryMode(mode.id)}
            className={`relative p-8 rounded-[40px] border-2 text-left transition-all group ${
              deliveryMode === mode.id ? "bg-card border-primary shadow-xl scale-[1.02]" : "bg-card border-border hover:border-muted-foreground"
            }`}
          >
            {mode.tag && (
              <span className="absolute top-4 right-4 px-2 py-1 rounded-lg bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
                {mode.tag}
              </span>
            )}
            <div className={`p-4 rounded-2xl w-fit mb-6 ${mode.bg}`}>
              <mode.icon className={mode.color} size={28} />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">{mode.title}</h3>
            <p className="font-sub text-xs text-muted-foreground mt-2 italic leading-relaxed">{mode.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zones & Tarifs */}
        <div className="space-y-6">
          <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm">
            <h3 className="font-heading text-lg font-bold text-foreground mb-6">Périmètre de Service</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rayon de livraison</p>
                  <p className="text-sm font-bold">5.0 km (Cotonou)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Délai Moyen</p>
                  <p className="text-sm font-bold">25 - 35 Minutes</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Tarification Dynamique</p>
              <div className="space-y-3">
                {[{ z: "Zone A (Proche)", f: "500 F" }, { z: "Zone B (Moyenne)", f: "1000 F" }].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-muted/30">
                    <span className="text-xs font-bold">{item.z}</span>
                    <span className="text-xs font-black text-primary">{item.f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
