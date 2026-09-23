import { usePrestataire } from "@/contexts/PrestataireContext";
import { Navigate, useLocation } from "react-router-dom";

interface PrestataireRouteProps {
  children: React.ReactNode;
}

export default function PrestataireRoute({ children }: PrestataireRouteProps) {
  const { isAuthenticated, isLoading } = usePrestataire();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
            Chargement de l'espace apporteur...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Mode Aperçu / Démo sans connexion obligatoire
    return <>{children}</>;
  }

  return <>{children}</>;
}
