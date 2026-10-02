import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Store,
  Clock,
  MapPin,
  Users,
  Smartphone,
  Globe,
  FileText,
  AlertTriangle,
  Star,
  DollarSign,
  CreditCard,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import {
  EstablishmentType,
  EstablishmentAge,
  CityBenin,
  EmployeeCount,
  OrderChannel,
  WebsiteStatus,
  NoWebsiteReason,
  MenuMethod,
  OrderManagementMethod,
  RestaurantProblem,
  PricingModelPreference,
  AcceptableSubscriptionTier,
  AcceptableCommissionTier,
  PaymentMethod,
  AdoptionConcern,
  WantsToTestStatus,
  SurveyResponse,
} from "@/types/survey";
import { submitSurveyResponse } from "@/services/surveyService";

// Liste des 12 fonctionnalités Oresto à évaluer
const FEATURES_TO_EVALUATE = [
  {
    id: "vitrine",
    title: "Vitrine internet personnalisée",
    desc: "Un site web élégant à votre nom (oresto.app/r/votre-resto), accessible 24h/24 par vos clients sur smartphone.",
  },
  {
    id: "qr_menu",
    title: "Menu digital avec QR Code",
    desc: "Vos clients scannent un QR Code à table pour voir le menu complet avec photos et prix à jour.",
  },
  {
    id: "online_orders",
    title: "Commandes directes en ligne",
    desc: "Prise de commande en direct depuis le site sans intermédiaire, avec choix sur place, à emporter ou livraison.",
  },
  {
    id: "whatsapp_orders",
    title: "Commandes WhatsApp structurées",
    desc: "Chaque commande génère automatiquement un message WhatsApp pré-formaté et clair (articles, total, adresse).",
  },
  {
    id: "order_management",
    title: "Gestion centralisée des commandes",
    desc: "Un écran simple pour la cuisine et les serveurs pour suivre les statuts (en attente, en cuisine, prête, livrée).",
  },
  {
    id: "stock_management",
    title: "Gestion des stocks en temps réel",
    desc: "Décompte automatique des portions/bouteilles avec alertes quand un plat ou une boisson est bientôt épuisé.",
  },
  {
    id: "table_reservation",
    title: "Réservation de tables en ligne",
    desc: "Permettre aux clients de réserver une table à l'avance (date, heure, nombre de convives) en direct.",
  },
  {
    id: "delivery_management",
    title: "Gestion des livraisons & coursiers",
    desc: "Attribution des commandes aux livreurs, calcul des frais de livraison et suivi des adresses des clients.",
  },
  {
    id: "stats",
    title: "Statistiques & Suivi des ventes",
    desc: "Tableaux de bord visuels de votre chiffre d'affaires quotidien, vos plats les plus vendus et vos heures de pointe.",
  },
  {
    id: "momo_payments",
    title: "Paiement Mobile Money direct",
    desc: "Encaissement instantané via MTN MoMo, Moov Money et Celtiis sans aucune commission prélevée par Oresto.",
  },
  {
    id: "multi_establishment",
    title: "Gestion de plusieurs établissements",
    desc: "Basculer en 1 clic entre différents restaurants, maquis ou points de vente sous un même profil.",
  },
  {
    id: "ai_assistant",
    title: "Assistant IA opérationnel (IZI IA)",
    desc: "Une intelligence artificielle qui calcule votre chiffre d'affaires, surveille vos stocks et vous conseille sur vos prix.",
  },
];

