import { useState, useEffect } from "react";
import { Settings, Globe, Shield, Palette, Database, Smartphone, Save, Loader2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/lib/firebase";
import { ref, get, update } from "firebase/database";
import { toast } from "sonner";

const tabs = [
  { icon: <Globe size={16} />, label: "Général" },
  { icon: <Palette size={16} />, label: "Apparence" },
  { icon: <Shield size={16} />, label: "Sécurité" },
  { icon: <Database size={16} />, label: "Données" },
  { icon: <Smartphone size={16} />, label: "Notifications" },
];

interface PlatformSettings {
  platformName: string;
  supportPhone: string;
  country: string;
  currency: string;
  theme: { primaryColor: string; darkMode: boolean; animations: boolean };
  security: { lockoutEnabled: boolean; sessionTimeout: boolean };
  notifications: { newVendor: boolean; newClient: boolean; validationRequired: boolean; dailyReport: boolean; securityAlerts: boolean };
}

const defaultSettings: PlatformSettings = {
  platformName: "Oresto Connect",
  supportPhone: "+22946305190",
  country: "Bénin",
  currency: "FCFA",
  theme: { primaryColor: "hsl(25,100%,50%)", darkMode: false, animations: true },
  security: { lockoutEnabled: true, sessionTimeout: true },
  notifications: { newVendor: true, newClient: true, validationRequired: true, dailyReport: false, securityAlerts: true },
};

export default function AdminSettings() {
  const { adminEmail } = useAdmin();
  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);

  // Load settings from Firebase on mount
  useEffect(() => {
    if (!db) { setIsLoading(false); return; }
    const settingsRef = ref(db, "platform_settings");
    get(settingsRef).then(snap => {
      if (snap.exists()) {
        const data = snap.val();
        setSettings({
          platformName: data.platformName || defaultSettings.platformName,
          supportPhone: data.supportPhone || defaultSettings.supportPhone,
          country: data.country || defaultSettings.country,
          currency: data.currency || defaultSettings.currency,
          theme: { ...defaultSettings.theme, ...data.theme },
          security: { ...defaultSettings.security, ...data.security },
          notifications: { ...defaultSettings.notifications, ...data.notifications },
        });
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!db) { toast.error("Base de données non disponible"); return; }
    setIsSaving(true);
    try {
      await update(ref(db, "platform_settings"), settings);
      setSaved(true);
      toast.success("Paramètres sauvegardés !");
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
    }
    setIsSaving(false);
  };

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Paramètres de la plateforme</h1>
        <p className="font-sub text-sm text-muted-foreground">Configurez Oresto Connect selon vos préférences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sub whitespace-nowrap transition-all ${
              activeTab === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Général */}
      {activeTab === 0 && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Informations de la plateforme</h3>
            {[
              { label: "Nom de la plateforme", key: "platformName", value: settings.platformName, type: "text" },
              { label: "Email admin", value: adminEmail || "", type: "email", disabled: true },
              { label: "Numéro WhatsApp support", key: "supportPhone", value: settings.supportPhone, type: "tel" },
              { label: "Pays principal", key: "country", value: settings.country, type: "text" },
              { label: "Devise", key: "currency", value: settings.currency, type: "text" },
            ].map((field, i) => (
              <div key={i}>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">{field.label}</label>
                <input defaultValue={field.value} type={field.type}
                  disabled={(field as any).disabled}
                  onChange={field.key ? (e) => updateSettings(field.key!, e.target.value) : undefined}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50" />
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={isSaving}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? "✅" : <Save size={16} />}
            {isSaving ? "Sauvegarde..." : saved ? "Enregistré !" : "Sauvegarder"}
          </button>
        </div>
      )}

      {/* Tab: Apparence */}
      {activeTab === 1 && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Thème & Couleurs</h3>
            <div>
              <label className="font-sub text-sm font-medium text-foreground block mb-2">Couleur principale</label>
              <div className="flex gap-3 flex-wrap">
                {["hsl(25,100%,50%)", "#7C3AED", "#0EA5E9", "#10B981", "#EF4444"].map((color, i) => (
                  <button key={i} onClick={() => updateSettings("theme.primaryColor", color)}
                    className={`w-10 h-10 rounded-full border-2 shadow-md hover:scale-110 transition-transform ${settings.theme.primaryColor === color ? "border-black scale-110" : "border-white"}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="font-sub text-sm text-foreground">Mode sombre</span>
              <input type="checkbox" checked={settings.theme.darkMode}
                onChange={(e) => updateSettings("theme.darkMode", e.target.checked)}
                className="accent-primary w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <span className="font-sub text-sm text-foreground">Animations activées</span>
              <input type="checkbox" checked={settings.theme.animations}
                onChange={(e) => updateSettings("theme.animations", e.target.checked)}
                className="accent-primary w-5 h-5" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? "✅" : <Save size={16} />}
            {isSaving ? "Sauvegarde..." : saved ? "Enregistré !" : "Sauvegarder l'apparence"}
          </button>
        </div>
      )}

      {/* Tab: Sécurité */}
      {activeTab === 2 && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Configuration sécurité</h3>
            {[
              { label: "Mot de passe admin actuel", type: "password" },
              { label: "Nouveau mot de passe", type: "password" },
              { label: "Confirmer le nouveau mot de passe", type: "password" },
            ].map((f, i) => (
              <div key={i}>
                <label className="font-sub text-sm font-medium text-foreground block mb-1">{f.label}</label>
                <input type={f.type} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            ))}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div>
                <p className="font-sub text-sm text-foreground">Verrouillage après 5 tentatives</p>
                <p className="font-body text-xs text-muted-foreground">Durée : 15 minutes</p>
              </div>
              <input type="checkbox" checked={settings.security.lockoutEnabled}
                onChange={(e) => updateSettings("security.lockoutEnabled", e.target.checked)}
                className="accent-primary w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted">
              <div>
                <p className="font-sub text-sm text-foreground">Session expire après inactivité</p>
                <p className="font-body text-xs text-muted-foreground">Durée : 15 minutes</p>
              </div>
              <input type="checkbox" checked={settings.security.sessionTimeout}
                onChange={(e) => updateSettings("security.sessionTimeout", e.target.checked)}
                className="accent-primary w-5 h-5" />
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? "✅" : <Save size={16} />}
            {isSaving ? "Sauvegarde..." : saved ? "Enregistré !" : "Mettre à jour la sécurité"}
          </button>
        </div>
      )}

      {/* Tab: Données */}
      {activeTab === 3 && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-heading font-semibold text-foreground">Base de données Firebase</h3>
            <div className="space-y-2 text-sm font-body">
              <div className="flex justify-between p-3 rounded-xl bg-muted">
                <span className="text-foreground">Projet Firebase</span>
                <span className="text-muted-foreground font-mono text-xs">oresto-connect</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted">
                <span className="text-foreground">Base de données</span>
                <span className="text-green-600 font-sub text-xs">✅ Connectée</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted">
                <span className="text-foreground">Authentification</span>
                <span className="text-green-600 font-sub text-xs">✅ Active</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted">
                <span className="text-foreground">Analytics GA4</span>
                <span className="text-green-600 font-sub text-xs">✅ Active</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-muted">
                <span className="text-foreground">IA Claude (Anthropic)</span>
                <span className="text-green-600 font-sub text-xs">✅ Connectée</span>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-2xl border-2 border-destructive/30 space-y-3">
            <h3 className="font-heading font-semibold text-destructive">Zone dangereuse</h3>
            <button className="px-4 py-2 rounded-full border border-destructive text-destructive font-sub text-sm btn-hover">
              Exporter toutes les données
            </button>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 4 && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="font-heading font-semibold text-foreground">Préférences de notification</h3>
            {[
              { label: "Nouvelle inscription vendeur", key: "newVendor" as const },
              { label: "Nouvelle inscription client", key: "newClient" as const },
              { label: "Validation boutique requise", key: "validationRequired" as const },
              { label: "Rapport journalier", key: "dailyReport" as const },
              { label: "Alertes de sécurité", key: "securityAlerts" as const },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                <span className="font-sub text-sm text-foreground">{item.label}</span>
                <input type="checkbox" checked={settings.notifications[item.key]}
                  onChange={(e) => updateSettings(`notifications.${item.key}`, e.target.checked)}
                  className="accent-primary w-5 h-5" />
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={isSaving}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover flex items-center gap-2 disabled:opacity-50">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : saved ? "✅" : <Save size={16} />}
            {isSaving ? "Sauvegarde..." : saved ? "Enregistré !" : "Sauvegarder les préférences"}
          </button>
        </div>
      )}
    </div>
  );
}
