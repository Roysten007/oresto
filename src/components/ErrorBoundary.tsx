import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Détection automatique des erreurs de chunks périmés / mise à jour de déploiement
    const errorMsg = (error?.message || error?.toString() || "").toLowerCase();
    const isChunkError =
      errorMsg.includes("dynamically imported module") ||
      errorMsg.includes("failed to fetch dynamically imported module") ||
      errorMsg.includes("loading chunk") ||
      errorMsg.includes("loading css chunk");

    if (isChunkError && typeof window !== "undefined") {
      const rescueKey = "oresto_chunk_rescue_" + window.location.pathname;
      const now = Date.now();
      const lastAttempt = sessionStorage.getItem(rescueKey);

      // Auto-rechargement propre une seule fois pour charger la nouvelle version sans bloquer l'utilisateur
      if (!lastAttempt || now - parseInt(lastAttempt, 10) > 10000) {
        sessionStorage.setItem(rescueKey, now.toString());

        // Nettoyage complet
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((r) => r.unregister());
          });
        }
        if ("caches" in window) {
          caches.keys().then((keys) => {
            keys.forEach((k) => caches.delete(k));
          });
        }

        // Navigation forcée vers la nouvelle URL avec bust de cache
        const cleanUrl = window.location.pathname + window.location.search;
        const separator = cleanUrl.includes("?") ? "&" : "?";
        window.location.replace(cleanUrl + separator + "_v=" + now);
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-red-50 text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto text-red-500 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Oups ! Une erreur est survenue</h2>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                L'application a rencontré un problème inattendu. Ne vous inquiétez pas, vos données sont en sécurité.
              </p>
            </div>
            
            {this.state.error && (
              <div className="relative group">
                <div className="p-4 bg-gray-50 rounded-2xl text-[10px] font-mono text-gray-400 break-all text-left overflow-auto max-h-48 border border-gray-100">
                  <p className="font-bold text-red-400 mb-1">Détails techniques :</p>
                  {this.state.error.stack || this.state.error.toString()}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(this.state.error?.stack || this.state.error?.toString() || "");
                    alert("Copié ! Envoyez-moi ce texte.");
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase"
                >
                  Copier
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={async () => {
                  try {
                    if ("serviceWorker" in navigator) {
                      const registrations = await navigator.serviceWorker.getRegistrations();
                      for (const reg of registrations) {
                        await reg.unregister();
                      }
                    }
                    if ("caches" in window) {
                      const keys = await caches.keys();
                      for (const key of keys) {
                        await caches.delete(key);
                      }
                    }
                  } catch {}
                  const cleanPath = window.location.pathname + window.location.search;
                  const sep = cleanPath.includes("?") ? "&" : "?";
                  window.location.replace(cleanPath + sep + "_bust=" + Date.now());
                }}
                className="w-full py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
              >
                <RotateCcw size={16} />
                Vider le cache & Recharger
              </button>
              
              <a
                href="/login"
                onClick={(e) => { 
                  e.preventDefault();
                  this.setState({ hasError: false, error: null }); 
                  window.location.href = "/login"; 
                }}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
