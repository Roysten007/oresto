import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, isAdminLoading } = useAdmin();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Permettre l'accès en mode aperçu/démonstration du portail Admin sans forcer le login
  return <>{children}</>;
}
