import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Utensils, ArrowRight, Building2, Compass } from "lucide-react";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-orange-50/60 via-white to-gray-50/80 text-foreground flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-body selection:bg-primary selection:text-white">
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-400/10 blur-[130px] rounded-full pointer-events-none" />

      {/* En-tête avec Logo Oresto */}
      <header className="relative z-10 flex justify-center py-4">
        <div className="flex items-center gap-3 bg-white border border-gray-200/80 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-heading text-2xl font-black tracking-tighter uppercase text-gray-900">
            Oresto
          </span>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="relative z-10 max-w-5xl mx-auto my-auto w-full text-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          {/* Badge d'accueil */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-primary font-sub text-[10px] font-black uppercase tracking-widest shadow-sm">
            <Compass size={13} /> Bienvenue sur Oresto
          </div>

          {/* Phrase d'introduction claire sur Oresto */}
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 max-w-2xl mx-auto leading-relaxed mt-2">
            Oresto connecte restaurants, hôtels, maquis et auberges avec les clients qui les cherchent, partout au Bénin.
          </p>

          {/* Titre principal */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-[900] tracking-tighter uppercase leading-[0.95] text-gray-900 pt-2">
            Qui êtes-vous <span className="text-primary italic block sm:inline">aujourd'hui ?</span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto italic font-body">
            Choisissez votre profil pour accéder à une expérience sur mesure.
          </p>
        </motion.div>

        {/* 2 Cartes de Sélection aux Couleurs Vives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Carte 1 : Client */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectProfile("client")}
            className="group cursor-pointer p-8 sm:p-10 rounded-[36px] bg-white border-2 border-gray-100 hover:border-primary hover:bg-orange-50/30 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-2xl"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                {/* Icône dans un carré orange vif */}
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                  <Utensils size={26} />
                </div>
                {/* Badge Orange Vif */}
                <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-primary text-[10px] font-black uppercase tracking-widest border border-orange-200/60 shadow-sm">
                  Client • Touriste
                </span>
              </div>

              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors mb-3">
                  Je cherche un établissement
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  Découvrez les meilleurs restaurants, hôtels, maquis et auberges au Bénin. Commandez ou réservez directement en quelques clics.
                </p>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-gray-100 flex items-center justify-between font-sub text-xs font-black uppercase tracking-widest text-primary relative z-10">
              <span>Explorer Oresto</span>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md shadow-orange-500/30">
                <ArrowRight size={18} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* Carte 2 : Pro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectProfile("pro")}
            className="group cursor-pointer p-8 sm:p-10 rounded-[36px] bg-white border-2 border-gray-100 hover:border-primary hover:bg-orange-50/30 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-2xl"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                {/* Icône dans un carré orange vif */}
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                  <Building2 size={26} />
                </div>
                {/* Badge Orange Vif */}
                <span className="px-3.5 py-1.5 rounded-full bg-orange-100 text-primary text-[10px] font-black uppercase tracking-widest border border-orange-200/60 shadow-sm">
                  Vendeur • Pro
                </span>
              </div>

              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors mb-3">
                  J'ai un établissement à faire connaître
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  Créez votre application web de vente ou réservation en 12 min. Zéro code, paiements Mobile Money et IA intégrée.
                </p>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-gray-100 flex items-center justify-between font-sub text-xs font-black uppercase tracking-widest text-primary relative z-10">
              <span>Lancer mon établissement</span>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-md shadow-orange-500/30">
                <ArrowRight size={18} />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>
      </main>

      {/* Pied de page épuré */}
      <footer className="relative z-10 text-center py-4 text-gray-400 font-sub text-[10px] font-bold uppercase tracking-widest">
        © 2026 Oresto Connect • La super-app du commerce local
      </footer>
    </div>
  );
}
