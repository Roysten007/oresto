import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

/**
 * Layout ultra-résilient dédié aux vitrines publiques (/r/:slug).
 * Ne charge que le strict nécessaire (Auth pour détecter si l'utilisateur est le gérant, Toasts et Tooltips).
 * Découple totalement les visiteurs publics des contextes Admin et Prestataire.
 */
export default function PublicShowcaseLayout() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </AuthProvider>
  );
}
