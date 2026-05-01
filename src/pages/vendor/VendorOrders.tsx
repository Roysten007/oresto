import { useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { Order } from "@/data/mockData";
import { Clock, Package, CheckCircle2, Truck, MessageCircle, X, MapPin, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderChat from "@/components/OrderChat";

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  pending:   { label: "En attente",    color: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200", icon: Clock },
  preparing: { label: "Préparation",   color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",   icon: Package },
  delivering:{ label: "En route",      color: "text-purple-600",  bg: "bg-purple-50",  border: "border-purple-200", icon: Truck },
  delivered: { label: "Livré",         color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200",icon: CheckCircle2 },
};

function OrderCard({
  order,
  actionLabel,
  nextStatus,
  onAction,
  onOpenChat,
}: {
  order: Order;
  actionLabel?: string;
  nextStatus?: Order["status"];
  onAction?: () => void;
  onOpenChat: (order: Order) => void;
}) {
  const [loading, setLoading] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META.pending;
  const Icon = meta.icon;
  const deliveryMode = (order as any).deliveryMode as string | undefined;
  const distanceKm = (order as any).distanceKm as number | undefined;

  const handleAction = async () => {
    if (!onAction) return;
    setLoading(true);
    await onAction();
    setLoading(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-border rounded-[28px] p-5 space-y-4 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${meta.bg} ${meta.color}`}>
              {meta.label}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground">
              {new Date(order.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="font-black text-sm text-foreground">{order.clientName}</p>
          <p className="text-[10px] text-muted-foreground">#{order.id.slice(-8)}</p>
        </div>
        <div className={`w-11 h-11 rounded-2xl ${meta.bg} flex items-center justify-center`}>
          <Icon size={20} className={meta.color} />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-muted/50">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
            <span>{item.qty}× {item.name}</span>
            <span className="text-foreground">{item.price.toLocaleString()} F</span>
          </div>
        ))}
      </div>

      {/* Delivery info */}
      {deliveryMode && (
        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground">
          <MapPin size={11} className="text-primary flex-shrink-0" />
          <span className="truncate">{deliveryMode === "pickup" ? "Retrait sur place" : `Livraison · ${distanceKm || "?"}km · ${order.address || ""}`}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="font-black text-base text-primary">{order.total.toLocaleString()} F</p>
        <div className="flex items-center gap-2">
          {/* Chat button */}
          <button
            onClick={() => onOpenChat(order)}
            className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <MessageCircle size={15} />
          </button>
          {/* Action button */}
          {actionLabel && onAction && (
            <button
              onClick={handleAction}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{actionLabel} <ChevronRight size={12} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VendorOrders() {
  const { orders, updateOrderStatus, isLoading } = useOrders();
  const [chatOrder, setChatOrder] = useState<Order | null>(null);

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pending   = orders.filter(o => o.status === "pending");
  const preparing = orders.filter(o => o.status === "preparing" || o.status === "delivering");
  const delivered = orders.filter(o => o.status === "delivered");

  const columns = [
    {
      emoji: "⏳", title: "En attente", orders: pending,
      accent: "border-orange-300 bg-orange-50/50",
      headerColor: "text-orange-600",
      actionLabel: "Accepter →",
      nextStatus: "preparing" as Order["status"],
    },
    {
      emoji: "🍳", title: "Préparation", orders: preparing,
      accent: "border-blue-300 bg-blue-50/50",
      headerColor: "text-blue-600",
      actionLabel: "Marquer livré ✓",
      nextStatus: "delivered" as Order["status"],
    },
    {
      emoji: "✅", title: "Livrés", orders: delivered,
      accent: "border-emerald-300 bg-emerald-50/50",
      headerColor: "text-emerald-600",
      actionLabel: undefined,
      nextStatus: undefined,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-heading text-3xl font-black text-foreground tracking-tight uppercase">
            Flux des <span className="text-primary">Commandes</span>
          </h1>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">
            {orders.length} commande{orders.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Temps réel
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.title} className={`rounded-[32px] border-2 ${col.accent} p-5 space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`font-heading font-black text-sm uppercase tracking-tight ${col.headerColor}`}>
                {col.emoji} {col.title}
              </h2>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${col.accent} ${col.headerColor} border border-current/20`}>
                {col.orders.length}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {col.orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center space-y-2"
                >
                  <p className="text-2xl">🍽️</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Aucune commande
                  </p>
                </motion.div>
              ) : (
                col.orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    actionLabel={col.actionLabel}
                    nextStatus={col.nextStatus}
                    onAction={col.nextStatus ? () => updateOrderStatus(order.id, col.nextStatus!) : undefined}
                    onOpenChat={setChatOrder}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Chat Drawer — slides in from right */}
      <AnimatePresence>
        {chatOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatOrder(null)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center gap-4 p-6 border-b border-border bg-card">
                <button
                  onClick={() => setChatOrder(null)}
                  className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center hover:bg-border transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-sm uppercase tracking-tight truncate">
                    Discussion · {chatOrder.clientName}
                  </h3>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    Commande #{chatOrder.id.slice(-8)} · {chatOrder.total.toLocaleString()} F
                  </p>
                </div>
              </div>

              {/* Chat fills the rest */}
              <div className="flex-1 overflow-hidden p-4">
                <OrderChat
                  orderId={chatOrder.id}
                  clientName={chatOrder.clientName}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
