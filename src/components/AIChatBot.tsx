import { useState, useEffect, useRef } from "react";
import { askIZA, type IZAMode } from "@/lib/iza";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, update, push, get, set } from "firebase/database";
import { slugify } from "@/lib/slugify";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Bonjour ! Je suis **IZI IA**, votre assistant intelligent. ⚡\n\nJe suis connecté en direct aux données réelles de votre restaurant :\n- 📊 Vos ventes & chiffre d'affaires exact\n- 📦 Le suivi en direct de vos commandes\n- 🍽️ L'optimisation de vos prix et de votre carte\n- 📱 Vos encaissements Mobile Money\n\nQue souhaitez-vous vérifier aujourd'hui ?",
  timestamp: new Date().toISOString(),
};

interface AIChatBotProps {
  mode?: IZAMode;
}

export default function AIChatBot({ mode = "dashboard" }: AIChatBotProps) {
  const isLanding = mode === "landing";
  const { user, vendorProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const sectorParam = searchParams.get("sector");
  const businessType = sectorParam || vendorProfile?.business_type || 
    ((vendorProfile?.category || "").toLowerCase().includes("boutique") || (vendorProfile?.category || "").toLowerCase().includes("mode") ? "ecommerce" : 
     (vendorProfile?.category || "").toLowerCase().includes("hotel") ? "hotel" : "restaurant");

  const isEcommerce = businessType === "ecommerce";
  const isHotel = businessType === "hotel";

  const currentVendorName = vendorProfile?.name || user?.name || "Votre Établissement";

  const initialGreeting = isLanding
    ? `Bonjour ! 👋 Je suis **IZI IA**, votre conseiller Oresto Connect.\n\nJe suis là pour vous faire découvrir la plateforme et répondre à toutes vos questions :\n• 💰 Formules & tarifs (5 000 FCFA/mois, 14 jours d'essai gratuit)\n• ⚡ Fonctionnalités pour restaurants, boutiques et résidences\n• 📱 Encaissements Mobile Money sans commission (0%)\n• 🚀 Comment créer votre vitrine en 2 minutes\n\nQue souhaitez-vous savoir ?`
    : isEcommerce
    ? `Bonjour ! Je suis **IZI IA**, votre assistant e-commerce dédié à **${currentVendorName}**.\n\nJe suis connecté en direct à votre boutique :\n• 📊 Ventes & chiffre d'affaires réels\n• 📦 Suivi des colis & expéditions\n• ⚠️ Alertes de stock faible\n• 🧾 Impression des reçus de vente & factures\n• 📱 Encaissements Mobile Money\n\nQue souhaitez-vous vérifier aujourd'hui ?`
    : isHotel
    ? `Bonjour ! Je suis **IZI IA**, votre assistant hôtelier dédié à **${currentVendorName}**.\n\nJe suis connecté en direct à votre établissement :\n• 📊 Nuitées & chiffre d'affaires\n• 🛏️ Disponibilité des chambres & réservations\n• 📅 Planning des séjours\n• 📱 Encaissements Mobile Money directs\n\nQue souhaitez-vous vérifier aujourd'hui ?`
    : `Bonjour ! Je suis **IZI IA**, votre assistant opérationnel dédié à **${currentVendorName}**.\n\nJe suis connecté en direct à votre établissement :\n• 📊 Ventes & chiffre d'affaires réels\n• 🍳 Suivi des commandes en cuisine & livraison\n• 🍽️ Gestion des prix et du catalogue\n• 🧾 Impression des tickets de caisse certifiés\n• 📱 Encaissements Mobile Money\n\nQue souhaitez-vous vérifier aujourd'hui ?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialGreeting,
      timestamp: new Date().toISOString()
    }
  ]);

  // Reset initial message if sector changes
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: initialGreeting,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [businessType, currentVendorName]);

  // Fermer la fenêtre de chat avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Speech recognition setup
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      recognitionRef.current = new SR();
      recognitionRef.current.lang = "fr-FR";
      recognitionRef.current.onresult = (e: any) => {
        setInput(e.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  // Ouverture programmatique depuis d'autres écrans
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("oresto:open-iza", open);
    return () => window.removeEventListener("oresto:open-iza", open);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const buildContext = async (): Promise<string> => {
    const vId = vendorProfile?.id || user?.vendorId;
    if (!vId) {
      return JSON.stringify({
        hasStore: false,
        userName: user?.name || "Commerçant",
        vendorName: "Mon Établissement",
        totalRevenue: 0,
        totalOrders: 0,
        todayRevenue: 0,
        todayOrders: 0,
        avgOrder: 0,
        recentOrdersList: [],
        productsList: [],
      });
    }

    // Données de base depuis le profil
    const initialSlug = vendorProfile?.slug || slugify(currentVendorName) || vId;
    const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";
    let contextData: any = {
      userName: user?.name || "Chef",
      role: user?.role || "vendor",
      vendorId: vId,
      vendorName: currentVendorName,
      business_type: businessType,
      isOpen: vendorProfile?.open !== false,
      is_published: vendorProfile?.is_published !== false,
      slug: initialSlug,
      publicSiteUrl: `${siteOrigin}/r/${initialSlug}`,
      siteRelativeUrl: `/r/${initialSlug}`,
      rating: vendorProfile?.rating || 5.0,
      reviewCount: vendorProfile?.reviewCount || 0,
      // Métriques (seront recalculées depuis Firebase si disponible)
      totalRevenue: 0,
      totalOrders: 0,
      todayRevenue: 0,
      todayOrders: 0,
      avgOrder: 0,
      // Listes vides par défaut — remplies depuis Firebase
      activeOrders: [],       // commandes en cours (cuisine / livraison)
      recentOrdersList: [],   // 10 dernières commandes tous statuts
      productsList: [],       // catalogue avec IDs réels pour les actions
      lowStockAlerts: [],     // produits avec stock ≤ 3
      topProducts: [],        // top 3 plats/produits les + vendus
    };

    if (db) {
      try {
        const [ordersSnap, productsSnap, vendorSnap] = await Promise.all([
          get(ref(db, "orders")),
          get(ref(db, "products")),
          get(ref(db, `vendors/${vId}`)),
        ]);

        // ── Données vendeur ──────────────────────────────────────────────────
        if (vendorSnap.exists()) {
          const v = vendorSnap.val();
          contextData.vendorName = v.name || contextData.vendorName;
          contextData.isOpen = v.open !== undefined ? v.open : contextData.isOpen;
          contextData.is_published = v.is_published !== false;
          const liveSlug = v.slug || slugify(v.name || currentVendorName) || vId;
          contextData.slug = liveSlug;
          contextData.publicSiteUrl = `${siteOrigin}/r/${liveSlug}`;
          contextData.siteRelativeUrl = `/r/${liveSlug}`;
          contextData.rating = v.rating || contextData.rating;
          contextData.reviewCount = v.reviewCount || contextData.reviewCount;
          contextData.phone = v.phone || v.whatsapp || "";
          contextData.city = v.city || "";
          contextData.plan = v.subscriptionPlan || v.plan || "pro";
          contextData.subscriptionStatus = v.subscriptionStatus || "active";
        }

        // ── Produits / Catalogue ─────────────────────────────────────────────
        if (productsSnap.exists()) {
          const allProducts = productsSnap.val();
          const myProducts = Object.entries(allProducts)
            .filter(([_, p]: any) => p.vendorId === vId)
            .map(([id, p]: any) => ({
              id,                         // ID Firebase réel — utilisé par update_product_price
              name: p.name || "Article",
              price: Number(p.price) || 0,
              category: p.category || "Divers",
              available: p.available !== false,
              stock: p.stock ?? null,
              description: p.description || "",
            }));

          contextData.productsList = myProducts;

          // Alertes stock faible (≤ 3 unités)
          contextData.lowStockAlerts = myProducts
            .filter(p => p.stock !== null && p.stock <= 3)
            .map(p => ({ id: p.id, name: p.name, stock: p.stock }));
        }

        // ── Commandes ────────────────────────────────────────────────────────
        if (ordersSnap.exists()) {
          const allOrders = ordersSnap.val();
          const myOrders: any[] = Object.entries(allOrders)
            .filter(([_, o]: any) => o.vendorId === vId)
            .map(([id, o]: any) => ({ id, ...o }))
            .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

          const validOrders = myOrders.filter((o: any) => o.status !== "cancelled");

          // Métriques globales
          const totalRev = validOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
          contextData.totalRevenue = totalRev;
          contextData.totalOrders = validOrders.length;
          contextData.avgOrder = validOrders.length > 0 ? Math.round(totalRev / validOrders.length) : 0;

          // Métriques du jour
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const todayOrdersList = validOrders.filter((o: any) => new Date(o.date || 0).getTime() >= todayStart.getTime());
          contextData.todayRevenue = todayOrdersList.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
          contextData.todayOrders = todayOrdersList.length;

          // Commandes ACTIVES — en cuisine ou en livraison (avec ID Firebase pour action)
          const active = myOrders.filter((o: any) =>
            o.status === "pending" || o.status === "preparing" || o.status === "delivering" || o.status === "confirmed"
          );
          contextData.activeOrders = active.map((o: any) => ({
            id: o.id,                      // ID Firebase — utilisé par update_order_status
            shortId: `#${o.id?.slice(-4) || "----"}`,
            items: Array.isArray(o.items)
              ? o.items.map((i: any) => `${i.qty || i.quantity || 1}x ${i.name || "Article"}`).join(", ")
              : (o.item || "Commande"),
            total: Number(o.total) || 0,
            status: o.status,
            statusLabel: o.status === "pending" ? "En attente" : o.status === "preparing" ? "En cuisine" : o.status === "delivering" ? "En livraison" : "Confirmée",
            payment: o.paymentMethod || "MoMo",
            clientName: o.clientName || o.userName || "Client",
            date: o.date || new Date().toISOString(),
            minutesAgo: o.date ? Math.floor((Date.now() - new Date(o.date).getTime()) / 60000) : 0,
          }));

          // 10 dernières commandes (tous statuts)
          contextData.recentOrdersList = myOrders.slice(0, 10).map((o: any) => ({
            id: o.id,
            shortId: `#${o.id?.slice(-4) || "----"}`,
            items: Array.isArray(o.items)
              ? o.items.map((i: any) => `${i.qty || i.quantity || 1}x ${i.name || "Article"}`).join(", ")
              : (o.item || "Commande"),
            total: Number(o.total) || 0,
            status: o.status,
            statusLabel: o.status === "pending" ? "En attente" : o.status === "preparing" ? "En cuisine" : o.status === "delivering" ? "En livraison" : o.status === "delivered" ? "Livré" : o.status === "cancelled" ? "Annulée" : o.status,
            payment: o.paymentMethod || "MoMo",
            clientName: o.clientName || o.userName || "Client",
            date: o.date || "",
          }));

          // Top produits (par nombre de ventes)
          const salesCount: Record<string, { name: string; count: number; revenue: number }> = {};
          for (const o of validOrders) {
            if (Array.isArray(o.items)) {
              for (const item of o.items) {
                const name = item.name || "Article";
                const qty = item.qty || item.quantity || 1;
                const rev = (item.price || 0) * qty;
                if (!salesCount[name]) salesCount[name] = { name, count: 0, revenue: 0 };
                salesCount[name].count += qty;
                salesCount[name].revenue += rev;
              }
            }
          }
          contextData.topProducts = Object.values(salesCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
        }
      } catch (e) {
        console.warn("Erreur chargement context IZI:", e);
      }
    }

    return JSON.stringify(contextData);
  };


  const executeTools = async (calls: any[]): Promise<string[]> => {
    const vId = vendorProfile?.id || user?.vendorId;
    if (!vId) {
      return ["Action impossible : aucun établissement associé à ce compte."];
    }
    const results: string[] = [];
    for (const call of calls) {
      try {
        if (call.name === "publish_or_activate_site" && db) {
          const snap = await get(ref(db, `vendors/${vId}`));
          const currentData = snap.exists() ? snap.val() : {};
          const chosenSlug = call.args.slug ? slugify(call.args.slug) : (currentData.slug || slugify(currentData.name || currentVendorName) || vId);
          await update(ref(db, `vendors/${vId}`), {
            isOpen: true,
            open: true,
            is_published: true,
            status: "active",
            slug: chosenSlug,
          });
          await set(ref(db, `slugs/${chosenSlug}`), { vendorId: vId });
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          const fullUrl = `${origin}/r/${chosenSlug}`;
          results.push(`🎉 **Votre vitrine en ligne est désormais 100% active et fonctionnelle !**\n\n🔗 **Lien direct pour vos clients :** [${fullUrl}](${fullUrl})\n\n💡 Vos clients peuvent dès maintenant consulter votre carte/catalogue, passer commande et régler directement par Mobile Money sans commission.`);
        }
        else if (call.name === "get_store_link" && db) {
          const snap = await get(ref(db, `vendors/${vId}`));
          const currentData = snap.exists() ? snap.val() : {};
          const currentSlug = currentData.slug || slugify(currentData.name || currentVendorName) || vId;
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          const fullUrl = `${origin}/r/${currentSlug}`;
          results.push(`🔗 **Lien public de votre établissement :**\n[${fullUrl}](${fullUrl})\n\n📱 Partagez ce lien à vos clients sur WhatsApp, Facebook ou Instagram pour recevoir des commandes directes.`);
        }
        else if (call.name === "update_store_info" && db) {
          const updates: any = {};
          if (call.args.name) updates.name = call.args.name;
          if (call.args.description) updates.description = call.args.description;
          if (call.args.phone) updates.phone = call.args.phone;
          if (call.args.whatsapp) updates.whatsapp = call.args.whatsapp;
          if (call.args.city) updates.city = call.args.city;
          if (call.args.neighborhood) updates.neighborhood = call.args.neighborhood;
          if (call.args.slug) {
            const newSlug = slugify(call.args.slug);
            updates.slug = newSlug;
            await set(ref(db, `slugs/${newSlug}`), { vendorId: vId });
          }
          await update(ref(db, `vendors/${vId}`), updates);
          results.push(`✅ Les informations de votre établissement ont été mises à jour avec succès.`);
        }
        else if (call.name === "update_product_price" && db) {
          await update(ref(db, `products/${call.args.productId}`), { price: Number(call.args.newPrice) });
          let pName = call.args.productName;
          if (!pName) {
            try {
              const snap = await get(ref(db, `products/${call.args.productId}`));
              if (snap.exists()) pName = snap.val()?.name;
            } catch {}
          }
          const label = pName ? ` de « ${pName} »` : "";
          results.push(`✅ Prix${label} mis à jour à ${Number(call.args.newPrice).toLocaleString("fr-FR")} FCFA.`);
        }
        else if (call.name === "toggle_product_availability" && db) {
          const isAvail = Boolean(call.args.available);
          await update(ref(db, `products/${call.args.productId}`), { available: isAvail });
          let pName = call.args.productName;
          if (!pName) {
            try {
              const snap = await get(ref(db, `products/${call.args.productId}`));
              if (snap.exists()) pName = snap.val()?.name;
            } catch {}
          }
          const label = pName ? `« ${pName} »` : "Le produit";
          results.push(`✅ ${label} marqué ${isAvail ? "disponible (en stock)" : "épuisé / indisponible"}.`);
        }
        else if (call.name === "toggle_shop_status" && db) {
          await update(ref(db, `vendors/${vId}`), { isOpen: call.args.isOpen, open: call.args.isOpen });
          results.push(`✅ Établissement ${call.args.isOpen ? "ouvert" : "fermé"} avec succès.`);
        }
        else if (call.name === "send_notification" && db) {
          await push(ref(db, `notifications`), { 
            message: call.args.message, target: call.args.target, 
            type: call.args.notifType || "info", date: new Date().toISOString()
          });
          results.push(`✅ Notification envoyée (${call.args.target}).`);
        }
        else if (call.name === "update_order_status" && db) {
          await update(ref(db, `orders/${call.args.orderId}`), { status: call.args.newStatus });
          results.push(`✅ Commande ${call.args.orderId.slice(-4)} mise à jour : ${call.args.newStatus}`);
        }
        else if (call.name === "create_promo" && db) {
          await update(ref(db, `vendors/${vId}/promos/${call.args.code}`), { 
            discount: call.args.discount, active: true 
          });
          results.push(`✅ Code promo ${call.args.code} de -${call.args.discount}F activé.`);
        }
        else if (call.name === "add_new_product" && db) {
          await push(ref(db, `products`), {
            vendorId: vId, name: call.args.name, price: call.args.price, 
            category: call.args.category || (isEcommerce ? "Mode" : "Plats"), available: true
          });
          results.push(`✅ Article "${call.args.name}" ajouté à ${Number(call.args.price).toLocaleString("fr-FR")} FCFA.`);
        }
        else {
          results.push(`⚠️ Action complétée.`);
        }
      } catch (err: any) { results.push(`❌ Erreur technique: ${err.message}`); }
    }
    return results;
  };

  const handleSend = async (textOverride?: string) => {
    const text = (textOverride || input).trim();
    if (!text || isLoading) return;
    setInput("");

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // En mode landing : pas de contexte Firebase, on envoie juste le message
      const context = isLanding ? undefined : await buildContext();
      const { text: replyText, functionCalls } = await askIZA(text, history, context, mode);

      let finalContent = replyText;
      if (functionCalls && functionCalls.length > 0) {
        const results = await executeTools(functionCalls);
        const resultsText = results.join("\n");
        finalContent = replyText 
          ? `${replyText}\n\n${resultsText}` 
          : `⚡ **Opérations effectuées avec succès :**\n\n${resultsText}`;
      }
      if (!finalContent) {
        finalContent = "Désolé, je n'ai pas pu générer de réponse. Réessayez.";
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: finalContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        role: "assistant",
        content: isLanding
          ? `Bonjour ! Je suis **IZI IA**, votre conseiller Oresto Connect. Posez-moi vos questions sur nos tarifs, nos fonctionnalités ou rendez-vous sur **/register** pour démarrer votre essai gratuit.`
          : `⚡ **IZI IA :** Je suis là pour vous aider avec **${currentVendorName}** ! Vous pouvez me demander vos ventes, le suivi de vos commandes ou l'impression de vos reçus.`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick buttons selon le mode
  const landingQuickButtons = [
    { label: "💰 Tarifs & formules", q: "Quels sont les tarifs et formules d'Oresto ?" },
    { label: "⚡ Fonctionnalités", q: "Qu'est-ce qu'Oresto peut faire pour mon restaurant ?" },
    { label: "📱 Mobile Money", q: "Comment fonctionne le paiement Mobile Money sur Oresto ?" },
    { label: "🚀 Comment démarrer", q: "Comment m'inscrire et démarrer mon essai gratuit ?" },
    { label: "🤖 IZI IA", q: "C'est quoi IZI IA et comment ça m'aide ?" },
  ];

  const quickButtons = isLanding ? landingQuickButtons : isEcommerce ? [
    { label: "📊 Ventes du jour", q: "Quel est le chiffre d'affaires de ma boutique aujourd'hui et au total ?" },
    { label: "📦 Colis à expédier", q: "Fais-moi le point sur mes commandes et colis à livrer" },
    { label: "⚠️ Alertes stock", q: "Quels sont les articles bientôt en rupture de stock ?" },
    { label: "🧾 Reçus de vente", q: "Comment imprimer et envoyer un reçu de vente au client ?" },
    { label: "💡 Conseils E-Commerce", q: "Donne-moi des conseils marketing pour vendre plus sur WhatsApp et les réseaux" }
  ] : isHotel ? [
    { label: "📊 CA & Nuitées", q: "Quel est le chiffre d'affaires des réservations et nuitées ?" },
    { label: "🛏️ Chambres disponibles", q: "Quelles sont les chambres et suites disponibles ?" },
    { label: "📅 Arrivées du jour", q: "Quelles sont les arrivées et réservations prévues ?" },
    { label: "💡 Optimiser mes prix", q: "Comment maximiser le taux d'occupation de mon établissement ?" }
  ] : [
    { label: "📊 Ventes du jour", q: "Quel est mon chiffre d'affaires exact aujourd'hui et au total ?" },
    { label: "🍳 Commandes en cuisine", q: "Fais-moi le point exact de mes commandes en cours et servies" },
    { label: "🍽️ Conseil carte & plats", q: "Comment optimiser mon menu et mes prix pour augmenter mon panier moyen ?" },
    { label: "🧾 Reçu officiel", q: "Comment générer un reçu de caisse après une vente ?" },
    { label: "📱 Paiement MoMo", q: "Combien ai-je encaissé par Mobile Money sans commission ?" }
  ];

  const startListening = () => {
    if (!recognitionRef.current) { toast.error("Micro non disponible sur ce navigateur"); return; }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const formatContent = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
  };

  return (
    <div className="fixed bottom-24 right-4 z-[9990] flex flex-col items-end gap-3 md:bottom-6 md:right-6 font-body">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[calc(100vw-32px)] sm:w-[360px] md:w-[380px] max-w-[380px] h-[min(520px,calc(100vh-140px))] flex flex-col bg-white border border-gray-200 shadow-2xl shadow-black/20 rounded-[28px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#0A0A0A] border-b border-white/10 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-md shadow-primary/30">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-black text-sm text-white uppercase tracking-tight">ORESTO IZI IA</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Assistant IA · Données Live</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([{ role: "assistant", content: initialGreeting, timestamp: new Date().toISOString() }])}
                  className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs"
                  title="Réinitialiser"
                  aria-label="Réinitialiser la conversation"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs"
                  aria-label="Fermer l'assistant IZI IA"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex gap-2 p-2 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide text-xs">
              {quickButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(btn.q)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[11px] font-bold whitespace-nowrap hover:border-primary hover:text-primary transition-all shadow-sm shrink-0"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FCFCFD]">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white text-[11px] shrink-0 mt-0.5 shadow-sm">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                  )}
                  <div
                    className={`max-w-[84%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#0A0A0A] text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-150 shadow-sm rounded-bl-none"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: formatContent(m.content) }} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white text-[11px] shrink-0">
                    <i className="fa-solid fa-robot fa-bounce"></i>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white border border-gray-150 text-gray-500 text-xs flex items-center gap-2 shadow-sm">
                    <span className="animate-pulse">Calcul des statistiques réelles...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Posez une question à IZI IA..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 border-none text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button
                type="button"
                onClick={startListening}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all ${
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Dictée vocale"
                aria-label="Activer la dictée vocale"
              >
                <i className="fa-solid fa-microphone"></i>
              </button>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center text-xs hover:bg-primary/90 disabled:opacity-40 transition-all shadow-md shadow-primary/25"
                aria-label="Envoyer le message"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Icon Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(true)}
          className="relative w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#0A0A0A] hover:bg-primary text-white flex items-center justify-center shadow-2xl shadow-black/35 border-2 border-white/20 transition-all group"
          title="IZI IA — Assistant Intelligent"
          aria-label="Ouvrir IZI IA"
        >
          {/* Robot Icon */}
          <div className="w-8 h-8 rounded-full bg-primary/25 group-hover:bg-white/25 flex items-center justify-center text-primary group-hover:text-white text-lg transition-colors">
            <i className="fa-solid fa-robot"></i>
          </div>

          {/* Online green indicator badge */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0A0A] flex items-center justify-center shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>
        </motion.button>
      )}
    </div>
  );
}
