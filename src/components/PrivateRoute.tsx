import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: "client" | "vendor";
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  // Accès direct et illimité sans blocage d'authentification
  return <>{children}</>;
}
