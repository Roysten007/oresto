import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Order, Product } from "@/data/mockData";
import {
  Hotel,
  KeyRound,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Plus,
  Bed,
  Users,
  Clock,
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

export default function DashboardHotel() {
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
      toast.success("Statut de la réservation mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Réservations actives (en séjour ou confirmées)
  const activeBookings = orders.filter(
    o => o.status === "preparing" || o.status === "pending" || o.status === "delivering"
  );

  // Arrivées prévues aujourd'hui
  const arrivalsToday = orders.filter(o => {
    const checkIn = (o as any).checkIn;
    if (checkIn) return checkIn === todayStr;
    return o.date && o.date.startsWith(todayStr);
  });

  // Taux d'occupation réel calculé à partir des chambres créées
  const totalRoomsCount = products.length;
  const occupiedCount = Math.min(totalRoomsCount, activeBookings.length);
  const occupancyRate = totalRoomsCount > 0 ? Math.round((occupiedCount / totalRoomsCount) * 100) : 0;
  const freeRoomsCount = Math.max(0, totalRoomsCount - occupiedCount);

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
      reservations: dayOrders.length,
      revenue: dayRevenue
    };
  });

  const hotelName = vendorProfile?.name || "Mon établissement";
  const hotelSlug = vendorProfile?.slug || vendorId;

  return (
    <div className="space-y-8 pb-16 font-sub">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-xs border border-indigo-100">
            <Hotel size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
                Tableau de bord <span className="text-indigo-600">Hôtel &amp; Résidence</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-sub font-bold">
                Réception ouverte
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-sub mt-0.5">
              {hotelName} • Gestion des réservations, nuitées et disponibilités en direct
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/vendor/catalogue")}
            className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sub font-bold text-xs flex items-center gap-2 border border-zinc-200 transition-colors"
          >
            <Plus size={14} /> Ajouter une chambre
          </button>

          <button
            onClick={() => window.open(`/r/${hotelSlug}`, '_blank')}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white font-sub font-bold text-xs shadow-xs hover:bg-indigo-700 flex items-center gap-2 transition-all"
          >
            <span>Voir ma vitrine hôtel</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPIs Hôtel Réels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Revenus Nuitées */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Revenus nuitées</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs border border-emerald-100">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {totalRevenue.toLocaleString("fr-FR")} F
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 size={12} />
            <span>0% commission d'agence</span>
          </div>
        </div>

        {/* KPI 2 : Taux d'Occupation Réel */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Taux d'occupation</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs border border-indigo-100">
              <Bed size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-indigo-600">
            {totalRoomsCount === 0 ? "0%" : `${occupancyRate}%`}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            {totalRoomsCount === 0 
              ? "Aucune chambre créée" 
              : `${occupiedCount} chambre${occupiedCount > 1 ? "s" : ""} sur ${totalRoomsCount}`}
          </span>
        </div>

        {/* KPI 3 : Arrivées Prévues */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Arrivées prévues</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs border border-blue-100">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-blue-600">
            {arrivalsToday.length}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            {arrivalsToday.length === 0 ? "Aucun check-in aujourd'hui" : "Check-in attendu aujourd'hui"}
          </span>
        </div>

        {/* KPI 4 : Chambres Disponibles */}
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Chambres libres</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xs border border-purple-100">
              <KeyRound size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {freeRoomsCount}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">
            {totalRoomsCount === 0 ? "Ajouter des chambres" : "Prêtes à la réservation"}
          </span>
        </div>

      </div>

      {/* Grid: Live Bookings & Rooms State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Colonne gauche : Réservations en cours */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-base text-zinc-950 tracking-tight flex items-center gap-2">
              <CalendarDays className="text-indigo-600" size={18} />
              <span>Réservations et séjours en direct</span>
            </h2>
            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              ● Synchronisé MoMo
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200/90 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl border border-indigo-100">
                <Hotel size={22} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">
                  Aucune réservation pour le moment
                </h3>
                <p className="text-xs text-zinc-500 font-sub max-w-sm mx-auto mt-1">
                  Partagez le lien de votre vitrine pour permettre à vos voyageurs de réserver directement sans commissions.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => navigate("/vendor/catalogue")}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-sub font-bold text-xs shadow-xs hover:bg-indigo-700 transition-all"
                >
                  Ajouter une chambre
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => {
                const checkIn = (order as any).checkIn;
                const checkOut = (order as any).checkOut;
                const nights = (order as any).nights;
                const guests = (order as any).guests;

                return (
                  <div 
                    key={order.id}
                    className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-white text-[10px] font-mono font-bold">
                          #{order.id.slice(-4)}
                        </span>
                        <span className="font-heading font-bold text-sm text-zinc-900">
                          {order.clientName || "Voyageur"}
                        </span>
                        {guests && (
                          <span className="text-xs text-zinc-500 font-sub">
                            • {guests} personne{guests > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 text-xs text-zinc-700">
                        {(order.items || []).map((it, idx) => (
                          <p key={idx} className="font-medium">
                            <strong>{it.qty || 1}x</strong> {it.name}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1 font-sub flex-wrap">
                        {checkIn && <span>Arrivée : <strong className="text-zinc-700">{checkIn}</strong></span>}
                        {checkOut && <span>• Départ : <strong className="text-zinc-700">{checkOut}</strong></span>}
                        {nights && <span>• ({nights} nuit{nights > 1 ? "s" : ""})</span>}
                        <span>• Paiement : <strong className="text-zinc-700 font-mono">{(order.paymentMethod || "momo").replace('_', ' ')}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
                      <span className="font-heading font-black text-base text-indigo-600">
                        {Number(order.total || 0).toLocaleString("fr-FR")} FCFA
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() => setReceiptOrder(order)}
                          className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-600 text-[11px] font-sub font-bold flex items-center gap-1 transition-all"
                          title="Télécharger la facture de séjour"
                        >
                          <Receipt size={11} />
                          <span>Reçu</span>
                        </button>

                        {order.status === "pending" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-sub font-bold shadow-xs transition-all"
                          >
                            Valider la réservation
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivering")}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-sub font-bold shadow-xs transition-all"
                          >
                            Check-in (Installé)
                          </button>
                        )}
                        {order.status === "delivering" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-sub font-bold shadow-xs transition-all"
                          >
                            Check-out (Libéré)
                          </button>
                        )}
                        {(order.status === "delivered" || order.status === "paid") && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-sub font-bold border border-emerald-100">
                            ✓ Séjour clôturé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colonne droite : État des Chambres & Graphique */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* État des Chambres Réelles */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm text-zinc-950 tracking-tight flex items-center gap-2">
                <Bed className="text-indigo-600" size={16} />
                <span>Chambres configurées ({products.length})</span>
              </h3>
              <button
                onClick={() => navigate("/vendor/catalogue")}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Gérer
              </button>
            </div>

            {products.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 text-center space-y-2">
                <p className="text-xs font-bold text-zinc-700">Aucune chambre ajoutée</p>
                <p className="text-[11px] text-zinc-500 font-sub">
                  Créez vos chambres dans le catalogue pour suivre leur disponibilité ici.
                </p>
                <button
                  onClick={() => navigate("/vendor/catalogue")}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition-colors"
                >
                  Ajouter une chambre
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {products.slice(0, 5).map(room => (
                  <div key={room.id} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-zinc-900">{room.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-sub">
                        {room.category || "Hébergement"} • <strong className="text-indigo-600">{Number(room.price || 0).toLocaleString("fr-FR")} F / nuitée</strong>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-100">
                      ✓ Disponible
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                    <linearGradient id="hotelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#hotelGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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
