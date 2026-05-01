import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClient } from "@/contexts/ClientContext";
import { 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ChevronRight, 
  CreditCard, 
  Star,
  Bell,
  HelpCircle,
  Edit2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, logout } = useAuth();
  const { notifications, loyaltyPoints } = useClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || "Client",
    name: user?.name || "Oresto",
    phone: user?.phone || "+229 00 00 00 00",
    email: user?.email || "contact@oresto.bj",
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-8 space-y-10 pb-40">
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center space-y-4 px-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-primary to-orange-400 p-1">
            <div className="w-full h-full rounded-[38px] bg-white p-1">
               <div className="w-full h-full rounded-[36px] bg-gray-50 flex items-center justify-center text-primary font-black text-4xl">
                 {user?.firstName?.[0] || "U"}
               </div>
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-90 transition-all">
            <Edit2 size={16} />
          </button>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{form.firstName} {form.name}</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{form.phone}</p>
        </div>
      </div>

      {/* Loyalty Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="mx-2 p-8 rounded-[48px] bg-black text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Points Fidélité</p>
              <h2 className="text-5xl font-black">{loyaltyPoints || 0}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Star className="text-primary fill-primary" size={28} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: '65%' }} />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 italic">Encore 350 pts pour votre prochain plat offert !</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Menu */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <button 
          onClick={() => navigate('/app/orders')}
          className="p-6 rounded-[40px] bg-white border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest">Mes Commandes</span>
        </button>
        <button 
          onClick={() => navigate('/app/favorites')}
          className="p-6 rounded-[40px] bg-white border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <Heart size={24} />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest">Mes Favoris</span>
        </button>
      </div>

      {/* Settings List */}
      <div className="space-y-4 px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-4">Paramètres & Aide</h2>
        <div className="space-y-2">
          {[
            { icon: Bell, label: "Notifications", color: "text-blue-500", bg: "bg-blue-50", badge: unreadCount },
            { icon: MapPin, label: "Mes Adresses", color: "text-emerald-500", bg: "bg-emerald-50" },
            { icon: CreditCard, label: "Moyens de Paiement", color: "text-purple-500", bg: "bg-purple-50" },
            { icon: HelpCircle, label: "Centre d'Aide", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: Settings, label: "Confidentialité", color: "text-gray-500", bg: "bg-gray-100" },
          ].map((item, i) => (
            <button 
              key={i}
              className="w-full p-5 rounded-[32px] bg-white border border-gray-50 flex items-center justify-between group active:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon size={22} />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                {item.badge && (
                  <span className="px-2 py-1 bg-primary text-white text-[9px] font-black rounded-lg">{item.badge}</span>
                )}
                <ChevronRight size={18} className="text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button 
          onClick={logout}
          className="w-full py-6 rounded-[32px] bg-red-50 text-red-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  );
}
