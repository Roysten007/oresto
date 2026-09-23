import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { getVendorSector } from "@/lib/vendorSector";
import DashboardRestaurant from "./dashboards/DashboardRestaurant";
import DashboardEcommerce from "./dashboards/DashboardEcommerce";
import DashboardHotel from "./dashboards/DashboardHotel";

export default function VendorDashboard() {
  const { vendorProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");

  const businessType = getVendorSector(vendorProfile, sectorQuery);

  if (businessType === "ecommerce") {
    return <DashboardEcommerce />;
  }

  if (businessType === "hotel") {
    return <DashboardHotel />;
  }

  return <DashboardRestaurant />;
}
