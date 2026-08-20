import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { db } from "@/lib/firebase";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { Commission, ReferredClient } from "@/data/prestataireTypes";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Copy,
  Share2,
  LogOut,
  ExternalLink,
  Store,
  Calendar,
  Percent,
  Sparkles,
  Zap,
  ArrowUpRight
} from "lucide-react";

export default function PrestataireDashboard() {
  const { prestataire, isAuthenticated, isLoading, logoutPrestataire } = usePrestataire();
  const navigate = useNavigate();

  const [clients, setClients] = useState<ReferredClient[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirection si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/prestataire/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Chargement des données temps réel liées au prestataire
  useEffect(() => {
    if (!prestataire?.uid || !db) {
      setLoadingData(false);
      return;
    }

    const pUid = prestataire.uid;

    // 1. Écouter les clients parrainés (dans vendors où prestataire_id === pUid)
    const vendorsRef = ref(db, "vendors");
    const unsubVendors = onValue(vendorsRef, (snap) => {
      if (snap.exists()) {
        const allVendors = snap.val();
        const list: ReferredClient[] = [];

        for (const vId of Object.keys(allVendors)) {
          const v = allVendors[vId];
          if (v.prestataire_id === pUid || v.referral_code === prestataire.code_referral) {
            const plan = v.subscriptionPlan || "pro";
            const monthlyComm = 1000; // 20% de l'abonnement standard Oresto Pro 5 000 FCFA
            list.push({
              id: vId,
              name: v.name || "Établissement Partenaire",
              category: v.category || "Commerce",
              city: v.city || "Cotonou",
              joinedDate: v.joinedDate || new Date().toISOString().split("T")[0],
              subscriptionPlan: plan,
              subscriptionStatus: v.subscriptionStatus || "active",
              monthlyCommission: monthlyComm,
            });
          }
        }
        if (list.length === 0 && pUid === "p_demo") {
          setClients([
            { id: "v_demo", name: "L'Atelier du Chef & Grill", category: "Restaurants", city: "Cotonou", joinedDate: "2026-08-01", subscriptionPlan: "pro", subscriptionStatus: "active", monthlyCommission: 1000 },
            { id: "v_demo2", name: "KiffStyle Store", category: "Boutique", city: "Cotonou", joinedDate: "2026-08-05", subscriptionPlan: "pro", subscriptionStatus: "active", monthlyCommission: 1000 },
            { id: "v_demo3", name: "Résidence Palmier Royal", category: "Hôtel", city: "Cotonou", joinedDate: "2026-08-10", subscriptionPlan: "starter", subscriptionStatus: "trial", monthlyCommission: 1000 }
          ]);
        } else {
          setClients(list);
        }
      } else {
        if (pUid === "p_demo") {
          setClients([
            { id: "v_demo", name: "L'Atelier du Chef & Grill", category: "Restaurants", city: "Cotonou", joinedDate: "2026-08-01", subscriptionPlan: "pro", subscriptionStatus: "active", monthlyCommission: 1000 },
            { id: "v_demo2", name: "KiffStyle Store", category: "Boutique", city: "Cotonou", joinedDate: "2026-08-05", subscriptionPlan: "pro", subscriptionStatus: "active", monthlyCommission: 1000 }
          ]);
        } else {
          setClients([]);
        }
      }
    });

    // 2. Écouter les commissions
    const commsRef = ref(db, "commissions");
    const unsubComms = onValue(commsRef, (snap) => {
      if (snap.exists()) {
        const allComms = snap.val();
        const list: Commission[] = [];

        for (const cId of Object.keys(allComms)) {
          const c = allComms[cId];
          if (c.prestataire_id === pUid) {
            list.push({ id: cId, ...c });
          }
        }

        if (list.length === 0 && pUid === "p_demo") {
          setCommissions([
            { id: "c1", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef & Grill", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-10T10:00:00Z" },
            { id: "c2", prestataire_id: "p_demo", client_id: "v_demo2", client_name: "KiffStyle Store", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-12T14:30:00Z" },
            { id: "c3", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef & Grill", mois: "2026-07", montant_abonnement: 5000, montant_commission: 1000, statut: "paye", date_paiement: "2026-07-31T18:00:00Z", created_at: "2026-07-10T10:00:00Z" },
          ]);
        } else {
          setCommissions(list.sort((a, b) => b.created_at.localeCompare(a.created_at)));
        }
      } else {
        if (pUid === "p_demo") {
          setCommissions([
            { id: "c1", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef & Grill", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-10T10:00:00Z" },
            { id: "c2", prestataire_id: "p_demo", client_id: "v_demo2", client_name: "KiffStyle Store", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-12T14:30:00Z" },
            { id: "c3", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef & Grill", mois: "2026-07", montant_abonnement: 5000, montant_commission: 1000, statut: "paye", date_paiement: "2026-07-31T18:00:00Z", created_at: "2026-07-10T10:00:00Z" },
          ]);
        } else {
          setCommissions([]);
        }
      }
      setLoadingData(false);
    });

    return () => {
      unsubVendors();
      unsubComms();
    };
  }, [prestataire]);

  if (isLoading || !prestataire) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-heading font-black text-xs uppercase tracking-widest text-gray-500">
          Chargement de votre espace...
        </p>
      </div>
    );
  }

  // Calculs des KPIs
  const totalClients = clients.length;
  const totalGagne = commissions
    .filter(c => c.statut === "paye")
    .reduce((sum, c) => sum + c.montant_commission, 0);

  const totalEnAttente = commissions
    .filter(c => c.statut === "en_attente")
    .reduce((sum, c) => sum + c.montant_commission, 0);

  const estimationMensuelle = clients
    .filter(c => c.subscriptionStatus === "active" || c.subscriptionStatus === "trial")
    .reduce((sum, c) => sum + c.monthlyCommission, 0);

  // Lien de parrainage
  const referralUrl = `${window.location.origin}/decouvrir?ref=${prestataire.code_referral}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Lien de parrainage copié dans le presse-papier !");
  };

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour ! Découvre Oresto Connect pour digitaliser ton restaurant, ta boutique ou ton hôtel avec vitrine en ligne, commandes WhatsApp et encaissements MoMo à 0% de commission :\n\n👉 ${referralUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-body text-gray-900 selection:bg-primary selection:text-white pb-20">
      
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-150 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white text-lg shadow-md shadow-primary/25">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="font-heading font-black text-base text-gray-900 leading-tight">
                Espace Apporteur d'Affaires
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                Partenaire : <span className="text-primary">{prestataire.nom}</span> • Code : <strong className="font-mono text-gray-900">{prestataire.code_referral}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logoutPrestataire}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. Carte Bannière Lien de Parrainage */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0A0A0A] text-white shadow-2xl relative overflow-hidden space-y-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-primary/25 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <Percent size={12} />
                Commission Permanente de 20%
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Votre Lien de Parrainage Personnel
              </h2>
              <p className="text-xs text-gray-400 max-w-xl">
                Partagez ce lien avec des restaurateurs, commerçants ou hôteliers. Tout compte créé avec votre lien vous rapporte 20% chaque mois.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={shareOnWhatsApp}
                className="px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 shrink-0"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Partager sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Lien Box with 1-click copy */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/15">
            <div className="flex-1 px-4 py-2 text-xs font-mono font-bold text-white truncate flex items-center gap-2">
              <span className="text-gray-400 select-none">Lien :</span>
              <span className="text-orange-300 truncate">{referralUrl}</span>
            </div>
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 rounded-xl bg-white text-gray-900 font-heading font-black text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <Copy size={14} />
              <span>Copier le lien</span>
            </button>
          </div>
        </div>

        {/* 2. Les 4 KPIs Clés */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1 : Clients Recrutés */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Clients Recrutés</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-primary flex items-center justify-center text-xs">
                <Users size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-gray-900">{totalClients}</p>
            <p className="text-[10px] text-gray-400 font-medium">Établissements actifs ou en essai</p>
          </div>

          {/* KPI 2 : Estimation Mensuelle Récurrente */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Revenu Mensuel Estimé</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-indigo-600">
              {estimationMensuelle.toLocaleString()} F
            </p>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 size={11} />
              <span>20% récurrent / mois</span>
            </p>
          </div>

          {/* KPI 3 : En Attente de Paiement */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">En Attente ce Mois</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <Clock size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-amber-600">
              {totalEnAttente.toLocaleString()} F
            </p>
            <p className="text-[10px] text-gray-400 font-medium">Virement prévu fin de mois</p>
          </div>

          {/* KPI 4 : Total Déjà Encaissé */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Déjà Payé</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-600">
              {totalGagne.toLocaleString()} F
            </p>
            <p className="text-[10px] text-gray-400 font-medium">Commissions cumulées à vie</p>
          </div>

        </div>

        {/* 3. Liste des Clients Parrainés */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                <Store size={18} className="text-primary" />
                <span>Mes Clients Parrainés ({clients.length})</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Liste des établissements inscrits avec votre code de parrainage.
              </p>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="py-16 text-center text-gray-400 p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-primary flex items-center justify-center mx-auto text-2xl">
                <Users size={28} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-gray-900 text-sm">Aucun client recruté pour le moment</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Partagez votre lien de parrainage aux commerçants de votre entourage pour commencer à toucher vos commissions.
                </p>
              </div>
              <button
                onClick={shareOnWhatsApp}
                className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md"
              >
                Partager mon lien
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150">
                  <tr>
                    <th className="px-6 py-4">Établissement</th>
                    <th className="px-6 py-4">Ville</th>
                    <th className="px-6 py-4">Plan Souscrit</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Commission / Mois</th>
                    <th className="px-6 py-4">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-gray-900 text-sm">{client.name}</div>
                        <div className="text-[10px] text-gray-400">{client.category}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{client.city}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-bold uppercase text-[10px]">
                          Plan {client.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          client.subscriptionStatus === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : client.subscriptionStatus === "trial"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {client.subscriptionStatus === "active" ? "Actif" : client.subscriptionStatus === "trial" ? "Essai Gratuit" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-heading font-black text-sm text-primary">
                        +{client.monthlyCommission.toLocaleString()} F / mois
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-[11px]">{client.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Historique des Commissions & Règlements */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-150 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-lg text-gray-900 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" />
                <span>Historique des Commissions & Règlements</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Détail des 20% générés à chaque renouvellement d'abonnement.
              </p>
            </div>
          </div>

          {commissions.length === 0 ? (
            <div className="py-12 text-center text-gray-400 p-6 space-y-1">
              <p className="font-bold text-sm text-gray-700">Aucune commission générée pour l'instant</p>
              <p className="text-xs">Dès qu'un client souscrit ou renouvelle son forfait, vos commissions apparaîtront ici.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150">
                  <tr>
                    <th className="px-6 py-4">Mois</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Abonnement Payé</th>
                    <th className="px-6 py-4">Commission (20%)</th>
                    <th className="px-6 py-4">Statut Paiement</th>
                    <th className="px-6 py-4">Date de Virement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {commissions.map(comm => (
                    <tr key={comm.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">{comm.mois}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{comm.client_name}</td>
                      <td className="px-6 py-4 text-gray-500">{Number(comm.montant_abonnement).toLocaleString()} FCFA</td>
                      <td className="px-6 py-4 font-heading font-black text-sm text-emerald-600">
                        +{Number(comm.montant_commission).toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          comm.statut === "paye"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {comm.statut === "paye" ? "Payé par MoMo" : "En attente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-[11px]">
                        {comm.date_paiement ? new Date(comm.date_paiement).toLocaleDateString() : "Prévu fin de mois"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
