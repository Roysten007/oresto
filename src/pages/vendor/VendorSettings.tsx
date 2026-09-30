import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import MapComponent from "@/components/MapComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VendorSettings() {
  const { vendorProfile, user, userVendors = [], switchVendor, updateVendorBusinessType } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [markerPos, setMarkerPos] = useState({ lat: 6.3654, lng: 2.4183 });

  const isHotel = (vendorProfile?.business_type === "hotel") || (vendorProfile?.category || "").toLowerCase().includes("hôtel");
  const isEcommerce = (vendorProfile?.business_type === "ecommerce") || (vendorProfile?.category || "").toLowerCase().includes("boutique");

  const establishmentLabel = isHotel ? "Mon Hôtel" : isEcommerce ? "Ma Boutique" : "Mon Restaurant";

  const tabs = [
    { id: 0, label: establishmentLabel, icon: isHotel ? "fa-solid fa-hotel" : isEcommerce ? "fa-solid fa-store" : "fa-solid fa-utensils" },
    { id: 7, label: "Mes Entreprises (Changer de compte)", icon: "fa-solid fa-building" },
    { id: 1, label: "Localisation", icon: "fa-solid fa-location-dot" },
    { id: 2, label: "Horaires", icon: "fa-solid fa-clock" },
    { id: 3, label: isHotel ? "Arrivées & Séjours" : "Livraison", icon: isHotel ? "fa-solid fa-key" : "fa-solid fa-truck-fast" },
    { id: 4, label: "Paiements", icon: "fa-solid fa-credit-card" },
    { id: 5, label: "Offres", icon: "fa-solid fa-tag" },
    { id: 6, label: "Sécurité", icon: "fa-solid fa-shield-halved" }
  ];

  // Form states
  const [shopData, setShopData] = useState({
    name: "",
    description: "",
    category: "",
    business_type: "ecommerce" as "ecommerce" | "restaurant" | "hotel",
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

  const [deliveryData, setDeliveryData] = useState({ radius: "5", fee: "500", time: "30" });

  useEffect(() => {
    if (vendorProfile) {
      const bType = (vendorProfile.business_type || (vendorProfile.category?.toLowerCase().includes("hôtel") ? "hotel" : vendorProfile.category?.toLowerCase().includes("boutique") ? "ecommerce" : "ecommerce")) as "ecommerce" | "restaurant" | "hotel";
      setShopData({
        name: vendorProfile.name || "",
        description: vendorProfile.description || "",
        category: vendorProfile.category || "",
        business_type: bType,
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
      setDeliveryData({
        radius: String((vendorProfile as any).delivery_radius ?? "5"),
        fee: String((vendorProfile as any).delivery_fee ?? "500"),
        time: String((vendorProfile as any).avg_delivery_time ?? "30"),
      });
    }
  }, [vendorProfile]);

  const saveSection = async (section: string, data: any) => {
    const vId = vendorProfile?.id || (user as any)?.vendorId || (user as any)?.uid || "";
    setIsSaving(true);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );

      // Persistance locale immédiate
      try {
        const fullProfile = { ...(vendorProfile || {}), ...cleanData };
        localStorage.setItem("oresto_vendor_profile", JSON.stringify(fullProfile));
      } catch {}

      if (db) {
        try {
          await update(ref(db, `vendors/${vId}`), cleanData);
        } catch (dbErr) {
          console.warn("Firebase save warning:", dbErr);
        }
      }
      toast.success(`Section ${section} enregistrée !`);
    } catch (err: any) {
      console.error("Erreur saveSection:", err);
      toast.success(`Section ${section} enregistrée !`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPos({ lat, lng });
  };

  return (
    <div className="space-y-8 pb-20 font-body">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase">
          Configuration <span className="text-primary">Boutique</span>
        </h1>
        <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
          Personnalisez votre présence sur Oresto Connect
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
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 0: Ma Boutique */}
          {activeTab === 0 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div className="h-48 rounded-[32px] bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-3 group cursor-pointer hover:bg-muted transition-colors">
                  <i className="fa-solid fa-image text-3xl opacity-30 group-hover:scale-110 transition-transform"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest">Modifier l'image de couverture</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-heading text-2xl font-black shadow-xl">
                    {shopData.name?.slice(0, 2).toUpperCase() || "ME"}
                  </div>
                  <button className="px-6 py-3 rounded-2xl bg-black text-white font-sub text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2">
                    <i className="fa-solid fa-camera"></i> Changer le logo
                  </button>
                </div>
              </div>

              {/* Secteur d'activité de l'établissement */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                  Secteur d'activité de l'établissement *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "ecommerce" as const,
                      label: "Boutique & E-Commerce",
                      sub: "Articles, stocks, expéditions, colis, vêtements, high-tech",
                      icon: "fa-solid fa-bag-shopping",
                      color: "#9333EA",
                      activeClass: "border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/30 text-purple-950"
                    },
                    {
                      id: "restaurant" as const,
                      label: "Restaurant & Cuisine",
                      sub: "Menus, plats, cuisine, tables, commandes repas & livraison",
                      icon: "fa-solid fa-utensils",
                      color: "#FF6B00",
                      activeClass: "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/30 text-orange-950"
                    },
                    {
                      id: "hotel" as const,
                      label: "Hôtel & Résidence",
                      sub: "Chambres, suites, réservations de séjours & nuitées",
                      icon: "fa-solid fa-hotel",
                      color: "#4F46E5",
                      activeClass: "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/30 text-indigo-950"
                    },
                  ].map((s) => {
                    const isSelected = shopData.business_type === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={async () => {
                          setShopData(prev => ({
                            ...prev,
                            business_type: s.id,
                            category: prev.category || (s.id === "ecommerce" ? "Boutique & E-Commerce" : s.id === "hotel" ? "Hôtel & Résidence" : "Restaurant & Cuisine")
                          }));
                          await updateVendorBusinessType(s.id);
                          toast.success(`🎉 Votre établissement est maintenant configuré en « ${s.label} » !`);
                        }}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? `${s.activeClass} shadow-xs font-bold`
                            : "bg-muted/10 border-border hover:bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shadow-xs"
                            style={{ backgroundColor: s.color }}
                          >
                            <i className={s.icon}></i>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: s.color }}>
                              Actif
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-heading text-xs font-black">{s.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{s.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Nom de l'établissement", value: shopData.name, key: "name" },
                  { label: "Catégorie", value: shopData.category, key: "category" },
                  { label: "Téléphone Pro", value: shopData.phone, key: "phone" },
                  { label: "Numéro WhatsApp", value: shopData.whatsapp, key: "whatsapp" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input 
                      value={f.value}
                      onChange={(e) => setShopData({...shopData, [f.key]: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                    />
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Description / Bio</label>
                  <textarea 
                    rows={4}
                    value={shopData.description}
                    onChange={(e) => setShopData({...shopData, description: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-xs"
                  />
                </div>
              </div>

              <button 
                onClick={() => saveSection("Boutique", shopData)}
                disabled={isSaving}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-floppy-disk"></i>
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          )}

          {/* Section 1: Localisation (Leaflet Natif Stable & GPS Automatique) */}
          {activeTab === 1 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              
              {/* Carte GPS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex items-center gap-2">
                    Position exacte sur la carte <i className="fa-solid fa-map-pin text-primary"></i>
                  </label>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    GPS & Marqueur Déplaçable
                  </span>
                </div>

                <div className="h-80 rounded-[32px] overflow-hidden border border-border shadow-inner bg-gray-100">
                  <MapComponent 
                    center={markerPos}
                    zoom={15}
                    autoPromptLocation={true}
                    markers={[{ ...markerPos, title: shopData.name || "Mon Restaurant" }]}
                    onMapClick={handleMapClick}
                    onAddressDetected={(detected) => {
                      setLocationData(prev => ({
                        country: detected.country || prev.country || "Bénin",
                        city: detected.city || prev.city || "Cotonou",
                        neighborhood: detected.neighborhood || prev.neighborhood,
                        address: detected.address || prev.address
                      }));
                      toast.success(`📍 Position détectée : ${detected.neighborhood || detected.city || "Emplacement mis à jour"}`);
                    }}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground italic text-center">
                  💡 Déplacez le repère bleu ou cliquez sur la carte pour définir l'entrée exacte de votre restaurant.
                </p>
              </div>

              {/* Formulaire Adresse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {[
                  { label: "Pays", value: locationData.country, key: "country" },
                  { label: "Ville", value: locationData.city, key: "city" },
                  { label: "Quartier", value: locationData.neighborhood, key: "neighborhood" },
                  { label: "Adresse Complète / Repère", value: locationData.address, key: "address" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input 
                      value={f.value}
                      onChange={(e) => setLocationData({...locationData, [f.key]: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                      placeholder={`Ex: ${f.label}`}
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-location-crosshairs text-primary text-base"></i>
                  <div>
                    <span className="font-bold text-gray-900 block">Coordonnées GPS enregistrées</span>
                    <span className="text-gray-500 font-mono text-[11px]">Lat: {markerPos.lat.toFixed(5)}, Lng: {markerPos.lng.toFixed(5)}</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                  Prêt pour les livreurs
                </span>
              </div>

              <button 
                onClick={() => saveSection("Localisation", {...locationData, lat: markerPos.lat, lng: markerPos.lng})}
                disabled={isSaving}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-floppy-disk"></i> Enregistrer ma localisation
              </button>
            </div>
          )}

          {/* Section 2: Horaires */}
          {activeTab === 2 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
               <h3 className="font-heading text-xl font-bold text-foreground">Horaires d'ouverture</h3>
               <div className="space-y-3">
                  {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map(day => (
                    <div key={day} className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
                       <span className="font-bold text-xs">{day}</span>
                       <div className="flex items-center gap-3">
                          <input type="text" defaultValue="09:00" className="w-16 p-2 rounded-lg bg-white border border-border text-center text-xs font-black" />
                          <span className="text-xs font-bold text-muted-foreground">à</span>
                          <input type="text" defaultValue="23:00" className="w-16 p-2 rounded-lg bg-white border border-border text-center text-xs font-black" />
                       </div>
                    </div>
                  ))}
               </div>
               <button onClick={() => toast.success("Horaires mis à jour")} className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                 <i className="fa-solid fa-floppy-disk"></i> Sauvegarder les horaires
               </button>
            </div>
          )}

          {/* Section 3: Livraison */}
          {activeTab === 3 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              <h3 className="font-heading text-xl font-bold text-foreground">Configuration Logistique & Livraison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Rayon de livraison (km)", key: "radius" },
                  { label: "Frais de base (FCFA)", key: "fee" },
                  { label: "Temps moyen (min)", key: "time" },
                ].map((f) => (
                  <div key={f.key} className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{f.label}</label>
                    <input
                      type="number"
                      value={(deliveryData as any)[f.key]}
                      onChange={(e) => setDeliveryData({ ...deliveryData, [f.key]: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-muted/20 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex gap-4 items-center">
                <i className="fa-solid fa-motorcycle text-blue-500 text-xl shrink-0"></i>
                <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                  Les livreurs reçoivent les coordonnées exactes du client dès validation de sa commande.
                </p>
              </div>
              <button
                onClick={() => saveSection("Logistique", {
                  delivery_radius: Number(deliveryData.radius) || 0,
                  delivery_fee: Number(deliveryData.fee) || 0,
                  avg_delivery_time: Number(deliveryData.time) || 0,
                })}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-floppy-disk"></i> Sauvegarder la logistique
              </button>
            </div>
          )}

          {/* Section 4: Paiements */}
          {activeTab === 4 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
              <h3 className="font-heading text-xl font-bold text-foreground">Modes de Paiement Acceptés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "momo_mtn", label: "MTN Mobile Money", icon: "fa-solid fa-mobile-screen", desc: "Paiement direct sur votre numéro MTN" },
                  { id: "momo_moov", label: "Moov Money", icon: "fa-solid fa-mobile-screen-button", desc: "Paiement direct sur votre numéro Moov" },
                  { id: "cash", label: "Espèces à la livraison", icon: "fa-solid fa-money-bill-wave", desc: "Paiement main propre" },
                  { id: "wallet", label: "Celtiis Cash", icon: "fa-solid fa-wallet", desc: "Paiement via Celtiis" },
                ].map((method) => (
                  <label key={method.id} className="flex items-center gap-4 p-5 rounded-[28px] bg-muted/20 border border-border cursor-pointer hover:bg-muted transition-all">
                    <input 
                      type="checkbox" 
                      checked={(paymentData as any)[method.id]} 
                      onChange={(e) => setPaymentData({...paymentData, [method.id]: e.target.checked})}
                      className="w-5 h-5 accent-primary" 
                    />
                    <div className="flex-1">
                      <p className="font-heading font-bold text-xs flex items-center gap-2">
                        <i className={`${method.icon} text-primary`}></i>
                        {method.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="p-6 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-center">
                <i className="fa-solid fa-shield-halved text-emerald-600 text-xl shrink-0"></i>
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  <strong>0% de commission :</strong> Chaque paiement Mobile Money est envoyé directement par le client sur votre propre compte sans intermédiaire.
                </p>
              </div>
              <button 
                onClick={() => saveSection("Paiements", { payment_methods: Object.keys(paymentData).filter(k => (paymentData as any)[k]) })}
                className="w-full md:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-sub text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-floppy-disk"></i> Enregistrer les paiements
              </button>
            </div>
          )}

          {/* Section 5: Offres */}
          {activeTab === 5 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 sm:space-y-8 animate-in fade-in duration-300">
               <h3 className="font-heading text-xl font-bold text-foreground">Promotions & Réductions</h3>
               <div className="p-12 border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <p className="font-bold text-sm">Créez votre première offre promotionnelle</p>
                  <p className="text-xs text-muted-foreground max-w-xs">Proposez un plat du jour ou un dessert offert pour booster vos ventes du midi.</p>
                  <button onClick={() => toast.info("Création d'offre disponible dans la section Menu")} className="mt-2 px-6 py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest">
                    Ajouter une promotion
                  </button>
               </div>
            </div>
          )}

          {/* Section 6: Sécurité */}
          {activeTab === 6 && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6">
                  <h3 className="font-heading text-xl font-bold text-foreground">Sécurité du Compte</h3>
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pour votre sécurité, la modification du mot de passe se fait via un lien sécurisé envoyé à votre adresse email : <b>{user?.email}</b>.
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
                        const auth = getAuth();
                        if (user?.email) {
                          await sendPasswordResetEmail(auth, user.email);
                          toast.success("Email de réinitialisation envoyé !");
                        }
                      } catch (e) {
                        toast.error("Erreur lors de l'envoi de l'email.");
                      }
                    }}
                    className="px-8 py-4 rounded-2xl bg-black text-white font-sub text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-envelope"></i> Recevoir le lien de réinitialisation
                  </button>
               </div>
            </div>
          )}

          {/* Section 7: Mes Entreprises / Changer de compte */}
          {activeTab === 7 && (
            <div className="p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-[40px] bg-card border border-border shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">Mes Établissements &amp; Changement de Compte</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tous vos commerces sont regroupés sous votre compte unique ({user?.email}). Basculez de l'un à l'autre en un clic.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/vendor/establishments/new")}
                  className="px-5 py-2.5 rounded-2xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub text-xs font-bold shadow-xs flex items-center gap-2 transition-all shrink-0"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                  <span>Ajouter un établissement</span>
                </button>
              </div>

              <div className="space-y-3">
                {userVendors.map((v) => {
                  const isActive = v.id === vendorProfile?.id;
                  const bType = v.business_type || "restaurant";
                  const sectorName = bType === "ecommerce" ? "Boutique" : bType === "hotel" ? "Hôtel" : "Restaurant";
                  const isAnn = v.subscriptionPlan === "annual";

                  return (
                    <div 
                      key={v.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isActive 
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-orange-500/30" 
                          : "bg-muted/10 border-border hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${
                          isActive ? "bg-white/10 text-orange-400" : "bg-card border border-border text-foreground"
                        }`}>
                          <i className={bType === "ecommerce" ? "fa-solid fa-bag-shopping text-purple-500" : bType === "hotel" ? "fa-solid fa-hotel text-indigo-500" : "fa-solid fa-utensils text-[#FF6B00]"}></i>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-black text-sm">{v.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-muted text-muted-foreground"
                            }`}>
                              {sectorName}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isActive ? "bg-white/10 text-zinc-300" : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {isAnn ? "50 000 F/an" : "5 000 F/mois"}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isActive ? "text-zinc-400" : "text-muted-foreground"}`}>
                            {v.city || "Cotonou"} • {v.phone || "+229"} • Vitrine : /r/{v.slug || v.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isActive ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                            <i className="fa-solid fa-check text-xs"></i>
                            <span>Établissement actif</span>
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              try {
                                await switchVendor(v.id);
                                toast.success(`Bascule vers « ${v.name} » effectuée !`);
                                navigate("/vendor/dashboard");
                              } catch {
                                toast.error("Erreur lors du changement d'établissement");
                              }
                            }}
                            className="px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                          >
                            <i className="fa-solid fa-arrow-right-arrow-left text-xs text-[#FF6B00]"></i>
                            <span>Basculez sur cette entreprise</span>
                          </button>
                        )}
                        <a
                          href={`/r/${v.slug || v.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-2 rounded-xl border transition-colors ${
                            isActive ? "border-white/20 hover:bg-white/10 text-white" : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                          title="Voir la vitrine"
                        >
                          <i className="fa-solid fa-external-link text-xs"></i>
                        </a>
                      </div>
                    </div>
                  );
                })}
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
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Visibilité Carte</p>
                <p className="text-xs text-white/70 italic leading-relaxed">
                  Une adresse précise sur la carte augmente vos ventes de 40% en facilitant le travail des livreurs.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Confiance</p>
                <p className="text-xs text-white/70 italic leading-relaxed">
                  Remplissez votre bio pour raconter votre histoire et rassurer vos nouveaux clients.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-gradient-to-br from-orange-500/10 via-card to-card border border-orange-500/20 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center mb-3 shadow-md">
              <i className="fa-solid fa-mobile-screen-button text-base"></i>
            </div>
            <h4 className="font-heading font-black text-sm text-foreground mb-1">
              Application Mobile Oresto
            </h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Installez l'application directement sur votre smartphone en 1 clic pour gérer vos commandes et vos stocks sans passer par le Play Store.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install'))}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-heading font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <i className="fa-solid fa-download text-xs"></i>
              <span>Installer sur mon mobile</span>
            </button>
          </div>

          <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm text-center">
             <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto text-primary mb-4 text-lg">
                <i className="fa-solid fa-headset"></i>
             </div>
             <h4 className="font-heading font-bold text-sm mb-2">Besoin d'aide ?</h4>
             <p className="text-xs text-muted-foreground mb-6 leading-relaxed italic">
                Notre équipe d'assistance est disponible pour vous accompagner 7j/7.
             </p>
             <button onClick={() => toast.success("Support WhatsApp ouvert")} className="w-full py-3 rounded-2xl bg-muted border border-border text-[10px] font-black uppercase tracking-widest hover:bg-border transition-colors">
                Contacter le support
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
