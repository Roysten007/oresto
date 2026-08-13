import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Order } from "@/data/mockData";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Clock,
  Bell,
  Calendar,
  DollarSign,
  Activity,
  ExternalLink,
  Crown,
  ShieldAlert,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Zap,
  Lock
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";
import {
  runSubscriptionBillingCheck,
  confirmVendorSubscriptionPayment,
  updateVendorSubscriptionPlan,
  MAKETOU_SIMULATION_MODE
} from "@/services/subscriptionService";

export default function VendorDashboard() {
  const { vendorProfile, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const vendorId = vendorProfile?.id || user?.vendorId;

  useEffect(() => {
    if (!db || !vendorId) {
      setIsLoading(false);
      return;
    }
    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val } as Order))
          .filter(o => o.vendorId === vendorId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(list);
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });
    return () => unsub();
  }, [vendorId]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Exécuter la vérification du cycle de facturation au chargement
  useEffect(() => {
    if (db && vendorProfile?.id) {
      runSubscriptionBillingCheck(db);
    }
  }, [vendorProfile?.id]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Stats commandes
  const validOrders = orders.filter(o => o.status !== "cancelled");
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayOrders = validOrders.filter(o => new Date(o.date) >= todayStart);
  const uniqueClients = new Set(validOrders.map(o => o.clientId)).size;

  const weeklyData = [];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const dayRevenue = validOrders
      .filter(o => {
        const od = new Date(o.date);
        return od >= d && od < nextD;
      })
      .reduce((s, o) => s + (o.total || 0), 0);

    weeklyData.push({
      name: dayNames[d.getDay()],
      revenue: dayRevenue
    });
  }

  const weeklyRevenue = weeklyData.reduce((s, d) => s + d.revenue, 0);

  const kpis = [
    {
      label: "Chiffre d'Affaires (7j)",
      value: `${weeklyRevenue.toLocaleString()} FCFA`,
      trend: "7 jours",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Commandes Live",
      value: String(todayOrders.length),
      trend: "Aujourd'hui",
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      label: "Nouveaux Clients",
      value: String(uniqueClients),
      trend: "Total",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Satisfaction",
      value: vendorProfile?.rating ? `${vendorProfile.rating}/5` : "—",
      trend: "Stable",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
  ];

  // Calculs abonnement
  const plan = vendorProfile?.subscriptionPlan || "starter";
  const subStatus = vendorProfile?.subscriptionStatus || "trial";
  const trialEndsAt = vendorProfile?.trialEndsAt || Date.now() + 30 * 24 * 60 * 60 * 1000;
  const nextBillingDate = vendorProfile?.nextBillingDate || trialEndsAt;
  const pendingInvoice = vendorProfile?.pendingInvoice;

  const daysLeftInTrial = Math.max(0, Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)));
  const daysUntilDue = Math.max(0, Math.ceil((nextBillingDate - Date.now()) / (1000 * 60 * 60 * 24)));

  const handlePayNowSimulation = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, pendingInvoice?.id);
      toast.success("🎉 Paiement simulé avec succès ! Votre abonnement est réactivé.");
      setShowPaymentModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePlan = async (newPlan: "starter" | "pro") => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await updateVendorSubscriptionPlan(db, vendorProfile.id, newPlan);
      toast.success(`Formule mise à jour vers ${newPlan === "pro" ? "Pro" : "Starter"}`);
      setShowPlanModal(false);
    } catch (err) {
      toast.error("Erreur de changement de formule.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Command <span className="text-primary">Center</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-sub text-xs text-muted-foreground uppercase tracking-widest font-bold">
              Opérationnel • {vendorProfile?.name || "Votre Boutique"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {vendorProfile?.slug && (
            <button
              onClick={() => window.open(`/r/${vendorProfile.slug}`, '_blank')}
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              Voir mon site public <ExternalLink size={14} />
            </button>
          )}
          <button className="relative p-3 rounded-2xl bg-card border border-border hover:bg-muted transition-colors">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
          </button>
          <div className="h-10 w-px bg-border mx-2 hidden md:block" />
          <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-2xl">
            <Calendar size={18} className="text-muted-foreground" />
            <span className="font-sub text-sm font-semibold">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Bannière Alerte In-App (Accès restreint / Paiement en attente) */}
      {subStatus === "restricted" && (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center flex-shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Accès aux commandes temporairement restreint</p>
              <p className="text-xs text-red-600/80">Votre site public reste visible mais les commandes sont désactivées faute de paiement.</p>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-6 py-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md whitespace-nowrap"
          >
            Régler l'abonnement
          </button>
        </div>
      )}

      {/* ─── Carte Mon Abonnement ─── */}
      <div className="p-8 rounded-[36px] bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <Crown size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Abonnement Vendeur</span>
                <h2 className="font-heading text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                  Formule {plan === "pro" ? "Pro (5 000 F/mois)" : "Starter (3 000 F/mois)"}
                </h2>
              </div>
            </div>
            <p className="text-white/60 text-xs italic max-w-xl">
              {plan === "pro"
                ? "Inclus : IZA AI (assistant 24h/24) • 0% de commission • Site Factory complet • MoMo"
                : "Inclus : Site Factory complet • Suivi commandes/réservations • Paiements Mobile Money • 2% comm"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto">
            {/* Statut Badge */}
            {subStatus === "trial" && (
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> Essai gratuit — encore {daysLeftInTrial} jour{daysLeftInTrial > 1 ? "s" : ""}
              </span>
            )}
            {subStatus === "active" && (
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={14} /> Actif jusqu'au {new Date(nextBillingDate).toLocaleDateString("fr-FR")}
              </span>
            )}
            {subStatus === "pending_payment" && (
              <span className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> Paiement en attente
              </span>
            )}
            {subStatus === "restricted" && (
              <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} /> Accès restreint
              </span>
            )}

            {/* Boutons d'action */}
            <button
              onClick={() => setShowPlanModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-md"
            >
              Changer de formule
            </button>

            {pendingInvoice && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                <CreditCard size={14} /> Payer maintenant
              </button>
            )}

            {vendorProfile?.paymentHistory && vendorProfile.paymentHistory.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-colors"
              >
                Historique ({vendorProfile.paymentHistory.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="group relative overflow-hidden p-6 rounded-[32px] bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${kpi.bg}`}>
                <kpi.icon size={24} className={kpi.color} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={10} /> {kpi.trend}
              </div>
            </div>
            <p className="font-heading text-2xl font-black text-foreground">{kpi.value}</p>
            <p className="font-sub text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">Performance</h3>
              <p className="font-sub text-sm text-muted-foreground">Volume d'affaires hebdomadaire</p>
            </div>
            <select className="bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs font-sub focus:outline-none">
              <option>7 derniers jours</option>
              <option>Mois en cours</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-8 rounded-[40px] bg-card border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-xl font-bold text-foreground">Flux Direct</h3>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
              Temps Réel
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <ShoppingBag className="text-muted-foreground opacity-20 mb-4" size={32} />
                <p className="font-sub text-sm text-muted-foreground italic">En attente de commandes...</p>
              </div>
            ) : (
              orders.slice(0, 8).map((order, idx) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-lg shadow-sm">
                    {idx % 2 === 0 ? "🍗" : "🥤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-bold truncate">{order.clientName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {order.date ? new Date(order.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                      </span>
                    </div>
                  </div>
                  <p className="font-heading text-sm font-black text-primary">
                    {(order.total || 0).toLocaleString()} F
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => navigate("/vendor/orders")}
            className="mt-6 w-full py-4 rounded-2xl bg-muted border border-border font-sub font-bold text-sm hover:bg-border transition-colors"
          >
            Voir tout l'historique
          </button>
        </div>
      </div>

      {/* ─── MODAL : Simulation Paiement Maketou ─── */}
      {showPaymentModal && pendingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black uppercase">Paiement Maketou</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Mode Simulation Actif
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Facture ID</span>
                <span className="font-mono text-gray-900">{pendingInvoice.id}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>Formule</span>
                <span className="uppercase text-gray-900">{pendingInvoice.plan}</span>
              </div>
              <div className="pt-3 border-t flex justify-between items-center">
                <span className="font-bold text-sm">Montant Total</span>
                <span className="font-black text-2xl text-primary">{pendingInvoice.amount.toLocaleString()} FCFA</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed italic">
              L'intégration Maketou utilisera MTN Mobile Money & Moov Money. Cliquez ci-dessous pour simuler la validation instantanée.
            </p>

            <button
              onClick={handlePayNowSimulation}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Confirmation...
                </>
              ) : (
                <>
                  <CreditCard size={18} /> Confirmer le paiement MoMo (Simulation)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL : Changer de Formule ─── */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowPlanModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="font-heading text-xl font-black uppercase">Changer de formule</h3>
              <p className="text-xs text-gray-500 mt-1">Sélectionnez la formule adaptée à votre établissement.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Starter */}
              <div
                onClick={() => handleChangePlan("starter")}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${plan === "starter" ? "border-primary bg-orange-50/50" : "border-gray-100 hover:border-gray-300"}`}
              >
                <span className="font-heading font-black text-lg block">Starter</span>
                <span className="font-black text-xl text-primary block mt-1">3 000 FCFA/mois</span>
                <ul className="text-xs text-gray-600 space-y-2 mt-4 italic">
                  <li>✓ Site Factory complet</li>
                  <li>✓ Suivi commandes/réservations</li>
                  <li>✓ Paiements MoMo</li>
                  <li>• Commission de 2% par vente</li>
                </ul>
              </div>

              {/* Pro */}
              <div
                onClick={() => handleChangePlan("pro")}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative ${plan === "pro" ? "border-primary bg-orange-50/50" : "border-gray-100 hover:border-gray-300"}`}
              >
                <span className="absolute -top-3 right-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Recommandé</span>
                <span className="font-heading font-black text-lg block">Pro</span>
                <span className="font-black text-xl text-primary block mt-1">5 000 FCFA/mois</span>
                <ul className="text-xs text-gray-600 space-y-2 mt-4 italic">
                  <li>✓ Tout Starter inclus</li>
                  <li>✓ Assistant IA IZA (24h/24)</li>
                  <li>✓ **0% de commission**</li>
                  <li>✓ Support prioritaire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL : Historique des Paiements ─── */}
      {showHistoryModal && vendorProfile?.paymentHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <h3 className="font-heading text-xl font-black uppercase">Historique des paiements</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {vendorProfile.paymentHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs block uppercase">Formule {item.plan}</span>
                    <span className="text-[10px] text-gray-400 font-mono block">{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-primary block">{item.amount.toLocaleString()} FCFA</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Payé
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
