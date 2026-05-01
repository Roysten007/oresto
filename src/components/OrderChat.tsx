import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { useAuth } from "@/contexts/AuthContext";
import { Send, MessageCircle, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "vendor";
  text: string;
  timestamp: number;
}

interface OrderChatProps {
  orderId: string;
  vendorName?: string;
  clientName?: string;
  compact?: boolean; // mode compact pour le dashboard vendeur
}

export default function OrderChat({ orderId, vendorName, clientName, compact = false }: OrderChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!db || !orderId) return;
    const msgsRef = ref(db, `messages/${orderId}`);
    const unsub = onValue(msgsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) as Message[];
        setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });
    return () => unsub();
  }, [orderId]);

  useEffect(() => {
    if (!compact) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, compact]);

  const sendMessage = async () => {
    if (!text.trim() || !user || !db) return;
    setSending(true);
    const msgsRef = ref(db, `messages/${orderId}`);
    const newMsg = push(msgsRef);
    await set(newMsg, {
      senderId: user.id,
      senderName: user.firstName || user.name || "Utilisateur",
      senderRole: user.role,
      text: text.trim(),
      timestamp: Date.now(),
    });
    setText("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMe = (msg: Message) => msg.senderId === user?.id;
  const otherName = user?.role === "vendor" ? (clientName || "Client") : (vendorName || "Restaurant");

  return (
    <div className={`flex flex-col bg-white rounded-[36px] border border-gray-100 shadow-lg overflow-hidden ${compact ? "" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
        <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-primary">
          {user?.role === "vendor" ? <ChefHat size={18} className="text-primary" /> : <MessageCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-sm uppercase tracking-tight truncate">
            {user?.role === "vendor" ? "Discussion avec le client" : `Chat avec ${otherName}`}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">En direct</p>
          </div>
        </div>
        {messages.length > 0 && (
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
            {messages.length} msg
          </span>
        )}
      </div>

      {/* Messages area */}
      <div
        className={`overflow-y-auto p-4 space-y-3 bg-[#F8F8FA] ${
          compact ? "max-h-56 min-h-[140px]" : "max-h-80 min-h-[200px]"
        }`}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-3">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-200">
              <MessageCircle size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Aucun message</p>
              <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">
                Commencez la discussion avec {otherName} !
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`flex ${isMe(msg) ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe(msg) ? "items-end" : "items-start"} gap-1`}>
                  {!isMe(msg) && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed font-medium ${
                      isMe(msg)
                        ? "bg-black text-white rounded-[18px] rounded-br-[6px] shadow-lg shadow-black/10"
                        : "bg-white text-black shadow-sm border border-gray-100 rounded-[18px] rounded-bl-[6px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-300 font-bold px-2">
                    {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 p-2 pl-4 bg-gray-50 rounded-2xl border border-gray-100 focus-within:border-primary/30 focus-within:bg-white transition-all">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrire à ${otherName}...`}
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-300 placeholder:font-normal"
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            {sending ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </motion.button>
        </div>
        <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest text-center mt-2">
          Entrée pour envoyer · Réponse en temps réel
        </p>
      </div>
    </div>
  );
}
