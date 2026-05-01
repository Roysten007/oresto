import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, get, set, push, onValue, remove } from "firebase/database";
import { 
  Truck, 
  Users, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  phone: string;
  status: "available" | "busy" | "offline";
  lastOrder?: string;
}

export default function VendorDelivery() {
  const { vendorProfile } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<string>("own");

  useEffect(() => {
    if (!vendorProfile?.id) return;
    const driversRef = ref(db, `vendors/${vendorProfile.id}/drivers`);
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
        setDrivers(list);
      } else {
        setDrivers([]);
      }
    });
    return () => unsubscribe();
  }, [vendorProfile?.id]);

  const addDriver = async () => {
    if (!newDriver.name || !newDriver.phone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    try {
      const driversRef = ref(db, `vendors/${vendorProfile?.id}/drivers`);
      const newRef = push(driversRef);
      await set(newRef, {
        name: newDriver.name,
        phone: newDriver.phone,
        status: "available",
        createdAt: new Date().toISOString()
      });
      setNewDriver({ name: "", phone: "" });
      setIsAdding(false);
      toast.success("Livreur ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const removeDriver = async (id: string) => {
    if (window.confirm("Supprimer ce livreur ?")) {
      await remove(ref(db, `vendors/${vendorProfile?.id}/drivers/${id}`));
      toast.success("Livreur supprimé");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "available" ? "busy" : "available";
    await set(ref(db, `vendors/${vendorProfile?.id}/drivers/${id}/status`), nextStatus);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Logistique & <span className="text-primary">Livraison</span>
          </h1>
          <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
            Gérez vos modes de livraison et votre flotte de livreurs
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

      {/* Gestion des Livreurs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">Équipe de Livraison</h3>
                <p className="font-sub text-sm text-muted-foreground">Vos coursiers actifs sur le terrain</p>
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-2xl font-sub text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors"
              >
                <Plus size={14} /> Ajouter un livreur
              </button>
            </div>

            {isAdding && (
              <div className="mb-8 p-6 rounded-[32px] bg-muted/30 border border-dashed border-border animate-in fade-in slide-in-from-top-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nom Complet</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jean Dupont"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Numéro de Téléphone</label>
                    <input 
                      type="tel" 
                      placeholder="+229 00 00 00 00"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setIsAdding(false)} className="px-6 py-3 font-sub text-[10px] font-black uppercase tracking-widest">Annuler</button>
                  <button onClick={addDriver} className="px-8 py-3 bg-primary text-white rounded-2xl font-sub text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Enregistrer</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {drivers.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-[32px]">
                  <UserPlus className="mx-auto text-muted-foreground opacity-20 mb-4" size={40} />
                  <p className="font-sub text-muted-foreground italic">Aucun livreur enregistré pour le moment.</p>
                </div>
              ) : (
                drivers.map((driver) => (
                  <div key={driver.id} className="group flex items-center gap-4 p-5 rounded-[32px] bg-muted/20 border border-transparent hover:border-border hover:bg-white transition-all">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                      driver.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 
                      driver.status === 'busy' ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {driver.status === 'available' ? '🛵' : '📦'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-bold text-foreground">{driver.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 font-sub text-[10px] font-bold text-muted-foreground">
                          <Phone size={10} /> {driver.phone}
                        </span>
                        <span className={`flex items-center gap-1 font-sub text-[10px] font-black uppercase tracking-widest ${
                          driver.status === 'available' ? 'text-emerald-500' : 'text-orange-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${driver.status === 'available' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                          {driver.status === 'available' ? 'Libre' : 'En livraison'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(driver.id, driver.status)}
                        className="p-3 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground transition-colors"
                        title="Changer le statut"
                      >
                        <Clock size={16} />
                      </button>
                      <button 
                        onClick={() => removeDriver(driver.id)}
                        className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

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

          <div className="p-8 rounded-[40px] bg-black text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h4 className="font-heading font-black text-lg uppercase tracking-tight mb-2">Auto-Assign</h4>
              <p className="text-xs text-white/50 leading-relaxed italic mb-6">
                Activez l'assignation automatique pour envoyer instantanément les commandes au livreur le plus proche.
              </p>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest">Activer</span>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
