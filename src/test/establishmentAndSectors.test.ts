import { describe, it, expect } from "vitest";
import { getVendorSector, getStarterProducts, isProductMatchingSector, BusinessSector } from "../lib/vendorSector";
import { slugify } from "../lib/slugify";
import { VendorProfile } from "../data/mockData";

describe("Establishment & Sector Management Tests", () => {
  it("should extract correct sector from vendor profile or fallback correctly", () => {
    const restoProfile = { business_type: "restaurant" } as VendorProfile;
    const ecomProfile = { business_type: "ecommerce" } as VendorProfile;
    const hotelProfile = { business_type: "hotel" } as VendorProfile;

    expect(getVendorSector(restoProfile)).toBe("restaurant");
    expect(getVendorSector(ecomProfile)).toBe("ecommerce");
    expect(getVendorSector(hotelProfile)).toBe("hotel");

    // Quand le profil n'a pas de business_type défini, searchParam prend le relais
    expect(getVendorSector(null, "ecommerce")).toBe("ecommerce");
    expect(getVendorSector(null, "hotel")).toBe("hotel");
    expect(getVendorSector(null, "restaurant")).toBe("restaurant");
  });

  it("should generate proper starter products for all 3 business sectors", () => {
    const testVendorId = "v_test_owner_999";

    const restoProducts = getStarterProducts("restaurant", testVendorId);
    expect(restoProducts.length).toBeGreaterThanOrEqual(3);
    restoProducts.forEach(p => {
      expect(p.vendorId).toBe(testVendorId);
      expect(p.price).toBeGreaterThan(0);
      expect(isProductMatchingSector(p, "restaurant")).toBe(true);
    });

    const ecomProducts = getStarterProducts("ecommerce", testVendorId);
    expect(ecomProducts.length).toBeGreaterThanOrEqual(3);
    ecomProducts.forEach(p => {
      expect(p.vendorId).toBe(testVendorId);
      expect(p.price).toBeGreaterThan(0);
      expect(isProductMatchingSector(p, "ecommerce")).toBe(true);
    });

    const hotelRooms = getStarterProducts("hotel", testVendorId);
    expect(hotelRooms.length).toBeGreaterThanOrEqual(2);
    hotelRooms.forEach(p => {
      expect(p.vendorId).toBe(testVendorId);
      expect(p.price).toBeGreaterThan(0);
      expect(isProductMatchingSector(p, "hotel")).toBe(true);
    });
  });

  it("should generate valid and clean slugs for establishment URLs", () => {
    expect(slugify("Le Grand Maquis Étoilé")).toBe("le-grand-maquis-etoile");
    expect(slugify("KiffStyle & Sneakers Store !")).toBe("kiffstyle-sneakers-store");
    expect(slugify("Palmier Royal Suites & Spa (Cotonou)")).toBe("palmier-royal-suites-spa-cotonou");
  });
});
