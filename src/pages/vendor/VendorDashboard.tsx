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

  // Stats commandes reliées en direct au système de paiement
  const paidOrders = orders.filter(o => o.status === "preparing" || o.status === "delivering" || o.status === "delivered" || o.status === "paid");
  const pendingValidationOrders = orders.filter(o => o.status === "payment_sent");
  const awaitingPaymentOrders = orders.filter(o => o.status === "awaiting_payment");
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayPaidOrders = paidOrders.filter(o => new Date(o.date) >= todayStart);
  const uniqueClients = new Set(orders.filter(o => o.status !== "cancelled").map(o => o.clientId)).size;

  const weeklyData = [];
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const dayRevenue = paidOrders
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

  const isEcommerce = vendorProfile?.business_type === "ecommerce" || (typeof window !== 'undefined' && localStorage.getItem("oresto_active_workspace") === "ecommerce");

  const weeklyRevenue = weeklyData.reduce((s, d) => s + d.revenue, 0);

  const kpis = [
    {
      label: isEcommerce ? "Ventes Encaissées (7j)" : "CA Encaissé (7j)",
      value: `${weeklyRevenue.toLocaleString()} FCFA`,
      trend: "Paiements MoMo validés",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: isEcommerce ? "Colis Validés (Aujourd'hui)" : "Repas Servis (Aujourd'hui)",
      value: String(todayPaidOrders.length),
      trend: isEcommerce ? "Prêts à l'expédition" : "Sortis de cuisine",
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      label: "Paiements à Valider",
      value: String(pendingValidationOrders.length),
      trend: `${awaitingPaymentOrders.length} en attente`,
      icon: CreditCard,
      color: pendingValidationOrders.length > 0 ? "text-blue-600 animate-pulse" : "text-amber-500",
      bg: pendingValidationOrders.length > 0 ? "bg-blue-100" : "bg-amber-500/10"
    },
    {
      label: isEcommerce ? "Acheteurs Fidélisés" : "Clients Reçus",
      value: String(uniqueClients),
      trend: "Total boutique",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  // Calculs abonnement unique Oresto Pro
  const plan = "pro";
  const subStatus = vendorProfile?.subscriptionStatus || "trial";
  const trialEndsAt = vendorProfile?.trialEndsAt || Date.now() + 30 * 24 * 60 * 60 * 1000;
  const nextBillingDate = vendorProfile?.nextBillingDate || trialEndsAt;
  const pendingInvoice = vendorProfile?.pendingInvoice;
  const isFirstPayment = !vendorProfile?.paymentHistory || vendorProfile.paymentHistory.length === 0;
  const currentPayAmount = isFirstPayment ? 2500 : 5000;

  const daysLeftInTrial = Math.max(0, Math.ceil((trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24)));
  const daysUntilDue = Math.max(0, Math.ceil((nextBillingDate - Date.now()) / (1000 * 60 * 60 * 24)));
  const graceDaysLeft = subStatus === "pending_payment" ? Math.max(0, 3 - Math.floor((Date.now() - nextBillingDate) / (1000 * 60 * 60 * 24))) : 3;

  const handlePayNowSimulation = async () => {
    if (!db || !vendorProfile?.id) return;
    setIsProcessing(true);
    try {
      await confirmVendorSubscriptionPayment(db, vendorProfile.id, pendingInvoice?.id);
      toast.success("🎉 Paiement validé avec succès ! Votre abonnement Oresto Pro est actif.");
      setShowPaymentModal(false);
    } catch (err) {
      toast.error("Erreur lors de la confirmation du paiement.");
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

      {/* Alerte J-7 (1 semaine avant échéance) */}
      {subStatus === "trial" && daysUntilDue <= 7 && daysUntilDue > 0 && (
        <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/30 text-orange-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Échéance dans {daysUntilDue} jour{daysUntilDue > 1 ? "s" : ""} — Offre spéciale -50%</p>
              <p className="text-xs text-orange-700/80">Profitez de 50% de réduction sur votre 1er mois (2 500 FCFA au lieu de 5 000 FCFA). Réglez dès maintenant pour anticiper sans coupure.</p>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-md whitespace-nowrap"
          >
            Régler (2 500 F)
          </button>
        </div>
      )}

      {/* Bannière Alerte Jour J / Grâce 3 jours */}
      {subStatus === "pending_payment" && (
        <div className="p-6 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Période de grâce active : {graceDaysLeft} jour{graceDaysLeft > 1 ? "s" : ""} restant{graceDaysLeft > 1 ? "s" : ""}</p>
              <p className="text-xs text-amber-800/80">Votre abonnement est arrivé à terme. Veuillez régulariser avant l'expiration du délai de 3 jours pour éviter le blocage de votre espace et de votre site.</p>
            </div>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-6 py-3 rounded-xl bg-amber-600 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-md whitespace-nowrap"
          >
            Régler ({currentPayAmount.toLocaleString()} F)
          </button>
        </div>
      )}

      {/* Alerte Urgente : Paiements MoMo Reçus à Valider */}
      {pendingValidationOrders.length > 0 && (
        <div className="p-6 rounded-3xl bg-blue-500/15 border-2 border-blue-500/40 text-blue-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in shadow-lg shadow-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <CreditCard size={22} className="animate-pulse" />
            </div>
            <div>
              <p className="font-heading font-black text-base uppercase tracking-tight text-blue-950">
                🔔 {pendingValidationOrders.length} Paiement{pendingValidationOrders.length > 1 ? "s" : ""} Mobile Money en attente de validation
              </p>
              <p className="text-xs text-blue-800 font-medium">
                Vos clients ont effectué leur transfert MoMo. Validez la réception pour lancer la préparation et comptabiliser la vente dans votre CA.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/vendor/orders")}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md whitespace-nowrap flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Voir & Valider ({pendingValidationOrders.length})
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Formule Exclusive</span>
                <h2 className="font-heading text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                  Oresto Pro (5 000 F/mois)
                </h2>
              </div>
            </div>
            <p className="text-white/60 text-xs italic max-w-xl">
              Inclus : Assistant IA IZI • 0% de commission • Site Factory complet • MoMo MTN/Moov • Support VIP
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
              <span className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 border border-orange-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} /> Grâce ({graceDaysLeft}j restants)
              </span>
            )}
            {subStatus === "restricted" && (
              <span className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} /> Accès restreint
              </span>
            )}

            {/* Boutons d'action */}
            <button
              onClick={() => navigate("/vendor/subscription")}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-md flex items-center gap-2"
            >
              <CreditCard size={14} /> Gérer mon abonnement
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
