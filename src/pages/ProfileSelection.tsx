import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Utensils, Store, ArrowRight, Building2, Compass } from "lucide-react";

export default function ProfileSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Si l'utilisateur clique "Changer de profil" (?select=true), on ne redirige pas automatiquement
    if (searchParams.get("select") === "true") return;

    const choice = localStorage.getItem("oresto_profile_choice");
    if (choice === "client") {
      navigate("/decouvrir", { replace: true });
    } else if (choice === "pro") {
      navigate("/pro", { replace: true });
    }
  }, [navigate, searchParams]);

  const selectProfile = (type: "client" | "pro") => {
    localStorage.setItem("oresto_profile_choice", type);
    if (type === "client") {
      navigate("/decouvrir");
    } else {
      navigate("/pro");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-body selection:bg-primary selection:text-white">
      {/* Glows d'arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header avec Logo */}
      <header className="relative z-10 flex justify-center py-4">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-heading text-xl font-black tracking-tighter uppercase text-white">
            Oresto
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto my-auto w-full text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary font-sub text-[10px] font-black uppercase tracking-widest">
            <Compass size={12} /> Bienvenue sur Oresto
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-[900] tracking-tighter uppercase leading-[0.95]">
            Qui êtes-vous <span className="text-primary italic block sm:inline">aujourd'hui ?</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-lg mx-auto italic font-body">
            Choisissez votre expérience pour accéder au contenu adapté à vos besoins.
          </p>
        </motion.div>

        {/* 2 Cartes cliquables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Carte 1 : Client */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectProfile("client")}
            className="group cursor-pointer p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all flex flex-col justify-between relative overflow-hidden shadow-2xl"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Utensils size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">
                  Client • Touriste
                </span>
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-3">
                  Je cherche un établissement
                </h2>
                <p className="text-white/60 text-sm leading-relaxed italic">
                  Découvrez les meilleurs restaurants, hôtels, maquis et auberges au Bénin. Commandez ou réservez directement en quelques clics.
                </p>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between font-sub text-xs font-black uppercase tracking-widest text-primary group-hover:text-white transition-colors relative z-10">
              <span>Explorer Oresto</span>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg">
                <ArrowRight size={18} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Carte 2 : Pro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectProfile("pro")}
            className="group cursor-pointer p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/[0.08] transition-all flex flex-col justify-between relative overflow-hidden shadow-2xl"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <Building2 size={28} />
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black uppercase tracking-widest">
                  Vendeur • Pro
                </span>
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white mb-3">
                  J'ai un établissement à faire connaître
                </h2>
                <p className="text-white/60 text-sm leading-relaxed italic">
                  Créez votre application web de vente ou réservation en 12 min. Zéro code, paiements Mobile Money et IA intégrée.
                </p>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-white/10 flex items-center justify-between font-sub text-xs font-black uppercase tracking-widest text-orange-400 group-hover:text-white transition-colors relative z-10">
              <span>Lancer mon établissement</span>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg">
                <ArrowRight size={18} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="relative z-10 text-center py-4 text-white/30 font-sub text-[10px] font-bold uppercase tracking-widest">
        © 2026 Oresto Connect • La super-app du commerce local
      </footer>
    </div>
  );
}
