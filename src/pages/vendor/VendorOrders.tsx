import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { getVendorSector } from "@/lib/vendorSector";
import { toast } from "sonner";
import { Order } from "@/data/mockData";
import { 
  Clock, 
  Package, 
  CheckCircle2, 
  Truck, 
  MessageCircle, 
  X, 
  ChevronRight, 
  CreditCard, 
  Receipt,
  Utensils,
  Hotel,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderChat from "@/components/OrderChat";
import ReceiptModal from "@/components/orders/ReceiptModal";

function OrderCard({
  order,
  actionLabel,
  onAction,
  onOpenChat,
  onOpenReceipt,
  sector
}: {
  order: Order;
  actionLabel?: string;
  onAction?: () => void;
  onOpenChat: (order: Order) => void;
  onOpenReceipt: (order: Order) => void;
  sector: "restaurant" | "ecommerce" | "hotel";
}) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!onAction) return;
    setLoading(true);
    await onAction();
    setLoading(false);
  };

  const checkIn = (order as any).checkIn;
  const checkOut = (order as any).checkOut;
  const nights = (order as any).nights;
  const guests = (order as any).guests;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-zinc-200/90 rounded-3xl p-5 space-y-4 hover:shadow-md transition-all font-sub"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200">
              #{order.id.slice(-5)}
            </span>
            <span className="font-heading font-bold text-sm text-zinc-950">
              {order.clientName || "Client"}
            </span>
          </div>
          {order.clientPhone && (
            <p className="text-[11px] text-zinc-500 font-mono">
              {order.clientPhone}
            </p>
          )}
        </div>

        <span className="font-heading font-black text-sm text-zinc-950 whitespace-nowrap">
          {Number(order.total || 0).toLocaleString("fr-FR")} F
        </span>
      </div>

      {/* Détails articles ou séjour */}
      <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 space-y-1 text-xs">
        {sector === "hotel" && (checkIn || checkOut) ? (
          <div className="space-y-1 text-[11px] text-zinc-700">
            <p className="font-bold text-indigo-700">
              {(order.items || []).map(i => i.name).join(", ") || "Hébergement"}
            </p>
            <p className="text-zinc-500">
              Du <strong>{checkIn || "Aujourd'hui"}</strong> au <strong>{checkOut || "Demain"}</strong>
              {nights && ` (${nights} nuit${nights > 1 ? "s" : ""})`}
            </p>
            {guests && <p className="text-zinc-500">{guests} voyageur{guests > 1 ? "s" : ""}</p>}
          </div>
        ) : (
          (order.items || []).map((it, idx) => (
            <div key={idx} className="flex justify-between items-center text-zinc-700">
              <span className="font-medium truncate max-w-[180px]">
                <strong className="text-zinc-900">{it.qty || 1}x</strong> {it.name}
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {Number((it.price || 0) * (it.qty || 1)).toLocaleString("fr-FR")} F
              </span>
            </div>
          ))
        )}

        {order.address && (
          <p className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/50">
            📍 {order.address}
          </p>
        )}
      </div>

      {/* Meta & Actions */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenReceipt(order)}
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            title="Télécharger le reçu / bon"
          >
            <Receipt size={14} />
          </button>

          {order.clientPhone && (
            <a
              href={`https://wa.me/${order.clientPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
              title="Contacter sur WhatsApp"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </a>
          )}
        </div>

        {actionLabel && (
          <button
            onClick={handleAction}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-sub font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{actionLabel}</span>
                <ChevronRight size={13} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function VendorOrders() {
  const { user, vendorProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");
  const sector = getVendorSector(vendorProfile, sectorQuery);

  const vendorId = vendorProfile?.id || user?.vendorId || user?.uid || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOrder, setChatOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!db || !vendorId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val } as Order))
          .filter(o => 
            o.vendorId === vendorId || 
            (user?.vendorId && o.vendorId === user.vendorId) ||
            (user?.uid && o.vendorId === user.uid)
          )
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setOrders(list);
      } else {
        setOrders([]);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [vendorId, user]);

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    if (!db) return;
    try {
      await update(ref(db, `orders/${orderId}`), { status });
      toast.success("Statut de la commande mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const awaitingPayment = orders.filter(o => o.status === "awaiting_payment" || o.status === "payment_sent");
  const pending = orders.filter(o => o.status === "pending");
  const inProgress = orders.filter(o => o.status === "preparing" || o.status === "delivering");
  const completed = orders.filter(o => o.status === "delivered" || o.status === "paid");

  // Définition des 4 colonnes selon le profil métier
  const columns = [
    {
      title: "Paiement MoMo à valider",
      count: awaitingPayment.length,
      orders: awaitingPayment,
      badgeColor: "bg-amber-100 text-amber-800",
      actionLabel: "Valider paiement",
      nextStatus: "preparing" as Order["status"],
    },
    {
      title: sector === "hotel" ? "Demandes de séjour" : sector === "ecommerce" ? "Commandes reçues" : "Nouvelles commandes",
      count: pending.length,
      orders: pending,
      badgeColor: "bg-orange-100 text-orange-800",
      actionLabel: sector === "hotel" ? "Valider le séjour" : sector === "ecommerce" ? "Préparer colis" : "En cuisine ➔",
      nextStatus: "preparing" as Order["status"],
    },
    {
      title: sector === "hotel" ? "Séjours en cours" : sector === "ecommerce" ? "En cours d'expédition" : "En cuisine / Livraison",
      count: inProgress.length,
      orders: inProgress,
      badgeColor: "bg-blue-100 text-blue-800",
      actionLabel: sector === "hotel" ? "Check-out (Libérer)" : sector === "ecommerce" ? "Marquer livré ✓" : "Marquer livré ✓",
      nextStatus: "delivered" as Order["status"],
    },
    {
      title: sector === "hotel" ? "Séjours clôturés" : sector === "ecommerce" ? "Colis livrés" : "Commandes servies",
      count: completed.length,
      orders: completed,
      badgeColor: "bg-emerald-100 text-emerald-800",
      actionLabel: undefined,
      nextStatus: undefined,
    }
  ];

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <div className="space-y-8 pb-16 font-sub">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xl shadow-xs border border-orange-100">
            {sector === "hotel" ? <Hotel size={22} /> : sector === "ecommerce" ? <ShoppingBag size={22} /> : <Utensils size={22} />}
          </div>
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
              Gestion des <span className="text-[#FF6B00]">{sector === "hotel" ? "réservations" : "commandes"}</span>
            </h1>
            <p className="text-xs text-zinc-500 font-sub mt-0.5">
              Suivi en temps réel des encaissements Mobile Money et des livraisons
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 text-right">
            <span className="text-[10px] text-zinc-400 font-sub block">Total encaissé</span>
            <span className="font-heading font-black text-sm text-zinc-950">
              {totalRevenue.toLocaleString("fr-FR")} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Kanban des commandes / réservations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map((col, idx) => (
          <div key={idx} className="space-y-4">
            
            {/* Column header */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-zinc-200/80 shadow-xs">
              <span className="font-heading font-bold text-xs text-zinc-900">
                {col.title}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeColor}`}>
                {col.count}
              </span>
            </div>

            {/* Orders list */}
            <div className="space-y-3">
              <AnimatePresence>
                {col.orders.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-center">
                    <p className="text-xs text-zinc-400 font-sub">Aucun élément</p>
                  </div>
                ) : (
                  col.orders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      actionLabel={col.actionLabel}
                      onAction={col.nextStatus ? () => updateOrderStatus(order.id, col.nextStatus!) : undefined}
                      onOpenChat={setChatOrder}
                      onOpenReceipt={setReceiptOrder}
                      sector={sector}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

          </div>
        ))}
      </div>

      {/* Modal du reçu officiel */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          vendorProfile={vendorProfile}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      {/* Chat avec client si besoin */}
      {chatOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="font-heading font-bold text-sm text-zinc-900">
                  {chatOrder.clientName || "Client"}
                </h3>
                <p className="text-xs text-zinc-500 font-sub">Commande #{chatOrder.id.slice(-5)}</p>
              </div>
              <button onClick={() => setChatOrder(null)} className="p-2 text-zinc-400 hover:text-zinc-600">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 py-4">
              <OrderChat orderId={chatOrder.id} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
