import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, update, get } from "firebase/database";
import { Prestataire, Commission, ReferredClient } from "@/data/prestataireTypes";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Search,
  Check,
  Eye,
  X,
  Store,
  Phone,
  MapPin,
  Sparkles,
  Percent
} from "lucide-react";

export default function AdminPrestataires() {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrestataire, setSelectedPrestataire] = useState<Prestataire | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // 1. Écouteur prestataires
    const pRef = ref(db, "prestataires");
    const unsubP = onValue(pRef, (snap) => {
      if (snap.exists()) {
        const all = snap.val();
        const list: Prestataire[] = Object.keys(all).map(k => ({ uid: k, ...all[k] }));
        setPrestataires(list);
      } else {
        // Fallback démo si la base est vierge
        const demoList: Prestataire[] = [
          { uid: "p_demo", nom: "Jean Affilié Oresto", telephone: "+229 97 12 34 56", ville: "Cotonou", email: "jean.partenaire@oresto.bj", code_referral: "JEA482", date_inscription: "2026-08-01", statut: "actif", total_gagne: 15000, total_en_attente: 10000 },
          { uid: "p_demo2", nom: "Armel Soglo", telephone: "+229 96 88 77 66", ville: "Abomey-Calavi", email: "armel.s@oresto.bj", code_referral: "ARM914", date_inscription: "2026-08-05", statut: "actif", total_gagne: 5000, total_en_attente: 5000 }
        ];
        setPrestataires(demoList);
      }
    });

    // 2. Écouteur commissions
    const cRef = ref(db, "commissions");
    const unsubC = onValue(cRef, (snap) => {
      if (snap.exists()) {
        const all = snap.val();
        const list: Commission[] = Object.keys(all).map(k => ({ id: k, ...all[k] }));
        setCommissions(list);
      } else {
        const demoComms: Commission[] = [
          { id: "comm_demo_1", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef", client_category: "Restaurants", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-10T10:00:00Z" },
          { id: "comm_demo_2", prestataire_id: "p_demo", client_id: "v_demo2", client_name: "KiffStyle Store", client_category: "Boutique", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-12T14:30:00Z" },
          { id: "comm_demo_3", prestataire_id: "p_demo", client_id: "v_demo", client_name: "L'Atelier du Chef", client_category: "Restaurants", mois: "2026-07", montant_abonnement: 5000, montant_commission: 1000, statut: "paye", date_paiement: "2026-07-31T18:00:00Z", created_at: "2026-07-10T10:00:00Z" },
          { id: "comm_demo_4", prestataire_id: "p_demo2", client_id: "v_demo3", client_name: "Résidence Palmier Royal", client_category: "Hôtel", mois: "2026-08", montant_abonnement: 5000, montant_commission: 1000, statut: "en_attente", date_paiement: null, created_at: "2026-08-14T09:15:00Z" },
        ];
        setCommissions(demoComms);
      }
    });

    // 3. Écouteur vendors
    const vRef = ref(db, "vendors");
    const unsubV = onValue(vRef, (snap) => {
      if (snap.exists()) {
        const all = snap.val();
        const list = Object.keys(all).map(k => ({ id: k, ...all[k] }));
        setVendors(list);
      } else {
        setVendors([]);
      }
      setLoading(false);
    });

    return () => {
      unsubP();
      unsubC();
      unsubV();
    };
  }, []);

  // Calculs par prestataire
  const prestatairesWithStats = prestataires.map(p => {
    const myClients = vendors.filter(v => v.prestataire_id === p.uid || v.referral_code === p.code_referral);
    const myCommissions = commissions.filter(c => c.prestataire_id === p.uid);

    const totalGagne = myCommissions
      .filter(c => c.statut === "paye")
      .reduce((sum, c) => sum + c.montant_commission, 0);

    const totalEnAttente = myCommissions
      .filter(c => c.statut === "en_attente")
      .reduce((sum, c) => sum + c.montant_commission, 0);

    return {
      ...p,
      clientsCount: myClients.length,
      totalGagne,
      totalEnAttente,
    };
  });

  const filteredPrestataires = prestatairesWithStats.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.nom.toLowerCase().includes(q) || p.telephone.includes(q) || p.code_referral.toLowerCase().includes(q) || p.ville.toLowerCase().includes(q);
  });

  // KPIs globaux
  const totalCommissionsDues = commissions
    .filter(c => c.statut === "en_attente")
    .reduce((sum, c) => sum + c.montant_commission, 0);

  const totalCommissionsPayees = commissions
    .filter(c => c.statut === "paye")
    .reduce((sum, c) => sum + c.montant_commission, 0);

  const totalClientsApportes = vendors.filter(v => v.prestataire_id || v.referral_code).length;

  // Marquer une commission individuelle comme payée
  const handleMarkAsPaid = async (commissionId: string) => {
    if (!db) return;
    setProcessingId(commissionId);
    try {
      await update(ref(db, `commissions/${commissionId}`), {
        statut: "paye",
        date_paiement: new Date().toISOString(),
      });
      toast.success("Commission marquée comme payée avec succès !");
    } finally {
      setProcessingId(null);
    }
  };

  // Marquer toutes les commissions en attente d'un prestataire comme payées
  const handleMarkAllPaidForPrestataire = async (prestataireUid: string) => {
    if (!db) return;
    const pendingComms = commissions.filter(c => c.prestataire_id === prestataireUid && c.statut === "en_attente");
    if (pendingComms.length === 0) {
      toast.info("Aucune commission en attente pour ce prestataire.");
      return;
    }

    setProcessingId(prestataireUid);
    try {
      const now = new Date().toISOString();
      const updates: Record<string, any> = {};
      for (const c of pendingComms) {
        updates[`commissions/${c.id}/statut`] = "paye";
        updates[`commissions/${c.id}/date_paiement`] = now;
      }
      await update(ref(db), updates);
      toast.success(`🎉 ${pendingComms.length} commission(s) marquées comme payées !`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 font-body text-gray-900 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-150 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white text-xl shadow-md shadow-primary/25">
            <i className="fa-solid fa-handshake"></i>
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-gray-900">
              Gestion des <span className="text-primary">Prestataires</span>
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
              Programme d'apporteurs d'affaires • 20% de commission récurrente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-heading font-bold text-xs border border-emerald-200">
            {prestataires.length} Partenaire{prestataires.length > 1 ? "s" : ""} Actif{prestataires.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* 4 KPIs Globaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Prestataires */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Partenaires</span>
            <Users size={16} className="text-primary" />
          </div>
          <p className="font-heading font-black text-2xl text-gray-900">{prestataires.length}</p>
          <span className="text-[10px] text-gray-400 font-medium">Apporteurs d'affaires inscrits</span>
        </div>

        {/* Total Clients Apportés */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Clients Recrutés</span>
            <Store size={16} className="text-indigo-600" />
          </div>
          <p className="font-heading font-black text-2xl text-indigo-600">{totalClientsApportes}</p>
          <span className="text-[10px] text-gray-400 font-medium">Commerçants parrainés</span>
        </div>

        {/* Total Dû ce mois */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Commissions Dues (En Attente)</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="font-heading font-black text-2xl text-amber-600">{totalCommissionsDues.toLocaleString()} F</p>
          <span className="text-[10px] text-amber-700 font-bold">À verser aux partenaires</span>
        </div>

        {/* Total Payé à vie */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Commissions Déjà Payées</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <p className="font-heading font-black text-2xl text-emerald-600">{totalCommissionsPayees.toLocaleString()} F</p>
          <span className="text-[10px] text-emerald-700 font-bold">Virées par MoMo</span>
        </div>

      </div>

      {/* Table des Prestataires */}
      <div className="bg-white rounded-[32px] border border-gray-200 shadow-xs overflow-hidden">
        
        {/* Barre de recherche */}
        <div className="p-6 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-black text-lg text-gray-900">
              Liste des Apporteurs d'Affaires
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Gérez les partenaires et effectuez les versements de commissions.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, code, tel..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-medium outline-none focus:border-primary focus:bg-white"
            />
          </div>
        </div>

        {filteredPrestataires.length === 0 ? (
          <div className="py-16 text-center text-gray-400 p-6 space-y-2">
            <Users size={32} className="mx-auto text-gray-300" />
            <p className="font-bold text-sm text-gray-700">Aucun prestataire trouvé</p>
            <p className="text-xs">Les personnes qui s'inscrivent via /devenir-prestataire apparaîtront ici.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-150">
                <tr>
                  <th className="px-6 py-4">Partenaire</th>
                  <th className="px-6 py-4">Code Parrainage</th>
                  <th className="px-6 py-4">Téléphone / Ville</th>
                  <th className="px-6 py-4">Clients</th>
                  <th className="px-6 py-4">En Attente (Dû)</th>
                  <th className="px-6 py-4">Total Déjà Payé</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredPrestataires.map(p => (
                  <tr key={p.uid} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-heading font-black text-sm text-gray-900">{p.nom}</div>
                      <div className="text-[10px] text-gray-400">{p.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-primary font-mono font-black text-xs">
                        {p.code_referral}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{p.telephone}</div>
                      <div className="text-[10px] text-gray-400">{p.ville}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-heading font-black text-sm text-gray-900">
                        {p.clientsCount}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">client{p.clientsCount > 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-heading font-black text-sm ${p.totalEnAttente > 0 ? "text-amber-600 font-bold" : "text-gray-400"}`}>
                        {p.totalEnAttente.toLocaleString()} FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 font-heading font-black text-sm text-emerald-600">
                      {p.totalGagne.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPrestataire(p)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-black hover:text-white text-gray-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Détails</span>
                        </button>

                        {p.totalEnAttente > 0 && (
                          <button
                            type="button"
                            disabled={processingId === p.uid}
                            onClick={() => handleMarkAllPaidForPrestataire(p.uid)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Check size={13} />
                            <span>Payer tout</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal Détails d'un Prestataire (Clients & Lignes de Commission) */}
      {selectedPrestataire && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-150 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Fiche Apporteur d'Affaires</span>
                <h3 className="font-heading font-black text-xl text-gray-900 mt-0.5">{selectedPrestataire.nom}</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Tél : <strong className="text-gray-900">{selectedPrestataire.telephone}</strong> • Ville : {selectedPrestataire.ville} • Code : <strong className="font-mono text-primary">{selectedPrestataire.code_referral}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedPrestataire(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Clients apportés */}
            <div className="space-y-3">
              <h4 className="font-heading font-black text-sm text-gray-900 flex items-center gap-2">
                <Store size={16} className="text-primary" />
                <span>Clients Rattachés ({vendors.filter(v => v.prestataire_id === selectedPrestataire.uid || v.referral_code === selectedPrestataire.code_referral).length})</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vendors
                  .filter(v => v.prestataire_id === selectedPrestataire.uid || v.referral_code === selectedPrestataire.code_referral)
                  .map(v => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-xs text-gray-900">{v.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">
                          {v.subscriptionStatus || "Actif"}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">{v.category || "Commerce"} • {v.city || "Cotonou"}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Lignes de Commission */}
            <div className="space-y-3 pt-4 border-t border-gray-150">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-black text-sm text-gray-900 flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-600" />
                  <span>Commissions du Partenaire</span>
                </h4>

                {commissions.some(c => c.prestataire_id === selectedPrestataire.uid && c.statut === "en_attente") && (
                  <button
                    onClick={() => handleMarkAllPaidForPrestataire(selectedPrestataire.uid)}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs"
                  >
                    Marquer tout comme payé
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {commissions
                  .filter(c => c.prestataire_id === selectedPrestataire.uid)
                  .map(comm => (
                    <div
                      key={comm.id}
                      className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-gray-900 block">{comm.mois}</span>
                        <span className="text-[11px] text-gray-500">{comm.client_name} • Abonnement : {Number(comm.montant_abonnement).toLocaleString()} F</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-heading font-black text-sm text-emerald-600">
                          +{Number(comm.montant_commission).toLocaleString()} F
                        </span>

                        {comm.statut === "paye" ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Payé
                          </span>
                        ) : (
                          <button
                            disabled={processingId === comm.id}
                            onClick={() => handleMarkAsPaid(comm.id)}
                            className="px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                          >
                            Payer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
