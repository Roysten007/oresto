import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  SurveyResponse, 
  SurveyFilterOptions,
  EstablishmentType,
  CityBenin
} from "@/types/survey";
import { 
  subscribeToSurveyResponses, 
  seedRealisticMarketData, 
  exportResponsesToCSV, 
  exportLeadsToCSV 
} from "@/services/surveyService";
import RespondentDetailModal from "./RespondentDetailModal";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import {
  LayoutDashboard,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Users,
  MessageSquare,
  Download,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  MapPin,
  Store,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Percent,
  TrendingUp,
  ShieldAlert,
  Database,
  Phone,
  FileSpreadsheet,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#FF6B00", "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6"];

const FEATURE_CATALOG: { id: string; title: string; description: string }[] = [
  { id: "f_vitrine", title: "Vitrine internet personnalisée", description: "Présentation pro du restaurant, adresse, horaires" },
  { id: "f_menu_qr", title: "Menu digital avec QR Code", description: "Consultation sur smartphone en salle sans menu papier" },
  { id: "f_commandes_en_ligne", title: "Commandes en ligne", description: "Prise de commande directe depuis le site" },
  { id: "f_whatsapp_structure", title: "Commandes WhatsApp structurées", description: "Bouton qui envoie la commande pré-remplie" },
  { id: "f_gestion_commandes", title: "Gestion centralisée des commandes", description: "Tableau de suivi des statuts en cuisine et salle" },
  { id: "f_gestion_stocks", title: "Gestion des stocks", description: "Suivi des ingrédients, alertes rupture" },
  { id: "f_reservations", title: "Réservation de tables", description: "Module de réservation en ligne avec confirmation" },
  { id: "f_livraisons", title: "Gestion des livraisons", description: "Suivi des livreurs et zones tarifaires" },
  { id: "f_statistiques", title: "Statistiques de ventes", description: "Rapports d'activité, plats stars, CA" },
  { id: "f_paiement_momo", title: "Paiement Mobile Money", description: "Intégration MTN MoMo, Moov Money, Celtiis" },
  { id: "f_multi_etablissements", title: "Gestion multi-établissements", description: "Piloter plusieurs restaurants depuis un compte" },
  { id: "f_ia_assistant", title: "Assistant IA de gestion", description: "Aide pour rédiger le menu, analyser les ventes" },
];

export default function InsightsAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Filtres
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterModel, setFilterModel] = useState<string>("all");
  const [filterWantsTest, setFilterWantsTest] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Écoute temps réel des réponses
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToSurveyResponses((data) => {
      setResponses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Injection de données de test si la base est vide
  const handleSeedData = async () => {
    try {
      setSeeding(true);
      const count = await seedRealisticMarketData();
      toast.success(`${count} réponses d'étude de marché injectées avec succès !`);
    } catch (e) {
      toast.error("Erreur lors de l'injection des données d'étude.");
    } finally {
      setSeeding(false);
    }
  };

  // Filtrage dynamique des réponses
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      if (filterCountry !== "all" && r.country !== filterCountry && r.city !== filterCountry) return false;
      if (filterType !== "all" && r.establishmentType !== filterType) return false;
      if (filterModel !== "all" && r.preferredPricingModel !== filterModel) return false;
      if (filterWantsTest !== "all" && r.wantsToTest !== filterWantsTest) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name?.toLowerCase().includes(q);
        const matchEstablishment = r.establishmentName?.toLowerCase().includes(q);
        const matchPhone = r.whatsapp?.toLowerCase().includes(q);
        const matchProblem = r.biggestProblem?.toLowerCase().includes(q);
        const matchExpectations = r.expectations?.toLowerCase().includes(q);
        const matchCountry = r.country?.toLowerCase().includes(q);
        const matchCity = r.city?.toLowerCase().includes(q);
        return Boolean(matchName || matchEstablishment || matchPhone || matchProblem || matchExpectations || matchCountry || matchCity);
      }

      return true;
    });
  }, [responses, filterCountry, filterType, filterModel, filterWantsTest, searchQuery]);

  // Statistiques globales calculées dynamiquement
  const totalCount = filteredResponses.length;
  const restaurantsCount = filteredResponses.filter(r => r.establishmentType === "Restaurant").length;
  const interestedInOrestoCount = filteredResponses.filter(r => r.wantsToTest === "Oui" || r.wantsToTest === "Peut-être").length;
  const hotLeadsCount = filteredResponses.filter(r => r.wantsToTest === "Oui" && r.contactConsent && r.whatsapp).length;
  const lastResponseDate = responses.length > 0 ? responses[0].createdAt : null;

  // Calcul répartition Pays / Géographie
  const countryDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResponses.forEach((r) => {
      const c = r.country || r.city || "Non spécifié";
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, percent: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [filteredResponses, totalCount]);

  // Calcul répartition Types
  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResponses.forEach((r) => {
      const t = r.establishmentType || "Autre";
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, percent: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [filteredResponses, totalCount]);

  // Calcul Modèles Économiques
  const pricingModelDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredResponses.forEach((r) => {
      const m = r.preferredPricingModel || "Non précisé";
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percent: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0,
    }));
  }, [filteredResponses, totalCount]);

  // Calcul Budgets Acceptables
  const subscriptionDistribution = useMemo(() => {
    const tiers = [
      "Moins de 2 500 FCFA / mois",
      "2 500 – 5 000 FCFA",
      "5 000 – 10 000 FCFA",
      "10 000 – 15 000 FCFA",
      "15 000 – 25 000 FCFA",
      "Plus de 25 000 FCFA",
      "Je ne paierais pas d'abonnement",
    ];
    return tiers.map((tier) => {
      const value = filteredResponses.filter((r) => r.acceptableSubscription === tier).length;
      return {
        tier: tier.replace(" / mois", "").replace(" FCFA", ""),
        fullName: tier,
        value,
        percent: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0,
      };
    });
  }, [filteredResponses, totalCount]);

  // Calcul Commissions Acceptables
  const commissionDistribution = useMemo(() => {
    const tiers = ["0 %", "Moins de 2 %", "2–3 %", "3–5 %", "Plus de 5 %", "Je ne souhaite pas payer de commission"];
    return tiers.map((tier) => {
      const value = filteredResponses.filter((r) => r.acceptableCommission === tier).length;
      return {
        tier,
        value,
        percent: totalCount > 0 ? Math.round((value / totalCount) * 100) : 0,
      };
    });
  }, [filteredResponses, totalCount]);

  // Calcul Score Utilité des 12 Fonctionnalités
  const featureStats = useMemo(() => {
    if (totalCount === 0) return [];
    return FEATURE_CATALOG.map((f) => {
      let sum = 0;
      let countWithScore = 0;
      let highInterestCount = 0; // scores 4 ou 5

      filteredResponses.forEach((r) => {
        const s = r.featureScores?.[f.id];
        if (typeof s === "number" && s > 0) {
          sum += s;
          countWithScore++;
          if (s >= 4) highInterestCount++;
        }
      });

      const avgScore = countWithScore > 0 ? Number((sum / countWithScore).toFixed(2)) : 0;
      const interestRate = countWithScore > 0 ? Math.round((highInterestCount / countWithScore) * 100) : 0;

      return {
        ...f,
        avgScore,
        votes: countWithScore,
        interestRate,
      };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [filteredResponses, totalCount]);

  // Calcul Fréquence des Problèmes
  const problemsDistribution = useMemo(() => {
    if (totalCount === 0) return [];
    const counts: Record<string, number> = {};

    filteredResponses.forEach((r) => {
      if (Array.isArray(r.problems)) {
        r.problems.forEach((p) => {
          counts[p] = (counts[p] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([problem, count]) => ({
        problem,
        count,
        percent: Math.round((count / totalCount) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredResponses, totalCount]);

  // Leads Bêta Qualifiés
  const qualifiedLeads = useMemo(() => {
    return filteredResponses.filter(
      (r) => r.contactConsent && (r.wantsToTest === "Oui" || r.wantsToTest === "Peut-être") && r.whatsapp
    );
  }, [filteredResponses]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-body">
      {/* Top Banner Oresto Insights */}
      <header className="bg-[#0A0A0A] text-white border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 no-underline">
              <ChevronRight size={14} className="rotate-180 text-primary" />
              Voir l'étude
            </Link>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/30">
                OI
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-black text-lg tracking-tight uppercase leading-none">
                    Oresto Insights
                  </h1>
                  <span className="bg-primary/20 text-primary border border-primary/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    Afrique & Global
                  </span>
                </div>
                <p className="text-[11px] text-white/50 leading-none mt-0.5">
                  Market Research & Décision Modèle Éco
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/survey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors no-underline"
            >
              <span>Voir le questionnaire</span>
              <ExternalLink size={13} className="text-primary" />
            </a>

            {responses.length === 0 && (
              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all"
              >
                <Database size={13} />
                <span>{seeding ? "Chargement..." : "Données démo"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 flex gap-1 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: "overview", label: "Vue Générale", icon: "fa-solid fa-chart-pie" },
            { id: "pricing", label: "Modèle Éco & Tarifs", icon: "fa-solid fa-money-bill-wave" },
            { id: "features", label: "Fonctionnalités", icon: "fa-solid fa-wand-magic-sparkles" },
            { id: "problems", label: "Problèmes & Verbatims", icon: "fa-solid fa-triangle-exclamation" },
            { id: "respondents", label: `Répondants (${filteredResponses.length})`, icon: "fa-solid fa-users" },
            { id: "leads", label: `Leads Bêta (${qualifiedLeads.length})`, icon: "fa-brands fa-whatsapp" },
            { id: "exports", label: "Exports & Données", icon: "fa-solid fa-download" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <i className={`${tab.icon} text-xs`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Barre de Filtres Intelligents (Section 13) */}
        <section className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
              <Filter size={15} className="text-primary" />
              <span>Filtrer les réponses de l'étude</span>
              <span className="text-[11px] font-normal text-slate-400">
                ({filteredResponses.length} sur {responses.length} réponses)
              </span>
            </div>

            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher resto, ville, mot-clé, verbatim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100">
            {/* Pays */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Pays / Région
              </label>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-primary"
              >
                <option value="all">Tous les pays</option>
                <option value="Bénin">Bénin</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Togo">Togo</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Mali">Mali</option>
                <option value="Gabon">Gabon</option>
                <option value="Guinée">Guinée</option>
                <option value="Niger">Niger</option>
                <option value="Congo">Congo</option>
                <option value="RD Congo">RD Congo</option>
                <option value="France">France</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Type Établissement
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-primary"
              >
                <option value="all">Tous les types</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Boutique / Magasin">Boutique / Magasin</option>
                <option value="Boutique en ligne / E-commerce">Boutique en ligne / E-commerce</option>
                <option value="Maquis">Maquis</option>
                <option value="Fast-food">Fast-food</option>
                <option value="Traiteur">Traiteur</option>
                <option value="Café / snack">Café / snack</option>
                <option value="Bar / lounge">Bar / lounge</option>
                <option value="Hôtel avec restaurant">Hôtel avec resto</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Modèle Éco */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Modèle Préféré
              </label>
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-primary"
              >
                <option value="all">Tous les modèles</option>
                <option value="Payer un abonnement mensuel fixe">Abonnement fixe</option>
                <option value="Ne pas payer d'abonnement mais payer un pourcentage sur les ventes">Commission pure</option>
                <option value="Un petit abonnement + un petit pourcentage">Hybride (Abo + Com)</option>
                <option value="Une formule gratuite limitée + des formules payantes">Freemium</option>
                <option value="Je ne sais pas encore">Indécis</option>
              </select>
            </div>

            {/* Souhait de tester */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Souhaite Tester
              </label>
              <select
                value={filterWantsTest}
                onChange={(e) => setFilterWantsTest(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-primary"
              >
                <option value="all">Tous</option>
                <option value="Oui">Oui (Leads chauds)</option>
                <option value="Peut-être">Peut-être</option>
                <option value="Non">Non</option>
              </select>
            </div>
          </div>

          {(filterCity !== "all" || filterType !== "all" || filterModel !== "all" || filterWantsTest !== "all" || searchQuery) && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setFilterCity("all");
                  setFilterType("all");
                  setFilterModel("all");
                  setFilterWantsTest("all");
                  setSearchQuery("");
                }}
                className="text-xs text-primary hover:underline font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            TAB 1: VUE GÉNÉRALE (OVERVIEW)
        ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Total Réponses</span>
                <div className="text-3xl font-black font-heading text-slate-900 mt-2">{totalCount}</div>
                <p className="text-[11px] text-slate-500 mt-1">Établissements audités</p>
                <div className="absolute right-4 bottom-4 text-primary/10">
                  <Store size={48} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Restaurants & Maquis</span>
                <div className="text-3xl font-black font-heading text-primary mt-2">
                  {restaurantsCount}
                  <span className="text-sm font-medium text-slate-400 ml-1.5">
                    ({totalCount > 0 ? Math.round((restaurantsCount / totalCount) * 100) : 0}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Cœur de cible Oresto</p>
                <div className="absolute right-4 bottom-4 text-emerald-500/10">
                  <Users size={48} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Intéressés par Oresto</span>
                <div className="text-3xl font-black font-heading text-emerald-600 mt-2">
                  {interestedInOrestoCount}
                  <span className="text-sm font-medium text-slate-400 ml-1.5">
                    ({totalCount > 0 ? Math.round((interestedInOrestoCount / totalCount) * 100) : 0}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Réponse "Oui" ou "Peut-être"</p>
                <div className="absolute right-4 bottom-4 text-emerald-500/10">
                  <TrendingUp size={48} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Leads Bêta Prêts</span>
                <div className="text-3xl font-black font-heading text-slate-900 mt-2">
                  {hotLeadsCount}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Coordonnées & accord reçus</p>
                <div className="absolute right-4 bottom-4 text-amber-500/10">
                  <MessageSquare size={48} />
                </div>
              </div>
            </div>

            {/* Insight Neutre Automatique (Section 20) */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary mb-2">
                <Sparkles size={16} />
                <span>Tendances Clés Observées sur le Terrain (Synthèse Descriptive)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/80">
                <div className="border-l-2 border-primary/40 pl-3">
                  <strong className="text-white block font-bold mb-1">Canaux de commande actuels :</strong>
                  WhatsApp et la vente sur place dominent largement les prises de commande auprès des restaurateurs interrogés.
                </div>
                <div className="border-l-2 border-primary/40 pl-3">
                  <strong className="text-white block font-bold mb-1">Fréquence du besoin Menu & Commandes :</strong>
                  La dispersion des commandes WhatsApp et la mise à jour difficile du menu sont citées parmi les frictions quotidiennes majeures.
                </div>
                <div className="border-l-2 border-primary/40 pl-3">
                  <strong className="text-white block font-bold mb-1">Bêta-testeurs potentiels :</strong>
                  {hotLeadsCount} restaurateurs ont formellement laissé leur numéro WhatsApp pour tester la première version.
                </div>
              </div>
            </div>

            {/* Graphiques Répartition Villes & Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Villes */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  Répartition Géographique
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryDistribution} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FF6B00" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Types d'établissement */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Store size={16} className="text-primary" />
                  Typologie des Établissements
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${percent}%)`}
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MODÈLE ÉCONOMIQUE & TARIFS (PRICING INSIGHTS)
        ======================================================== */}
        {activeTab === "pricing" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-black font-heading text-slate-900">
                Analyse du Modèle Économique & Disposition à Payer
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Données objectives recueillies pour orienter la tarification d'Oresto sans induire de biais.
              </p>
            </div>

            {/* Modèle économique préféré */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-base uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Modèle Préféré par les Restaurateurs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pricingModelDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pricingModelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {pricingModelDistribution.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs font-semibold text-slate-800">{m.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{m.value}</span>
                        <span className="text-xs text-slate-400 ml-1">({m.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grilles Budgets Abonnement & Commissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Abonnement mensuel */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CreditCard size={16} className="text-emerald-600" />
                  Budget Mensuel Acceptable (FCFA / mois)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subscriptionDistribution} margin={{ top: 10, bottom: 40, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="tier" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Commission sur les ventes */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Percent size={16} className="text-amber-500" />
                  Niveau de Commission Acceptable
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={commissionDistribution} margin={{ top: 10, bottom: 40, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="tier" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: ANALYSE DES FONCTIONNALITÉS (FEATURES)
        ======================================================== */}
        {activeTab === "features" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-black font-heading text-slate-900">
                Utilité des Fonctionnalités Oresto
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Classement par note moyenne (sur 5) et par taux d'intérêt fort (note 4 ou 5 sur 5).
              </p>
            </div>

            <div className="space-y-3">
              {featureStats.map((feat, idx) => (
                <div 
                  key={feat.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <h3 className="font-heading font-black text-base text-slate-900">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 pl-8">
                      {feat.description}
                    </p>
                  </div>

                  {/* Barres et scores */}
                  <div className="flex items-center gap-6 shrink-0 md:min-w-[280px]">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Intérêt fort (4-5)</span>
                        <span className="font-black text-slate-900">{feat.interestRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${feat.interestRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-slate-900 leading-none">
                        {feat.avgScore} <span className="text-xs font-normal text-slate-400">/ 5</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {feat.votes} évaluation{feat.votes > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: ANALYSE DES PROBLÈMES & VERBATIMS (PROBLEMS)
        ======================================================== */}
        {activeTab === "problems" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-4 border-amber-500 pl-4">
              <h2 className="text-2xl font-black font-heading text-slate-900">
                Difficultés & Problèmes Exprimés sur le Terrain
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Problèmes les plus fréquemment cochés et verbatims authentiques saisis par les restaurateurs.
              </p>
            </div>

            {/* Fréquence des problèmes cochés */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Problèmes les Plus Fréquemment Rencontrés
              </h3>

              <div className="space-y-3">
                {problemsDistribution.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{p.problem}</span>
                      <span className="font-black text-slate-900">{p.percent}% ({p.count} resto{p.count > 1 ? "s" : ""})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verbatims : Quel est votre plus gros problème ? */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" />
                  Verbatims Bruts : « Quel est actuellement votre PLUS gros problème ? »
                </h3>
                <span className="text-xs text-slate-400">
                  {filteredResponses.filter(r => r.biggestProblem).length} verbatims
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResponses
                  .filter((r) => r.biggestProblem && r.biggestProblem.trim().length > 0)
                  .map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedResponse(r)}
                      className="bg-slate-50 hover:bg-orange-50/40 border border-slate-200/70 hover:border-orange-300 rounded-xl p-4 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {r.establishmentName || "Établissement"} ({r.establishmentType})
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin size={11} />
                          {r.country ? (r.city ? `${r.country} (${r.city})` : r.country) : (r.city || "Non spécifié")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 italic leading-relaxed">
                        "{r.biggestProblem}"
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: LISTE DES RÉPONDANTS (RESPONDENTS)
        ======================================================== */}
        {activeTab === "respondents" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-heading text-slate-900">
                  Répertoire des Répondants ({filteredResponses.length})
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Cliquez sur une ligne pour examiner la fiche complète et accéder aux coordonnées.
                </p>
              </div>

              <button
                onClick={() => exportResponsesToCSV(filteredResponses)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
              >
                <Download size={14} />
                <span>Exporter en CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-4">Établissement</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Pays / Ville</th>
                      <th className="p-4">Taille</th>
                      <th className="p-4">Modèle préféré</th>
                      <th className="p-4">Budget abo</th>
                      <th className="p-4">Bêta-test</th>
                      <th className="p-4">WhatsApp</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredResponses.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedResponse(r)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="p-4 font-bold text-slate-900">
                          {r.establishmentName || "Sans nom précisé"}
                          {r.name && <span className="block text-[11px] font-normal text-slate-500">{r.name}</span>}
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {r.establishmentType}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-slate-900">{r.country || r.city || "Non spécifié"}</span>
                          {r.country && r.city && <span className="block text-[10px] text-slate-400">{r.city}</span>}
                        </td>
                        <td className="p-4">{r.employeeCount} emp.</td>
                        <td className="p-4 font-medium text-slate-700">
                          {r.preferredPricingModel?.split(" ")[0]}...
                        </td>
                        <td className="p-4 text-emerald-700 font-semibold">
                          {r.acceptableSubscription?.replace(" FCFA / mois", "") || "-"}
                        </td>
                        <td className="p-4">
                          {r.wantsToTest === "Oui" ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                              Oui
                            </span>
                          ) : r.wantsToTest === "Peut-être" ? (
                            <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">
                              Peut-être
                            </span>
                          ) : (
                            <span className="text-slate-400">Non</span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          {r.whatsapp ? (
                            <span className="text-emerald-700 font-semibold">{r.whatsapp}</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResponse(r);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-slate-700 font-bold transition-colors"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredResponses.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">
                          Aucun répondant ne correspond aux critères de recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: CONTACTS BÊTA-TEST (LEADS)
        ======================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h2 className="text-2xl font-black font-heading text-slate-900">
                  Prospects & Bêta-Testeurs Qualifiés ({qualifiedLeads.length})
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Restaurateurs ayant expressément consenti à être recontactés par WhatsApp pour tester Oresto.
                </p>
              </div>

              <button
                onClick={() => exportLeadsToCSV(responses)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                <Download size={14} />
                <span>Exporter la liste des Leads (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualifiedLeads.map((lead) => {
                const cleanPhone = lead.whatsapp?.replace(/[^0-9+]/g, "") || "";
                const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : cleanPhone.length === 8 ? "229" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                  `Bonjour ${lead.name || ""}, je vous contacte suite à votre participation à l'étude Oresto Insights concernant ${lead.establishmentName || "votre établissement"}.`
                )}`;

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {lead.establishmentType}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {lead.country || lead.city || "Non spécifié"}
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                        {lead.establishmentName || "Sans nom"}
                      </h3>

                      <p className="text-xs font-semibold text-slate-700">
                        Contact : {lead.name || "Responsable"}
                      </p>

                      <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <p className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <Phone size={13} className="text-emerald-600" />
                          {lead.whatsapp}
                        </p>
                        {lead.email && (
                          <p className="text-slate-500 truncate text-[11px]">
                            {lead.email}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 pt-1">
                          Budget envisagé : <strong className="text-slate-800">{lead.acceptableSubscription || "Non précisé"}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm no-underline"
                      >
                        <MessageSquare size={14} />
                        <span>WhatsApp direct</span>
                      </a>
                      <button
                        onClick={() => setSelectedResponse(lead)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      >
                        Fiche
                      </button>
                    </div>
                  </div>
                );
              })}

              {qualifiedLeads.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl p-12 text-center text-slate-400">
                  Aucun lead bêta correspondant aux critères.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: EXPORTS & DONNÉES (EXPORTS)
        ======================================================== */}
        {activeTab === "exports" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-black font-heading text-slate-900">
                Exports & Téléchargement des Données
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Téléchargez les jeux de données brutes ou filtrées pour analyse dans Excel, Google Sheets ou CRM.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Toutes les Réponses */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center">
                  <FileSpreadsheet size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Export Complet de l'Étude (CSV)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Contient l'intégralité des 24 colonnes : profil, canaux de commande, difficultés, scores des 12 fonctionnalités, choix de modèle économique, budgets, moyens de paiement et verbatims.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => exportResponsesToCSV(filteredResponses)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/20"
                  >
                    <Download size={15} />
                    <span>Télécharger CSV Complet ({filteredResponses.length} lignes)</span>
                  </button>
                </div>
              </div>

              {/* Export Leads Bêta */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-black text-lg text-slate-900">
                    Export Prospects & Bêta-Testeurs (CSV)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Liste filtrée des professionnels prêts à tester Oresto avec leurs numéros WhatsApp, établissement, ville, budget mensuel envisagé et leur principal problème.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => exportLeadsToCSV(filteredResponses)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Download size={15} />
                    <span>Télécharger Liste WhatsApp ({qualifiedLeads.length} leads)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Fiche Détaillée d'un Répondant (Section 12) */}
      <RespondentDetailModal
        response={selectedResponse}
        onClose={() => setSelectedResponse(null)}
      />
    </div>
  );
}
