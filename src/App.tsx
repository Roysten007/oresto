import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ClientProvider } from "@/contexts/ClientContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import AIChatBot from "@/components/AIChatBot";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import ClientLayout from "./layouts/ClientLayout";
import ClientHome from "./pages/app/ClientHome";
import ClientSearch from "./pages/app/ClientSearch";
import ShopDetail from "./pages/app/ShopDetail";
import Cart from "./pages/app/Cart";
import OrderTracking from "./pages/app/OrderTracking";
import RateOrder from "./pages/app/RateOrder";
import OrdersList from "./pages/app/OrdersList";
import Favorites from "./pages/app/Favorites";
import Profile from "./pages/app/Profile";
import Notifications from "./pages/app/Notifications";
import Messages from "./pages/app/Messages";
import Addresses from "./pages/app/Addresses";
import Payments from "./pages/app/Payments";
import HelpCenter from "./pages/app/HelpCenter";
import Privacy from "./pages/app/Privacy";

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
import AdminVendors from "./pages/admin/AdminVendors";
import AdminClients from "./pages/admin/AdminClients";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminRevenues from "./pages/admin/AdminRevenues";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

import Decouvrir from "./pages/app/Decouvrir";
import RestaurantPublic from "./pages/app/RestaurantPublic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <OrderProvider>
          <AdminProvider>
            <ClientProvider>
              <CartProvider>
                <BrowserRouter>
                  <AIChatBot />
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Public Restaurant Site */}
                    <Route path="/r/:slug" element={<RestaurantPublic />} />

                    {/* Client routes */}
                    <Route path="/app" element={<PrivateRoute><ClientLayout /></PrivateRoute>}>
                      <Route path="home" element={<ClientHome />} />
                      <Route path="decouvrir" element={<Decouvrir />} />
                      <Route path="search" element={<ClientSearch />} />
                      <Route path="shop/:id" element={<ShopDetail />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="order/:id" element={<OrderTracking />} />
                      <Route path="rate/:orderId" element={<RateOrder />} />
                      <Route path="orders" element={<OrdersList />} />
                      <Route path="favorites" element={<Favorites />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="notifications" element={<Notifications />} />
                      <Route path="messages" element={<Messages />} />
                      <Route path="addresses" element={<Addresses />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="help" element={<HelpCenter />} />
                      <Route path="privacy" element={<Privacy />} />
                    </Route>

                    {/* Vendor routes */}
                    <Route path="/vendor" element={<PrivateRoute requiredRole="vendor"><VendorLayout /></PrivateRoute>}>
                      <Route path="dashboard" element={<VendorDashboard />} />
                      <Route path="site" element={<VendorSiteBuilder />} />
                      <Route path="catalogue" element={<VendorCatalogue />} />
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
              </CartProvider>
            </ClientProvider>
          </AdminProvider>
        </OrderProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
