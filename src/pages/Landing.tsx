import { Link } from "react-router-dom";
import { FadeIn } from "@/hooks/useFadeIn";
import { categories } from "@/data/mockData";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Check, X } from "lucide-react";

const trustItems = ["🇧🇯 Bénin", "🇹🇬 Togo", "🇨🇮 Côte d'Ivoire", "🇸🇳 Sénégal", "MTN MoMo", "Moov Money", "WhatsApp", "Google Maps"];

const steps = [
  { num: 1, icon: "🔍", title: "Cherchez", desc: "Tapez un plat, un commerce, une ville" },
  { num: 2, icon: "🛒", title: "Commandez", desc: "Ajoutez au panier, payez en MoMo" },
  { num: 3, icon: "🚀", title: "Recevez", desc: "Votre livreur part en ~20 min" },
];

const clientFeatures = [
  "Géolocalisation automatique de votre ville",
  "Filtres : ouvert maintenant, note, quartier",
  "Suivi livraison en temps réel",
  "Paiement MTN & Moov MoMo intégré",
  "Historique et avis après chaque commande",
];

const vendorFeatures = [
  "Créez votre catalogue ou menu facilement",
  "Recevez des commandes en temps réel",
  "Gérez vos livreurs et zones de livraison",
  "Statistiques de ventes et revenus",
  "Badge vérifié, QR Code, codes promo",
];

const testimonials = [
  { quote: "Je reçois 3 fois plus de commandes depuis Oresto.", initials: "A.S.", name: "Aminata S.", role: "Restauratrice", city: "Cotonou 🇧🇯" },
  { quote: "En 10 minutes ma boutique était en ligne. Incroyable.", initials: "K.M.", name: "Kofi M.", role: "Épicier", city: "Lomé 🇹🇬" },
  { quote: "Le paiement MoMo intégré, c'est exactement ce qu'il fallait.", initials: "F.D.", name: "Fatou D.", role: "Cliente", city: "Abidjan 🇨🇮" },
];

const countries = [
  { flag: "🇧🇯", name: "Bénin", status: "Actif", color: "bg-green-100 text-green-700" },
  { flag: "🇹🇬", name: "Togo", status: "Bientôt", color: "bg-muted text-muted-foreground" },
  { flag: "🇨🇮", name: "Côte d'Ivoire", status: "Q3 2025", color: "bg-muted text-muted-foreground" },
  { flag: "🇸🇳", name: "Sénégal", status: "Q4 2025", color: "bg-muted text-muted-foreground" },
];

