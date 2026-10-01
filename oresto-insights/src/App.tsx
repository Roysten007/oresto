import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminRoute from "@/components/AdminRoute";
import { Toaster } from "sonner";

const SurveyPublic = lazy(() => import("./pages/SurveyPublic"));
const InsightsAdminDashboard = lazy(() => import("./pages/admin/InsightsAdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

export default function App() {
  return (
    <AdminProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Le questionnaire public est directement à la racine de cette application */}
            <Route path="/" element={<SurveyPublic />} />
            <Route path="/survey" element={<SurveyPublic />} />
            <Route path="/etude" element={<SurveyPublic />} />

            {/* Espace Administrateur Sécurisé */}
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <InsightsAdminDashboard />
                </AdminRoute>
              }
            />

            {/* Redirection vers l'étude pour toute route inconnue */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminProvider>
  );
}
