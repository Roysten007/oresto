import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, query, orderByChild, equalTo, get } from "firebase/database";
import { 
  ShoppingCart, 
  Share2, 
  Store, 
  X, 
  Plus, 
  Minus, 
  CheckCircle2, 
  CreditCard,
  Truck,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorProfile, Product } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getDemoShowcaseBySlug } from "@/data/demoShowcaseData";
import { slugify } from "@/lib/slugify";

// Modular Section Components
import HeroSection from "@/components/showcase/HeroSection";
import AboutSection from "@/components/showcase/AboutSection";
import MenuSection from "@/components/showcase/MenuSection";
import CatalogueSection from "@/components/showcase/CatalogueSection";
import RoomsSection from "@/components/showcase/RoomsSection";
import GallerySection from "@/components/showcase/GallerySection";
import TableReservationWidget from "@/components/showcase/TableReservationWidget";
import HotelBookingWidget from "@/components/showcase/HotelBookingWidget";
import HotelAmenitiesSection from "@/components/showcase/HotelAmenitiesSection";
import LocationHoursSection from "@/components/showcase/LocationHoursSection";
import ReviewsSection from "@/components/showcase/ReviewsSection";
import FAQSection from "@/components/showcase/FAQSection";
import ContactSection from "@/components/showcase/ContactSection";
import PublicFooter from "@/components/showcase/PublicFooter";
import ProductDetailModal from "@/components/ecommerce/ProductDetailModal";

