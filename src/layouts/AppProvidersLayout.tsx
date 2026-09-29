import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { PrestataireProvider } from "@/contexts/PrestataireContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

export default function AppProvidersLayout() {
  return (
    <AuthProvider>
      <AdminProvider>
        <PrestataireProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Outlet />
          </TooltipProvider>
        </PrestataireProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
