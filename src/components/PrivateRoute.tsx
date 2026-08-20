import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: "client" | "vendor" | "admin";
}

export default function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();
  
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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole && role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
