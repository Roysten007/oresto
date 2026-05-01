import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, ChevronRight, CheckCircle2, Star, Sparkles, Clock, Truck } from "lucide-react";
import { useClient } from "@/contexts/ClientContext";

const CITIES = ["Cotonou", "Abomey", "Bohicon", "Porto-Novo", "Parakou", "Lomé", "Abidjan", "Dakar"];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { updateLocation, updateCity, completeOnboarding } = useClient();
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Certains navigateurs bloquent la géolocalisation si elle n'est pas déclenchée par un clic.
    // On essaie quand même après 1 seconde.
    const t = setTimeout(() => {
      handleRequestLocation();
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.state || "Cotonou";
            await updateLocation(latitude, longitude, city);
          } catch(e) {
            await updateLocation(latitude, longitude);
          }
          setLoading(false);
          setStep(2);
        },
        (error) => {
          console.error("Erreur géolocalisation:", error);
          setLoading(false);
          setShowCitySelector(true);
        }
      );
    } else {
      setLoading(false);
      setShowCitySelector(true);
    }
  };

  const handleSelectCity = async (city: string) => {
    await updateCity(city);
    setStep(2);
  };

  const handleRequestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      console.log("Permission notifs:", permission);
    }
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-8 items-center justify-center text-center space-y-12"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <MapPin size={64} className="text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg"
              >
                <Sparkles size={24} className="text-amber-500" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                Trouvez les meilleurs restaurants <span className="text-primary">près de vous</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto font-sub">
                Oresto utilise votre position pour afficher les restaurants disponibles dans votre zone et calculer les frais de livraison.
              </p>
            </div>

            {!showCitySelector ? (
              <div className="w-full space-y-4">
                <button
                  onClick={handleRequestLocation}
                  disabled={loading}
                  className="w-full py-5 rounded-3xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-2"
                >
                  {loading ? "Détection..." : "Autoriser la localisation"}
                  {!loading && <ChevronRight size={18} />}
                </button>
                <button
                  onClick={() => setShowCitySelector(true)}
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors"
                >
                  Choisir ma ville manuellement
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sélectionnez votre ville</p>
                <div className="grid grid-cols-2 gap-3">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleSelectCity(city)}
                      className="py-4 rounded-2xl border border-border font-bold text-sm hover:border-black hover:bg-black hover:text-white transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-8 items-center justify-center text-center space-y-12"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <Bell size={64} className="text-primary" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                Ne ratez aucune <span className="text-primary">mise à jour</span>
              </h1>
              <div className="space-y-4 py-6">
                {[
                  { icon: Clock, text: "Statut de votre commande en temps réel" },
                  { icon: Truck, text: "Votre plat est prêt / en livraison" },
                  { icon: Star, text: "Promos et offres exclusives" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-primary" />
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="w-full space-y-4">
              <button
                onClick={handleRequestNotifications}
                className="w-full py-5 rounded-3xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl"
              >
                Activer les notifications
              </button>
              <button
                onClick={completeOnboarding}
                className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors"
              >
                Peut-être plus tard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 flex justify-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-all ${step === 1 ? "w-8 bg-black" : "bg-muted"}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${step === 2 ? "w-8 bg-black" : "bg-muted"}`} />
      </div>
    </div>
  );
}