export default function RestaurantPublic() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // E-commerce & Cart state
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", notes: "", mode: "delivery" });
  const [placingOrder, setPlacingOrder] = useState(false);

  // Hotel booking selected room helper
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<string | undefined>();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  // Détection stricte du secteur
  const businessType: "restaurant" | "ecommerce" | "hotel" = useMemo(() => {
    if (!vendor) return "restaurant";
    if (vendor.business_type === "ecommerce" || vendor.business_type === "hotel" || vendor.business_type === "restaurant") {
      return vendor.business_type;
    }
    const cat = (vendor.category || "").toLowerCase();
    if (cat.includes("boutique") || cat.includes("mode") || cat.includes("vente") || cat.includes("tech") || cat.includes("e-commerce")) {
      return "ecommerce";
    }
    if (cat.includes("hôtel") || cat.includes("hotel") || cat.includes("résidence") || cat.includes("auberge")) {
      return "hotel";
    }
    return "restaurant";
  }, [vendor]);

  // Chargement des données Firebase en temps réel
  useEffect(() => {
    if (!slug || !db) {
      setLoading(false);
      return;
    }

    let unsubVendor: (() => void) | null = null;
    let unsubProducts: (() => void) | null = null;

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 4500);

    const checkVendorBySlug = async () => {
      const cleanSlug = (slug || "").toLowerCase().trim();
      const demoCandidate = getDemoShowcaseBySlug(cleanSlug);

      let matchedVendorId = "";
      let matchedVendor: VendorProfile | null = null;

      // 1. Recherche directe dans slugs/${cleanSlug}
      try {
        const slugSnap = await get(ref(db, `slugs/${cleanSlug}`));
        if (slugSnap.exists()) {
          const val = slugSnap.val();
          const targetId = typeof val === "object" ? val?.vendorId : val;
          if (targetId) {
            matchedVendorId = targetId;
          }
        }
      } catch (e) {
        console.warn("Slugs lookup warning:", e);
      }

      // 2. Recherche par ID direct vendors/${cleanSlug}
      if (!matchedVendorId) {
        try {
          const directSnap = await get(ref(db, `vendors/${cleanSlug}`));
          if (directSnap.exists()) {
            matchedVendorId = cleanSlug;
            matchedVendor = { id: cleanSlug, ...directSnap.val() };
          }
        } catch (e) {
          console.warn("Direct vendor check warning:", e);
        }
      }

      // 3. Recherche en scannant la liste vendors si pas encore trouvé
      if (!matchedVendorId) {
        try {
          const allVendorsSnap = await get(ref(db, "vendors"));
          if (allVendorsSnap.exists()) {
            const all = allVendorsSnap.val();
            const found = Object.entries(all).find(([id, v]: [string, any]) => {
              if (!v) return false;
              const vSlug = (v.slug || "").toLowerCase().trim();
              const vNameSlug = slugify(v.name || "");
              return vSlug === cleanSlug || id.toLowerCase() === cleanSlug || vNameSlug === cleanSlug;
            });
            if (found) {
              matchedVendorId = found[0];
              matchedVendor = { id: matchedVendorId, ...(found[1] as any) };
            }
          }
        } catch (e) {
          console.warn("All vendors scan warning:", e);
        }
      }

      // 4. Si un matchedVendorId a été trouvé, écouter en temps réel vendors/${matchedVendorId}
      if (matchedVendorId) {
        unsubVendor = onValue(ref(db, `vendors/${matchedVendorId}`), (snap) => {
          if (snap.exists()) {
            const val = snap.val();
            const vData: VendorProfile = { id: matchedVendorId, ...val };
            const owner = user?.vendorId === matchedVendorId || user?.id === vData.userId;
            setIsOwner(owner);
            setVendor(vData);
            clearTimeout(timeout);
            setLoading(false);
          } else if (matchedVendor) {
            setVendor(matchedVendor);
            clearTimeout(timeout);
            setLoading(false);
          }
        });

        // Écouter les produits pour ce vendeur (filtrage en mémoire fiable à 100%)
        if (unsubProducts) unsubProducts();
        unsubProducts = onValue(ref(db, "products"), (prodSnap) => {
          let list: Product[] = [];
          if (prodSnap.exists()) {
            const all = prodSnap.val();
            list = Object.keys(all)
              .map(k => ({ id: k, ...all[k] }))
              .filter((p: any) => p.vendorId === matchedVendorId && p.available !== false);
          }

          if (list.length > 0) {
            setProducts(list);
            return;
          }

          // Fallback localStorage pour ce vendeur
          try {
            const localSaved = localStorage.getItem(`oresto_products_${matchedVendorId}`);
            if (localSaved) {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setProducts(parsed);
                return;
              }
            }
          } catch {}

          // Fallback démo si disponible
          if (demoCandidate && demoCandidate.products.length > 0) {
            setProducts(demoCandidate.products);
          }
        });
        return;
      }

      // 5. Fallback localStorage pour prévisualisation immédiate sans latence réseau
      try {
        const localSaved = localStorage.getItem("oresto_vendor_profile");
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          const parsedSlug = (parsed.slug || slugify(parsed.name || "")).toLowerCase().trim();
          if (parsedSlug === cleanSlug || parsed.id === cleanSlug || cleanSlug === "demo") {
            const owner = user?.vendorId === parsed.id || user?.id === parsed.userId;
            setIsOwner(owner);
            setVendor(parsed);
            clearTimeout(timeout);
            setLoading(false);

            // Charger les produits locaux
            const localProds = localStorage.getItem(`oresto_products_${parsed.id || "v_demo"}`);
            if (localProds) {
              const pList = JSON.parse(localProds);
              if (Array.isArray(pList) && pList.length > 0) {
                setProducts(pList);
                return;
              }
            }
          }
        }
      } catch {}

      // 6. Fallback vitrines de démonstration préconfigurées
      if (demoCandidate) {
        setVendor(demoCandidate.vendor);
        setProducts(demoCandidate.products);
        clearTimeout(timeout);
        setLoading(false);
        return;
      }

      // 7. Si vraiment introuvable
      clearTimeout(timeout);
      setLoading(false);
    };

    checkVendorBySlug();

    return () => {
      clearTimeout(timeout);
      if (unsubVendor) unsubVendor();
      if (unsubProducts) unsubProducts();
    };
  }, [slug, user]);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleAddToCartWithVariants = (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
    const variantStr = Object.entries(selectedVariants).length > 0
      ? ` (${Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")})`
      : "";
    const customProduct = { ...product, name: `${product.name}${variantStr}` };

    setCart(prev => {
      const existing = prev.find(i => i.product.name === customProduct.name);
      if (existing) {
        return prev.map(i => i.product.name === customProduct.name ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { product: customProduct, qty: quantity }];
    });
    toast.success(`${quantity}x ${customProduct.name} ajouté au panier`);
  };

  const handleInstantBuy = (product: Product, quantity: number, selectedVariants: Record<string, string>) => {
    handleAddToCartWithVariants(product, quantity, selectedVariants);
    setShowOrderForm(true);
  };

  const handleBookRoom = (room: Product) => {
    setSelectedRoomForBooking(room.id);
    const bookingElement = document.getElementById("booking");
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShare = async () => {
    if (navigator.share && vendor) {
      try {
        await navigator.share({
          title: vendor.name,
          text: vendor.description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-heading font-black text-xs uppercase tracking-widest text-gray-500">
          Chargement de la vitrine...
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl">
          <Store size={36} />
        </div>
        <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-gray-900">
          Établissement Introuvable
        </h1>
        <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
          Cette vitrine n'existe pas ou le lien est temporairement indisponible.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-primary transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const themeFont = vendor.font_choice === "elegant" 
    ? "'Cormorant Garamond', serif" 
    : vendor.font_choice === "bold" 
    ? "'Montserrat', sans-serif" 
    : "'Inter', sans-serif";

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-body text-gray-900 selection:bg-primary selection:text-white" style={{ fontFamily: themeFont }}>
      
      {/* Top Shipping Bar for E-Commerce */}
      {businessType === "ecommerce" && (
        <div className="bg-black text-white px-4 py-2 text-[11px] font-bold text-center flex items-center justify-center gap-2">
          <i className="fa-solid fa-truck-fast text-primary"></i>
          <span>Livraison Express • Retours sous 48h • Encaissement Mobile Money Direct 100% Sécurisé</span>
        </div>
      )}

      {/* Floating Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 border-b border-gray-150 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs shrink-0">
            <img
              src={vendor.logo_url || `https://ui-avatars.com/api/?name=${vendor.name}`}
              className="w-full h-full object-cover"
              alt={vendor.name}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading font-black text-sm text-gray-900 leading-tight truncate max-w-[170px] sm:max-w-xs">
              {vendor.name}
            </h1>
            <p className="text-[10px] text-gray-500 font-medium truncate">
              {vendor.neighborhood || "Haie Vive"}, {vendor.city || "Cotonou"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-xs transition-colors"
            title="Partager la vitrine"
          >
            <Share2 size={16} />
          </button>

          {vendor.whatsapp && (
            <a
              href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#25D366] text-white text-xs font-heading font-black tracking-wide flex items-center gap-1.5 shadow-sm hover:bg-[#20bd5a] transition-all"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🍽️ SECTEUR RESTAURANT — 10 SECTIONS STRICTES */}
      {/* ========================================================================= */}
      {businessType === "restaurant" && (
        <main>
          {/* 1. Hero */}
          <HeroSection
            vendor={vendor}
            businessType="restaurant"
            onPrimaryCta={() => {
              const res = document.getElementById("reservation");
              if (res) res.scrollIntoView({ behavior: "smooth" });
            }}
            onSecondaryCta={() => {
              const menu = document.getElementById("menu");
              if (menu) menu.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* 2. À propos */}
          <AboutSection vendor={vendor} businessType="restaurant" />

          {/* 3. Menu / Carte */}
          <MenuSection products={products} vendor={vendor} onAddToCart={handleAddToCart} />

          {/* 4. Galerie photos */}
          <GallerySection vendor={vendor} businessType="restaurant" />

          {/* 5. Réservation de table */}
          <TableReservationWidget vendor={vendor} />

          {/* 6. Localisation & horaires */}
          <LocationHoursSection vendor={vendor} businessType="restaurant" />

          {/* 7. Avis clients */}
          <ReviewsSection vendor={vendor} businessType="restaurant" />

          {/* 8. FAQ */}
          <FAQSection vendor={vendor} businessType="restaurant" />

          {/* 9. Contact */}
          <ContactSection vendor={vendor} businessType="restaurant" />

          {/* 10. Footer */}
          <PublicFooter vendor={vendor} businessType="restaurant" />
        </main>
      )}

      {/* ========================================================================= */}
      {/* 🛍️ SECTEUR BOUTIQUE — 11 SECTIONS STRICTES */}
      {/* ========================================================================= */}
      {businessType === "ecommerce" && (
        <main>
          {/* 1. Hero */}
          <HeroSection
            vendor={vendor}
            businessType="ecommerce"
            onPrimaryCta={() => {
              const cat = document.getElementById("catalogue");
              if (cat) cat.scrollIntoView({ behavior: "smooth" });
            }}
            onSecondaryCta={() => {
              const cont = document.getElementById("contact");
              if (cont) cont.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* 2. À propos */}
          <AboutSection vendor={vendor} businessType="ecommerce" />

          {/* 3. Catalogue produits */}
          <CatalogueSection
            products={products}
            vendor={vendor}
            onSelectProduct={setSelectedProductForModal}
            onQuickAddToCart={handleAddToCart}
          />

          {/* 4. Fiche produit (Modal détaillée) */}
          <ProductDetailModal
            product={selectedProductForModal}
            isOpen={Boolean(selectedProductForModal)}
            onClose={() => setSelectedProductForModal(null)}
            onAddToCart={handleAddToCartWithVariants}
            onInstantBuy={handleInstantBuy}
            primaryColor={vendor.primary_color || "#000000"}
          />

          {/* 5. Panier / Commande géré via le bouton flottant et le modal de commande ci-dessous */}

          {/* 6. Galerie / Lookbook */}
          <GallerySection vendor={vendor} businessType="ecommerce" />

          {/* 7. Localisation & horaires */}
          <LocationHoursSection vendor={vendor} businessType="ecommerce" />

          {/* 8. Avis clients */}
          <ReviewsSection vendor={vendor} businessType="ecommerce" />

          {/* 9. FAQ */}
          <FAQSection vendor={vendor} businessType="ecommerce" />

          {/* 10. Contact */}
          <ContactSection vendor={vendor} businessType="ecommerce" />

          {/* 11. Footer */}
          <PublicFooter vendor={vendor} businessType="ecommerce" />
        </main>
      )}

      {/* ========================================================================= */}
      {/* 🏨 SECTEUR HÔTEL & AUBERGE — 11 SECTIONS STRICTES */}
      {/* ========================================================================= */}
      {businessType === "hotel" && (
        <main>
          {/* 1. Hero */}
          <HeroSection
            vendor={vendor}
            businessType="hotel"
            onPrimaryCta={() => {
              const book = document.getElementById("booking");
              if (book) book.scrollIntoView({ behavior: "smooth" });
            }}
            onSecondaryCta={() => {
              const rooms = document.getElementById("rooms");
              if (rooms) rooms.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {/* 2. À propos */}
          <AboutSection vendor={vendor} businessType="hotel" />

          {/* 3. Chambres / Types d'hébergement */}
          <RoomsSection rooms={products} vendor={vendor} onBookRoom={handleBookRoom} />

          {/* 4. Calendrier de disponibilité & Réservation en direct */}
          <HotelBookingWidget rooms={products} vendor={vendor} selectedRoomId={selectedRoomForBooking} />

          {/* 5. Équipements & services */}
          <HotelAmenitiesSection vendor={vendor} />

          {/* 6. Galerie photos */}
          <GallerySection vendor={vendor} businessType="hotel" />

          {/* 7. Localisation & Points d'intérêt */}
          <LocationHoursSection vendor={vendor} businessType="hotel" />

          {/* 8. Avis clients */}
          <ReviewsSection vendor={vendor} businessType="hotel" />

          {/* 9. FAQ */}
          <FAQSection vendor={vendor} businessType="hotel" />

          {/* 10. Contact */}
          <ContactSection vendor={vendor} businessType="hotel" />

          {/* 11. Footer */}
          <PublicFooter vendor={vendor} businessType="hotel" />
        </main>
      )}

      {/* ========================================================================= */}
      {/* 🛒 PANIER FLOTTANT & COMMANDE MOMO (POUR RESTAURANT & BOUTIQUE) */}
      {/* ========================================================================= */}
      {totalItems > 0 && (
        <div className="fixed bottom-5 left-4 right-4 z-40 max-w-md mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-3.5 bg-[#0A0A0A] text-white rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/10"
          >
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center text-sm font-black shadow-md">
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Votre Panier</p>
                <p className="font-heading font-black text-sm text-white">{totalPrice.toLocaleString()} FCFA</p>
              </div>
            </div>

            <button
              onClick={() => setShowOrderForm(true)}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <CreditCard size={14} />
              <span>Commander</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal Finalisation de Commande */}
      <AnimatePresence>
        {showOrderForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-heading font-black text-base text-gray-900">Finaliser votre commande</h3>
                <button onClick={() => setShowOrderForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <X size={16} />
                </button>
              </div>

              {/* Récapitulatif Panier */}
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                    <span className="font-bold text-gray-800">{item.qty}x {item.product.name}</span>
                    <span className="font-black text-primary">{(item.product.price * item.qty).toLocaleString()} F</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 text-xs flex justify-between font-black">
                <span>Total à régler :</span>
                <span className="text-primary font-heading text-sm">{totalPrice.toLocaleString()} FCFA</span>
              </div>

              {/* Formulaire Client */}
              <div className="space-y-3 text-xs">
                {businessType === "ecommerce" && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderForm({ ...orderForm, mode: "delivery" })}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                        orderForm.mode === "delivery" ? "bg-black text-white border-black" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      <Truck size={14} />
                      <span>Livraison Express</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderForm({ ...orderForm, mode: "pickup" })}
                      className={`p-2.5 rounded-xl border font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                        orderForm.mode === "pickup" ? "bg-black text-white border-black" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}
                    >
                      <Building2 size={14} />
                      <span>Retrait Boutique</span>
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Votre Nom complet *</label>
                  <input
                    type="text"
                    value={orderForm.name}
                    onChange={e => setOrderForm({ ...orderForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-primary"
                    placeholder="Ex: Jean Houndété"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Numéro Téléphone / WhatsApp *</label>
                  <input
                    type="tel"
                    value={orderForm.phone}
                    onChange={e => setOrderForm({ ...orderForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 font-bold outline-none focus:border-primary"
                    placeholder="+229 97 00 00 00"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    {orderForm.mode === "pickup" ? "Remarques éventuelles" : "Adresse de livraison *"}
                  </label>
                  <input
                    type="text"
                    value={orderForm.notes}
                    onChange={e => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs outline-none focus:border-primary"
                    placeholder={orderForm.mode === "pickup" ? "Heure de passage..." : "Quartier, repère, indications..."}
                  />
                </div>
              </div>

              {/* Bouton de confirmation */}
              <button
                type="button"
                disabled={!orderForm.name.trim() || !orderForm.phone.trim() || placingOrder}
                onClick={async () => {
                  if (!db || !vendor?.id) return;
                  setPlacingOrder(true);
                  try {
                    const newOrderRef = push(ref(db, "orders"));
                    await set(newOrderRef, {
                      id: newOrderRef.key,
                      vendorId: vendor.id,
                      vendorName: vendor.name,
                      clientName: orderForm.name.trim(),
                      clientPhone: orderForm.phone.trim(),
                      address: orderForm.mode === "pickup" ? "Retrait en boutique" : (orderForm.notes.trim() || "Livraison"),
                      items: cart.map(i => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
                      total: totalPrice,
                      status: "payment_sent",
                      paymentMethod: "Mobile Money Direct",
                      date: new Date().toISOString()
                    });

                    toast.success("Commande validée ! Redirection WhatsApp en cours...");
                    const rawPhone = (vendor.whatsapp || vendor.phone || "").replace(/\D/g, "");
                    const itemsList = cart.map(i => `• ${i.qty}x ${i.product.name} (${(i.product.price * i.qty).toLocaleString()} F)`).join("\n");
                    const modeLabel = orderForm.mode === "pickup" ? "Retrait en boutique" : `Livraison à : ${orderForm.notes.trim()}`;
                    const msg = encodeURIComponent(
                      `Bonjour *${vendor.name}* !\nJe viens de commander sur votre vitrine :\n\n${itemsList}\n\n*Total : ${totalPrice.toLocaleString()} FCFA*\n👤 Nom : ${orderForm.name.trim()}\n📞 Tél : ${orderForm.phone.trim()}\n📦 Mode : ${modeLabel}\n\nEnvoyé depuis Oresto Connect.`
                    );

                    setShowOrderForm(false);
                    setCart([]);
                    if (rawPhone) {
                      window.open(`https://wa.me/${rawPhone}?text=${msg}`, "_blank");
                    }
                  } finally {
                    setPlacingOrder(false);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-bolt"></i>
                <span>{placingOrder ? "Envoi en cours..." : "Confirmer et Payer par MoMo"}</span>
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