export default function SurveyPublic() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Honeypot anti-spam (doit rester vide)
  const [honeypot, setHoneypot] = useState("");

  // État des réponses du formulaire
  const [form, setForm] = useState<{
    // Étape 1 : Profil
    establishmentType: string;
    establishmentTypeOther: string;
    establishmentAge: string;
    city: string;
    cityOther: string;
    employeeCount: string;

    // Étape 2 : Fonctionnement
    orderChannels: string[];
    orderChannelsOther: string;
    websiteStatus: string;
    noWebsiteReasons: string[];
    noWebsiteOther: string;
    menuMethod: string;
    menuMethodOther: string;
    orderManagement: string;
    orderManagementOther: string;

    // Étape 3 : Problèmes
    problems: string[];
    problemsOther: string;
    biggestProblem: string;

    // Étape 4 : Évaluation fonctionnalités (1-5)
    featureScores: Record<string, number>;

    // Étape 5 : Modèle économique
    preferredPricingModel: string;
    acceptableSubscription: string;
    acceptableCommission: string;

    // Étape 6 : Paiements & freins
    paymentMethods: string[];
    paymentMethodsOther: string;
    concerns: string[];
    concernsOther: string;
    expectations: string;

    // Étape 7 : Contact & Bêta-test
    wantsToTest: string;
    name: string;
    establishmentName: string;
    whatsapp: string;
    email: string;
    contactCity: string;
    contactConsent: boolean;
  }>({
    establishmentType: "",
    establishmentTypeOther: "",
    establishmentAge: "",
    city: "",
    cityOther: "",
    employeeCount: "",

    orderChannels: [],
    orderChannelsOther: "",
    websiteStatus: "",
    noWebsiteReasons: [],
    noWebsiteOther: "",
    menuMethod: "",
    menuMethodOther: "",
    orderManagement: "",
    orderManagementOther: "",

    problems: [],
    problemsOther: "",
    biggestProblem: "",

    featureScores: {
      vitrine: 4,
      qr_menu: 4,
      online_orders: 4,
      whatsapp_orders: 4,
      order_management: 4,
      stock_management: 3,
      table_reservation: 3,
      delivery_management: 4,
      stats: 4,
      momo_payments: 5,
      multi_establishment: 3,
      ai_assistant: 4,
    },

    preferredPricingModel: "",
    acceptableSubscription: "",
    acceptableCommission: "",

    paymentMethods: [],
    paymentMethodsOther: "",
    concerns: [],
    concernsOther: "",
    expectations: "",

    wantsToTest: "",
    name: "",
    establishmentName: "",
    whatsapp: "+229 ",
    email: "",
    contactCity: "",
    contactConsent: true,
  });

  // Restaurer brouillon local
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oresto_insights_draft");
      if (saved) {
        setForm((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {}
  }, []);

  // Sauvegarder automatiquement le brouillon
  useEffect(() => {
    try {
      localStorage.setItem("oresto_insights_draft", JSON.stringify(form));
    } catch {}
  }, [form]);

  // Gestion des sélections simples
  const handleSingleSelect = (field: string, val: string) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  // Gestion des multi-sélections (checkboxes)
  const handleMultiToggle = (field: "orderChannels" | "noWebsiteReasons" | "problems" | "paymentMethods" | "concerns", val: string) => {
    setForm((prev) => {
      const current = prev[field] as string[];
      if (current.includes(val)) {
        return { ...prev, [field]: current.filter((item) => item !== val) };
      } else {
        return { ...prev, [field]: [...current, val] };
      }
    });
  };

  // Validation par étape
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!form.establishmentType) {
        toast.error("Veuillez sélectionner votre type d'établissement.");
        return false;
      }
      if (!form.establishmentAge) {
        toast.error("Veuillez indiquer depuis combien de temps votre établissement existe.");
        return false;
      }
      if (!form.city) {
        toast.error("Veuillez indiquer la ville de votre établissement.");
        return false;
      }
      if (!form.employeeCount) {
        toast.error("Veuillez indiquer le nombre de personnes y travaillant.");
        return false;
      }
    }

    if (step === 2) {
      if (form.orderChannels.length === 0) {
        toast.error("Sélectionnez au moins un canal de commande principal.");
        return false;
      }
      if (!form.websiteStatus) {
        toast.error("Indiquez si vous avez un site internet professionnel.");
        return false;
      }
      if (!form.menuMethod) {
        toast.error("Indiquez comment vous présentez votre menu actuellement.");
        return false;
      }
      if (!form.orderManagement) {
        toast.error("Indiquez comment vous gérez vos commandes.");
        return false;
      }
    }

    if (step === 3) {
      if (form.problems.length === 0) {
        toast.error("Sélectionnez au moins une difficulté ou 'Aucun problème majeur'.");
        return false;
      }
      if (!form.biggestProblem.trim()) {
        toast.error("Veuillez décrire en quelques mots votre plus gros problème actuel.");
        return false;
      }
    }

    if (step === 4) {
      // Toutes les fonctionnalités ont une valeur par défaut
      return true;
    }

    if (step === 5) {
      if (!form.preferredPricingModel) {
        toast.error("Veuillez indiquer le modèle qui vous semblerait le plus adapté.");
        return false;
      }
      if (!form.acceptableSubscription) {
        toast.error("Indiquez le montant d'abonnement qui vous semblerait acceptable.");
        return false;
      }
      if (!form.acceptableCommission) {
        toast.error("Indiquez le niveau de commission éventuelle qui vous semblerait acceptable.");
        return false;
      }
    }

    if (step === 6) {
      if (form.paymentMethods.length === 0) {
        toast.error("Sélectionnez au moins un moyen de paiement utilisé.");
        return false;
      }
    }

    if (step === 7) {
      if (!form.wantsToTest) {
        toast.error("Indiquez si vous souhaitez tester Oresto lorsqu'il sera disponible.");
        return false;
      }
      if (form.wantsToTest === "Oui" || form.wantsToTest === "Peut-être") {
        if (!form.name.trim()) {
          toast.error("Veuillez renseigner votre nom.");
          return false;
        }
        if (!form.establishmentName.trim()) {
          toast.error("Veuillez renseigner le nom de votre établissement.");
          return false;
        }
        const cleanPhone = form.whatsapp.replace(/\D/g, "");
        if (cleanPhone.length < 8) {
          toast.error("Veuillez renseigner un numéro WhatsApp valide.");
          return false;
        }
        if (!form.contactConsent) {
          toast.error("Veuillez cocher la case d'acceptation pour être recontacté.");
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmitFinal();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitFinal = async () => {
    // Vérification honeypot anti-bot
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Omit<SurveyResponse, "id" | "createdAt"> = {
        establishmentType: form.establishmentType,
        establishmentTypeOther: form.establishmentTypeOther,
        establishmentAge: form.establishmentAge as EstablishmentAge,
        city: form.city,
        cityOther: form.cityOther,
        employeeCount: form.employeeCount as EmployeeCount,

        orderChannels: form.orderChannels,
        orderChannelsOther: form.orderChannelsOther,
        websiteStatus: form.websiteStatus as WebsiteStatus,
        noWebsiteReasons: form.noWebsiteReasons,
        noWebsiteOther: form.noWebsiteOther,
        menuMethod: form.menuMethod,
        menuMethodOther: form.menuMethodOther,
        orderManagement: form.orderManagement,
        orderManagementOther: form.orderManagementOther,

        problems: form.problems,
        problemsOther: form.problemsOther,
        biggestProblem: form.biggestProblem.trim(),

        featureScores: form.featureScores,

        preferredPricingModel: form.preferredPricingModel as PricingModelPreference,
        acceptableSubscription: form.acceptableSubscription as AcceptableSubscriptionTier,
        acceptableCommission: form.acceptableCommission as AcceptableCommissionTier,

        paymentMethods: form.paymentMethods,
        paymentMethodsOther: form.paymentMethodsOther,
        concerns: form.concerns,
        concernsOther: form.concernsOther,
        expectations: form.expectations.trim(),

        wantsToTest: form.wantsToTest as WantsToTestStatus,
        name: form.name.trim(),
        establishmentName: form.establishmentName.trim(),
        whatsapp: form.whatsapp.trim(),
        email: form.email.trim(),
        contactCity: form.contactCity || form.city,
        contactConsent: form.contactConsent,
      };

      const result = await submitSurveyResponse(payload);
      if (result.success) {
        localStorage.removeItem("oresto_insights_draft");
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Erreur lors de l'enregistrement de votre réponse.");
      }
    } catch (e: any) {
      toast.error("Erreur inattendue : " + (e.message || "veuillez réessayer."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE DE REMERCIEMENT (POST-SOUMISSION)
  // ══════════════════════════════════════════════════════════════════════════════
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sub text-zinc-900 flex flex-col justify-between">
        <header className="p-6 border-b border-zinc-200/80 bg-white">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-sm shadow-sm">
                O
              </div>
              <span className="font-heading font-black tracking-tight text-base text-zinc-900">
                Oresto <span className="text-[#FF6B00]">Insights</span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Réponse enregistrée
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-5 py-12 text-center my-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle2 size={32} />
          </motion.div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-900 mb-3 tracking-tight">
            Merci pour votre participation.
          </h1>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Vos réponses vont nous aider à mieux comprendre les besoins réels des restaurants et commerces du Bénin, et à construire Oresto autour de problèmes concrets du terrain.
          </p>

          {form.contactConsent && (form.wantsToTest === "Oui" || form.wantsToTest === "Peut-être") && (
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/70 text-xs text-[#EA580C] font-medium mb-8 flex items-center gap-3 text-left">
              <Sparkles size={18} className="shrink-0 text-[#FF6B00]" />
              <span>
                <strong>Nous vous contacterons sur WhatsApp</strong> lorsque les premiers tests privés d'Oresto seront ouverts.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/"
              className="px-6 py-3.5 rounded-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs font-bold transition-all shadow-xs"
            >
              Découvrir Oresto
            </Link>
            <a
              href="https://wa.me/22997000000?text=Bonjour,%20je%20viens%20de%20participer%20%C3%A0%20l'%C3%A9tude%20Oresto%20Insights%20et%20je%20souhaite%20tester%20la%20plateforme%20en%20avant-premi%C3%A8re."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-md shadow-[#FF6B00]/20 flex items-center justify-center gap-2"
            >
              <span>Je souhaite tester Oresto</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </main>

        <footer className="p-6 text-center text-xs text-zinc-400 border-t border-zinc-200/60 bg-white">
          <p>© {new Date().getFullYear()} Oresto • Étude de marché indépendante Bénin</p>
        </footer>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE D'ACCUEIL DU QUESTIONNAIRE (AVANT DE COMMENCER)
  // ══════════════════════════════════════════════════════════════════════════════
  if (!started) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] font-sub text-zinc-900 selection:bg-orange-100 selection:text-[#EA580C]">
        {/* Header simple */}
        <header className="py-4 px-6 bg-white border-b border-zinc-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-sm shadow-sm">
                O
              </div>
              <div>
                <span className="font-heading font-black tracking-tight text-base text-zinc-900 block leading-tight">
                  Oresto <span className="text-[#FF6B00]">Insights</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium block">
                  Étude de marché • Restauration Bénin
                </span>
              </div>
            </div>
            <Link
              to="/insights/admin"
              className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <Lock size={12} />
              <span>Espace Admin</span>
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="max-w-3xl mx-auto px-5 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100/80 text-[#EA580C] text-xs font-bold mb-5">
            <Sparkles size={13} className="text-[#FF6B00]" />
            <span>Consultation des professionnels de terrain au Bénin</span>
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-zinc-900 tracking-tight leading-[1.15] mb-5">
            Les restaurants évoluent. <br className="hidden sm:inline" />
            <span className="text-[#FF6B00]">Oresto</span> veut comprendre comment.
          </h1>

          <div className="max-w-xl mx-auto text-zinc-600 text-sm sm:text-base leading-relaxed space-y-3 mb-8">
            <p>
              Nous travaillons sur Oresto, une plateforme conçue pour aider les restaurants, maquis, fast-foods et traiteurs à mieux présenter leurs produits, recevoir leurs commandes et gérer leur activité.
            </p>
            <p>
              Avant de finaliser notre solution, nous voulons comprendre les <strong>réalités concrètes des professionnels du terrain</strong>.
            </p>
            <p className="text-zinc-800 font-semibold text-xs sm:text-sm bg-zinc-100 py-1.5 px-3 rounded-lg inline-block">
              ⏱️ Ce questionnaire prend environ <strong className="text-zinc-900">3 à 5 minutes</strong>.
            </p>
          </div>

          <div className="space-y-2.5 max-w-sm mx-auto">
            <button
              onClick={() => {
                setStarted(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full py-4 px-8 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm sm:text-base shadow-lg shadow-[#FF6B00]/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Participer à l'étude</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-zinc-500 font-medium">
              Vos réponses nous aideront à construire une solution réellement adaptée aux restaurants.
            </p>
          </div>
        </section>

        {/* SECTION À PROPOS D'ORESTO */}
        <section className="max-w-3xl mx-auto px-5 py-10 border-t border-zinc-200">
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
            <h2 className="font-heading font-black text-xl text-zinc-900 mb-3 tracking-tight">
              À propos d'Oresto
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6">
              Oresto est une plateforme destinée aux restaurants et commerces qui souhaitent disposer d'une présence digitale professionnelle et simplifier la gestion de leurs commandes, produits et clients.
              Selon les besoins de l'établissement, Oresto peut notamment proposer :
            </p>

            {/* Cartes de fonctionnalités */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "fa-solid fa-qrcode", title: "Menu digital", desc: "Consultable par QR Code" },
                { icon: "fa-solid fa-cart-shopping", title: "Commandes en ligne", desc: "Sans intermédiaire" },
                { icon: "fa-solid fa-store", title: "Vitrine personnalisée", desc: "À vos couleurs" },
                { icon: "fa-solid fa-utensils", title: "Gestion commandes", desc: "Suivi cuisine en direct" },
                { icon: "fa-solid fa-boxes-stacked", title: "Gestion des stocks", desc: "Alertes ruptures" },
                { icon: "fa-solid fa-calendar-check", title: "Réservations", desc: "Tables & couverts" },
                { icon: "fa-solid fa-chart-line", title: "Statistiques", desc: "Chiffre d'affaires live" },
                { icon: "fa-solid fa-mobile-screen", title: "Paiements", desc: "Mobile Money direct" },
              ].map((card, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-zinc-200/80 text-left">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xs mb-2 border border-orange-100">
                    <i className={card.icon}></i>
                  </div>
                  <h3 className="font-heading font-bold text-xs text-zinc-900 mb-0.5">{card.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium leading-tight">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 text-white text-xs sm:text-sm text-center leading-relaxed">
              <p className="font-medium text-zinc-300">
                Mais avant de déterminer exactement quelles fonctionnalités et quelles formules proposer, <strong className="text-white">nous voulons connaître votre réalité de terrain</strong>.
              </p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setStarted(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="py-3.5 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-sub font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Commencer le questionnaire</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-zinc-400 border-t border-zinc-200">
          <p>© {new Date().getFullYear()} Oresto Insights • Plateforme de consultation des restaurateurs du Bénin.</p>
        </footer>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // SYSTÈME DE QUESTIONNAIRE INTERACTIF (ÉTAPES 1 À 7)
  // ══════════════════════════════════════════════════════════════════════════════
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sub text-zinc-900 flex flex-col justify-between selection:bg-orange-100 selection:text-[#EA580C]">
      {/* Barre de navigation & Progression */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-xs shadow-xs">
              O
            </div>
            <span className="font-heading font-black text-sm text-zinc-900">
              Oresto <span className="text-[#FF6B00]">Insights</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-500">
              Étape <span className="text-zinc-900 font-extrabold">{currentStep}</span> sur {totalSteps}
            </span>
            <span className="text-[11px] font-black text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Barre de progression fluide */}
        <div className="w-full h-1 bg-zinc-100 overflow-hidden">
          <motion.div
            className="h-full bg-[#FF6B00]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>
      </header>

      {/* Champ Honeypot invisible pour bloquer les spams */}
      <input
        type="text"
        name="website_url_honey"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* CONTENU DU QUESTIONNAIRE */}
      <main className="max-w-2xl w-full mx-auto px-5 py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 1 — PROFIL DU RESTAURANT */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 1 • Profil de votre établissement
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Parlez-nous de votre établissement
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Ces informations nous permettent de contextualiser votre réalité quotidienne.
                  </p>
                </div>

                {/* Q1 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Store size={14} className="text-[#FF6B00]" />
                    Q1. Quel type d'établissement gérez-vous ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Restaurant", icon: "fa-solid fa-utensils" },
                      { label: "Maquis", icon: "fa-solid fa-fire-burner" },
                      { label: "Fast-food", icon: "fa-solid fa-burger" },
                      { label: "Traiteur", icon: "fa-solid fa-wheat-awn" },
                      { label: "Café / snack", icon: "fa-solid fa-mug-hot" },
                      { label: "Bar / lounge", icon: "fa-solid fa-martini-glass" },
                      { label: "Hôtel avec restaurant", icon: "fa-solid fa-hotel" },
                      { label: "Autre", icon: "fa-solid fa-store" },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleSingleSelect("establishmentType", label)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.establishmentType === label
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <i className={`${icon} text-[#FF6B00] text-xs`}></i>
                          <span>{label}</span>
                        </span>
                        {form.establishmentType === label && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Clock size={14} className="text-[#FF6B00]" />
                    Q2. Depuis combien de temps votre établissement existe-t-il ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Moins de 1 an", "1 à 3 ans", "3 à 5 ans", "Plus de 5 ans"].map((age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => handleSingleSelect("establishmentAge", age)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.establishmentAge === age
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{age}</span>
                        {form.establishmentAge === age && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#FF6B00]" />
                    Q3. Dans quelle ville se situe votre établissement ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Cotonou",
                      "Abomey-Calavi",
                      "Porto-Novo",
                      "Parakou",
                      "Abomey",
                      "Bohicon",
                      "Ouidah",
                      "Autre",
                    ].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleSingleSelect("city", city)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.city === city
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{city}</span>
                        {form.city === city && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Users size={14} className="text-[#FF6B00]" />
                    Q4. Combien de personnes travaillent régulièrement dans votre établissement ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {["1–2", "3–5", "6–10", "11–20", "Plus de 20"].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => handleSingleSelect("employeeCount", count)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                          form.employeeCount === count
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="font-heading font-black text-sm">{count}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">personnes</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 2 — COMMENT VOUS FONCTIONNEZ AUJOURD'HUI */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 2 • Organisation actuelle
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Comment gérez-vous actuellement votre activité ?
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Comprendre vos canaux et méthodes actuels pour bâtir des passerelles adaptées.
                  </p>
                </div>

                {/* Q5 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone size={14} className="text-[#FF6B00]" />
                      Q5. Comment vos clients passent-ils principalement leurs commandes ? *
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">Choix multiples</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Sur place", icon: "fa-solid fa-chair text-amber-500" },
                      { label: "Téléphone", icon: "fa-solid fa-phone text-blue-500" },
                      { label: "WhatsApp", icon: "fa-brands fa-whatsapp text-emerald-500" },
                      { label: "Facebook", icon: "fa-brands fa-facebook text-blue-600" },
                      { label: "Instagram", icon: "fa-brands fa-instagram text-pink-500" },
                      { label: "Site internet", icon: "fa-solid fa-globe text-indigo-500" },
                      { label: "Application", icon: "fa-solid fa-mobile-screen text-purple-500" },
                      { label: "Autre", icon: "fa-solid fa-ellipsis text-zinc-400" },
                    ].map(({ label, icon }) => {
                      const isSel = form.orderChannels.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleMultiToggle("orderChannels", label)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                            isSel
                              ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <i className={`${icon} text-xs`}></i>
                            <span>{label}</span>
                          </span>
                          {isSel && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q6 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Globe size={14} className="text-[#FF6B00]" />
                    Q6. Avez-vous actuellement un site internet professionnel ? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      "Oui",
                      "Non",
                      "Oui, mais il n'est plus vraiment utilisé",
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleSingleSelect("websiteStatus", status)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.websiteStatus === status
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{status}</span>
                        {form.websiteStatus === status && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>

                  {/* Affichage conditionnel si NON */}
                  {form.websiteStatus === "Non" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 mt-3"
                    >
                      <label className="text-xs font-bold text-zinc-700 block">
                        Pourquoi n'avez-vous pas encore de site internet ? (Choix multiples)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Trop cher",
                          "Je n'en vois pas l'utilité",
                          "Je ne sais pas comment en créer un",
                          "Je préfère WhatsApp",
                          "Trop compliqué à gérer",
                          "Je n'ai pas encore eu le temps",
                          "Autre",
                        ].map((reason) => {
                          const isSel = form.noWebsiteReasons.includes(reason);
                          return (
                            <button
                              key={reason}
                              type="button"
                              onClick={() => handleMultiToggle("noWebsiteReasons", reason)}
                              className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                                isSel
                                  ? "border-[#FF6B00] bg-white text-[#EA580C] font-bold shadow-xs"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-600"
                              }`}
                            >
                              <span>{reason}</span>
                              {isSel && <CheckCircle2 size={13} className="text-[#FF6B00]" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Q7 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#FF6B00]" />
                    Q7. Comment présentez-vous actuellement votre menu ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Menu papier", icon: "fa-solid fa-book-open text-amber-600" },
                      { label: "Image envoyée sur WhatsApp", icon: "fa-brands fa-whatsapp text-emerald-500" },
                      { label: "PDF", icon: "fa-solid fa-file-pdf text-red-500" },
                      { label: "QR Code", icon: "fa-solid fa-qrcode text-indigo-600" },
                      { label: "Site internet", icon: "fa-solid fa-globe text-blue-500" },
                      { label: "Réseaux sociaux", icon: "fa-brands fa-instagram text-pink-500" },
                      { label: "Autre", icon: "fa-solid fa-ellipsis text-zinc-400" },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleSingleSelect("menuMethod", label)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.menuMethod === label
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <i className={`${icon} text-xs`}></i>
                          <span>{label}</span>
                        </span>
                        {form.menuMethod === label && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q8 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Utensils size={14} className="text-[#FF6B00]" />
                    Q8. Comment gérez-vous vos commandes ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Cahier papier", icon: "fa-solid fa-book text-amber-600" },
                      { label: "WhatsApp", icon: "fa-brands fa-whatsapp text-emerald-500" },
                      { label: "Téléphone", icon: "fa-solid fa-phone text-blue-500" },
                      { label: "Excel / Google Sheets", icon: "fa-solid fa-table text-emerald-600" },
                      { label: "Logiciel", icon: "fa-solid fa-desktop text-indigo-500" },
                      { label: "Application", icon: "fa-solid fa-mobile-screen text-purple-500" },
                      { label: "Autre", icon: "fa-solid fa-ellipsis text-zinc-400" },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleSingleSelect("orderManagement", label)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.orderManagement === label
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <i className={`${icon} text-xs`}></i>
                          <span>{label}</span>
                        </span>
                        {form.orderManagement === label && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 3 — PROBLÈMES */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 3 • Problèmes réels
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Quelles sont vos principales difficultés ?
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Nous voulons concevoir des outils qui résolvent des maux de tête réels, pas des gadgets.
                  </p>
                </div>

                {/* Q9 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-[#FF6B00]" />
                      Q9. Parmi ces problèmes, lesquels rencontrez-vous ? (Choix multiples) *
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Trop de commandes dispersées sur WhatsApp",
                      "Erreurs dans les commandes",
                      "Difficulté à suivre les commandes",
                      "Difficulté à gérer les livraisons",
                      "Difficulté à gérer les stocks",
                      "Menu difficile à mettre à jour",
                      "Peu de visibilité sur internet",
                      "Difficulté à attirer de nouveaux clients",
                      "Difficulté à gérer les réservations",
                      "Manque de statistiques sur les ventes",
                      "Difficulté à suivre les revenus",
                      "Aucun problème majeur",
                      "Autre",
                    ].map((problem) => {
                      const isSel = form.problems.includes(problem);
                      return (
                        <button
                          key={problem}
                          type="button"
                          onClick={() => handleMultiToggle("problems", problem)}
                          className={`p-3 rounded-2xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                            isSel
                              ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] font-bold shadow-xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <span>{problem}</span>
                          {isSel && <CheckCircle2 size={14} className="text-[#FF6B00] shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q10 */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-[#FF6B00]" />
                    Q10. Quel est actuellement votre PLUS gros problème dans la gestion de votre établissement ? *
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    Soyez aussi concret que possible (ex: commandes perdues aux heures de pointe, livreurs en retard, fiches manuscrites illisibles...).
                  </p>
                  <textarea
                    rows={4}
                    value={form.biggestProblem}
                    onChange={(e) => setForm((prev) => ({ ...prev, biggestProblem: e.target.value }))}
                    placeholder="Décrivez votre principal problème ici..."
                    className="w-full p-4 rounded-2xl border border-zinc-200 bg-white text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                  />
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 4 — INTÉRÊT POUR ORESTO (1 à 5) */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 4 • Utilité des fonctionnalités
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Imaginons votre établissement avec Oresto
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Pour chaque fonctionnalité, indiquez à quel point elle vous serait utile dans votre quotidien (de 1 = pas utile à 5 = très utile).
                  </p>
                </div>

                <div className="space-y-3.5">
                  {FEATURES_TO_EVALUATE.map((feat, index) => {
                    const currentScore = form.featureScores[feat.id] || 3;
                    return (
                      <div
                        key={feat.id}
                        className="p-4 rounded-2xl bg-white border border-zinc-200/90 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 font-bold text-[10px] flex items-center justify-center">
                                {index + 1}
                              </span>
                              <h3 className="font-heading font-bold text-xs sm:text-sm text-zinc-900">
                                {feat.title}
                              </h3>
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-1 ml-7 leading-relaxed">
                              {feat.desc}
                            </p>
                          </div>
                        </div>

                        {/* Échelle 1 à 5 */}
                        <div className="pt-1 border-t border-zinc-100 flex items-center justify-between gap-1.5 sm:gap-2">
                          {[
                            { val: 1, label: "Pas du tout" },
                            { val: 2, label: "Peu" },
                            { val: 3, label: "Moyennement" },
                            { val: 4, label: "Utile" },
                            { val: 5, label: "Très utile" },
                          ].map((item) => {
                            const isSelected = currentScore === item.val;
                            return (
                              <button
                                key={item.val}
                                type="button"
                                onClick={() =>
                                  setForm((prev) => ({
                                    ...prev,
                                    featureScores: { ...prev.featureScores, [feat.id]: item.val },
                                  }))
                                }
                                className={`flex-1 py-2 px-1 rounded-xl text-center transition-all ${
                                  isSelected
                                    ? "bg-[#FF6B00] text-white font-bold shadow-xs scale-102"
                                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/60"
                                }`}
                              >
                                <span className="block font-heading font-black text-xs sm:text-sm">
                                  {item.val}
                                </span>
                                <span className="block text-[8px] sm:text-[9px] truncate">
                                  {item.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 5 — MODÈLE ÉCONOMIQUE */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 5 • Modèle économique
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Comment préféreriez-vous payer pour ce type de solution ?
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Cette étude est totalement neutre : nous cherchons le modèle le plus juste et le plus pérenne pour les restaurateurs.
                  </p>
                </div>

                {/* Q11 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-[#FF6B00]" />
                    Q11. Quel modèle vous semblerait le plus adapté ? *
                  </label>
                  <div className="space-y-2">
                    {[
                      "Payer un abonnement mensuel fixe",
                      "Ne pas payer d'abonnement mais payer un pourcentage sur les ventes réalisées via la plateforme",
                      "Un petit abonnement + un petit pourcentage",
                      "Une formule gratuite avec des fonctionnalités limitées + des formules payantes",
                      "Je ne sais pas encore",
                    ].map((model) => (
                      <button
                        key={model}
                        type="button"
                        onClick={() => handleSingleSelect("preferredPricingModel", model)}
                        className={`w-full p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.preferredPricingModel === model
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{model}</span>
                        {form.preferredPricingModel === model && <CheckCircle2 size={16} className="text-[#FF6B00] shrink-0 ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q12 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-[#FF6B00]" />
                    Q12. Si vous deviez payer un abonnement mensuel pour une solution comme Oresto, quel montant vous semblerait acceptable ? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Moins de 2 500 FCFA / mois",
                      "2 500 – 5 000 FCFA",
                      "5 000 – 10 000 FCFA",
                      "10 000 – 15 000 FCFA",
                      "15 000 – 25 000 FCFA",
                      "Plus de 25 000 FCFA",
                      "Je ne paierais pas d'abonnement",
                    ].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleSingleSelect("acceptableSubscription", tier)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.acceptableSubscription === tier
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{tier}</span>
                        {form.acceptableSubscription === tier && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q13 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#FF6B00]" />
                    Q13. Si vous préfériez un modèle basé sur les ventes, quel niveau de commission vous semblerait acceptable ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "0 %",
                      "Moins de 2 %",
                      "2–3 %",
                      "3–5 %",
                      "Plus de 5 %",
                      "Je ne souhaite pas payer de commission",
                    ].map((comm) => (
                      <button
                        key={comm}
                        type="button"
                        onClick={() => handleSingleSelect("acceptableCommission", comm)}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          form.acceptableCommission === comm
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{comm}</span>
                        {form.acceptableCommission === comm && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 6 — PAIEMENT ET CONFIANCE */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 6 • Paiements & Freins
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Ce qui compte pour vous
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Identifier vos habitudes d'encaissement et vos réticences éventuelles.
                  </p>
                </div>

                {/* Q14 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#FF6B00]" />
                      Q14. Quels moyens de paiement utilisez-vous actuellement ? (Choix multiples) *
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: "MTN Mobile Money", icon: "fa-solid fa-mobile-screen text-amber-500" },
                      { label: "Moov Money", icon: "fa-solid fa-mobile-screen-button text-blue-600" },
                      { label: "Celtiis", icon: "fa-solid fa-wallet text-purple-600" },
                      { label: "Espèces", icon: "fa-solid fa-money-bill-wave text-emerald-600" },
                      { label: "Carte bancaire", icon: "fa-solid fa-credit-card text-sky-500" },
                      { label: "Autre", icon: "fa-solid fa-ellipsis text-zinc-400" },
                    ].map(({ label, icon }) => {
                      const isSel = form.paymentMethods.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => handleMultiToggle("paymentMethods", label)}
                          className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                            isSel
                              ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <i className={`${icon} text-xs`}></i>
                            <span>{label}</span>
                          </span>
                          {isSel && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q15 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#FF6B00]" />
                      Q15. Qu'est-ce qui vous ferait hésiter à utiliser une plateforme comme Oresto ? (Choix multiples)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      "Prix",
                      "Commission sur les ventes",
                      "Difficulté d'utilisation",
                      "Manque de confiance",
                      "Paiements",
                      "Problèmes techniques",
                      "Support client",
                      "Je préfère WhatsApp",
                      "Autre",
                    ].map((concern) => {
                      const isSel = form.concerns.includes(concern);
                      return (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => handleMultiToggle("concerns", concern)}
                          className={`p-3 rounded-2xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                            isSel
                              ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] font-bold shadow-xs"
                              : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                          }`}
                        >
                          <span>{concern}</span>
                          {isSel && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Q16 */}
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <Star size={14} className="text-[#FF6B00]" />
                    Q16. Qu'attendriez-vous absolument d'une plateforme destinée à votre établissement ?
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    La chose indispensable sans laquelle vous ne l'utiliseriez pas (facultatif).
                  </p>
                  <textarea
                    rows={3}
                    value={form.expectations}
                    onChange={(e) => setForm((prev) => ({ ...prev, expectations: e.target.value }))}
                    placeholder="Votre attente prioritaire..."
                    className="w-full p-4 rounded-2xl border border-zinc-200 bg-white text-xs text-zinc-800 placeholder:text-zinc-400 outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                  />
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ÉTAPE 7 — CONTACT ET BÊTA-TEST */}
            {/* ────────────────────────────────────────────────────────────── */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C] block mb-1">
                    Étape 7 • Suite & Bêta-test
                  </span>
                  <h2 className="font-heading font-black text-2xl text-zinc-900 tracking-tight">
                    Souhaitez-vous être informé de la suite ?
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Nous sélectionnerons un petit groupe d'établissements au Bénin pour tester Oresto en avant-première.
                  </p>
                </div>

                {/* Souhaitez-vous tester */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#FF6B00]" />
                    Souhaitez-vous tester Oresto lorsqu'il sera disponible ? *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Oui", "Peut-être", "Non"].map((ans) => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => handleSingleSelect("wantsToTest", ans)}
                        className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
                          form.wantsToTest === ans
                            ? "border-[#FF6B00] bg-orange-50/70 text-[#EA580C] shadow-xs"
                            : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700"
                        }`}
                      >
                        <span>{ans}</span>
                        {form.wantsToTest === ans && <CheckCircle2 size={14} className="text-[#FF6B00]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coordonnées si Oui ou Peut-être */}
                {(form.wantsToTest === "Oui" || form.wantsToTest === "Peut-être") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4"
                  >
                    <p className="text-xs font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                      Vos coordonnées pour vous recontacter
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 block mb-1">Votre Nom *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Gildas Houndégnon"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-800 outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 block mb-1">Nom de l'établissement *</label>
                        <input
                          type="text"
                          value={form.establishmentName}
                          onChange={(e) => setForm((prev) => ({ ...prev, establishmentName: e.target.value }))}
                          placeholder="Ex: Restaurant Le Bénin"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-800 outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 block mb-1">Numéro WhatsApp *</label>
                        <input
                          type="tel"
                          value={form.whatsapp}
                          onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                          placeholder="+229 97 00 00 00"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-800 outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 block mb-1">Email (facultatif)</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="contact@monresto.bj"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-800 outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.contactConsent}
                        onChange={(e) => setForm((prev) => ({ ...prev, contactConsent: e.target.checked }))}
                        className="mt-0.5 rounded border-zinc-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                      />
                      <span className="text-xs text-zinc-600 leading-snug">
                        J'accepte d'être recontacté par l'équipe d'Oresto dans le cadre du lancement ou des tests pilotes de la plateforme.
                      </span>
                    </label>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* BOUTONS NAVIGATION PRÉCÉDENT / SUIVANT */}
        <div className="pt-8 border-t border-zinc-200/80 mt-8 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-3 px-5 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft size={14} />
              <span>Précédent</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="py-3 px-5 rounded-full text-zinc-400 hover:text-zinc-600 text-xs font-medium transition-colors"
            >
              Annuler
            </button>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleNext}
            className="py-3.5 px-7 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-xs sm:text-sm shadow-md shadow-[#FF6B00]/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                <span>Envoi des réponses...</span>
              </>
            ) : currentStep === totalSteps ? (
              <>
                <span>Valider et envoyer mes réponses</span>
                <Send size={14} />
              </>
            ) : (
              <>
                <span>Suivant</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </main>

      {/* Footer sobre */}
      <footer className="py-4 px-6 text-center text-xs text-zinc-400 border-t border-zinc-200/60 bg-white">
        <p>Vos réponses sont strictement confidentielles et utilisées uniquement pour l'étude de marché d'Oresto.</p>
      </footer>
    </div>
  );
}
