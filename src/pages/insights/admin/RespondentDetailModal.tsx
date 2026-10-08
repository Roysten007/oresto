import React from "react";
import { SurveyResponse } from "@/types/survey";
import { 
  X, 
  Store, 
  MapPin, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  ExternalLink,
  DollarSign,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

interface RespondentDetailModalProps {
  response: SurveyResponse | null;
  onClose: () => void;
}

const FEATURE_NAMES: Record<string, string> = {
  f_vitrine: "Vitrine internet personnalisée",
  f_menu_qr: "Menu digital avec QR Code",
  f_commandes_en_ligne: "Commandes en ligne",
  f_whatsapp_structure: "Commandes WhatsApp structurées",
  f_gestion_commandes: "Gestion centralisée des commandes",
  f_gestion_stocks: "Gestion des stocks",
  f_reservations: "Réservation de tables",
  f_livraisons: "Gestion des livraisons",
  f_statistiques: "Statistiques de ventes",
  f_paiement_momo: "Paiement Mobile Money",
  f_multi_etablissements: "Gestion multi-établissements",
  f_ia_assistant: "Assistant IA de gestion",
};

export default function RespondentDetailModal({ response, onClose }: RespondentDetailModalProps) {
  if (!response) return null;

  // Nettoyage et formatage du numéro WhatsApp béninois
  const cleanPhone = response.whatsapp?.replace(/[^0-9+]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.replace("+", "") : cleanPhone.length === 8 ? "229" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
        `Bonjour ${response.name || ""}, je vous contacte suite à votre participation à l'étude Oresto Insights concernant ${response.establishmentName || "votre établissement"}.`
      )}`
    : null;

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Date inconnue";
    try {
      return new Date(isoString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 5) return "bg-emerald-500 text-white";
    if (score === 4) return "bg-emerald-100 text-emerald-800 font-semibold";
    if (score === 3) return "bg-amber-100 text-amber-800 font-medium";
    if (score === 2) return "bg-orange-100 text-orange-800";
    return "bg-slate-100 text-slate-500";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-[#0A0A0A] text-white p-6 md:p-8 flex items-start justify-between relative">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-white text-xs font-black uppercase px-2.5 py-1 rounded-lg tracking-wider">
                {response.establishmentType || "Établissement"}
              </span>
              <span className="bg-white/10 text-white/90 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                <MapPin size={12} className="text-primary" />
                {response.country ? (response.city ? `${response.country} • ${response.city}` : response.country) : (response.city || "Non spécifié")}
              </span>
              {response.wantsToTest === "Oui" && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles size={12} />
                  Souhaite tester (Lead Bêta)
                </span>
              )}
              {response.wantsToTest === "Peut-être" && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-lg">
                  Peut-être intéressé
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tight text-white">
              {response.establishmentName || "Établissement sans nom précisé"}
            </h2>
            
            <p className="text-white/60 text-xs flex items-center gap-2">
              <Clock size={13} />
              Réponse soumise le {formatDate(response.createdAt)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corps déroulant */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1 text-slate-800">

          {/* Contact & Lead Card si renseigné */}
          {response.contactConsent && (response.name || response.whatsapp) && (
            <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck size={16} />
                  Contact Bêta-testeur qualifié (Consentement accordé)
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {response.name || "Responsable"} 
                  {response.establishmentName && <span className="text-slate-500 text-sm font-normal"> — {response.establishmentName}</span>}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                  {response.whatsapp && (
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Phone size={13} className="text-emerald-600" />
                      {response.whatsapp}
                    </span>
                  )}
                  {response.email && (
                    <span className="flex items-center gap-1 text-slate-600">
                      <Mail size={13} className="text-primary" />
                      {response.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin size={13} />
                    {response.country ? (response.city ? `${response.country} • ${response.city}` : response.country) : (response.city || "Non spécifié")}
                  </span>
                </div>
              </div>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all no-underline shrink-0"
                >
                  <MessageSquare size={16} />
                  Contacter sur WhatsApp
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          )}

          {/* Section 1 : Profil & Fonctionnement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profil */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Store size={15} className="text-primary" />
                1. Profil de l'établissement
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Type :</span>
                  <span className="font-semibold text-slate-900">{response.establishmentType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Ancienneté :</span>
                  <span className="font-semibold text-slate-900">{response.establishmentAge}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Pays / Ville :</span>
                  <span className="font-semibold text-slate-900">
                    {response.country ? (response.city ? `${response.country} (${response.city})` : response.country) : (response.city || "Non spécifié")}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Taille de l'équipe :</span>
                  <span className="font-semibold text-slate-900">{response.employeeCount} employés</span>
                </div>
              </div>
            </div>

            {/* Fonctionnement actuel */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Calendar size={15} className="text-primary" />
                2. Fonctionnement actuel
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Canaux de commande :</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {response.orderChannels?.map((ch, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-200/50">
                  <span className="text-slate-500">Site internet actuel :</span>
                  <span className="font-semibold text-slate-900">{response.websiteStatus}</span>
                </div>
                {response.noWebsiteReasons && response.noWebsiteReasons.length > 0 && (
                  <div className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">Pourquoi pas de site :</span>{" "}
                    {response.noWebsiteReasons.join(", ")}
                  </div>
                )}
                <div className="flex justify-between py-1 border-t border-slate-200/50">
                  <span className="text-slate-500">Présentation du menu :</span>
                  <span className="font-semibold text-slate-900">{response.menuMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-200/50">
                  <span className="text-slate-500">Gestion des commandes :</span>
                  <span className="font-semibold text-slate-900">{response.orderManagement}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Problèmes & Verbatim Clé */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              3. Problèmes & Difficultés vécues
            </h3>

            {/* Verbatim le plus gros problème */}
            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-2xl">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block mb-1">
                Le plus gros problème exprimé (Verbatim brut) :
              </span>
              <p className="text-base font-semibold text-slate-900 italic">
                "{response.biggestProblem || "Aucun détail saisi."}"
              </p>
            </div>

            {/* Liste des problèmes cochés */}
            <div>
              <span className="text-xs text-slate-500 font-medium block mb-2">Autres problèmes cochés :</span>
              <div className="flex flex-wrap gap-2">
                {response.problems?.length > 0 ? (
                  response.problems.map((p, idx) => (
                    <span 
                      key={idx} 
                      className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Aucun problème coché.</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 3 : Note des 12 Fonctionnalités */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sparkles size={15} className="text-primary" />
                4. Évaluation des fonctionnalités Oresto (Échelle 1 à 5)
              </h3>
              <span className="text-xs text-slate-400">1: Pas utile → 5: Très utile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {Object.entries(FEATURE_NAMES).map(([id, title]) => {
                const score = response.featureScores?.[id] || 0;
                return (
                  <div 
                    key={id} 
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-700 pr-2 leading-snug">{title}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-black shrink-0 ${getScoreColor(score)}`}>
                      {score > 0 ? `${score} / 5` : "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4 : Modèle Économique & Tarification */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-2">
              <DollarSign size={15} />
              5. Préférences de Modèle Économique & Disposition à Payer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-white/50 block uppercase tracking-wider">Modèle Préféré</span>
                <p className="text-sm font-bold text-white">{response.preferredPricingModel || "Non précisé"}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-white/50 block uppercase tracking-wider">Abonnement Mensuel Acceptable</span>
                <p className="text-sm font-bold text-emerald-400">{response.acceptableSubscription || "Non précisé"}</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-white/50 block uppercase tracking-wider">Commission Vente Acceptable</span>
                <p className="text-sm font-bold text-amber-400">{response.acceptableCommission || "Non précisé"}</p>
              </div>
            </div>
          </div>

          {/* Section 5 : Moyens de paiement, Freins & Attentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paiements & Freins */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <CreditCard size={15} className="text-primary" />
                6. Moyens de Paiement & Freins
              </h3>

              <div>
                <span className="text-xs text-slate-500 block">Moyens de paiement utilisés :</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {response.paymentMethods?.map((pm, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-slate-800 text-xs font-medium px-2 py-0.5 rounded-md">
                      {pm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-xs text-slate-500 block">Freins ou hésitations exprimés :</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {response.concerns?.map((c, i) => (
                    <span key={i} className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium px-2 py-0.5 rounded-md">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Attentes indispensables */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <TrendingUp size={15} className="text-primary" />
                7. Attentes indispensables
              </h3>
              <p className="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed italic">
                "{response.expectations || "Aucune attente spécifique formulée."}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">ID: {response.id}</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
