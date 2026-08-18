import { VendorProfile } from "@/data/mockData";
import { Phone, MessageCircle, Instagram, Facebook, Share2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function ContactSection({ vendor, businessType }: Props) {
  const isHotel = businessType === "hotel";
  const isEcommerce = businessType === "ecommerce";

  const rawPhone = (vendor.whatsapp || vendor.phone || "").replace(/\D/g, "");
  const socials = vendor.social_links || {};

  const handleShare = async () => {
    if (navigator.share) {
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

  return (
    <section id="contact" className="py-12 sm:py-16 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
            Échange Direct & Assistance
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            Contactez Notre Équipe
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {isHotel
              ? "Une question sur un hébergement ou une demande spécifique ? Notre conciergerie est à votre écoute."
              : isEcommerce
              ? "Besoin d'un conseil sur une taille ou le suivi d'un colis ? Écrivez-nous directement."
              : "Pour vos commandes spéciales, réservations de groupe ou renseignements."}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* WhatsApp Card */}
          {vendor.whatsapp && (
            <a
              href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(`Bonjour ${vendor.name}, je vous contacte depuis votre vitrine en ligne.`)}`}
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center text-xl shadow-lg shadow-[#25D366]/25">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e7e34]">Messagerie Directe</span>
                <h4 className="font-heading font-black text-sm text-gray-900 mt-0.5">WhatsApp Concierge</h4>
                <p className="text-xs text-gray-600 mt-1 font-mono">{vendor.whatsapp}</p>
              </div>
              <span className="text-[11px] font-black text-[#1e7e34] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Discuter en direct</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </span>
            </a>
          )}

          {/* Phone Card */}
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone}`}
              className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-600/25">
                <Phone size={22} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Appel Téléphonique</span>
                <h4 className="font-heading font-black text-sm text-gray-900 mt-0.5">{isHotel ? "Réception 24h/24" : "Service Client"}</h4>
                <p className="text-xs text-gray-600 mt-1 font-mono">{vendor.phone}</p>
              </div>
              <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Appeler maintenant</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </span>
            </a>
          )}

          {/* Social Links Card */}
          <div className="p-6 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shadow-lg shadow-purple-600/25">
              <i className="fa-solid fa-hashtag"></i>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Réseaux Sociaux</span>
              <h4 className="font-heading font-black text-sm text-gray-900 mt-0.5">Suivez Notre Actualité</h4>
              <div className="flex items-center gap-2 pt-2">
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                )}
                {socials.tiktok && (
                  <a href={socials.tiktok} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform">
                    <i className="fa-brands fa-tiktok"></i>
                  </a>
                )}
                {!socials.instagram && !socials.facebook && !socials.tiktok && (
                  <span className="text-xs text-gray-400 italic">Disponibles sur WhatsApp</span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold">Partagez nos nouveautés</span>
          </div>

          {/* Share Card */}
          <div
            onClick={handleShare}
            className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex flex-col justify-between space-y-4 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-lg shadow-amber-500/25">
              <Share2 size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Partager le Site</span>
              <h4 className="font-heading font-black text-sm text-gray-900 mt-0.5">Recommander à un ami</h4>
              <p className="text-xs text-gray-600 mt-1">Copiez le lien direct vers cette vitrine</p>
            </div>
            <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Partager le lien</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
