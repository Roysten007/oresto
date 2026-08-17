import { useState, useEffect, useRef } from "react";
import { askIZA } from "@/lib/iza";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { ref, update, push, get } from "firebase/database";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Bonjour ! Je suis **IZI IA**, votre assistant intelligent. ⚡\n\nJe peux vous aider à :\n- 📊 Analyser vos chiffres & commandes\n- 🍽️ Gérer votre carte et vos prix\n- 📱 Suivre vos paiements Mobile Money\n- 🚀 Développer votre établissement\n\nQue puis-je faire pour vous aujourd'hui ?",
  timestamp: new Date().toISOString(),
};

export default function AIChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

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
    let contextStr = `UTILISATEUR: ${user?.name || "Chef Restaurateur"} | Rôle: ${user?.role || "vendor"} | ID: ${user?.id || "u_demo"} | VendorID: ${user?.vendorId || "v_demo"}`;
    if (db) {
      try {
        const snap = await get(ref(db));
        if (snap.exists()) {
          const data = snap.val();
          if (user?.role === "vendor" && user.vendorId) {
            const myVendor = data.vendors?.[user.vendorId] || {};
            const myProducts = Object.entries(data.products || {}).filter(([_, p]: any) => p.vendorId === user.vendorId).map(([id, p]: any) => ({ id, ...p }));
            const myOrders = Object.entries(data.orders || {}).filter(([_, o]: any) => o.vendorId === user.vendorId);
            contextStr += `\nBOUTIQUE: ${JSON.stringify({ name: myVendor.name, isOpen: myVendor.isOpen })}\n`;
            contextStr += `PRODUITS: ${JSON.stringify(myProducts).substring(0, 1000)}\n`;
            contextStr += `COMMANDES: ${JSON.stringify(myOrders).substring(0, 1500)}\n`;
          }
        }
      } catch (e) {}
    }
    return contextStr;
  };

  const executeTools = async (calls: any[]): Promise<string[]> => {
    const results: string[] = [];
    for (const call of calls) {
      try {
        if (call.name === "update_product_price" && db) {
          await update(ref(db, `products/${call.args.productId}`), { price: call.args.newPrice });
          results.push(`✅ Prix du produit mis à jour à ${call.args.newPrice} F`);
        }
        else if (call.name === "toggle_shop_status" && db && user?.vendorId) {
          await update(ref(db, `vendors/${user.vendorId}`), { isOpen: call.args.isOpen });
          results.push(`✅ Boutique ${call.args.isOpen ? "ouverte" : "fermée"} avec succès.`);
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
          results.push(`✅ Commande ${call.args.orderId.slice(-4)} passée en: ${call.args.newStatus}`);
        }
        else if (call.name === "create_promo" && db && user?.vendorId) {
          await update(ref(db, `vendors/${user.vendorId}/promos/${call.args.code}`), { 
            discount: call.args.discount, active: true 
          });
          results.push(`✅ Code promo ${call.args.code} de -${call.args.discount}F activé.`);
        }
        else if (call.name === "add_new_product" && db && user?.vendorId) {
          await push(ref(db, `products`), {
            vendorId: user.vendorId, name: call.args.name, price: call.args.price, 
            category: call.args.category || "Plats", available: true
          });
          results.push(`✅ Produit "${call.args.name}" ajouté à ${call.args.price}F.`);
        }
        else {
          results.push(`⚠️ Impossible d'exécuter l'action demandée.`);
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
      const context = await buildContext();
      const { text: replyText, functionCalls } = await askIZA(text, history, context);

      let finalContent = replyText;
      if (functionCalls && functionCalls.length > 0) {
        const results = await executeTools(functionCalls);
        const resultsText = results.join("\n");
        finalContent = replyText ? `${replyText}\n\n${resultsText}` : resultsText;
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
    } catch (error: any) {
      // Pas de message d'erreur bloquant — réponse amicale
      const fallbackMsg: Message = {
        role: "assistant",
        content: "⚡ **IZI IA :** Je suis là pour vous aider ! Vous pouvez me demander vos ventes du jour, le suivi de vos commandes MoMo ou des conseils pour vos plats.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

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
            className="w-[340px] md:w-[380px] h-[520px] flex flex-col bg-white border border-gray-200 shadow-2xl shadow-black/20 rounded-[28px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#0A0A0A] border-b border-white/10 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-sm shadow-md shadow-primary/30">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-black text-sm text-white uppercase tracking-tight">ORESTO IZI IA</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Assistant IA · En ligne</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([INITIAL_MESSAGE])}
                  className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs"
                  title="Réinitialiser"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-xs"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex gap-2 p-2 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide text-xs">
              {[
                { label: "📦 Commandes du jour", q: "Voir mes commandes" },
                { label: "📊 Chiffre d'affaires", q: "Quel est mon chiffre d'affaires aujourd'hui ?" },
                { label: "🍽️ Conseil carte", q: "Comment optimiser mon menu et mes prix ?" },
                { label: "📱 Paiement MoMo", q: "Comment fonctionnent les paiements Mobile Money ?" }
              ].map((btn, i) => (
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
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
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
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl bg-white border border-gray-150 text-gray-500 text-xs flex items-center gap-2 shadow-sm">
                    <span className="animate-pulse">IZI IA réfléchit...</span>
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
              >
                <i className="fa-solid fa-microphone"></i>
              </button>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center text-xs hover:bg-primary/90 disabled:opacity-40 transition-all shadow-md shadow-primary/25"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-[#0A0A0A] text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl hover:bg-primary transition-all border border-white/10"
        >
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px]">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <span>IZI IA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      )}
    </div>
  );
}
