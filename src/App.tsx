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
import ReferralTracker from "@/components/ReferralTracker";

import ProLanding from "./pages/ProLanding";
import LandingRestaurant from "./pages/LandingRestaurant";
import LandingEcommerce from "./pages/LandingEcommerce";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Pages Prestataires / Affiliation
import DevenirPrestataire from "./pages/prestataire/DevenirPrestataire";
import PrestataireLogin from "./pages/prestataire/PrestataireLogin";
import PrestataireDashboard from "./pages/prestataire/PrestataireDashboard";

import VendorLayout from "./layouts/VendorLayout";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorCatalogue from "./pages/vendor/VendorCatalogue";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorDelivery from "./pages/vendor/VendorDelivery";
import VendorStats from "./pages/vendor/VendorStats";
import VendorSubscription from "./pages/vendor/VendorSubscription";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorSiteBuilder from "./pages/vendor/VendorSiteBuilder";

import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrestataires from "./pages/admin/AdminPrestataires";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminClients from "./pages/admin/AdminClients";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminRevenues from "./pages/admin/AdminRevenues";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

import RestaurantPublic from "./pages/app/RestaurantPublic";

const queryClient = new QueryClient();

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
                <Route path="/prestataire/dashboard" element={<PrestataireDashboard />} />

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
            </BrowserRouter>
          </PrestataireProvider>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
