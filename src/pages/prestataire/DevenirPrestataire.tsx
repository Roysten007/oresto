import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { toast } from "sonner";

export default function DevenirPrestataire() {
  const { registerPrestataire } = usePrestataire();
  const navigate = useNavigate();

  // État du simulateur de revenus
  const [storeCount, setStoreCount] = useState<number>(25);

  // Formulaire d'inscription
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    ville: "Cotonou",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const monthlyEarnings = storeCount * 1000;
  const yearlyEarnings = monthlyEarnings * 12;

  const presetValues = [5, 10, 25, 50, 100];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nom.trim() || !form.telephone.trim() || !form.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerPrestataire({
        nom: form.nom,
        telephone: form.telephone,
        ville: form.ville,
        password: form.password
      });

      if (res.success) {
        toast.success("Félicitations ! Votre compte apporteur d'affaires est actif.", { duration: 4000 });
        navigate("/prestataire/dashboard", { replace: true });
      } else {
        setError(res.error || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const affiliateFaqs = [
    {
      q: "L'inscription au programme est-elle payante ?",
      a: "Non, l'inscription est 100% gratuite et ouverte à tous. Vous n'avez aucun frais d'entrée à payer. Dès la création de votre compte, vous recevez instantanément votre lien de parrainage et votre code exclusif."
    },
    {
      q: "Comment et quand les commissions sont-elles versées ?",
      a: "Vos gains sont comptabilisés en temps réel sur votre tableau de bord dès qu'un commerce parrainé s'abonne ou renouvelle son forfait. Les fonds sont versés automatiquement chaque fin de mois directement sur votre compte Mobile Money (MTN MoMo, Moov Money ou Celtiis Cash)."
    },
    {
      q: "Pendant combien de temps est-ce que je touche des commissions ?",
      a: "À vie ! Tant que l'établissement que vous avez parrainé maintient son abonnement mensuel à Oresto, vous recevez vos 1 000 FCFA (20%) chaque mois de manière récurrente et passive."
    },
    {
      q: "Dois-je installer le site ou gérer le support technique des commerçants ?",
      a: "Non, absolument pas. C'est toute la force de notre solution : l'équipe Oresto prend en charge 100% de l'infrastructure, du support client WhatsApp et des mises à jour. Votre seul rôle est de faire découvrir Oresto aux commerçants."
    },
    {
      q: "Puis-je parrainer des commerces dans d'autres villes ou pays ?",
      a: "Oui, sans restriction. Vous pouvez parrainer des établissements à Cotonou, Calavi, Porto-Novo, Parakou et partout au Bénin, ainsi que dans les autres pays de la sous-région UEMOA."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sub selection:bg-orange-100 selection:text-[#EA580C] overflow-x-hidden">
      
      {/* Header de navigation flottant */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-base shadow-braised group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-tight text-zinc-950">
                Oresto
              </span>
              <span className="text-[11px] font-sub font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                Partenaires
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="hidden sm:inline-flex text-xs font-sub font-bold text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              ← Retour au site principal
            </Link>
            <Link
              to="/prestataire/login"
              className="text-xs sm:text-sm font-sub font-bold text-zinc-800 hover:text-zinc-950 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 transition-all flex items-center gap-1.5"
            >
              <span>Connexion partenaire</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24">
        
        {/* 1. HERO SECTION PARTENAIRES */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-6">
            <i className="fa-solid fa-handshake text-xs"></i>
            <span>Programme partenaires &amp; apporteurs d'affaires</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-heading font-black text-zinc-950 tracking-tight leading-[1.12] mb-6 max-w-4xl mx-auto">
            Bâtissez un <span className="text-[#FF6B00]">revenu passif mensuel</span> <br className="hidden sm:block" />
            en recommandant Oresto.
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-sub font-normal max-w-2xl mx-auto leading-relaxed mb-8">
            Aidez les restaurants, maquis, boutiques et résidences de votre entourage à se digitaliser. Touchez <strong>20% de commission récurrente chaque mois</strong> (1 000 FCFA / mois par client actif à vie), versé directement sur votre compte Mobile Money.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#inscription"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
            >
              <span>Devenir partenaire gratuitement</span>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </a>

            <a
              href="#simulateur"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-sub font-bold text-sm border border-zinc-200 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-calculator text-[#FF6B00] text-xs"></i>
              <span>Simuler mes revenus</span>
            </a>
          </div>

          {/* 3 Réassurances clés */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-sub font-medium text-zinc-600">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
              <span>100% gratuit et sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-mobile-screen text-[#FF6B00] text-sm"></i>
              <span>Paiements MTN MoMo, Moov &amp; Celtiis</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-indigo-600 text-sm"></i>
              <span>Commissions récurrentes à vie</span>
            </div>
          </div>

        </section>

        {/* 2. SIMULATEUR DE GAINS EN FOND SOMBRE (#09090B) */}
        <section id="simulateur" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-[#09090B] rounded-3xl sm:rounded-[36px] border border-zinc-800 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-[#FF6B00] text-xs font-sub font-bold mb-3">
                <i className="fa-solid fa-calculator text-xs"></i>
                <span>Simulateur de commissions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
                Combien pouvez-vous gagner chaque mois ?
              </h2>
              <p className="text-zinc-400 font-sub text-xs sm:text-sm mt-2">
                Ajustez le nombre d'établissements recommandés pour voir vos revenus passifs.
              </p>
            </div>

            {/* Sélecteur de paliers rapides */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 relative z-10">
              {presetValues.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStoreCount(val)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sub font-bold transition-all ${
                    storeCount === val
                      ? "bg-[#FF6B00] text-white shadow-braised scale-105"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800"
                  }`}
                >
                  {val} commerces
                </button>
              ))}
            </div>

            {/* Range Slider */}
            <div className="max-w-lg mx-auto mb-8 space-y-3 relative z-10">
              <div className="flex justify-between items-center text-xs font-sub font-bold">
                <span className="text-zinc-400">Établissements parrainés :</span>
                <span className="font-heading font-black text-xl text-[#FF6B00]">{storeCount} commerces</span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={storeCount}
                onChange={(e) => setStoreCount(parseInt(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]"
              />

              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100 commerces</span>
              </div>
            </div>

            {/* Affichage des gains calculés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8 relative z-10">
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1">
                <span className="text-xs font-sub font-bold text-zinc-400 block">
                  Revenu mensuel récurrent
                </span>
                <div className="text-3xl sm:text-4xl font-heading font-black text-[#FF6B00]">
                  {monthlyEarnings.toLocaleString("fr-FR")} FCFA
                </div>
                <span className="text-[11px] text-zinc-500 font-sub block">
                  versé chaque fin de mois sur votre MoMo
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center space-y-1">
                <span className="text-xs font-sub font-bold text-zinc-400 block">
                  Revenu annuel estimé
                </span>
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {yearlyEarnings.toLocaleString("fr-FR")} FCFA
                </div>
                <span className="text-[11px] text-zinc-500 font-sub block">
                  cumulé sur 12 mois sans frais de gestion
                </span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <a
                href="#inscription"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-xs shadow-braised transition-all"
              >
                <span>Activer mon compte et commencer</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>

          </div>
        </section>

        {/* 3. COMMENT ÇA MARCHE EN 3 ÉTAPES */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-bold mb-4">
              <i className="fa-solid fa-layer-group text-xs"></i>
              <span>Processus simple</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-zinc-950 tracking-tight leading-tight">
              Comment ça fonctionne pour vous ?
            </h2>
            <p className="mt-3 text-base text-zinc-600 font-sub font-normal">
              Trois étapes claires pour générer des revenus passifs sans interrompre votre activité actuelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-base mb-6 border border-orange-100">
                  01
                </div>
                <h3 className="text-lg font-heading font-black text-zinc-950 tracking-tight mb-2">
                  Créez votre compte en 60 secondes
                </h3>
                <p className="text-sm text-zinc-600 font-sub font-normal leading-relaxed">
                  Remplissez le formulaire d'inscription avec votre numéro WhatsApp. Vous obtenez immédiatement votre lien de parrainage et votre code exclusif.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-base mb-6 border border-orange-100">
                  02
                </div>
                <h3 className="text-lg font-heading font-black text-zinc-950 tracking-tight mb-2">
                  Partagez votre lien aux commerçants
                </h3>
                <p className="text-sm text-zinc-600 font-sub font-normal leading-relaxed">
                  Restaurants, maquis, boutiques ou résidences : faites-leur découvrir la plateforme Oresto avec 14 jours d'essai gratuit sans carte bancaire.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-base mb-6 border border-orange-100">
                  03
                </div>
                <h3 className="text-lg font-heading font-black text-zinc-950 tracking-tight mb-2">
                  Encaissez chaque mois sur MoMo
                </h3>
                <p className="text-sm text-zinc-600 font-sub font-normal leading-relaxed">
                  Chaque fois qu'un commerçant renouvelle son forfait mensuel à 5 000 FCFA, 1 000 FCFA (20%) vous sont versés directement sur votre compte Mobile Money.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. FORMULAIRE D'INSCRIPTION PARTENAIRE */}
        <section id="inscription" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 border border-zinc-200/90 shadow-float">
            
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="text-xs font-sub font-bold text-[#EA580C] block mb-1">
                Activation immédiate
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 tracking-tight">
                Rejoignez le réseau des apporteurs d'affaires
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-sub mt-2">
                100% gratuit, sans frais d'entrée, code parrain personnel généré à la validation.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-sub font-bold flex items-center gap-2 mb-6">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              
              <div className="space-y-1">
                <label className="text-xs font-sub font-bold text-zinc-700">
                  Nom et prénom *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Jean Houndété"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                  <i className="fa-solid fa-user absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700">
                    Numéro MoMo (WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      placeholder="+229 97 00 00 00"
                      required
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                    />
                    <i className="fa-solid fa-phone absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700">
                    Ville de résidence *
                  </label>
                  <select
                    value={form.ville}
                    onChange={(e) => setForm({ ...form, ville: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  >
                    <option value="Cotonou">Cotonou</option>
                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Parakou">Parakou</option>
                    <option value="Bohicon">Bohicon</option>
                    <option value="Ouidah">Ouidah</option>
                    <option value="Autre">Autre ville</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 caractères"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Répétez le mot de passe"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-bold text-sm shadow-braised transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                      <span>Création de votre compte en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Activer mon compte Partenaire</span>
                      <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-500 font-sub">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/prestataire/login" className="text-[#EA580C] font-bold hover:underline">
                    Connectez-vous ici
                  </Link>
                </p>
              </div>

            </form>

          </div>
        </section>

        {/* 5. FAQ AFFILIATION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 tracking-tight">
              Questions fréquentes sur le programme
            </h2>
          </div>

          <div className="space-y-3">
            {affiliateFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl transition-all duration-200 overflow-hidden bg-white border ${
                    isOpen ? "border-orange-500/50 shadow-md" : "border-zinc-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-zinc-950">
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? "rotate-180 bg-[#FF6B00] text-white" : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-zinc-600 font-sub text-xs sm:text-sm leading-relaxed border-t border-zinc-100 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-8 text-center text-xs font-sub text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-heading font-black text-zinc-900 text-base">
            Oresto <span className="text-[#FF6B00]">Partenaires</span>
          </Link>
          <p>© {new Date().getFullYear()} Oresto. Tous droits réservés.</p>
          <a
            href="https://wa.me/2290143405361"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-700 hover:text-[#FF6B00] flex items-center gap-1.5 font-bold transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm text-[#25D366]"></i>
            <span>Support Partenaires : +229 01 43 40 53 61</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
