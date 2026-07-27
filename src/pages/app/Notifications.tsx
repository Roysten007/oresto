import { useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Check, Clock, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClient } from "@/contexts/ClientContext";

const timeAgo = (iso?: string) => {
  if (!iso) return "";
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return "";
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j === 1) return "Hier";
  return `Il y a ${j} j`;
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "order": return <ShoppingBag size={18} />;
    case "delivery": return <Clock size={18} />;
    case "loyalty": return <Star size={18} />;
    case "promo":
    case "discovery": return <MessageCircle size={18} />;
    default: return <Bell size={18} />;
  }
};

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useClient();

  return (
    <div className="py-8 space-y-8 pb-40">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm active:scale-90 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">Centre <span className="text-primary">Notifications</span></h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Restez informé de vos commandes</p>
          </div>
        </div>
        <button
          onClick={markAllAsRead}
          className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all"
          title="Tout marquer comme lu"
        >
          <Check size={20} />
        </button>
      </div>

      {/* Notifications List */}
      <div className="px-2 space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <Bell size={40} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aucune notification</p>
            </motion.div>
          ) : (
            notifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !n.is_read && markAsRead(n.id)}
                className={`group relative p-6 rounded-[32px] border transition-all ${
                  n.is_read ? "bg-white border-gray-50" : "bg-white border-primary/20 shadow-lg shadow-primary/5 cursor-pointer"
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    n.is_read ? "bg-gray-50 text-gray-400" : "bg-primary/10 text-primary"
                  }`}>
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className={`text-xs font-black uppercase tracking-tight ${n.is_read ? "text-gray-600" : "text-black"}`}>
                        {n.title}
                      </h3>
                      <span className="text-[9px] font-bold text-gray-400 uppercase whitespace-nowrap">{timeAgo(n.created_at)}</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 leading-relaxed">
                      {n.body}
                    </p>
                  </div>
                </div>

                {!n.is_read && (
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary" />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
