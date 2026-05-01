import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MapComponent from "@/components/MapComponent";

const tabs = ["🏪 Ma Boutique", "📍 Localisation", "⏰ Horaires", "🚚 Livraison", "💳 Paiements", "🎯 Offres", "🔐 Sécurité"];

export default function VendorSettings() {
  const { vendorProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [markerPos, setMarkerPos] = useState({ lat: 6.3654, lng: 2.4183 });

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPos({ lat, lng });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Paramètres</h1>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-full text-xs font-sub whitespace-nowrap ${activeTab === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="space-y-4 max-w-2xl">
          <div className="h-40 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground font-body">Photo de couverture (1200x400)</div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading text-xl font-bold">
              {vendorProfile?.name?.slice(0, 2).toUpperCase() || "VD"}
            </div>
            <button className="px-4 py-2 rounded-full border border-border text-foreground font-sub text-sm">Modifier le logo</button>
          </div>
          {[
            { label: "Nom de la boutique", value: vendorProfile?.name || "" },
            { label: "Description", value: vendorProfile?.description || "" },
            { label: "Catégorie", value: vendorProfile?.category || "" },
            { label: "Téléphone", value: vendorProfile?.phone || "" },
            { label: "WhatsApp", value: vendorProfile?.whatsapp || "" },
          ].map((field, i) => (
            <div key={i}>
              <label className="font-sub text-sm font-medium text-foreground block mb-1">{field.label}</label>
              <input defaultValue={field.value} className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
            </div>
          ))}
          <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">Sauvegarder les infos</button>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-4 max-w-2xl">
          {["Pays", "Ville", "Quartier", "Adresse complète"].map((label, i) => (
            <div key={i}>
              <label className="font-sub text-sm font-medium text-foreground block mb-1">{label}</label>
              <input defaultValue={i === 0 ? vendorProfile?.country : i === 1 ? vendorProfile?.city : i === 2 ? vendorProfile?.neighborhood : ""}
                className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
            </div>
          ))}
          <div className="space-y-1">
            <label className="font-sub text-sm font-medium text-foreground block">Position sur la carte</label>
            <p className="text-xs text-muted-foreground mb-2 italic">Cliquez sur la carte pour placer votre boutique précisément</p>
            <div className="h-60 rounded-2xl overflow-hidden border border-border shadow-sm">
              <MapComponent 
                center={markerPos}
                zoom={14}
                markers={[{ ...markerPos, title: "Ma Boutique" }]}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
          <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover w-full md:w-auto">Sauvegarder la localisation</button>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-3 max-w-2xl">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
            <div key={day} className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border">
              <label className="flex items-center gap-2 min-w-[100px]">
                <input type="checkbox" defaultChecked={day !== "Dimanche"} className="accent-primary" />
                <span className="font-sub text-sm text-foreground">{day}</span>
              </label>
              <input type="time" defaultValue="08:00" className="px-3 py-1.5 rounded-xl border border-border bg-background font-body text-sm" />
              <span className="text-muted-foreground">—</span>
              <input type="time" defaultValue="22:00" className="px-3 py-1.5 rounded-xl border border-border bg-background font-body text-sm" />
            </div>
          ))}
          <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">Sauvegarder les horaires</button>
        </div>
      )}

      {activeTab >= 3 && activeTab <= 5 && (
        <div className="text-center py-16">
          <p className="font-body text-muted-foreground">Section {tabs[activeTab]} — Bientôt disponible</p>
        </div>
      )}

      {activeTab === 6 && (
        <div className="space-y-6 max-w-2xl">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Changer le mot de passe</h3>
            {["Mot de passe actuel", "Nouveau mot de passe", "Confirmer"].map((label, i) => (
              <div key={i}>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">{label}</label>
                <input type="password" className="w-full px-4 py-3 rounded-2xl border border-border bg-background font-body focus:ring-2 focus:ring-primary outline-none" />
              </div>
            ))}
            <button className="px-6 py-3 rounded-full bg-foreground text-background font-sub font-semibold btn-hover">Mettre à jour</button>
          </div>
          <div className="p-4 rounded-2xl border-2 border-destructive/30">
            <h3 className="font-heading font-semibold text-destructive mb-3">Zone dangereuse</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 rounded-full border border-destructive text-destructive font-sub text-sm btn-hover">Désactiver ma boutique</button>
              <button className="block px-4 py-2 rounded-full bg-destructive text-destructive-foreground font-sub text-sm btn-hover">Supprimer mon compte</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
