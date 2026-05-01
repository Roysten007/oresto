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
                onClick={() => window.location.reload()}
                className="w-full py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
              >
                <RotateCcw size={16} />
                Recharger l'application
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
