import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Send, 
  MessageCircle, 
  ChefHat, 
  Image as ImageIcon, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Phone, 
  Receipt, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Smartphone,
  Truck,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "vendor" | "system";
  text: string;
  timestamp: number;
  type?: "text" | "image" | "system" | "payment_request" | "payment_sent" | "payment_confirmed";
  imageUrl?: string;
  paymentDetails?: {
    amount: number;
    phone?: string;
    network?: string;
  };
}

interface OrderData {
  id: string;
  vendorId?: string;
  vendorName?: string;
  clientId?: string;
  clientName?: string;
  clientPhone?: string;
  items?: { name: string; qty: number; price: number }[];
  total?: number;
  status?: "awaiting_payment" | "payment_sent" | "preparing" | "delivering" | "delivered" | "cancelled" | string;
  notes?: string;
  date?: string;
}

interface OrderChatProps {
  orderId: string;
  vendorName?: string;
  clientName?: string;
  compact?: boolean;
}

export default function OrderChat({ orderId, vendorName, clientName, compact = false }: OrderChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [vendorPhone, setVendorPhone] = useState<string>("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVendor = user?.role === "vendor";

  // 1. Écouter les messages de la commande
  useEffect(() => {
    if (!db || !orderId) return;
    const msgsRef = ref(db, `messages/${orderId}`);
    const unsubMsgs = onValue(msgsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) as Message[];
        setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    });

    // 2. Écouter l'état en direct de la commande
    const orderRef = ref(db, `orders/${orderId}`);
    const unsubOrder = onValue(orderRef, async snap => {
      if (snap.exists()) {
        const oData = snap.val() as OrderData;
        setOrder(oData);

        // Récupérer le numéro du vendeur si non présent
        if (oData.vendorId && !vendorPhone) {
          const vSnap = await get(ref(db, `vendors/${oData.vendorId}`));
          if (vSnap.exists()) {
            const vData = vSnap.val();
            setVendorPhone(vData.phone || vData.whatsapp || "");
          }
        }
      }
    });

    return () => {
      unsubMsgs();
      unsubOrder();
    };
  }, [orderId]);

  useEffect(() => {
    if (!compact) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, compact]);

  const handleCopyPhone = (phoneNum: string) => {
    if (!phoneNum) return;
    navigator.clipboard.writeText(phoneNum.replace(/\s+/g, ""));
    setCopied(true);
    toast.success("Numéro Mobile Money copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db) return;

    setSending(true);
    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, `order-images/${orderId}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const msgsRef = ref(db, `messages/${orderId}`);
      const newMsg = push(msgsRef);
      await set(newMsg, {
        senderId: user?.id || `guest_${orderId}`,
        senderName: user?.name || clientName || "Client",
        senderRole: isVendor ? "vendor" : "client",
        text: "📸 Reçu / Preuve de paiement envoyé(e)",
        timestamp: Date.now(),
        type: "image",
        imageUrl: downloadURL
      });
      toast.success("Image transmise avec succès !");
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Erreur lors de l'envoi de l'image");
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sendMessage = async (customText?: string, customType: Message["type"] = "text") => {
    const content = customText || text;
    if (!content.trim() || !db) return;
    setSending(true);
    try {
      const msgsRef = ref(db, `messages/${orderId}`);
      const newMsg = push(msgsRef);
      await set(newMsg, {
        senderId: user?.id || `guest_${orderId}`,
        senderName: isVendor ? (user?.name || vendorName || "Restaurant") : (clientName || "Client"),
        senderRole: isVendor ? "vendor" : "client",
        text: content.trim(),
        timestamp: Date.now(),
        type: customType,
      });
      if (!customText) setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Action Vendeur : Envoyer ses coordonnées MoMo dans le chat
  const handleSendPaymentDetails = async () => {
    if (!db || !order) return;
    const phoneToUse = vendorPhone || user?.phone || "+229 XX XX XX XX";
    const amount = order.total || 0;
    const msgText = `💳 Instructions de Paiement Mobile Money :\n\n• Montant : ${amount.toLocaleString()} FCFA\n• Numéro : ${phoneToUse}\n• Réseau : MTN MoMo / Moov Money\n\nMerci d'effectuer le transfert puis de cliquer sur "J'ai envoyé le paiement" ci-dessous 👇`;
    
    await sendMessage(msgText, "payment_request");
    toast.success("Coordonnées de paiement envoyées au client !");
  };

  // Action Client : Déclarer avoir envoyé le paiement
  const handleClientDeclarePaymentSent = async () => {
    if (!db || !order) return;
    try {
      // 1. Mettre à jour le statut de la commande
      await update(ref(db, `orders/${orderId}`), {
        status: "payment_sent"
      });

      // 2. Envoyer le message dans le chat
      const amount = order.total || 0;
      await sendMessage(`💸 J'ai effectué le paiement de ${amount.toLocaleString()} FCFA via Mobile Money. Merci de vérifier la réception et de lancer la préparation !`, "payment_sent");
      toast.success("Notification de paiement transmise au restaurant !");
    } catch (err) {
      toast.error("Erreur lors de l'envoi de la notification");
    }
  };

  // Action Vendeur : Confirmer la réception du paiement
  const handleVendorConfirmPayment = async () => {
    if (!db || !order) return;
    try {
      // 1. Mettre à jour la commande vers preparing
      await update(ref(db, `orders/${orderId}`), {
        status: "preparing"
      });

      // 2. Envoyer un message de confirmation
      const amount = order.total || 0;
      await sendMessage(`✅ Paiement de ${amount.toLocaleString()} FCFA bien reçu et validé ! Votre commande est maintenant en cours de préparation en cuisine. 🍽️`, "payment_confirmed");
      toast.success("Paiement validé ! Commande en préparation.");
    } catch (err) {
      toast.error("Erreur lors de la validation du paiement");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isMe = (msg: Message) => {
    if (isVendor) return msg.senderRole === "vendor";
    return msg.senderRole === "client";
  };

  const otherPartyTitle = isVendor ? (order?.clientName || clientName || "Client") : (order?.vendorName || vendorName || "Restaurant");
  const orderTotal = order?.total || 0;
  const currentStatus = order?.status || "awaiting_payment";

  return (
    <div className={`flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden ${compact ? "" : ""}`}>
      {/* Header & Status Banner */}
      <div className="border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-primary shadow-sm">
              {isVendor ? <ChefHat size={18} className="text-primary" /> : <MessageCircle size={18} />}
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight flex items-center gap-1.5">
                {isVendor ? `Client : ${otherPartyTitle}` : otherPartyTitle}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-gray-500">
                  Commande #{orderId.slice(-6).toUpperCase()} • <span className="font-black text-primary">{orderTotal.toLocaleString()} F</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-700 transition-colors"
          >
            <Receipt size={12} />
            <span>Reçu</span>
            {showReceipt ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {currentStatus === "awaiting_payment" && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Clock size={11} /> En attente de paiement
              </span>
            )}
            {currentStatus === "payment_sent" && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={11} /> Paiement envoyé par le client
              </span>
            )}
            {currentStatus === "preparing" && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={11} /> En préparation 🍽️
              </span>
            )}
            {currentStatus === "delivering" && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Truck size={11} /> En livraison 🛵
              </span>
            )}
            {currentStatus === "delivered" && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Check size={11} /> Commande Livrée
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-400">Paiement Mobile Money direct</span>
        </div>

        {/* Détail du Reçu (Accordéon déroulant) */}
        <AnimatePresence>
          {showReceipt && order && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white border-t border-gray-100 p-4 space-y-2 text-xs"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Articles commandés :</p>
              <div className="space-y-1.5">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-medium">
                    <span>{item.qty}× {item.name}</span>
                    <span className="font-bold">{(item.price * item.qty).toLocaleString()} F</span>
                  </div>
                ))}
              </div>
              {order.notes && (
                <p className="text-[10px] text-gray-500 italic pt-2 border-t border-gray-100">
                  Note : {order.notes}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Module d'Action Paiement Intégré */}
      <div className="p-3.5 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border-b border-orange-200/50">
        {!isVendor ? (
          // Interface Client : Payer via Mobile Money
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-primary" /> Règlement par Mobile Money (MoMo / Moov)
                </p>
                <p className="text-[11px] text-gray-600">
                  Montant à transférer : <strong className="text-primary font-black text-sm">{orderTotal.toLocaleString()} FCFA</strong>
                </p>
              </div>

              {vendorPhone && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-sm">
                    {vendorPhone}
                  </span>
                  <button
                    onClick={() => handleCopyPhone(vendorPhone)}
                    className="p-1.5 bg-black text-white rounded-xl hover:bg-primary transition-colors flex items-center gap-1 text-[10px] font-bold"
                    title="Copier le numéro"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>

            {/* Boutons d'action rapide client */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleClientDeclarePaymentSent}
                disabled={currentStatus === "preparing" || currentStatus === "delivering" || currentStatus === "delivered"}
                className="flex-1 min-w-0 w-full sm:w-auto py-2.5 px-4 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={14} /> J'ai envoyé le paiement
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ImageIcon size={14} /> Joindre reçu
              </button>
            </div>
          </div>
        ) : (
          // Interface Vendeur : Envoyer coordonnées & Valider le paiement
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <Smartphone size={14} className="text-primary" /> Gestion du Paiement Client
              </p>
              <p className="text-[11px] text-gray-600">
                Montant attendu : <strong className="text-primary font-black">{orderTotal.toLocaleString()} FCFA</strong>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSendPaymentDetails}
                className="py-2 px-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-[11px] hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Phone size={13} className="text-primary" /> Envoyer mon numéro MoMo
              </button>

              <button
                type="button"
                onClick={handleVendorConfirmPayment}
                disabled={currentStatus === "preparing" || currentStatus === "delivering" || currentStatus === "delivered"}
                className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 size={13} /> Valider réception paiement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Messages area */}
      <div
        className={`overflow-y-auto p-4 space-y-3 bg-[#F9F9FB] ${
          compact ? "max-h-64 min-h-[160px]" : "max-h-96 min-h-[220px]"
        }`}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-3">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-300">
              <MessageCircle size={28} />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-500">Discussion en direct</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                Échangez pour finaliser le paiement et les détails de livraison.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map(msg => {
              if (msg.type === "system") {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center my-3"
                  >
                    <div className="bg-gray-100/90 border border-gray-200/60 text-gray-700 text-[11px] font-medium px-4 py-2.5 rounded-2xl max-w-[90%] text-center whitespace-pre-wrap shadow-sm">
                      {msg.text}
                    </div>
                  </motion.div>
                );
              }

              if (msg.type === "payment_confirmed") {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-center my-3"
                  >
                    <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold px-4 py-3 rounded-2xl max-w-[90%] text-center shadow-md flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                      <span>{msg.text}</span>
                    </div>
                  </motion.div>
                );
              }

              const msgIsMe = isMe(msg);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className={`flex ${msgIsMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${msgIsMe ? "items-end" : "items-start"} gap-1`}>
                    {!msgIsMe && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-2">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`px-4 py-3 text-sm leading-relaxed font-medium ${
                        msgIsMe
                          ? "bg-black text-white rounded-[20px] rounded-br-[4px] shadow-md shadow-black/10"
                          : "bg-white text-gray-900 shadow-sm border border-gray-100 rounded-[20px] rounded-bl-[4px]"
                      }`}
                    >
                      {msg.type === "image" && msg.imageUrl ? (
                        <div className="space-y-2">
                          <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={msg.imageUrl} 
                              alt="Preuve ou photo" 
                              className="rounded-xl max-w-full h-auto max-h-56 object-cover cursor-pointer hover:opacity-95 transition-opacity" 
                            />
                          </a>
                          <p className="text-[11px] opacity-80">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium px-2">
                      {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 p-2 pl-4 bg-gray-50 rounded-2xl border border-gray-200/80 focus-within:border-primary/50 focus-within:bg-white transition-all">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrire un message à ${otherPartyTitle}...`}
            className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
            title="Joindre une photo ou preuve de paiement"
            className="w-10 h-10 rounded-xl bg-gray-200/80 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-40 shrink-0"
          >
            <ImageIcon size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage()}
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-primary/20"
          >
            {sending ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </motion.button>
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center mt-2">
          Paiements Mobile Money directs • Assistance en direct
        </p>
      </div>
    </div>
  );
}
