import { BusinessSector } from "./LandingHero";

interface LandingProblemProps {
  activeSector: BusinessSector;
}

export default function LandingProblem({ activeSector }: LandingProblemProps) {
  const problems = [
    {
      sector: "restaurant",
      title: "Si vous gérez un Restaurant, un Maquis ou un Fast-Food",
      badge: "RESTAURATION",
      icon: "fa-solid fa-utensils",
      pains: [
        {
          head: "25% à 30% de commission perdus sur chaque plat",
          desc: "Les plateformes de livraison tierces vous étranglent : sur un plat vendu 4 000 FCFA, vous laissez plus de 1 000 FCFA à un intermédiaire alors que c'est vous qui cuisinez et achetez la marchandise."
        },
        {
          head: "Le coup de feu de midi gâché au téléphone",
          desc: "Aux heures de pointe, votre personnel passe son temps à dicter les plats du jour ou envoyer des photos sur WhatsApp pendant que les clients en salle s'impatientent et que la cuisine prend du retard."
        },
        {
          head: "20 minutes d'attente pour l'addition à table",
          desc: "Les serveurs courent dans tous les sens pour apporter la monnaie ou le terminal. Des clients s'en vont sans payer ou repartent frustrés de la lenteur du service."
        }
      ]
    },
    {
      sector: "ecommerce",
      title: "Si vous gérez une Boutique de Vêtements, Chaussures ou Tech",
      badge: "BOUTIQUE & E-COMMERCE",
      icon: "fa-solid fa-bag-shopping",
      pains: [
        {
          head: "3 heures par jour perdues à renvoyer 50 photos dans les DM",
          desc: "Chaque nouveau client vous redemande la même chose : 'C'est disponible en 42 ?', 'Le prix c'est combien ?'. Vous passez votre journée à copier-coller les mêmes photos plutôt que de développer vos ventes."
        },
        {
          head: "Des dizaines de clients 'fantômes' qui ne finalisent jamais",
          desc: "Le client pose 15 questions, hésite sur la couleur, demande votre numéro MoMo, puis ne répond plus jamais. Sans panier d'achat fluide, plus de 70% de vos prospects abandonnent en cours de route."
        },
        {
          head: "Le piège des fausses captures d'écran de virement MoMo",
          desc: "Des escrocs vous envoient des SMS ou captures d'écran Photoshop de transferts MTN ou Moov truqués. Sans confirmation bancaire automatisée, vous risquez d'expédier un colis qui ne vous sera jamais payé."
        }
      ]
    },
    {
      sector: "hotel",
      title: "Si vous gérez un Hôtel, une Résidence Meublée ou des Chambres d'Hôtes",
      badge: "HÔTELLERIE & RÉSIDENCES",
      icon: "fa-solid fa-hotel",
      pains: [
        {
          head: "Les réservations téléphoniques 'fantômes' sans acompte",
          desc: "Un client bloque votre meilleure suite pour le week-end par un simple appel, vous refusez d'autres clients sérieux, et la personne ne se présente jamais le jour J. Votre chambre reste vide et votre argent est perdu."
        },
        {
          head: "La gestion artisanale sur un cahier raturé",
          desc: "Sans planning numérique automatique, une mauvaise communication entre votre réceptionniste de jour et de nuit suffit pour louer la même chambre deux fois et créer un scandale avec un client VIP."
        },
        {
          head: "Une visibilité invisible en dehors des réseaux sociaux",
          desc: "Faute de site web avec photos claires et tarifs des nuitées, les touristes et voyageurs d'affaires préfèrent réserver ailleurs par manque d'informations fiables."
        }
      ]
    }
  ];

  return (
    <section id="probleme" className="py-20 sm:py-28 bg-[#0D0D0D] text-white relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation"></i>
            LE DIAGNOSTIC BRUT
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Reconnaissez-vous l'une de ces situations qui vous coûtent cher chaque jour ?
          </h2>
          <p className="text-white/60 text-sm sm:text-base font-medium">
            Voici les freins majeurs qui vous empêchent de faire décoller votre chiffre d'affaires :
          </p>
        </div>

        {/* 3 Problems Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {problems.map((prob) => {
            const isHighlighted = prob.sector === activeSector;
            return (
              <div
                key={prob.sector}
                className={`p-6 sm:p-8 rounded-[32px] transition-all flex flex-col justify-between ${
                  isHighlighted
                    ? "bg-[#161616] border-2 border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                    : "bg-[#111111] border border-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                      isHighlighted ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white/5 text-white/60"
                    }`}>
                      <i className={prob.icon}></i>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      isHighlighted ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-white/50"
                    }`}>
                      {prob.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-black text-xl text-white mb-6 leading-snug">
                    {prob.title}
                  </h3>

                  <div className="space-y-5">
                    {prob.pains.map((pain, pidx) => (
                      <div key={pidx} className="flex gap-3">
                        <div className="mt-1 text-red-400 text-sm shrink-0">
                          <i className="fa-solid fa-circle-xmark"></i>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-white mb-1">
                            {pain.head}
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-body">
                            {pain.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5">
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    Oresto élimine définitivement ce problème.
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