interface PlanFeature { text: string; included: boolean }
const starterFeatures: PlanFeature[] = [
  { text: "Fiche marketplace", included: true },
  { text: "20 produits max", included: true },
  { text: "50 commandes/mois", included: true },
  { text: "Paiement Cash", included: true },
  { text: "MoMo", included: false },
  { text: "Stats avancées", included: false },
];
const proFeatures: PlanFeature[] = [
  { text: "Tout Starter", included: true },
  { text: "Catalogue illimité", included: true },
  { text: "Commandes illimitées", included: true },
  { text: "MTN & Moov MoMo", included: true },
  { text: "Stats de base", included: true },
  { text: "Badge Pro + QR Code", included: true },
];
const premiumFeatures: PlanFeature[] = [
  { text: "Tout Pro", included: true },
  { text: "Mise en avant recherche", included: true },
  { text: "Badge Vérifié ✅", included: true },
  { text: "Stats avancées", included: true },
  { text: "Programme fidélité", included: true },
  { text: "Codes promo", included: true },
  { text: "WhatsApp Business", included: true },
  { text: "Gestionnaire dédié", included: true },
  { text: "Pub page d'accueil", included: true },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section id="accueil" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full bg-oresto-orange-light text-primary font-sub text-sm font-medium mb-6">
              🌍 La super-app du commerce local
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-foreground">
              Tout ce dont vous avez besoin, livré depuis votre quartier.
            </h1>
            <p className="mt-6 text-lg font-sub text-muted-foreground max-w-lg">
              Oresto connecte les clients aux commerces locaux d'Afrique de l'Ouest. Commandez, payez en MoMo, suivez en temps réel.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/register" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
                📱 Télécharger l'app
              </Link>
              <Link to="/register" className="px-6 py-3 rounded-full border-2 border-foreground text-foreground font-sub font-semibold btn-hover">
                🏪 Ouvrir ma boutique
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <span className="px-4 py-2 rounded-2xl bg-muted font-sub text-sm">🏪 +2 400 boutiques</span>
              <span className="px-4 py-2 rounded-2xl bg-muted font-sub text-sm">⭐ 4.8/5</span>
              <span className="px-4 py-2 rounded-2xl bg-muted font-sub text-sm">🚀 ~20 min</span>
            </div>
          </FadeIn>
          <FadeIn className="flex justify-center">
            <div className="w-[280px] h-[560px] rounded-[40px] border-4 border-foreground bg-background shadow-2xl overflow-hidden p-3">
              <div className="w-full h-full rounded-[28px] bg-muted overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="h-8 flex items-center justify-between">
                    <span className="font-heading font-bold text-primary text-lg">ORESTO</span>
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                  </div>
                  <div className="h-10 rounded-full bg-background border border-border flex items-center px-3">
                    <span className="text-xs text-muted-foreground">🔍 Que cherchez-vous ?</span>
                  </div>
                  <div className="flex gap-2 overflow-hidden">
                    {["🍽️", "💊", "🛒", "👗"].map((icon, i) => (
                      <div key={i} className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
                    ))}
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-2xl bg-background p-2 shadow-sm">
                      <div className="h-20 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 mb-2" />
                      <div className="h-3 w-3/4 rounded bg-foreground/10" />
                      <div className="h-2 w-1/2 rounded bg-foreground/5 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-muted py-4 overflow-hidden">
        <div className="animate-scroll-left flex gap-12 whitespace-nowrap">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="font-sub text-sm text-muted-foreground flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="fonctionnalites" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Trouvez ce qu'il vous faut</h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <FadeIn key={i}>
              <div className="card-hover p-6 rounded-2xl bg-card border border-border text-center cursor-pointer hover:border-primary group">
                <div className="w-14 h-14 rounded-full bg-oresto-orange-light flex items-center justify-center text-2xl mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  {cat.icon}
                </div>
                <span className="font-sub font-medium text-foreground">{cat.label}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">En 3 étapes, c'est livré</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 border-t-2 border-dashed border-border" />
            {steps.map((step) => (
              <FadeIn key={step.num}>
                <div className="text-center relative">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-heading font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <span className="text-3xl mb-3 block">{step.icon}</span>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn className="flex justify-center order-2 md:order-1">
            <div className="w-[240px] h-[480px] rounded-[36px] border-4 border-foreground bg-background shadow-xl overflow-hidden p-2">
              <div className="w-full h-full rounded-[28px] bg-muted flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">Votre ville, dans votre poche</h2>
            <ul className="space-y-4">
              {clientFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">✅</span>
                  <span className="font-body text-foreground">{feat}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-block mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
              Télécharger l'app →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* VENDOR SECTION */}
      <section className="bg-oresto-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-8">Ouvrez votre vitrine en 10 minutes</h2>
              <ul className="space-y-4">
                {vendorFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5">✅</span>
                    <span className="font-body text-primary-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-block mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
                Créer mon espace vendeur →
              </Link>
            </FadeIn>
            <FadeIn className="flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-foreground/10 p-6 space-y-4">
                <div className="flex gap-3">
                  {["📦 12", "💰 45k", "⭐ 4.8"].map((stat, i) => (
                    <div key={i} className="flex-1 rounded-xl bg-foreground/10 p-3 text-center">
                      <span className="text-primary-foreground text-sm font-sub">{stat}</span>
                    </div>
                  ))}
                </div>
                <div className="h-32 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <span className="text-primary-foreground/30 text-sm">📊 Graphique revenus</span>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-foreground/5">
                    <div className="w-8 h-8 rounded-full bg-primary/30" />
                    <div className="flex-1">
                      <div className="h-2.5 w-24 rounded bg-primary-foreground/20" />
                      <div className="h-2 w-16 rounded bg-primary-foreground/10 mt-1" />
                    </div>
                    <span className="text-xs text-primary px-2 py-0.5 rounded-full bg-primary/20">Nouveau</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="abonnements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Choisissez votre plan vendeur</h2>
          <p className="mt-3 font-sub text-muted-foreground">Sans engagement. Changez de plan à tout moment.</p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6 items-end">
          {/* STARTER */}
          <FadeIn>
            <div className="card-hover rounded-2xl border-2 border-foreground p-8 bg-card">
              <h3 className="font-heading font-bold text-xl text-foreground">STARTER</h3>
              <p className="font-heading text-3xl font-bold text-foreground mt-2">10 000 <span className="text-base font-normal text-muted-foreground">FCFA/mois</span></p>
              <ul className="mt-6 space-y-3">
                {starterFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-sm">
                    {f.included ? <Check size={16} className="text-primary flex-shrink-0" /> : <X size={16} className="text-muted-foreground flex-shrink-0" />}
                    <span className={f.included ? "text-foreground" : "text-muted-foreground"}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 block text-center px-6 py-3 rounded-full border-2 border-foreground text-foreground font-sub font-semibold btn-hover">
                Commencer
              </Link>
            </div>
          </FadeIn>

          {/* PRO */}
          <FadeIn>
            <div className="card-hover rounded-2xl p-8 bg-oresto-black text-primary-foreground relative scale-105">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sub font-semibold">
                LE PLUS POPULAIRE
              </span>
              <h3 className="font-heading font-bold text-xl">PRO</h3>
              <p className="font-heading text-3xl font-bold mt-2">25 000 <span className="text-base font-normal text-primary-foreground/60">FCFA/mois</span></p>
              <ul className="mt-6 space-y-3">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 block text-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
                Commencer
              </Link>
            </div>
          </FadeIn>

          {/* PREMIUM */}
          <FadeIn>
            <div className="card-hover rounded-2xl border border-border p-8 bg-card border-t-4 border-t-primary">
              <h3 className="font-heading font-bold text-xl text-foreground">PREMIUM</h3>
              <p className="font-heading text-3xl font-bold text-foreground mt-2">50 000 <span className="text-base font-normal text-muted-foreground">FCFA/mois</span></p>
              <ul className="mt-6 space-y-3">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-sm">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    <span className="text-foreground">{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 block text-center px-6 py-3 rounded-full border-2 border-foreground text-foreground font-sub font-semibold btn-hover">
                Commencer
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Ils font confiance à Oresto</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i}>
                <div className="card-hover rounded-2xl bg-card p-6 shadow-md">
                  <div className="text-primary mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="font-body italic text-foreground mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-sub font-semibold text-sm text-foreground">{t.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{t.role}, {t.city}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section id="pays" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Déjà présent, bientôt partout</h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countries.map((c, i) => (
            <FadeIn key={i}>
              <div className="card-hover rounded-2xl bg-card border border-border p-6 text-center">
                <span className="text-4xl mb-3 block">{c.flag}</span>
                <h3 className="font-heading font-semibold text-foreground">{c.name}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-sub font-medium ${c.color}`}>{c.status}</span>
              </div>
            </FadeIn>
          ))}
        </div>
        <p className="text-center mt-8 font-sub text-muted-foreground">Et toute l'Afrique de l'Ouest dans notre viseur 🌍</p>
      </section>

      {/* FINAL CTA */}
      <section className="bg-oresto-black py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground">Rejoignez la révolution du commerce local.</h2>
          <p className="mt-4 font-sub text-primary-foreground/60">Des milliers de commerçants et clients vous attendent.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/register" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-sub font-semibold btn-hover">
              📱 Télécharger l'app
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-full border-2 border-primary-foreground/30 text-primary-foreground font-sub font-semibold btn-hover hover:border-primary-foreground">
              🏪 Ouvrir ma boutique
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
