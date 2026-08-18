import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import DashboardRestaurant from "./dashboards/DashboardRestaurant";
import DashboardEcommerce from "./dashboards/DashboardEcommerce";
import DashboardHotel from "./dashboards/DashboardHotel";

export default function VendorDashboard() {
  const { vendorProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");

  // Détection du secteur d'activité (profil du vendeur ou query param pour tester)
  const businessType = sectorQuery || vendorProfile?.business_type || 
    ((vendorProfile?.category || "").toLowerCase().includes("boutique") ||
     (vendorProfile?.category || "").toLowerCase().includes("mode") ||
     (vendorProfile?.category || "").toLowerCase().includes("tech") ||
     (vendorProfile?.category || "").toLowerCase().includes("e-commerce") ? "ecommerce" : 
     (vendorProfile?.category || "").toLowerCase().includes("hôtel") ||
     (vendorProfile?.category || "").toLowerCase().includes("hotel") ? "hotel" : "restaurant");

  if (businessType === "ecommerce") {
    return <DashboardEcommerce />;
  }

  if (businessType === "hotel") {
    return <DashboardHotel />;
  }

  return <DashboardRestaurant />;
}
