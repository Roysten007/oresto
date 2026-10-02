import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function GallerySection({ vendor, businessType }: Props) {
  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  const customGallery = vendor.gallery_images || [];
  const galleryList = customGallery;
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(null);

  if (galleryList.length === 0) return null;

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
            {isEcommerce ? "Inspirations & Mises en Scène" : isHotel ? "Immersion & Atmosphère" : "Instantanés Gourmands"}
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            {isEcommerce ? "Notre Lookbook & Galerie" : isHotel ? "Galerie Photos du Séjour" : "Galerie Photos & Ambiance"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {isEcommerce
              ? "Découvrez nos pièces en situation pour vous inspirer et sublimer votre quotidien."
              : isHotel
              ? "Explorez nos chambres, nos terrasses et nos espaces de détente en images."
              : "Un aperçu en images de nos spécialités, de nos assiettes et de l'ambiance chaleureuse de notre table."}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {galleryList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage({ url: item.url, caption: item.caption })}
              className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 group cursor-pointer shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={item.url}
                alt={item.caption || "Galerie photo"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                {item.category && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary block">
                    {item.category}
                  </span>
                )}
                <p className="font-heading font-bold text-xs leading-snug truncate">
                  {item.caption || "Agrandir"}
                </p>
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs text-white">
                  <ZoomIn size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || ""}
                className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl"
              />

              {selectedImage.caption && (
                <p className="text-white text-center mt-3 font-heading font-bold text-sm">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
