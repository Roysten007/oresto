import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Order, Product } from "@/data/mockData";
import {
  Utensils,
  ChefHat,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  Bike,
  Flame,
  AlertCircle,
  ExternalLink,
  Plus,
  QrCode,
  Receipt
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
import { useNavigate } from "react-router-dom";
import ReceiptModal from "@/components/orders/ReceiptModal";

export default function DashboardRestaurant() {
  const { vendorProfile, user } = useAuth();
  const navigate = useNavigate();
  const vendorId = vendorProfile?.id || user?.vendorId || "v_demo";

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Sample data fallback if new account
  const sampleOrders: Order[] = [
    {
      id: "ord_101",
      clientId: "c1",
      clientName: "Jean Houndété",
      vendorId,
      vendorName: vendorProfile?.name || "L'Atelier du Chef & Grill",
      items: [{ name: "Poulet Braisé & Alloco Doré", qty: 2, price: 4500 }],
      total: 9000,
      deliveryFee: 1000,
      status: "preparing",
      paymentMethod: "momo_mtn",
      address: "Table 4 (Sur Place)",
      date: new Date().toISOString()
    },
    {
      id: "ord_102",
      clientId: "c2",
      clientName: "Amina Kora",
      vendorId,
      vendorName: vendorProfile?.name || "L'Atelier du Chef & Grill",
      items: [{ name: "Capitaine Braisé Royal", qty: 1, price: 6500 }, { name: "Bissap Frais", qty: 2, price: 1000 }],
      total: 8500,
      deliveryFee: 1500,
      status: "delivering",
      paymentMethod: "momo_moov",
      address: "Livraison Haie Vive, Rue 340",
      date: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      id: "ord_103",
      clientId: "c3",
      clientName: "Marc Dossou",
      vendorId,
      vendorName: vendorProfile?.name || "L'Atelier du Chef & Grill",
      items: [{ name: "Chawarma Viande & Frites", qty: 3, price: 2500 }],
      total: 7500,
      deliveryFee: 0,
      status: "delivered",
      paymentMethod: "momo_mtn",
      address: "À Emporter",
      date: new Date(Date.now() - 90 * 60000).toISOString()
    }
  ];

  useEffect(() => {
    if (!db || !vendorId) {
      setOrders(sampleOrders);
      setLoading(false);
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsubOrders = onValue(ordersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val } as Order))
          .filter(o => o.vendorId === vendorId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(list.length > 0 ? list : sampleOrders);
      } else {
        setOrders(sampleOrders);
      }
      setLoading(false);
    });

    const productsRef = ref(db, "products");
    const unsubProducts = onValue(productsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data)
          .map(k => ({ id: k, ...data[k] }))
          .filter(p => p.vendorId === vendorId);
        setProducts(list);
      }
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, [vendorId]);

  const updateOrderStatus = async (orderId: string, newStatus: any) => {
    if (!db) return;
    try {
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
      toast.success("Statut de commande mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const inKitchenOrders = orders.filter(o => o.status === "preparing" || o.status === "pending");
  const deliveringOrders = orders.filter(o => o.status === "delivering");
  const completedOrders = orders.filter(o => o.status === "delivered" || o.status === "paid");

  const todayRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const chartData = [
    { day: "Lun", repas: 14, revenue: 65000 },
    { day: "Mar", repas: 18, revenue: 82000 },
    { day: "Mer", repas: 22, revenue: 98000 },
    { day: "Jeu", repas: 19, revenue: 89000 },
    { day: "Ven", repas: 34, revenue: 165000 },
    { day: "Sam", repas: 45, revenue: 210000 },
    { day: "Dim", repas: 38, revenue: 175000 },
  ];

  return (
    <div className="space-y-8 pb-16 font-body">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center text-2xl shadow-sm">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-foreground">
                Tableau de Bord <span className="text-primary">Restaurant</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider">
                Cuisine Ouverte
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-0.5">
              {vendorProfile?.name || "L'Atelier du Chef & Grill"} • Suivi des commandes, de la cuisine et des encaissements MoMo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/vendor/catalogue")}
            className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-2 border border-border"
          >
            <Plus size={14} /> Ajouter un plat
          </button>

          <button
            onClick={() => window.open(`/r/${vendorProfile?.slug || "latelier-du-chef"}`, '_blank')}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
          >
            <span>Voir ma Carte en direct</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPIs Restaurant Dédiés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Recettes Repas (7j) */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Recettes Repas (7j)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-foreground">884 000 F</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 size={12} />
            <span>100% MoMo direct (0% comm)</span>
          </div>
        </div>

        {/* KPI 2 : En Cuisine Maintenant */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">En Cuisine (Live)</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-primary flex items-center justify-center text-xs">
              <Flame size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-primary">{inKitchenOrders.length} tickets</p>
          <span className="text-[10px] text-muted-foreground font-bold">À préparer au feu</span>
        </div>

        {/* KPI 3 : En Cours de Livraison */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">En Livraison</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs">
              <Bike size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-blue-600">{deliveringOrders.length} livreurs</p>
          <span className="text-[10px] text-muted-foreground font-bold">En route vers le client</span>
        </div>

        {/* KPI 4 : Repas Servis du Jour */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Repas Servis</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs">
              <Utensils size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-foreground">38 aujourd'hui</p>
          <span className="text-[10px] text-muted-foreground font-bold">Panier moyen : 4 800 F</span>
        </div>

      </div>

      {/* Grid: Live Kitchen Queue & Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Live Kitchen Queue (KDS - Kitchen Display System) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-base uppercase tracking-tight text-foreground flex items-center gap-2">
              <Flame className="text-primary" size={18} />
              Commandes & Cuisine en Direct
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              ● Synchronisé MoMo
            </span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div 
                key={order.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/40 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-mono font-black">
                      #{order.id.slice(-4).toUpperCase()}
                    </span>
                    <span className="font-heading font-black text-sm text-foreground">
                      {order.clientName}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-bold">
                      • {order.address}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-xs text-foreground/80">
                    {order.items.map((it, idx) => (
                      <p key={idx} className="font-medium">
                        <strong>{it.qty}x</strong> {it.name}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                    <span>Paiement : <strong>{order.paymentMethod.replace('_', ' ').toUpperCase()}</strong></span>
                    <span>• {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <span className="font-heading font-black text-base text-primary">
                    {order.total.toLocaleString()} FCFA
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setReceiptOrder(order)}
                      className="px-2.5 py-1 rounded-xl bg-muted hover:bg-black hover:text-white text-muted-foreground text-[10px] font-bold flex items-center gap-1 transition-all"
                      title="Générer & Télécharger le reçu officiel"
                    >
                      <Receipt size={11} />
                      <span>Reçu</span>
                    </button>

                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivering")}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        Prêt ➔ Livrer
                      </button>
                    )}
                    {order.status === "delivering" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        Marquer Livré ✓
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold">
                        ✓ Servi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Revenue Chart & QR Code Widget */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Revenue Chart */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-tight text-foreground">
                Affluence & Repas de la Semaine
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground">7 derniers jours</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="restoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#EA580C" strokeWidth={2} fillOpacity={1} fill="url(#restoGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick QR Code Tables Widget */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-black text-white shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-lg">
                <QrCode size={20} />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm uppercase tracking-tight">QR Codes de Tables & Comptoir</h4>
                <p className="text-[11px] text-white/60">Permettez à vos clients de commander sans attendre</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/vendor/site")}
              className="w-full py-3 rounded-xl bg-white text-black font-heading font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors mt-2"
            >
              Générer mes QR Codes de table
            </button>
          </div>

        </div>

      </div>

      {/* Official Receipt Modal for Download & Print */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          vendorProfile={vendorProfile}
          onClose={() => setReceiptOrder(null)}
        />
      )}

    </div>
  );
}
