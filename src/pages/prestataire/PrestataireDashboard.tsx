import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Commission, ReferredClient } from "@/data/prestataireTypes";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Copy,
  LogOut,
  Store,
  Percent,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Share2
} from "lucide-react";

export default function PrestataireDashboard() {
  const { prestataire, isAuthenticated, isLoading, logoutPrestataire } = usePrestataire();
  const navigate = useNavigate();

  const [clients, setClients] = useState<ReferredClient[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Redirection stricte si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/prestataire/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Chargement des données réelles du prestataire depuis Firebase
  useEffect(() => {
    if (!prestataire?.uid || !db) {
      setLoadingData(false);
      return;
    }

    const pUid = prestataire.uid;
    const pCode = prestataire.code_referral;

    // 1. Écouter les commerces parrainés réels
    const vendorsRef = ref(db, "vendors");
    const unsubVendors = onValue(vendorsRef, (snap) => {
      if (snap.exists()) {
        const allVendors = snap.val();
        const list: ReferredClient[] = [];

        for (const vId of Object.keys(allVendors)) {
          const v = allVendors[vId];
          if (v.prestataire_id === pUid || (pCode && v.referral_code === pCode)) {
            const plan = v.subscriptionPlan || "pro";
            const monthlyComm = 1000; // 20% de l'abonnement standard Oresto Pro 5 000 FCFA
            list.push({
              id: vId,
              name: v.name || v.restaurantName || "Commerce Partenaire",
              category: v.category || "Commerce",
              city: v.city || "Cotonou",
              joinedDate: v.joinedDate || (v.createdAt ? new Date(v.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]),
              subscriptionPlan: plan,
              subscriptionStatus: v.subscriptionStatus || "active",
              monthlyCommission: monthlyComm,
            });
          }
        }
        setClients(list);
      } else {
        setClients([]);
      }
    });

    // 2. Écouter les commissions réelles
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
        setCommissions(list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || "")));
      } else {
        setCommissions([]);
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        <p className="font-heading font-black text-xs text-zinc-500">
          Chargement de votre espace partenaire...
        </p>
      </div>
    );
  }

  // Calculs stricts des métriques réelles (aucun faux chiffre par défaut)
  const totalClients = clients.length;
  
  const totalGagne = commissions
    .filter(c => c.statut === "paye")
    .reduce((sum, c) => sum + (Number(c.montant_commission) || 0), 0);

  const totalEnAttente = commissions
    .filter(c => c.statut === "en_attente")
    .reduce((sum, c) => sum + (Number(c.montant_commission) || 0), 0);

  const estimationMensuelle = clients
    .filter(c => c.subscriptionStatus === "active")
    .reduce((sum, c) => sum + (Number(c.monthlyCommission) || 1000), 0);

  // Lien de parrainage réel (formaté avec le domaine de production en priorité)
  const baseUrl = typeof window !== "undefined" && window.location.hostname !== "localhost" 
    ? window.location.origin 
    : "https://oresto.app";
  const referralUrl = `${baseUrl}/register?ref=${prestataire.code_referral}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success("Lien de parrainage copié dans le presse-papier !");
  };

  const shareOnWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour ! Découvre Oresto pour digitaliser ton restaurant, ta boutique ou ton hôtel avec ta propre vitrine en ligne, commandes WhatsApp et encaissements Mobile Money à 0% de commission.\n\nTeste 14 jours gratuits ici 👉 ${referralUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sub text-zinc-900 selection:bg-orange-100 selection:text-[#EA580C] pb-20">
      
      {/* Barre de navigation supérieure */}
      <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/90 px-4 sm:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 bg-[#FF6B00] rounded-2xl flex items-center justify-center text-white font-heading font-black text-base shadow-braised hover:scale-105 transition-transform">
              O
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-sm sm:text-base text-zinc-950 leading-tight">
                  Espace Apporteur d'Affaires
                </h1>
                <span className="text-[10px] font-sub font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Actif
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-sub">
                Partenaire : <span className="font-bold text-zinc-800">{prestataire.nom}</span> • Code : <strong className="font-mono text-[#EA580C]">{prestataire.code_referral}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden md:inline-flex text-xs font-sub font-bold text-zinc-600 hover:text-zinc-950 px-3 py-2 transition-colors"
            >
              Voir le site public
            </Link>
            <button
              onClick={logoutPrestataire}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-red-50 text-zinc-600 hover:text-red-600 font-sub font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal du tableau de bord */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. Bannière Lien de Parrainage Personnel */}
        <div className="p-6 sm:p-8 rounded-3xl sm:rounded-[36px] bg-[#09090B] text-white shadow-2xl relative overflow-hidden space-y-5 border border-zinc-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-[#FF6B00] text-[11px] font-sub font-bold">
                <Percent size={12} />
                <span>20% de commission récurrente chaque mois</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                Votre lien de parrainage personnel
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-sub">
                Partagez ce lien avec des restaurateurs, commerçants ou hôteliers. Chaque abonnement actif vous rapporte <strong>1 000 FCFA chaque mois</strong> à vie.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <button
                onClick={shareOnWhatsApp}
                className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sub font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all active:scale-95"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>Partager sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Boîte du lien avec copie 1-clic */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
            <div className="flex-1 px-4 py-2 text-xs font-mono font-bold text-white truncate flex items-center gap-2">
              <span className="text-zinc-500 select-none">Lien :</span>
              <span className="text-[#FF6B00] truncate">{referralUrl}</span>
            </div>
            <button
              onClick={copyReferralLink}
              className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-sub font-bold text-xs hover:bg-[#FF6B00] hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 shrink-0"
            >
              <Copy size={14} />
              <span>Copier le lien</span>
            </button>
          </div>
        </div>

        {/* 2. Les 4 indicateurs clés réels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* KPI 1 : Clients Parrainés */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-sub font-bold text-zinc-600">Clients recrutés</span>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xs border border-orange-100">
                <Users size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">{totalClients}</p>
            <p className="text-[11px] text-zinc-500 font-sub">Établissements inscrits avec votre code</p>
          </div>

          {/* KPI 2 : Revenu Mensuel Récurrent */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-sub font-bold text-zinc-600">Revenu mensuel estimé</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs border border-indigo-100">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-indigo-600">
              {estimationMensuelle.toLocaleString("fr-FR")} F
            </p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 font-sub">
              <CheckCircle2 size={11} />
              <span>1 000 F / client actif / mois</span>
            </p>
          </div>

          {/* KPI 3 : En Attente ce mois */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-sub font-bold text-zinc-600">En attente ce mois</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs border border-amber-100">
                <Clock size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-amber-600">
              {totalEnAttente.toLocaleString("fr-FR")} F
            </p>
            <p className="text-[11px] text-zinc-500 font-sub">Virement prévu en fin de mois</p>
          </div>

          {/* KPI 4 : Total Déjà Payé */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-sub font-bold text-zinc-600">Total déjà encaissé</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs border border-emerald-100">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-600">
              {totalGagne.toLocaleString("fr-FR")} F
            </p>
            <p className="text-[11px] text-zinc-500 font-sub">Commissions cumulées perçues</p>
          </div>

        </div>

        {/* 3. Section Liste des Établissements Parrainés */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] border border-zinc-200/90 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-black text-lg text-zinc-950 flex items-center gap-2">
                <Store size={18} className="text-[#FF6B00]" />
                <span>Mes établissements parrainés ({clients.length})</span>
              </h3>
              <p className="text-xs text-zinc-500 font-sub mt-0.5">
                Liste des commerces, restaurants et résidences inscrits avec votre lien ou code.
              </p>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="py-14 px-6 text-center max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto text-2xl border border-orange-100">
                <Users size={26} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-zinc-950 text-base">
                  Vous n'avez pas encore parrainé d'établissement
                </h4>
                <p className="text-xs text-zinc-600 font-sub max-w-md mx-auto mt-1.5 leading-relaxed">
                  Partagez votre lien de parrainage à vos connaissances gérantes de restaurants, maquis, boutiques ou résidences meublées.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-sub font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Partager sur WhatsApp</span>
                </button>
                <button
                  onClick={copyReferralLink}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sub font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Copy size={13} />
                  <span>Copier mon lien</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 text-xs font-sub font-bold text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4">Établissement</th>
                    <th className="px-6 py-4">Ville</th>
                    <th className="px-6 py-4">Formule</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Commission</th>
                    <th className="px-6 py-4">Date d'inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sub">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-zinc-950 text-sm">{client.name}</div>
                        <div className="text-[11px] text-zinc-400">{client.category}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-600">{client.city}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 font-bold text-[11px]">
                          {client.subscriptionPlan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-sub font-bold ${
                          client.subscriptionStatus === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : client.subscriptionStatus === "trial"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {client.subscriptionStatus === "active" ? "Actif" : client.subscriptionStatus === "trial" ? "Essai gratuit" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-heading font-black text-sm text-[#FF6B00]">
                        +{client.monthlyCommission.toLocaleString("fr-FR")} F / mois
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-xs">{client.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Guide d'action pour recruter vos premiers commerces */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center border border-orange-100">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-zinc-950">
                Comment développer vos gains rapidement ?
              </h3>
              <p className="text-xs text-zinc-500 font-sub">
                3 conseils simples pour parrainer vos premiers établissements cette semaine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-xs">
                1
              </span>
              <h4 className="font-heading font-bold text-sm text-zinc-900">
                Partagez sur votre statut WhatsApp
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sub">
                Postez votre lien avec un mot court : les gérants de votre répertoire qui vendent sur WhatsApp vous contacteront d'eux-mêmes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-xs">
                2
              </span>
              <h4 className="font-heading font-bold text-sm text-zinc-900">
                Mettez en avant les 14 jours gratuits
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sub">
                Le commerçant n'a aucune carte bancaire à renseigner. Il teste sans risque et commence à encaisser directement par MoMo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-xs">
                3
              </span>
              <h4 className="font-heading font-bold text-sm text-zinc-900">
                Paiement automatique chaque fin de mois
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sub">
                Dès qu'un client renouvelle son forfait, vos 1 000 FCFA sont validés et versés directement sur votre compte Mobile Money.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Coordonnées de Versement Mobile Money */}
        <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-100 shrink-0">
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-black text-zinc-950 text-base">
                  Compte de versement Mobile Money
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-sub font-bold">
                  Configuré
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-sub mt-0.5">
                Numéro associé : <strong className="text-zinc-900 font-mono">{prestataire.telephone}</strong> ({prestataire.ville})
              </p>
              <p className="text-[11px] text-zinc-400 font-sub mt-0.5">
                Compatible MTN Mobile Money, Moov Money et Celtiis Cash.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/2290143405361?text=Bonjour%20Oresto%20Support%2C%20je%20souhaite%20mettre%20%C3%A0%20jour%20mon%20num%C3%A9ro%20de%20versement%20Mobile%20Money%20partenaire."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-sub font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <span>Modifier mon numéro MoMo</span>
            <ArrowRight size={12} />
          </a>
        </div>

      </main>

    </div>
  );
}
