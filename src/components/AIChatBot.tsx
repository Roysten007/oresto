import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, ChevronDown, Mic, Volume2, Activity } from "lucide-react";
import { askGemini } from "@/lib/gemini";
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
  content: "Bonjour ! Je suis **IZA**, l'assistant IA d'Oresto. ⚡\n\nJe peux vous aider à :\n- 🍽️ Trouver un restaurant\n- 📦 Suivre une commande\n- 💡 Conseils pour restaurateurs\n- 📊 Analyser vos performances\n\nQue puis-je faire pour vous ?",
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const buildContext = async (): Promise<string> => {
    let contextStr = `UTILISATEUR: ${user?.name || "Visiteur"} | Rôle: ${user?.role || "client"} | ID: ${user?.id || "N/A"} | VendorID: ${user?.vendorId || "N/A"}`;
    if (db) {
      try {
        const snap = await get(ref(db));
        if (snap.exists()) {
          const data = snap.val();
          contextStr += `\n\n=== CONTEXTE SÉCURISÉ ===\n`;

          if (user?.role === "client" || !user) {
            // Pour les clients: Uniquement la liste publique des restos et les produits disponibles
            const publicVendors = Object.entries(data.vendors || {}).map(([id, v]: any) => ({
              id, name: v.name, description: v.description, isOpen: v.isOpen, rating: v.rating
            }));
            const publicProducts = Object.entries(data.products || {}).filter(([_, p]: any) => p.available).map(([id, p]: any) => ({
              id, name: p.name, price: p.price, vendorId: p.vendorId, category: p.category
            }));
            contextStr += `RESTAURANTS PUBLICS: ${JSON.stringify(publicVendors).substring(0, 1000)}\n`;
            contextStr += `PRODUITS ACTIFS: ${JSON.stringify(publicProducts).substring(0, 1500)}\n`;
          } 
          else if (user?.role === "vendor" && user.vendorId) {
            // Pour un vendeur: Uniquement SES produits, SES commandes, et SON profil
            const myVendor = data.vendors?.[user.vendorId] || {};
            const myProducts = Object.entries(data.products || {}).filter(([_, p]: any) => p.vendorId === user.vendorId).map(([id, p]: any) => ({ id, ...p }));
            const myOrders = Object.entries(data.orders || {}).filter(([_, o]: any) => o.vendorId === user.vendorId);
            contextStr += `VOTRE BOUTIQUE: ${JSON.stringify({ name: myVendor.name, isOpen: myVendor.isOpen, promos: myVendor.promos })}\n`;
            contextStr += `VOS PRODUITS: ${JSON.stringify(myProducts).substring(0, 1000)}\n`;
            contextStr += `VOS COMMANDES RÉCENTES: ${JSON.stringify(myOrders).substring(0, 1500)}\n`;
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

    const userMsg: Message = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role, content: m.content }));
      const currentContext = await buildContext();
      const result = await askGemini(text, history, currentContext);

      let finalContent = result.text;
      
      if (result.functionCalls && result.functionCalls.length > 0) {
        const actionResults = await executeTools(result.functionCalls);
        if (!finalContent) {
           finalContent = actionResults.join("\n\n");
        } else {
           finalContent += "\n\n" + actionResults.join("\n\n");
        }
      }

      if (!finalContent) finalContent = "Action effectuée.";

      const assistantMsg: Message = {
        role: "assistant",
        content: finalContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("IZA Error Details:", error);
      toast.error(`Erreur IZA: ${error.message || "Problème technique"}`);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Désolé, je rencontre un problème technique. (${error.message || "Erreur inconnue"})`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) { toast.error("Micro non disponible"); return; }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const formatContent = (text: string) => {
    // Bold **text** → strong
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
  };

  // Only show for authenticated users
  if (!user) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[9990] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[340px] md:w-[380px] h-[520px] flex flex-col bg-white border border-gray-100 shadow-2xl shadow-black/15 rounded-[28px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-black border-b border-white/10 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm text-white uppercase tracking-tight">Oresto IZA</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Assistant IA · En ligne</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setMessages([INITIAL_MESSAGE])}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase"
                  title="Réinitialiser"
                >
                  ↺
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8FA]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <Sparkles size={13} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-[18px] text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-[6px] shadow-lg shadow-black/10"
                        : "bg-white text-black border border-gray-100 rounded-bl-[6px] shadow-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                  />
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                    <Sparkles size={13} className="text-primary" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-[18px] rounded-bl-[6px] px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-gray-300"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
                {[
                  "Analyser mes ventes",
                  "Conseils pour mon menu",
                  "Comment suivre ma commande ?",
                ].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-primary hover:text-white transition-all flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2 p-2 pl-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-primary/30 focus-within:bg-white transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Posez votre question à IZA..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-300 font-medium"
                  disabled={isLoading}
                />
                <button
                  onClick={startListening}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  <Mic size={14} />
                </button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-30"
                >
                  {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(v => !v)}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? "bg-gray-800 text-white" : "bg-black text-white hover:bg-primary"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
