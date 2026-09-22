import { useState } from "react";
import { BusinessSector } from "./LandingHero";

interface LandingInteractiveDemoProps {
  activeSector: BusinessSector;
  onSelectSector: (sector: BusinessSector) => void;
}

export default function LandingInteractiveDemo({ activeSector, onSelectSector }: LandingInteractiveDemoProps) {
  const [cartCount, setCartCount] = useState(1);
  const [orderSent, setOrderSent] = useState(false);
  const [demoOrders, setDemoOrders] = useState([
    { id: "#042", item: "Poulet Braisé & Alloco", total: "4 500 F", status: "En cuisine", time: "À l'instant" }
  ]);

  const demoCatalogs = {
    restaurant: {
      name: "Restaurant Le Bénin & Grillades",
      slug: "restaurant-le-benin",
      category: "Cuisine & Grillades",
      item: {
        name: "Poulet Braisé Signature du Chef",
        desc: "Mariné 24h aux épices béninoises, braisé au charbon de bois. Servi avec alloco.",
        price: 4500,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=600&auto=format&fit=crop"
      }
    },
    ecommerce: {
      name: "KiffStyle Fashion Store",
      slug: "kiffstyle-store",
      category: "Sneakers & Vêtements",
      item: {
        name: "Sneakers Streetwear Urban Pro",
        desc: "Cuir respirant, semelle confort amortissante. Pointures 40 à 45 disponibles.",
        price: 18500,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
      }
    },
    hotel: {
      name: "Palmier Royal Résidence",
      slug: "palmier-royal",
      category: "Chambres & Suites",
      item: {
        name: "Suite Junior Deluxe Vue Jardin",
        desc: "Lit King Size, climatisation, Smart TV, Wi-Fi haut débit et petit déjeuner inclus.",
        price: 25000,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop"
      }
    }
  };

  const current = demoCatalogs[activeSector];

  const handleSimulateOrder = () => {
    setOrderSent(true);
    const newOrd = {
      id: `#0${Math.floor(50 + Math.random() * 40)}`,
      item: `${cartCount}x ${current.item.name.split(" ")[0]}`,
      total: `${(current.item.price * cartCount).toLocaleString()} F`,
      status: "MoMo Direct",
      time: "À l'instant"
    };
    setDemoOrders(prev => [newOrd, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setOrderSent(false);
    }, 4000);
  };

  return (
    <section id="demo" className="py-20 sm:py-28 bg-[#090909] text-white relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
            <i className="fa-solid fa-flask"></i>
            SIMULATION EN DIRECT
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Ne nous croyez pas sur parole. Testez l'expérience en temps réel.
          </h2>
          <p className="text-white/60 text-sm sm:text-base font-medium">
            Passez une commande test à gauche et observez la notification instantanée arriver sur le tableau de bord commerçant à droite :
          </p>
        </div>

        {/* Sector Tabs Switcher */}
        <div className="flex justify-center gap-2 mb-10">
          {(["restaurant", "ecommerce", "hotel"] as BusinessSector[]).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSelectSector(sec)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeSector === sec
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${sec === 'restaurant' ? 'fa-utensils' : sec === 'ecommerce' ? 'fa-bag-shopping' : 'fa-hotel'}`}></i>
              <span className="capitalize">{sec}</span>
            </button>
          ))}
        </div>

        {/* Interactive Dual-Panel Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel: The Customer View (Smartphone screen) */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-[#141414] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-md shadow-primary/30">
                  <i className="fa-solid fa-mobile-screen"></i>
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">{current.name}</h4>
                  <p className="text-[11px] text-white/50">Vue Client • Lien WhatsApp / QR Code</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                ● En ligne
              </span>
            </div>

            {/* Product Card */}
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/5">
              <img
                src={current.item.image}
                alt={current.item.name}
                className="w-full h-44 object-cover"
              />
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h5 className="font-heading font-black text-base text-white">{current.item.name}</h5>
                  <span className="font-heading font-black text-primary text-lg">
                    {current.item.price.toLocaleString()} F
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{current.item.desc}</p>
                
                {/* Quantity */}
                <div className="pt-3 flex items-center justify-between border-t border-white/5">
                  <span className="text-xs font-bold text-white/70">Quantité :</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCartCount(Math.max(1, cartCount - 1))}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="font-heading font-black text-sm text-white">{cartCount}</span>
                    <button
                      type="button"
                      onClick={() => setCartCount(cartCount + 1)}
                      className="w-8 h-8 rounded-lg bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Simulator Button */}
            <button
              type="button"
              onClick={handleSimulateOrder}
              disabled={orderSent}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {orderSent ? (
                <>
                  <i className="fa-solid fa-circle-check text-sm animate-bounce"></i>
                  <span>Paiement MoMo envoyé avec succès !</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-bolt text-sm"></i>
                  <span>Commander maintenant ({(current.item.price * cartCount).toLocaleString()} FCFA via MoMo)</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel: The Merchant Command Center */}
          <div className="p-6 sm:p-8 rounded-[36px] bg-[#141414] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-sm shadow-md">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <div>
                  <h4 className="font-heading font-black text-sm text-white">Tableau de Bord Marchand</h4>
                  <p className="text-[11px] text-white/50">Réception immédiate sans intermédiaire</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase font-mono">
                0% COMMISSION
              </span>
            </div>

            {/* Incoming Orders Stream */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider">
                Flux des commandes en direct :
              </p>

              {demoOrders.map((ord, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-between gap-4 animate-in fade-in duration-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{ord.id}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {ord.status}
                      </span>
                    </div>
                    <p className="font-heading font-bold text-xs text-white">{ord.item}</p>
                    <p className="text-[10px] text-white/40">{ord.time}</p>
                  </div>
                  <span className="font-heading font-black text-sm text-white">{ord.total}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white/60 flex items-center gap-3">
              <i className="fa-solid fa-shield-check text-emerald-400 text-lg"></i>
              <span>
                <strong>Zéro faux avis :</strong> Vous testez ici le moteur réel. L'argent de chaque commande arrive directement sur votre propre numéro Mobile Money.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
