import { useState } from "react";
import { VendorProfile } from "@/data/mockData";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  vendor: VendorProfile;
  businessType: "restaurant" | "ecommerce" | "hotel";
}

export default function FAQSection({ vendor, businessType }: Props) {
  const isHotel = businessType === "hotel";
  const isEcommerce = businessType === "ecommerce";

  const defaultFAQ = isHotel
    ? [
        { q: "Quelles sont les heures d'arrivée (Check-in) et de départ (Check-out) ?", a: `L'enregistrement s'effectue à partir de ${vendor.check_in_time || "14h00"} et les départs doivent avoir lieu avant ${vendor.check_out_time || "11h00"}. Un départ tardif peut être arrangé avec la réception selon les disponibilités.` },
        { q: "Le petit-déjeuner est-il inclus dans la réservation ?", a: "Oui, un petit-déjeuner continental et buffet complet est proposé chaque matin de 07h00 à 10h30 pour tous nos résidents." },
        { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons les règlements par MTN Mobile Money, Moov Money, Carte bancaire (Visa / Mastercard) ainsi que les espèces à la réception." },
        { q: "Proposez-vous une navette pour l'aéroport ?", a: "Oui, une navette privée peut vous accueillir directement à l'Aéroport International de Cadjehoun (Cotonou). Il vous suffit de nous communiquer votre numéro de vol lors de votre réservation." },
        { q: "Y a-t-il une caution remboursable à l'arrivée ?", a: `Une caution de garantie de ${vendor.deposit_amount ? `${Number(vendor.deposit_amount).toLocaleString()} FCFA` : "20 000 FCFA"} est demandée lors du check-in et vous est intégralement restituée lors de votre départ après l'état des lieux.` }
      ]
    : isEcommerce
    ? [
        { q: "Quels sont les délais et zones de livraison ?", a: "Nous livrons partout à Cotonou et Calavi sous 24h ouvrées. Pour les autres villes du Bénin (Porto-Novo, Parakou, Bohicon), les expéditions s'effectuent via les gares routières en 24h à 48h." },
        { q: "Comment payer ma commande en toute sécurité ?", a: "Vous pouvez régler directement par Mobile Money (MTN MoMo ou Moov Money) sans aucun frais supplémentaire. Le paiement est 100% sécurisé et instantané." },
        { q: "Puis-je échanger un article si la taille ne convient pas ?", a: "Absolument ! Vous disposez de 48h après réception pour nous signaler un souci de taille ou de conformité. L'article doit être non porté et dans son emballage d'origine." },
        { q: "Peut-on venir récupérer son colis en boutique physique ?", a: `Oui, le retrait en point de vente à ${vendor.neighborhood || "Haie Vive"} est totalement gratuit dès que votre commande est prête.` }
      ]
    : [
        { q: "Faut-il obligatoirement réserver à l'avance ?", a: "La réservation n'est pas obligatoire mais vivement conseillée, en particulier pour les vendredis et samedis soirs ainsi que pour les grandes tablées." },
        { q: "Acceptez-vous les réservations de groupe et événements privés ?", a: "Oui ! Nous organisons régulièrement des anniversaires, repas d'affaires, mariages et cocktails dînatoires. Contactez-nous directement sur WhatsApp pour un devis personnalisé." },
        { q: "Proposez-vous un service de livraison à domicile ?", a: "Oui, vous pouvez commander directement tous nos plats sur cette vitrine et vous faire livrer chez vous ou au bureau par nos livreurs partenaires." },
        { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons les paiements en espèces, MTN Mobile Money, Moov Money et cartes bancaires." }
      ];

  const faqList = vendor.faq_items && vendor.faq_items.length > 0 ? vendor.faq_items : defaultFAQ;
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqList.length === 0) return null;

  return (
    <section id="faq" className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
            <HelpCircle size={13} />
            Questions Fréquentes
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900">
            Foire Aux Questions (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Retrouvez rapidement les réponses à vos interrogations les plus courantes.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqList.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/90 overflow-hidden bg-gray-50/60 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-black text-xs sm:text-sm text-gray-900 hover:text-primary transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 text-gray-400 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-150/60">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
