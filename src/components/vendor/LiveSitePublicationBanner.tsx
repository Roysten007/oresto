import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { db } from "@/lib/firebase";
import { ref, update, set } from "firebase/database";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";
import { 
  Globe, 
  ExternalLink, 
  Copy, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  Sparkles,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LiveSitePublicationBannerProps {
  vendorProfile: VendorProfile | null;
  businessType: "restaurant" | "ecommerce" | "hotel";
  productsCount?: number;
}

export default function LiveSitePublicationBanner({
  vendorProfile,
  businessType,
  productsCount = 0,
}: LiveSitePublicationBannerProps) {
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTogglingOpen, setIsTogglingOpen] = useState(false);

  const vendorId = vendorProfile?.id || "";
  const shopName = vendorProfile?.name || "Mon établissement";
  const slug = vendorProfile?.slug || slugify(shopName) || vendorId;
  const isPublished = vendorProfile?.is_published !== false;
  const isOpen = vendorProfile?.open !== false;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://oresto.app";
  const fullPublicUrl = `${origin}/r/${slug}`;
  const displayUrl = `${typeof window !== "undefined" ? window.location.host : "oresto.app"}/r/${slug}`;

  // Copier le lien
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullPublicUrl);
    toast.success("Lien de votre vitrine copié dans le presse-papier !");
  };

  // Partager sur WhatsApp
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `👋 Bonjour ! Découvrez notre catalogue en ligne et commandez directement chez *${shopName}* :\n\n🔗 ${fullPublicUrl}\n\n📱 Paiement sécurisé Mobile Money (0% de frais) !`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // Publier la vitrine en 1 clic
  const handlePublishNow = async () => {
    if (!db || !vendorId) return;
    setIsPublishing(true);
    try {
      const cleanSlug = slugify(slug || shopName);
      await update(ref(db, `vendors/${vendorId}`), {
        is_published: true,
        open: true,
        status: "active",
        slug: cleanSlug,
      });
      await set(ref(db, `slugs/${cleanSlug}`), { vendorId });
      toast.success("🎉 Votre vitrine est désormais publiée et accessible en direct !");
    } catch {
      toast.error("Erreur lors de la publication de la vitrine");
    } finally {
      setIsPublishing(false);
    }
  };

  // Ouvrir / Fermer les commandes en 1 clic
  const handleToggleShopOpen = async () => {
    if (!db || !vendorId) return;
    setIsTogglingOpen(true);
    try {
      const newStatus = !isOpen;
      await update(ref(db, `vendors/${vendorId}`), {
        open: newStatus,
        isOpen: newStatus,
      });
      toast.success(newStatus ? "🟢 Établissement ouvert aux commandes !" : "🔴 Établissement fermé temporairement.");
    } catch {
      toast.error("Erreur lors du changement de statut");
    } finally {
      setIsTogglingOpen(false);
    }
  };

  const labelSecteur = businessType === "ecommerce" ? "Boutique en ligne" : businessType === "hotel" ? "Vitrine Résidence & Hôtel" : "Carte & Menu Restaurant";

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
      !isPublished
        ? "bg-amber-50/70 border-amber-200/90 shadow-sm"
        : isOpen
        ? "bg-gradient-to-r from-emerald-50/60 via-white to-orange-50/30 border-emerald-200/80 shadow-xs"
        : "bg-zinc-50 border-zinc-200/90 shadow-xs"
    }`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Colonne Gauche : Statut et URL */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sub font-bold shadow-xs ${
              !isPublished
                ? "bg-amber-200 text-amber-900"
                : isOpen
                ? "bg-emerald-500 text-white"
                : "bg-zinc-700 text-white"
            }`}>
              <span className={`w-2 h-2 rounded-full ${!isPublished ? "bg-amber-600 animate-pulse" : isOpen ? "bg-white animate-pulse" : "bg-zinc-400"}`} />
              {!isPublished ? "Vitrine non publiée (Brouillon)" : isOpen ? "Vitrine en ligne & Active" : "Vitrine fermée temporairement"}
            </span>

            <span className="text-[11px] font-sub font-semibold text-zinc-500">
              {labelSecteur} • {productsCount} article{productsCount > 1 ? "s" : ""} au catalogue
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/90 shadow-xs font-mono text-xs text-zinc-800">
              <Globe size={14} className="text-[#FF6B00]" />
              <span className="font-bold text-zinc-900">{displayUrl}</span>
            </div>

            <button
              onClick={handleCopyLink}
              title="Copier le lien direct"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 font-sub font-bold text-xs flex items-center gap-1.5 border border-zinc-200 shadow-xs transition-colors"
            >
              <Copy size={13} />
              <span>Copier</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              title="Partager sur WhatsApp"
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sub font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Share2 size={13} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Colonne Droite : Boutons d'Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {!isPublished ? (
            <button
              onClick={handlePublishNow}
              disabled={isPublishing}
              className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-sub font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles size={14} />
              <span>{isPublishing ? "Publication..." : "Publier ma vitrine (1 clic)"}</span>
            </button>
          ) : (
            <button
              onClick={handleToggleShopOpen}
              disabled={isTogglingOpen}
              className={`px-4 py-2.5 rounded-2xl font-sub font-bold text-xs flex items-center gap-2 border transition-all ${
                isOpen
                  ? "bg-white hover:bg-red-50 text-red-600 border-red-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
              }`}
            >
              <Power size={13} />
              <span>{isOpen ? "Fermer temporairement" : "Rouvrir aux commandes"}</span>
            </button>
          )}

          <button
            onClick={() => window.open(`/r/${slug}`, "_blank")}
            className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-sub font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
          >
            <span>Ouvrir la vitrine</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={() => navigate("/vendor/site")}
            title="Modifier le design et la présentation"
            className="px-3 py-2.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-700 font-sub font-bold text-xs flex items-center gap-1.5 border border-zinc-200 shadow-xs transition-colors"
          >
            <Settings size={14} />
            <span className="hidden sm:inline">Personnaliser</span>
          </button>
        </div>

      </div>
    </div>
  );
}
