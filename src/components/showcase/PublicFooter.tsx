import { VendorProfile } from "@/data/mockData";
import { Link } from "react-router-dom";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function PublicFooter({ vendor, businessType }: Props) {
  const currentYear = new Date().getFullYear();
  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  return (
    <footer className="bg-[#0A0A0A] text-white pt-14 pb-28 sm:pb-16 border-t border-white/10 font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-0.5 overflow-hidden">
                <img
                  src={vendor.logo_url || `https://ui-avatars.com/api/?name=${vendor.name}`}
                  alt={vendor.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="font-heading font-black text-lg text-white">
                {vendor.name}
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {vendor.description || (isEcommerce ? "Boutique en ligne officielle avec livraison rapide et encaissement sécurisé." : isHotel ? "Résidence hôtelière de charme pour vos séjours d'affaires et de détente." : "Restaurant gastronomique et saveurs authentiques.")}
            </p>
          </div>

          {/* Nav Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading font-black text-xs uppercase tracking-widest text-primary">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">À propos de l'établissement</a></li>
              {isRestaurant(businessType) && <li><a href="#menu" className="hover:text-white transition-colors">La Carte & Les Menus</a></li>}
              {isEcommerce && <li><a href="#catalogue" className="hover:text-white transition-colors">Catalogue Produits</a></li>}
              {isHotel && <li><a href="#rooms" className="hover:text-white transition-colors">Chambres & Suites</a></li>}
              {isHotel && <li><a href="#amenities" className="hover:text-white transition-colors">Équipements & Services</a></li>}
              <li><a href="#gallery" className="hover:text-white transition-colors">Galerie Photos</a></li>
              <li><a href="#location" className="hover:text-white transition-colors">Localisation & Horaires</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Avis Clients</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Foire Aux Questions</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact & Réservations</a></li>
            </ul>
          </div>

          {/* Trust / Powered by */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading font-black text-xs uppercase tracking-widest text-primary">
              Garantie & Sécurité
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Commandes & réservations directes sans commission d'intermédiaire. Encaissements Mobile Money 100% sécurisés.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold transition-all border border-white/10"
              >
                <i className="fa-solid fa-bolt text-primary text-xs"></i>
                <span>Propulsé par Oresto Connect</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {currentYear} {vendor.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-gray-400">Créer mon site vitrine</Link>
            <span>•</span>
            <span className="text-gray-600">Oresto Factory v2.5</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function isRestaurant(t: string) {
  return t === "restaurant";
}
