import { Navigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated } = useAdmin();
  if (!isAdminAuthenticated) return <Navigate to="/oresto-admin/login" replace />;
  return <>{children}</>;
}
