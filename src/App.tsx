import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ReferralTracker from "@/components/ReferralTracker";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

// Critical landing page loaded directly without Firebase for fastest LCP & 0 KB unused JS
import ProLanding from "./pages/ProLanding";

// Helper de chargement dynamique résilient avec auto-récupération sur mise à jour de build
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error: any) {
      console.warn("Module dynamique temporairement indisponible, auto-récupération...", error);
      if (typeof window !== "undefined") {
        const key = "oresto_chunk_retry_" + window.location.pathname;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "true");
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw error;
    }
  });

// Lazy-loaded App Providers (AuthProvider, AdminProvider, PrestataireProvider, Toaster)
// Only loaded when navigating to authenticated/app sections, keeping landing page ultra-light
const AppProvidersLayout = lazyWithRetry(() => import("./layouts/AppProvidersLayout"));
const PublicShowcaseLayout = lazyWithRetry(() => import("./layouts/PublicShowcaseLayout"));

// Secondary and dashboard pages code-split with lazy loading
const Login = lazyWithRetry(() => import("./pages/Login"));
const Register = lazyWithRetry(() => import("./pages/Register"));
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword"));
const Unauthorized = lazyWithRetry(() => import("./pages/Unauthorized"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

// Pages Prestataires / Affiliation
const DevenirPrestataire = lazyWithRetry(() => import("./pages/prestataire/DevenirPrestataire"));
const PrestataireLogin = lazyWithRetry(() => import("./pages/prestataire/PrestataireLogin"));
const PrestataireDashboard = lazyWithRetry(() => import("./pages/prestataire/PrestataireDashboard"));
const PrestataireRoute = lazyWithRetry(() => import("@/components/PrestataireRoute"));

// Vendor routes
const PrivateRoute = lazyWithRetry(() => import("@/components/PrivateRoute"));
const VendorLayout = lazyWithRetry(() => import("./layouts/VendorLayout"));
const VendorDashboard = lazyWithRetry(() => import("./pages/vendor/VendorDashboard"));
const VendorCatalogue = lazyWithRetry(() => import("./pages/vendor/VendorCatalogue"));
const VendorOrders = lazyWithRetry(() => import("./pages/vendor/VendorOrders"));
const VendorDelivery = lazyWithRetry(() => import("./pages/vendor/VendorDelivery"));
const VendorStats = lazyWithRetry(() => import("./pages/vendor/VendorStats"));
const VendorSubscription = lazyWithRetry(() => import("./pages/vendor/VendorSubscription"));
const VendorSettings = lazyWithRetry(() => import("./pages/vendor/VendorSettings"));
const VendorSiteBuilder = lazyWithRetry(() => import("./pages/vendor/VendorSiteBuilder"));
const NewEstablishment = lazyWithRetry(() => import("./pages/vendor/NewEstablishment"));

// Admin routes
const AdminRoute = lazyWithRetry(() => import("@/components/AdminRoute"));
const AdminLayout = lazyWithRetry(() => import("./layouts/AdminLayout"));
const AdminLogin = lazyWithRetry(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazyWithRetry(() => import("./pages/admin/AdminDashboard"));
const AdminPrestataires = lazyWithRetry(() => import("./pages/admin/AdminPrestataires"));
const AdminVendors = lazyWithRetry(() => import("./pages/admin/AdminVendors"));
const AdminClients = lazyWithRetry(() => import("./pages/admin/AdminClients"));
const AdminSubscriptions = lazyWithRetry(() => import("./pages/admin/AdminSubscriptions"));
const AdminRevenues = lazyWithRetry(() => import("./pages/admin/AdminRevenues"));
const AdminOrders = lazyWithRetry(() => import("./pages/admin/AdminOrders"));
const AdminCategories = lazyWithRetry(() => import("./pages/admin/AdminCategories"));
const AdminNotifications = lazyWithRetry(() => import("./pages/admin/AdminNotifications"));
const AdminSettings = lazyWithRetry(() => import("./pages/admin/AdminSettings"));

// Public Restaurant Site
const RestaurantPublic = lazyWithRetry(() => import("./pages/app/RestaurantPublic"));

// Oresto Insights - Étude de marché Bénin (Public & Admin)
const SurveyPublic = lazyWithRetry(() => import("./pages/insights/SurveyPublic"));
const InsightsAdminDashboard = lazyWithRetry(() => import("./pages/insights/admin/InsightsAdminDashboard"));

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
    <BrowserRouter>
      <ReferralTracker />
      <PWAInstallPrompt />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Public Landing Routes — 100% Free of Firebase, Admin & Prestataire bundle overhead */}
          <Route path="/" element={<ProLanding />} />
          <Route path="/pro" element={<Navigate to="/" replace />} />
          <Route path="/restaurant" element={<Navigate to="/register?sector=restaurant" replace />} />
          <Route path="/resto" element={<Navigate to="/register?sector=restaurant" replace />} />
          <Route path="/boutique" element={<Navigate to="/register?sector=ecommerce" replace />} />
          <Route path="/ecommerce" element={<Navigate to="/register?sector=ecommerce" replace />} />
          <Route path="/hotel" element={<Navigate to="/register?sector=hotel" replace />} />
          <Route path="/decouvrir" element={<ProLanding />} />

          {/* App & Authenticated Routes — Lazy-loads AuthProvider, Firebase & Toasts on demand */}
          <Route element={<AppProvidersLayout />}>
            {/* Oresto Insights — Questionnaire Public Étude de Marché Bénin */}
            <Route path="/survey" element={<SurveyPublic />} />
            <Route path="/insights" element={<SurveyPublic />} />
            <Route path="/etude" element={<SurveyPublic />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Espace Apporteurs d'Affaires / Prestataires */}
            <Route path="/devenir-prestataire" element={<DevenirPrestataire />} />
            <Route path="/prestataire/login" element={<PrestataireLogin />} />
            <Route path="/prestataire/dashboard" element={<PrestataireRoute><PrestataireDashboard /></PrestataireRoute>} />
          </Route>

          {/* Public Restaurant / Showcase Site — 100% Isolated from Admin & Prestataire contexts */}
          <Route element={<PublicShowcaseLayout />}>
            <Route path="/r/:slug" element={<RestaurantPublic />} />
          </Route>

          <Route element={<AppProvidersLayout />}>

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
              <Route path="establishments/new" element={<NewEstablishment />} />
              <Route path="new-establishment" element={<NewEstablishment />} />
            </Route>

            {/* Admin routes */}
            <Route path="/oresto-admin/login" element={<AdminLogin />} />
            <Route path="/oresto-admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="insights" element={<InsightsAdminDashboard />} />
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
