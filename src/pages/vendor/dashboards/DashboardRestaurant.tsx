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
  const vendorId = vendorProfile?.id || user?.vendorId || user?.uid || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!db || !vendorId) {
      setOrders([]);
      setProducts([]);
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
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setOrders(list);
      } else {
        setOrders([]);
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
      } else {
        setProducts([]);
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
      toast.success("Statut de la commande mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const inKitchenOrders = orders.filter(o => o.status === "preparing" || o.status === "pending");
  const deliveringOrders = orders.filter(o => o.status === "delivering");
  const completedOrders = orders.filter(o => o.status === "delivered" || o.status === "paid");

  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(o => o.date && o.date.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const averageBasket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Calcul réel des 7 derniers jours pour le graphique
  const daysShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().split("T")[0];
    const dayOrders = orders.filter(o => o.date && o.date.startsWith(dayStr));
    const dayRevenue = dayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return {
      day: daysShort[d.getDay()],
      repas: dayOrders.length,
      revenue: dayRevenue
    };
  });

  const restaurantName = vendorProfile?.name || vendorProfile?.restaurantName || "Mon restaurant";
  const restaurantSlug = vendorProfile?.slug || vendorId;

  return (
    <div className="space-y-8 pb-16 font-sub">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl shadow-xs border border-orange-100">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
                Tableau de bord <span className="text-[#FF6B00]">Restaurant</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-sub font-bold">
                Cuisine ouverte
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sub mt-0.5">
              {restaurantName} • Suivi des commandes, de la cuisine et des encaissements Mobile Money
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/vendor/catalogue")}
            className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sub font-bold text-xs flex items-center gap-2 border border-zinc-200 transition-colors"
          >
            <Plus size={14} /> Ajouter un plat
          </button>

          <button
            onClick={() => window.open(`/r/${restaurantSlug}`, '_blank')}
            className="px-5 py-2.5 rounded-2xl bg-[#FF6B00] text-white font-sub font-bold text-xs shadow-braised hover:bg-[#EA580C] flex items-center gap-2 transition-all"
          >
            <span>Voir ma carte en direct</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPIs Restaurant Réels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Recettes Totales */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Recettes totales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs border border-emerald-100">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {totalRevenue.toLocaleString("fr-FR")} F
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 size={12} />
            <span>100% MoMo direct (0% commission)</span>
          </div>
        </div>

        {/* KPI 2 : En Cuisine Maintenant */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">En cuisine (direct)</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xs border border-orange-100">
              <Flame size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-[#FF6B00]">
            {inKitchenOrders.length} ticket{inKitchenOrders.length > 1 ? "s" : ""}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            {inKitchenOrders.length === 0 ? "Aucun ticket en attente" : "En cours de préparation"}
          </span>
        </div>

        {/* KPI 3 : En Cours de Livraison */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">En livraison</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100">
              <Bike size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-blue-600">
            {deliveringOrders.length}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            {deliveringOrders.length === 0 ? "Aucune course en cours" : "En route vers le client"}
          </span>
        </div>

        {/* KPI 4 : Commandes Servies */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Commandes servies</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs border border-purple-100">
              <Utensils size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {completedOrders.length}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            Panier moyen : {averageBasket.toLocaleString("fr-FR")} F
          </span>
        </div>

      </div>

      {/* Grid: Live Kitchen Queue & Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne gauche : File d'attente Cuisine en direct */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-base text-zinc-950 tracking-tight flex items-center gap-2">
              <Flame className="text-[#FF6B00]" size={18} />
              <span>Commandes et cuisine en direct</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              ● Synchronisé MoMo
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto text-xl border border-orange-100">
                <Utensils size={22} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">
                  Aucune commande pour le moment
                </h3>
                <p className="text-xs text-zinc-500 font-sub max-w-sm mx-auto mt-1">
                  Partagez votre lien de commande ou imprimez vos QR codes de table pour commencer à recevoir des commandes.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => navigate("/vendor/catalogue")}
                  className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white font-sub font-bold text-xs shadow-xs hover:bg-[#EA580C] transition-all"
                >
                  Ajouter un plat
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div 
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-orange-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-mono font-bold">
                        #{order.id.slice(-4)}
                      </span>
                      <span className="font-heading font-bold text-sm text-zinc-900">
                        {order.clientName || "Client"}
                      </span>
                      {order.address && (
                        <span className="text-xs text-zinc-500 font-sub">
                          • {order.address}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5 text-xs text-zinc-700">
                      {(order.items || []).map((it, idx) => (
                        <p key={idx} className="font-medium">
                          <strong>{it.qty}x</strong> {it.name}
                        </p>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1 font-sub">
                      <span>Paiement : <strong className="text-zinc-700 font-mono">{(order.paymentMethod || "momo").replace('_', ' ')}</strong></span>
                      {order.date && <span>• {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
                    <span className="font-heading font-black text-base text-[#FF6B00]">
                      {Number(order.total || 0).toLocaleString("fr-FR")} FCFA
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setReceiptOrder(order)}
                        className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-600 text-[11px] font-sub font-bold flex items-center gap-1 transition-all"
                        title="Télécharger le reçu"
                      >
                        <Receipt size={11} />
                        <span>Reçu</span>
                      </button>

                      {order.status === "preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "delivering")}
                          className="px-3 py-1.5 bg-[#FF6B00] hover:bg-[#EA580C] text-white rounded-xl text-[11px] font-sub font-bold shadow-xs transition-all"
                        >
                          Prêt ➔ Livrer
                        </button>
                      )}
                      {order.status === "delivering" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "delivered")}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-sub font-bold shadow-xs transition-all"
                        >
                          Marquer livré ✓
                        </button>
                      )}
                      {(order.status === "delivered" || order.status === "paid") && (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-sub font-bold border border-emerald-100">
                          ✓ Servi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite : Graphique et QR Code */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Graphique des recettes réelles */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-zinc-950 tracking-tight">
                Recettes des 7 derniers jours
              </h3>
              <span className="text-xs text-zinc-500 font-sub">Temps réel</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="restoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={2} fillOpacity={1} fill="url(#restoGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Widget QR Codes de tables */}
          <div className="p-6 rounded-3xl bg-[#09090B] text-white shadow-xl space-y-3 border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center text-lg shadow-braised">
                <QrCode size={20} />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm text-white">QR codes de tables &amp; comptoir</h4>
                <p className="text-xs text-zinc-400 font-sub">Permettez à vos clients de commander sans attendre</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/vendor/site")}
              className="w-full py-3 rounded-xl bg-white text-zinc-950 font-sub font-bold text-xs hover:bg-zinc-100 transition-colors mt-2"
            >
              Générer mes QR codes de table
            </button>
          </div>

        </div>

      </div>

      {/* Modal du reçu officiel */}
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
