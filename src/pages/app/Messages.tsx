import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, ChevronRight, Clock, Package, CheckCircle2, Truck, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderChat from "@/components/OrderChat";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: "En attente",  color: "text-orange-500",  icon: Clock },
  preparing: { label: "Préparation", color: "text-blue-500",    icon: Package },
  delivering:{ label: "En route",    color: "text-purple-500",  icon: Truck },
  delivered: { label: "Livré",       color: "text-emerald-500", icon: CheckCircle2 },
};

interface ConversationPreview {
  orderId: string;
  vendorName: string;
  status: string;
  lastMessage?: string;
  lastTime?: number;
  unread: number;
}

export default function Messages() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Build conversation previews from orders + messages
  useEffect(() => {
    if (!db || orders.length === 0) return;

    const unsubscribers: (() => void)[] = [];
    const convMap = new Map<string, ConversationPreview>();

    orders.forEach(order => {
      convMap.set(order.id, {
        orderId: order.id,
        vendorName: order.vendorName || "Restaurant",
        status: order.status,
        unread: 0,
      });

      const unsub = onValue(ref(db, `messages/${order.id}`), snap => {
        const data = snap.val();
        if (data) {
          const msgs = Object.values(data) as any[];
          const sorted = msgs.sort((a, b) => b.timestamp - a.timestamp);
          const last = sorted[0];
          const unread = msgs.filter((m: any) => m.senderId !== user?.id && !m.isRead).length;

          convMap.set(order.id, {
            orderId: order.id,
            vendorName: order.vendorName || "Restaurant",
            status: order.status,
            lastMessage: last?.text,
            lastTime: last?.timestamp,
            unread,
          });
        }
        setConversations(Array.from(convMap.values()).sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0)));
      });

      unsubscribers.push(unsub);
    });

    // Set initial list even without messages
    setConversations(Array.from(convMap.values()));

    return () => unsubscribers.forEach(u => u());
  }, [orders, user?.id]);

  const filtered = conversations.filter(c =>
    c.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="py-8 pb-32 space-y-6">
      {/* Header */}
      <div className="space-y-1 px-2">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
          Mes <span className="text-primary">Messages</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-5 py-4 rounded-[28px] bg-white border border-gray-100 shadow-sm mx-2">
        <Search size={18} className="text-gray-300 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un restaurant..."
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-300"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
            <MessageCircle size={40} />
          </div>
          <div>
            <p className="text-sm font-black uppercase">Aucune conversation</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Passez une commande pour démarrer un chat !
            </p>
          </div>
          <button
            onClick={() => navigate("/app/decouvrir")}
            className="px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
          >
            Commander
          </button>
        </div>
      )}

      {/* Conversation list */}
      {!selectedOrderId && filtered.length > 0 && (
        <div className="space-y-3 px-2">
          <AnimatePresence>
            {filtered.map(conv => {
              const meta = statusConfig[conv.status] || statusConfig.pending;
              const StatusIcon = meta.icon;
              return (
                <motion.button
                  key={conv.orderId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedOrderId(conv.orderId)}
                  className="w-full flex items-center gap-4 p-4 rounded-[28px] bg-white border border-gray-50 shadow-sm hover:border-primary/20 hover:shadow-md transition-all active:scale-[0.98] text-left"
                >
                  {/* Avatar / Status */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-white flex items-center justify-center`}>
                      <StatusIcon size={10} className={meta.color} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-sm uppercase truncate">{conv.vendorName}</h3>
                      {conv.lastTime && (
                        <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap flex-shrink-0">
                          {new Date(conv.lastTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[10px] text-gray-400 truncate font-medium">
                        {conv.lastMessage || "Démarrez la conversation..."}
                      </p>
                      {conv.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <span className={`inline-block mt-1 text-[8px] font-black uppercase tracking-widest ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Chat view */}
      <AnimatePresence>
        {selectedOrderId && selectedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-2 space-y-4"
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedOrderId(null)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              ← Retour aux messages
            </button>

            {/* Order context bar */}
            <div className="p-4 rounded-[24px] bg-white border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-black text-sm uppercase">{selectedOrder.vendorName}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Commande #{selectedOrderId.slice(-8)} · {selectedOrder.total.toLocaleString()} F
                </p>
              </div>
              <button
                onClick={() => navigate(`/app/order/${selectedOrderId}`)}
                className="px-3 py-2 rounded-xl bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-primary hover:text-white transition-all border border-gray-100"
              >
                Suivi →
              </button>
            </div>

            {/* Chat */}
            <OrderChat
              orderId={selectedOrderId}
              vendorName={selectedOrder.vendorName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
