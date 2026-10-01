import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, isAdminLoading } = useAdmin();
  const location = useLocation();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/oresto-admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
