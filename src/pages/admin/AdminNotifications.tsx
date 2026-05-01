import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { Bell, Send, Users, Store, AlertTriangle, CheckCircle } from "lucide-react";

interface Notification {
  id?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  target: "all" | "vendors" | "clients";
  createdAt: string;
  read: boolean;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info" as "info" | "warning" | "success", target: "all" as "all" | "vendors" | "clients" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!db) { setIsLoading(false); return; }
    const notifsRef = ref(db, "notifications");
    const unsub = onValue(notifsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({ id, ...(val as Notification) }));
        setNotifications(list.reverse());
      } else {
        setNotifications([]);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!form.title || !form.message || !db) return;
    setIsSending(true);
    const newNotif: Notification = {
      ...form,
      createdAt: new Date().toISOString(),
      read: false,
    };
    await push(ref(db, "notifications"), newNotif);
    setForm({ title: "", message: "", type: "info", target: "all" });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setIsSending(false);
  };

  const typeIcon = (type: string) => {
    if (type === "warning") return <AlertTriangle size={16} className="text-yellow-500" />;
    if (type === "success") return <CheckCircle size={16} className="text-green-500" />;
    return <Bell size={16} className="text-primary" />;
  };

  const targetLabel = (target: string) => {
    if (target === "vendors") return "Vendeurs";
    if (target === "clients") return "Clients";
    return "Tous";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Notifications</h1>
        <p className="font-sub text-sm text-muted-foreground">Envoyez des messages à vos vendeurs et clients</p>
      </div>

      {/* Form */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4 max-w-2xl">
        <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Send size={18} /> Envoyer une notification
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-sub text-sm font-medium text-foreground block mb-1">Titre</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Maintenance prévue"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="font-sub text-sm font-medium text-foreground block mb-1">Destinataires</label>
            <select
              value={form.target}
              onChange={e => setForm(f => ({ ...f, target: e.target.value as any }))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="vendors">Vendeurs uniquement</option>
              <option value="clients">Clients uniquement</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-sub text-sm font-medium text-foreground block mb-1">Message</label>
          <textarea
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Rédigez votre message ici..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div>
            <label className="font-sub text-sm font-medium text-foreground block mb-1">Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
              className="px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="info">ℹ️ Information</option>
              <option value="warning">⚠️ Avertissement</option>
              <option value="success">✅ Succès</option>
            </select>
          </div>

          <button
            onClick={handleSend}
            disabled={isSending || !form.title || !form.message}
            className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-sub font-semibold text-sm btn-hover disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={16} />
            {isSending ? "Envoi..." : "Envoyer"}
          </button>

          {success && (
            <p className="mt-6 text-green-600 font-sub text-sm font-medium">✅ Notification envoyée !</p>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-foreground">Historique ({notifications.length})</h3>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground font-body text-sm">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-card border border-border">
            <Bell size={40} className="mx-auto mb-4 text-muted-foreground" />
            <p className="font-heading text-lg font-semibold text-foreground">Aucune notification envoyée</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border flex items-start gap-3">
              <div className="mt-0.5">{typeIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-sub font-semibold text-foreground text-sm">{n.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-sub bg-muted text-muted-foreground">
                      {targetLabel(n.target)}
                    </span>
                    <span className="text-[10px] font-body text-muted-foreground">
                      {new Date(n.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground mt-1">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
