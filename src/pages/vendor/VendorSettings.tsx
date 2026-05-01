import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, get, set, update } from "firebase/database";
import MapComponent from "@/components/MapComponent";
import { 
  Store, 
  MapPin, 
  Clock, 
  Truck, 
  CreditCard, 
  Tag, 
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

const tabs = [
  { id: 0, label: "Ma Boutique", icon: Store },
  { id: 1, label: "Localisation", icon: MapPin },
  { id: 2, label: "Horaires", icon: Clock },
  { id: 3, label: "Livraison", icon: Truck },
  { id: 4, label: "Paiements", icon: CreditCard },
  { id: 5, label: "Offres", icon: Tag },
  { id: 6, label: "Sécurité", icon: ShieldCheck }
];

export default function VendorSettings() {
  const { vendorProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [markerPos, setMarkerPos] = useState({ lat: 6.3654, lng: 2.4183 });

  // Form states
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    category: "",
    phone: "",
    whatsapp: ""
  });

  const [locationData, setLocationData] = useState({
    country: "Bénin",
    city: "Cotonou",
    neighborhood: "",
    address: ""
  });

  const [paymentData, setPaymentData] = useState({
    momo_mtn: true,
    momo_moov: true,
    cash: true,
    wallet: true
  });

  useEffect(() => {
    if (vendorProfile) {
      setShopData({
        name: vendorProfile.name || "",
        description: vendorProfile.description || "",
        category: vendorProfile.category || "",
        phone: vendorProfile.phone || "",
        whatsapp: vendorProfile.whatsapp || ""
      });
      setLocationData({
        country: vendorProfile.country || "Bénin",
        city: vendorProfile.city || "Cotonou",
        neighborhood: vendorProfile.neighborhood || "",
        address: vendorProfile.address || ""
      });
      if (vendorProfile.payment_methods) {
        setPaymentData({
          momo_mtn: vendorProfile.payment_methods.includes("momo_mtn"),
          momo_moov: vendorProfile.payment_methods.includes("momo_moov"),
          cash: vendorProfile.payment_methods.includes("cash"),
          wallet: vendorProfile.payment_methods.includes("wallet")
        });
      }
    }
  }, [vendorProfile]);

  const saveSection = async (section: string, data: any) => {
    if (!vendorProfile?.id) return;
    setIsSaving(true);
    try {
      await update(ref(db, `vendors/${vendorProfile.id}`), data);
      toast.success(`Section ${section} enregistrée !`);
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPos({ lat, lng });
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
          Configuration <span className="text-primary">Boutique</span>
        </h1>
        <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
          Personnalisez votre présence sur Oresto
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              activeTab === tab.id ? "bg-black text-white border-black shadow-lg" : "bg-card text-muted-foreground border-border hover:border-muted-foreground"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 0: Ma Boutique */}
          {activeTab === 0 && (
            <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm space-y-8 animate-in fade-in duration-500">
              <div className="space-y-4">
                <div className="h-48 rounded-[32px] bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-3 group cursor-pointer hover:bg-muted transition-colors">
                  <Store size={32} className="opacity-20 group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Modifier l'image de couverture</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-heading text-2xl font-black shadow-xl">
                    {shopData.name?.slice(0, 2).toUpperCase() || "VD"}
                  </div>
                  <button className="px-6 py-3 rounded-2xl bg-black text-white font-sub text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                    Changer le logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nom de la boutique", value: shopData.name, key: "name" },
                  { label: "Catégorie", value: shopData.category, key: "category" },
                  { label: "Téléphone Pro", value: shopData.phone, key: "phone" },
                  { label: "Numéro WhatsApp", value: shopData.whatsapp, key: "whatsapp" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input 
                      value={f.value}
                      onChange={(e) => setShopData({...shopData, [f.key]: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description / Bio</label>
                  <textarea 
                    rows={4}
                    value={shopData.description}
                    onChange={(e) => setShopData({...shopData, description: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={() => saveSection("Boutique", shopData)}
                disabled={isSaving}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                {isSaving ? "Enregistrement..." : <><Save size={18} /> Enregistrer les modifications</>}
              </button>
            </div>
          )}

          {/* Section 1: Localisation */}
          {activeTab === 1 && (
            <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Pays", value: locationData.country, key: "country" },
                  { label: "Ville", value: locationData.city, key: "city" },
                  { label: "Quartier", value: locationData.neighborhood, key: "neighborhood" },
                  { label: "Adresse Complète", value: locationData.address, key: "address" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input 
                      value={f.value}
                      onChange={(e) => setLocationData({...locationData, [f.key]: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                  Position sur la carte <AlertTriangle size={12} className="text-orange-500" />
                </label>
                <div className="h-72 rounded-[32px] overflow-hidden border border-border shadow-inner">
                  <MapComponent 
                    center={markerPos}
                    zoom={14}
                    markers={[{ ...markerPos, title: "Position Boutique" }]}
                    onMapClick={handleMapClick}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic text-center">Cliquez sur la carte pour définir vos coordonnées GPS exactes</p>
              </div>
              <button 
                onClick={() => saveSection("Localisation", {...locationData, lat: markerPos.lat, lng: markerPos.lng})}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-black text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
              >
                Confirmer la position
              </button>
            </div>
          )}

          {/* Section 3: Livraison */}
          {activeTab === 3 && (
            <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm space-y-8 animate-in fade-in duration-500">
              <h3 className="font-heading text-xl font-bold text-foreground">Configuration Logistique</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Rayon de livraison (km)", value: "5.0", key: "deliveryRadius" },
                  { label: "Frais de base (FCFA)", value: "500", key: "baseDeliveryFee" },
                  { label: "Temps moyen (min)", value: "30", key: "avgDeliveryTime" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input 
                      defaultValue={f.value}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex gap-4">
                <Truck className="text-blue-500 shrink-0" size={24} />
                <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                  Configurez vos livreurs dans la section dédiée pour activer l'assignation intelligente.
                </p>
              </div>
              <button 
                onClick={() => saveSection("Logistique", { delivery_config: { radius: 5, fee: 500 } })}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl"
              >
                Sauvegarder la logistique
              </button>
            </div>
          )}

          {/* Section 4: Paiements */}
          {activeTab === 4 && (
            <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm space-y-8 animate-in fade-in duration-500">
              <h3 className="font-heading text-xl font-bold text-foreground">Modes de Paiement Acceptés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "momo_mtn", label: "MTN Mobile Money", icon: "📱", desc: "Paiement direct via MTN" },
                  { id: "momo_moov", label: "Moov Money", icon: "📲", desc: "Paiement direct via Moov" },
                  { id: "cash", label: "Paiement Cash", icon: "💵", desc: "À la livraison / au retrait" },
                  { id: "wallet", label: "Oresto Wallet", icon: "💰", desc: "Utiliser le solde client" },
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-4 p-6 rounded-[32px] bg-muted/20 border border-border cursor-pointer hover:bg-muted transition-all">
                    <input 
                      type="checkbox" 
                      checked={(paymentData as any)[method.id]} 
                      onChange={(e) => setPaymentData({...paymentData, [method.id]: e.target.checked})}
                      className="w-5 h-5 accent-primary" 
                    />
                    <div className="flex-1">
                      <p className="font-heading font-bold text-sm">{method.label} {method.icon}</p>
                      <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-6 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex gap-4">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed italic">
                  Toutes les transactions sont sécurisées. Les fonds Mobile Money sont transférés sur votre compte professionnel chaque semaine.
                </p>
              </div>
              <button 
                onClick={() => saveSection("Paiements", { payment_methods: Object.keys(paymentData).filter(k => (paymentData as any)[k]) })}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl"
              >
                Enregistrer les paiements
              </button>
            </div>
          )}

          {activeTab === 2 || activeTab === 5 ? (
             <div className="p-20 rounded-[40px] bg-card border border-border text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground opacity-30">
                  <Clock size={32} />
                </div>
                <h3 className="font-heading font-bold text-foreground">Section en cours d'optimisation</h3>
                <p className="font-sub text-sm text-muted-foreground italic max-w-xs mx-auto">
                  Nous finalisons les paramètres de {tabs.find(t => t.id === activeTab)?.label} pour une expérience optimale.
                </p>
             </div>
          ) : activeTab === 6 && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm space-y-6">
                  <h3 className="font-heading text-xl font-bold text-foreground">Sécurité du Compte</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Mot de passe actuel</label>
                      <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nouveau</label>
                        <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Confirmer</label>
                        <input type="password" placeholder="••••••••" className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none" />
                      </div>
                    </div>
                  </div>
                  <button className="px-8 py-4 rounded-2xl bg-black text-white font-sub text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                    Mettre à jour le mot de passe
                  </button>
               </div>
               
               <div className="p-8 rounded-[40px] border-2 border-red-500/20 bg-red-500/5 space-y-4">
                  <h3 className="font-heading font-bold text-red-500">Zone de Danger</h3>
                  <p className="text-xs text-red-600/70 italic">La désactivation de la boutique rendra vos produits invisibles aux clients.</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button className="px-6 py-3 rounded-xl border border-red-500 text-red-500 font-sub text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Désactiver la boutique</button>
                    <button className="px-6 py-3 rounded-xl bg-red-500 text-white font-sub text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">Supprimer définitivement</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <div className="p-8 rounded-[40px] bg-black text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h4 className="font-heading font-black text-lg uppercase tracking-tight mb-4 relative z-10">Guide Pro</h4>
            <div className="space-y-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Visibilité</p>
                <p className="text-xs text-white/70 italic leading-relaxed">
                  Une adresse précise sur la carte augmente vos ventes de 40% en facilitant le travail des livreurs.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Confiance</p>
                <p className="text-xs text-white/70 italic leading-relaxed">
                  Remplissez votre bio pour raconter l'histoire de votre boutique et rassurer vos nouveaux clients.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm text-center">
             <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto text-orange-500 mb-4">
                <AlertTriangle size={24} />
             </div>
             <h4 className="font-heading font-bold text-sm mb-2">Besoin d'aide ?</h4>
             <p className="text-xs text-muted-foreground mb-6 leading-relaxed italic">
                Notre équipe support est disponible pour vous aider à configurer votre boutique.
             </p>
             <button className="w-full py-3 rounded-2xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest hover:bg-border transition-colors">
                Contacter le support
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
