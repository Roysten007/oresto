import { VendorProfile } from "@/data/mockData";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function AboutSection({ vendor, businessType }: Props) {
  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  const story = vendor.about_story || vendor.description;
  const concept = vendor.about_concept;
  const chef = vendor.about_chef;

  // Si rien n'est renseigné, ne pas afficher de bloc vide
  if (!story && !concept && !chef) {
    return null;
  }

  const defaultImage = isEcommerce
    ? "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80"
    : isHotel
    ? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80";

  return (
    <section id="about" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Image Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={vendor.about_image || vendor.logo_url || defaultImage}
                alt={vendor.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-2 sm:bottom-4 sm:-right-4 bg-black text-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-lg">
                <i className={`fa-solid ${isEcommerce ? "fa-gem" : isHotel ? "fa-star" : "fa-award"}`}></i>
              </div>
              <div>
                <p className="font-heading font-black text-xs uppercase tracking-tight">Authenticité & Qualité</p>
                <p className="text-[10px] text-gray-400 font-bold">100% Vérifié Oresto</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-primary block">
                {isEcommerce ? "Notre Univers & Nos Valeurs" : isHotel ? "Bienvenue chez vous" : "L'Histoire & Le Savoir-Faire"}
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 leading-tight">
                {isEcommerce 
                  ? "Une sélection pensée avec passion pour votre style" 
                  : isHotel 
                  ? "Un havre de paix, de confort et d'élégance" 
                  : "Une expérience culinaire sincère et généreuse"}
              </h2>
            </div>

            {/* Story */}
            {story && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {story}
              </p>
            )}

            {/* Concept / Chef Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {concept && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 space-y-1">
                  <h4 className="font-heading font-black text-xs text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-compass-drafting text-primary"></i>
                    <span>{isEcommerce ? "Nos Valeurs" : isHotel ? "Le Cadre" : "Le Concept"}</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{concept}</p>
                </div>
              )}

              {chef && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-150 space-y-1">
                  <h4 className="font-heading font-black text-xs text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-user-tie text-primary"></i>
                    <span>{isEcommerce ? "L'Équipe" : isHotel ? "Le Service" : "Le Chef & La Brigade"}</span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{chef}</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
