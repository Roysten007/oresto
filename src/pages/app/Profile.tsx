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
  ChevronLeft,
  CreditCard, 
  Star,
  Bell,
  HelpCircle,
  Edit2,
  CheckCircle2,
  Camera,
  Gift,
  Globe,
  Key,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";

export default function Profile() {
  const { user, logout } = useAuth();
  const { notifications, loyaltyPoints, language, updateLanguage } = useClient();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: user?.firstName || "Client",
    name: user?.name || "Oresto",
    phone: user?.phone || "+229 00 00 00 00",
    email: user?.email || "contact@oresto.bj",
    photo: user?.avatar || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);


  const handleSaveProfile = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      await update(ref(db, `users/${user.id}`), {
        firstName: form.firstName,
        name: form.name,
        phone: form.phone,
        email: form.email,
        avatar: form.photo,
      });
      toast.success("Profil mis à jour !");
      setIsEditing(false);
    } catch (e) {
      toast.error("Erreur de sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, form.email);
      toast.success("Email de réinitialisation envoyé !");
      setShowPasswordModal(false);
    } catch (e) {
      toast.error("Erreur d'envoi. Vérifiez votre email.");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="py-8 space-y-10 pb-40 px-4">
      {/* Header Profile with Back Button */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">Mon Profil</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-[40px] bg-gradient-to-tr from-primary to-orange-400 p-1">
            <div className="w-full h-full rounded-[38px] bg-white p-1 relative overflow-hidden group">
               {form.photo ? (
                 <img src={form.photo} className="w-full h-full rounded-[36px] object-cover" alt="Profile" />
               ) : (
                 <div className="w-full h-full rounded-[36px] bg-gray-50 flex items-center justify-center text-primary font-black text-4xl">
                   {user?.firstName?.[0] || "U"}
                 </div>
               )}
               {isEditing && (
                 <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera size={24} />
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) {
                       const reader = new FileReader();
                       reader.onloadend = () => setForm({...form, photo: reader.result as string});
                       reader.readAsDataURL(file);
                     }
                   }} />
                 </label>
               )}
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-90 transition-all"
            disabled={isSaving}
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (isEditing ? <CheckCircle2 size={16} /> : <Edit2 size={16} />)}
          </button>
        </div>
        <div className="space-y-1 w-full max-w-xs mx-auto">
          {isEditing ? (
            <div className="space-y-3">
              <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full text-center py-2 border-b-2 border-primary outline-none font-black text-xl" placeholder="Prénom" />
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full text-center py-2 border-b-2 border-primary outline-none font-black text-xl uppercase" placeholder="Nom" />
              <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full text-center py-2 border-b-2 border-primary outline-none font-bold text-sm text-gray-500" placeholder="Téléphone" />
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full text-center py-2 border-b-2 border-primary outline-none font-bold text-sm text-gray-500" placeholder="Email" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{form.firstName} {form.name}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{form.phone}</p>
            </>
          )}
        </div>
      </div>

      {/* Loyalty Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="p-8 rounded-[48px] bg-black text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Points Fidélité</p>
              <h2 className="text-5xl font-black">{loyaltyPoints}</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Star className="text-primary fill-primary" size={28} />
            </div>
          </div>
          <div className="space-y-3">
            {/* Dynamic progress: milestone every 500 pts */}
            {(() => {
              const MILESTONE = 500;
              const progress = loyaltyPoints % MILESTONE;
              const remaining = MILESTONE - progress;
              const pct = Math.min((progress / MILESTONE) * 100, 100);
              return (
                <>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 italic">
                    {loyaltyPoints === 0
                      ? "Passez votre première commande pour gagner des points !"
                      : remaining === MILESTONE
                      ? "🎉 Palier atteint ! Profitez de votre récompense."
                      : `Encore ${remaining} pts pour votre prochain plat offert !`}
                  </p>
                </>
              );
            })()}
          </div>
          
          {/* How to earn */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Comment gagner des points ?</p>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
              <span className="text-primary font-black">+1pt</span> par 100 FCFA dépensés
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold opacity-70">
              <span className="text-primary font-black">+5pts</span> bonus si livraison par le restaurant
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Menu */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => navigate('/app/orders')}
          className="p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] bg-white border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wider text-center leading-tight">Mes Commandes</span>
        </button>
        <button 
          onClick={() => navigate('/app/favorites')}
          className="p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] bg-white border border-gray-50 shadow-sm flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Heart size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wider text-center leading-tight">Mes Favoris</span>
        </button>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Paramètres & Aide</h2>
        <div className="space-y-2">
          {[
            { icon: Bell, label: "Notifications", color: "text-blue-500", bg: "bg-blue-50", badge: unreadCount, path: "/app/notifications" },
            { icon: MapPin, label: "Mes Adresses", color: "text-emerald-500", bg: "bg-emerald-50", path: "/app/addresses" },
            { icon: CreditCard, label: "Moyens de Paiement", color: "text-purple-500", bg: "bg-purple-50", path: "/app/payments" },
            { icon: Globe, label: `Langue (${language === 'fr' ? 'FR' : 'EN'})`, color: "text-sky-500", bg: "bg-sky-50", action: () => setShowLanguageModal(true) },
            { icon: Key, label: "Mot de passe", color: "text-indigo-500", bg: "bg-indigo-50", action: () => setShowPasswordModal(true) },
            { icon: HelpCircle, label: "Centre d'Aide", color: "text-orange-500", bg: "bg-orange-50", path: "/app/help" },
            { icon: Settings, label: "Confidentialité", color: "text-gray-500", bg: "bg-gray-100", path: "/app/privacy" },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => item.path ? navigate(item.path) : (item.action && item.action())}
              className="w-full p-5 rounded-[32px] bg-white border border-gray-50 flex items-center justify-between group active:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon size={22} />
                </div>
                <span className="font-black text-[10px] sm:text-xs uppercase tracking-wider truncate">{item.label}</span>
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
      <div>
        <button 
          onClick={logout}
          className="w-full py-6 rounded-[32px] bg-red-50 text-red-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-xl uppercase tracking-tighter">Changer de langue</h3>
                <button onClick={() => setShowLanguageModal(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <button onClick={() => { updateLanguage("fr"); setShowLanguageModal(false); toast.success("Langue changée en Français"); }} className={`w-full p-4 rounded-2xl font-black flex justify-between items-center ${language === 'fr' ? 'bg-primary text-white' : 'bg-gray-50'}`}>
                  Français {language === 'fr' && <CheckCircle2 size={20} />}
                </button>
                <button onClick={() => { updateLanguage("en"); setShowLanguageModal(false); toast.success("Language changed to English"); }} className={`w-full p-4 rounded-2xl font-black flex justify-between items-center ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-50'}`}>
                  English {language === 'en' && <CheckCircle2 size={20} />}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-xl uppercase tracking-tighter">Mot de passe</h3>
                <button onClick={() => setShowPasswordModal(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><X size={20} /></button>
              </div>
              <p className="text-sm font-medium text-gray-500">
                Vous recevrez un email de réinitialisation sécurisé à l'adresse <b>{form.email}</b>.
              </p>
              <button onClick={handleResetPassword} className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs">
                Envoyer le lien
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
