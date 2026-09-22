import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrestataire } from "@/contexts/PrestataireContext";
import { toast } from "sonner";

export default function DevenirPrestataire() {
  const { registerPrestataire } = usePrestataire();
  const navigate = useNavigate();

  // Interactive earnings calculator state
  const [storeCount, setStoreCount] = useState<number>(25);

  // Form state
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    ville: "Cotonou",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const monthlyEarnings = storeCount * 1000;
  const yearlyEarnings = monthlyEarnings * 12;

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
        toast.success("🎉 Félicitations ! Votre compte apporteur d'affaires est actif.", { duration: 4000 });
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
      q: "L'inscription au programme d'affiliation est-elle payante ?",
      a: "Non, l'inscription est 100% gratuite et ouverte à tous. Vous n'avez absolument rien à payer. Dès la création de votre compte, vous recevez immédiatement votre code parrain et votre lien personnel."
    },
    {
      q: "Comment et quand mes commissions sont-elles versées ?",
      a: "Vos gains sont calculés automatiquement en temps réel sur votre tableau de bord et versés chaque fin de mois directement sur votre compte Mobile Money (MTN MoMo, Moov Money ou Celtiis Cash)."
    },
    {
      q: "Pendant combien de temps est-ce que je touche des commissions ?",
      a: "À vie ! Tant que le commerçant ou restaurateur que vous avez parrainé maintient son abonnement mensuel à Oresto, vous recevez vos 1 000 FCFA (20%) chaque mois de manière récurrente et passive."
    },
    {
      q: "Dois-je gérer le support technique ou installer le site du commerçant ?",
      a: "Non ! C'est toute la force de notre plateforme. L'équipe d'Oresto prend en charge 100% du support technique, des serveurs et des mises à jour. Votre seul rôle est de faire découvrir Oresto aux commerçants."
    },
    {
      q: "Puis-je parrainer des commerces situés dans d'autres villes ?",
      a: "Absolument. Vous pouvez parrainer des établissements à Cotonou, Calavi, Porto-Novo, Parakou et partout au Bénin ainsi que dans toute la sous-région UEMOA."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sub selection:bg-orange-100 selection:text-[#EA580C] overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-heading font-black text-base shadow-braised group-hover:scale-105 transition-transform">
              O
            </div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-tight text-zinc-950 uppercase">
                Oresto
              </span>
              <span className="text-[10px] font-sub font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-[#EA580C]">
                Affiliation
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/prestataire/login"
              className="text-xs sm:text-sm font-sub font-bold text-zinc-700 hover:text-zinc-950 px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <span>Espace Affilié (Connexion)</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24">
        
        {/* HERO SECTION AFFILIÉ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-6 shadow-sm">
            <i className="fa-solid fa-handshake"></i>
            <span>PROGRAMME OFFICIEL D'AFFILIATION • 20% DE COMMISSION RÉCURRENTE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black text-zinc-950 tracking-tight leading-[1.08] mb-6 uppercase max-w-4xl mx-auto">
            Bâtissez un <span className="text-[#FF6B00]">revenu passif mensuel</span> en digitalisant les commerces.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 font-sub font-medium max-w-2xl mx-auto leading-relaxed mb-8">
            Recommandez Oresto aux restaurants, boutiques et hôtels. Touchez <strong>1 000 FCFA / mois par client actif à vie</strong>, versé directement sur votre compte Mobile Money chaque fin de mois.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#inscription"
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group"
            >
              <span>Devenir Partenaire Gratuitement</span>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </a>

            <a
              href="#simulateur"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 font-sub font-bold text-sm border border-zinc-300 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-calculator text-[#FF6B00]"></i>
              <span>Simuler mes revenus</span>
            </a>
          </div>

          {/* Quick Reassurances */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sub font-bold text-zinc-500 uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-check text-[#FF6B00]"></i>
              <span>100% Gratuit & Sans engagement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-money-bill-wave text-[#FF6B00]"></i>
              <span>Paiements MTN MoMo & Moov</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-chart-line text-[#FF6B00]"></i>
              <span>Commissions à vie</span>
            </div>
          </div>

        </section>

        {/* SECTION 2 : SIMULATEUR DE GAINS EN FOND SOMBRE STRUCTURÉ (#0A0A0A) */}
        <section id="simulateur" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[36px] border border-zinc-800 p-8 sm:p-12 text-white shadow-dark-card relative overflow-hidden">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950 text-[#FF6B00] text-xs font-sub font-bold uppercase tracking-wider mb-3 border border-orange-800/50">
                <i className="fa-solid fa-calculator"></i>
                <span>CALCULATRICE DE COMMISSIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight uppercase">
                Combien pouvez-vous gagner chaque mois ?
              </h2>
              <p className="text-zinc-400 font-sub text-sm mt-2">
                Faites glisser le curseur selon le nombre d'établissements que vous parrainez.
              </p>
            </div>

            {/* Range Slider */}
            <div className="max-w-xl mx-auto mb-10 space-y-4">
              <div className="flex justify-between items-center text-sm font-sub font-bold">
                <span className="text-zinc-400">Établissements actifs parrainés :</span>
                <span className="font-heading font-black text-2xl text-[#FF6B00]">{storeCount} commerces</span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={storeCount}
                onChange={(e) => setStoreCount(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B00]"
              />

              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>1 commerce</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100 commerces</span>
              </div>
            </div>

            {/* Earnings Output Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
              
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-sub font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Revenu Mensuel Récurrent
                </span>
                <div className="text-3xl sm:text-4xl font-heading font-black text-[#FF6B00]">
                  {monthlyEarnings.toLocaleString("fr-FR")} FCFA
                </div>
                <span className="text-[11px] text-zinc-500 font-sub mt-1 block">
                  versé tous les 5 du mois sur votre MoMo
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs font-sub font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Revenu Annuel Estimé
                </span>
                <div className="text-3xl sm:text-4xl font-heading font-black text-white">
                  {yearlyEarnings.toLocaleString("fr-FR")} FCFA
                </div>
                <span className="text-[11px] text-zinc-500 font-sub mt-1 block">
                  sur 12 mois sans investissement de départ
                </span>
              </div>

            </div>

            <div className="text-center">
              <a
                href="#inscription"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-xs uppercase tracking-wider shadow-braised transition-all"
              >
                <span>Commencer à parrainer maintenant</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>

          </div>
        </section>

        {/* SECTION 3 : COMMENT ÇA MARCHE EN 3 ÉTAPES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#EA580C] text-xs font-sub font-black uppercase tracking-wider mb-4">
              <i className="fa-solid fa-shoe-prints"></i>
              <span>PROCESSUS SIMPLE & CLAIR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-zinc-950 tracking-tight leading-tight uppercase">
              Comment ça marche pour vous ?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sub font-medium">
              3 étapes simples pour activer vos revenus passifs sans quitter votre emploi ou votre activité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-lg mb-6 border border-orange-100">
                  01
                </div>
                <h3 className="text-xl font-heading font-black text-zinc-950 uppercase mb-3">
                  Créez votre compte en 60 secondes
                </h3>
                <p className="text-sm text-zinc-600 font-sub leading-relaxed">
                  Remplissez le formulaire ci-dessous avec votre numéro WhatsApp. Vous obtenez immédiatement votre lien de parrainage et votre code exclusif.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-lg mb-6 border border-orange-100">
                  02
                </div>
                <h3 className="text-xl font-heading font-black text-zinc-950 uppercase mb-3">
                  Parlez-en aux commerçants
                </h3>
                <p className="text-sm text-zinc-600 font-sub leading-relaxed">
                  Restaurants, fast-foods, boutiques de mode ou résidences : montrez-leur la démo Oresto et invitez-les à tester 14 jours gratuitement.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center font-heading font-black text-lg mb-6 border border-orange-100">
                  03
                </div>
                <h3 className="text-xl font-heading font-black text-zinc-950 uppercase mb-3">
                  Encaissez chaque mois sur MoMo
                </h3>
                <p className="text-sm text-zinc-600 font-sub leading-relaxed">
                  Chaque fois qu'un commerçant renouvelle son abonnement mensuel à 5 000 FCFA, 1 000 FCFA vous sont crédités automatiquement.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4 : FORMULAIRE D'INSCRIPTION AFFILIÉ */}
        <section id="inscription" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-white rounded-3xl sm:rounded-[36px] p-8 sm:p-12 border-2 border-orange-500/50 shadow-float">
            
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-sub font-black uppercase tracking-wider text-[#EA580C] block mb-1">
                Inscription Immédiate
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-zinc-950 uppercase">
                Rejoignez le réseau des apporteurs d'affaires
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-sub mt-2">
                Gratuit, sans frais d'entrée, activation immédiate de votre code parrain.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-sub font-bold flex items-center gap-2 mb-6">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              
              <div className="space-y-1">
                <label className="text-xs font-sub font-bold text-zinc-700 uppercase tracking-wide">
                  Nom et Prénom *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Jean Houndété"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                  <i className="fa-solid fa-user absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700 uppercase tracking-wide">
                    Numéro MoMo (WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      placeholder="+229 97 00 00 00"
                      required
                      className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                    />
                    <i className="fa-solid fa-phone absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700 uppercase tracking-wide">
                    Ville de résidence *
                  </label>
                  <select
                    value={form.ville}
                    onChange={(e) => setForm({ ...form, ville: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
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
                  <label className="text-xs font-sub font-bold text-zinc-700 uppercase tracking-wide">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 caractères"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-sub font-bold text-zinc-700 uppercase tracking-wide">
                    Confirmer mot de passe *
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Répétez le mot de passe"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-[#FAFAFA] font-sub font-medium text-sm outline-none focus:border-[#FF6B00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-[#FF6B00] hover:bg-[#EA580C] text-white font-sub font-black text-sm uppercase tracking-wider shadow-braised transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Création de votre espace en cours...</span>
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
                  Vous avez déjà un compte apporteur d'affaires ?{" "}
                  <Link to="/prestataire/login" className="text-[#EA580C] font-bold hover:underline">
                    Connectez-vous ici
                  </Link>
                </p>
              </div>

            </form>

          </div>
        </section>

        {/* SECTION 5 : FAQ AFFILIÉS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-zinc-950 uppercase">
              Questions Fréquentes sur l'Affiliation
            </h2>
          </div>

          <div className="space-y-4">
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
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-heading font-bold text-base text-zinc-950">
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
                    <div className="px-6 pb-6 pt-1 text-zinc-600 font-sub text-sm leading-relaxed border-t border-zinc-100 mt-1">
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
      <footer className="bg-white border-t border-zinc-200 py-10 text-center text-xs font-sub text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="font-heading font-black text-zinc-900 text-base uppercase">
            Oresto <span className="text-[#FF6B00]">Pro</span>
          </Link>
          <p>© {new Date().getFullYear()} Oresto Affiliation. Tous droits réservés.</p>
          <a
            href="https://wa.me/2290143405361"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-[#FF6B00] flex items-center gap-1.5 font-bold"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>Support Partenaires : +229 01 43 40 53 61</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
