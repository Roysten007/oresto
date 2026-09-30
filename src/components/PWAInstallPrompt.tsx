import { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Vérifier si l'application est déjà installée / exécutée en mode standalone
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Détection iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isIosDevice && !/crios|fxios|opios/.test(userAgent) && /safari/.test(userAgent);
    setIsIOS(isSafari);

    // 3. Écoute de l'événement PWA standard (Android Chrome / Edge / Windows)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Vérifier si l'utilisateur a fermé le bandeau il y a moins de 5 jours
      const dismissedAt = localStorage.getItem("oresto_pwa_dismissed_time");
      if (dismissedAt) {
        const daysDiff = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        if (daysDiff < 5) return;
      }

      // Afficher après un court délai pour ne pas agresser au premier millième de seconde
      setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Si on est sur iOS Safari et qu'il n'a pas été masqué récemment
    if (isSafari) {
      const dismissedAt = localStorage.getItem("oresto_pwa_dismissed_time");
      if (!dismissedAt || (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24) >= 5) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 4000);
      }
    }

    // 4. Écouteur pour déclenchement manuel (ex: bouton dans le footer ou les paramètres)
    const handleManualTrigger = () => {
      if (isSafari) {
        setShowIOSGuide(true);
      } else {
        setShowPrompt(true);
      }
    };
    window.addEventListener("open-pwa-install", handleManualTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowIOSGuide(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("open-pwa-install", handleManualTrigger);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback si l'événement n'a pas été capturé (navigateurs tiers)
      setShowIOSGuide(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    } catch {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    try {
      localStorage.setItem("oresto_pwa_dismissed_time", Date.now().toString());
    } catch {}
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Bandeau d'installation flottant en bas de l'écran */}
      <AnimatePresence>
        {showPrompt && !showIOSGuide && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
          >
            <div className="bg-[#0A0A0A]/95 text-white backdrop-blur-xl border border-white/15 p-4 rounded-3xl shadow-2xl shadow-black/50 flex flex-col gap-3">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-xl shadow-lg shrink-0">
                    O
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-black text-sm text-white leading-tight">
                        Installer l'application Oresto
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FF6B00]/20 text-[#FF6B00]">
                        Web App
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-sub mt-0.5 leading-snug">
                      Ajoutez l'icône sur votre écran d'accueil sans passer par le Play Store.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
                  aria-label="Fermer l'invitation d'installation"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#EA580C] text-white font-heading font-bold text-xs shadow-md shadow-[#FF6B00]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Download size={14} />
                  <span>Installer sur mon mobile</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-sub font-semibold transition-colors"
                >
                  Plus tard
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Guide d'installation pas-à-pas pour iOS Safari & Navigateurs manuels */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 text-zinc-900 font-sub"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-lg">
                    O
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-zinc-950">
                      Installer Oresto sur votre mobile
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      Sans passer par Google Play Store ou App Store
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition-colors"
                  aria-label="Fermer le guide d'installation"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-zinc-700">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950">Appuyez sur « Partager »</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>Touchez l'icône</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-zinc-300 text-zinc-900 font-semibold text-[10px]">
                        <Share2 size={11} className="text-blue-500" /> Partager
                      </span>
                      <span>dans la barre en bas de votre navigateur.</span>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950">Choisissez « Sur l'écran d'accueil »</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>Faites défiler le menu et appuyez sur</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-zinc-300 text-zinc-900 font-semibold text-[10px]">
                        <PlusSquare size={11} className="text-zinc-800" /> Sur l'écran d'accueil
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950">Appuyez sur « Ajouter »</p>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      L'icône Oresto sera immédiatement disponible sur votre écran d'accueil avec un lancement ultra-rapide en plein écran.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-heading font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} />
                  <span>J'ai compris</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
