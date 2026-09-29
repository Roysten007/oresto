import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { PrestataireProvider } from "@/contexts/PrestataireContext";
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import PrestataireRoute from "@/components/PrestataireRoute";
import ReferralTracker from "@/components/ReferralTracker";

// Critical landing page loaded synchronously for instant FCP/LCP
import ProLanding from "./pages/ProLanding";

// Secondary and dashboard pages code-split with lazy loading
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Pages Prestataires / Affiliation
const DevenirPrestataire = lazy(() => import("./pages/prestataire/DevenirPrestataire"));
const PrestataireLogin = lazy(() => import("./pages/prestataire/PrestataireLogin"));
const PrestataireDashboard = lazy(() => import("./pages/prestataire/PrestataireDashboard"));

// Vendor routes
const VendorLayout = lazy(() => import("./layouts/VendorLayout"));
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const VendorCatalogue = lazy(() => import("./pages/vendor/VendorCatalogue"));
const VendorOrders = lazy(() => import("./pages/vendor/VendorOrders"));
const VendorDelivery = lazy(() => import("./pages/vendor/VendorDelivery"));
const VendorStats = lazy(() => import("./pages/vendor/VendorStats"));
const VendorSubscription = lazy(() => import("./pages/vendor/VendorSubscription"));
const VendorSettings = lazy(() => import("./pages/vendor/VendorSettings"));
const VendorSiteBuilder = lazy(() => import("./pages/vendor/VendorSiteBuilder"));

// Admin routes
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPrestataires = lazy(() => import("./pages/admin/AdminPrestataires"));
const AdminVendors = lazy(() => import("./pages/admin/AdminVendors"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminSubscriptions = lazy(() => import("./pages/admin/AdminSubscriptions"));
const AdminRevenues = lazy(() => import("./pages/admin/AdminRevenues"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Public Restaurant Site
const RestaurantPublic = lazy(() => import("./pages/app/RestaurantPublic"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="w-8 h-8 rounded-full border-2 border-[#FF6B00] border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AdminProvider>
          <PrestataireProvider>
            <BrowserRouter>
              <ReferralTracker />
              <Suspense fallback={<RouteLoader />}>
                <Routes>
                  {/* Page de Vente Unique & Inscription Segmentée */}
                  <Route path="/" element={<ProLanding />} />
                  <Route path="/pro" element={<Navigate to="/" replace />} />
                  <Route path="/restaurant" element={<Navigate to="/register?sector=restaurant" replace />} />
                  <Route path="/resto" element={<Navigate to="/register?sector=restaurant" replace />} />
                  <Route path="/boutique" element={<Navigate to="/register?sector=ecommerce" replace />} />
                  <Route path="/ecommerce" element={<Navigate to="/register?sector=ecommerce" replace />} />
                  <Route path="/hotel" element={<Navigate to="/register?sector=hotel" replace />} />
                  <Route path="/decouvrir" element={<ProLanding />} />
                  
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Espace Apporteurs d'Affaires / Prestataires */}
                  <Route path="/devenir-prestataire" element={<DevenirPrestataire />} />
                  <Route path="/prestataire/login" element={<PrestataireLogin />} />
                  <Route path="/prestataire/dashboard" element={<PrestataireRoute><PrestataireDashboard /></PrestataireRoute>} />

                  {/* Public Restaurant Site */}
                  <Route path="/r/:slug" element={<RestaurantPublic />} />

                  {/* Vendor routes */}
                  <Route path="/vendor" element={<PrivateRoute requiredRole="vendor"><VendorLayout /></PrivateRoute>}>
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="site" element={<VendorSiteBuilder />} />
                    <Route path="builder" element={<Navigate to="/vendor/site" replace />} />
                    <Route path="catalogue" element={<VendorCatalogue />} />
                    <Route path="menu" element={<Navigate to="/vendor/catalogue" replace />} />
                    <Route path="orders" element={<VendorOrders />} />
                    <Route path="delivery" element={<VendorDelivery />} />
                    <Route path="stats" element={<VendorStats />} />
                    <Route path="subscription" element={<VendorSubscription />} />
                    <Route path="settings" element={<VendorSettings />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/oresto-admin/login" element={<AdminLogin />} />
                  <Route path="/oresto-admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="prestataires" element={<AdminPrestataires />} />
                    <Route path="vendors" element={<AdminVendors />} />
                    <Route path="clients" element={<AdminClients />} />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route path="revenues" element={<AdminRevenues />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </PrestataireProvider>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
