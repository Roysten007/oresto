import { useState } from "react";
import { Order, VendorProfile } from "@/data/mockData";
import { QRCodeSVG } from "qrcode.react";
import { 
  Printer, 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Store, 
  Utensils, 
  ShoppingBag,
  Calendar,
  Clock,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  order: Order;
  vendorProfile?: Partial<VendorProfile> | null;
  onClose: () => void;
}

export default function ReceiptModal({ order, vendorProfile, onClose }: Props) {
  const [isPrinting, setIsPrinting] = useState(false);

  const vendorName = vendorProfile?.name || order.vendorName || "Oresto Commerce";
  const vendorPhone = vendorProfile?.phone || vendorProfile?.whatsapp || "+229 97 00 00 00";
  const vendorCity = vendorProfile?.city || "Cotonou";
  const vendorAddress = vendorProfile?.neighborhood ? `${vendorProfile.neighborhood}, ${vendorCity}` : vendorCity;
  
  const receiptNumber = `REC-${order.id.slice(-6).toUpperCase()}`;
  const orderDate = order.date ? new Date(order.date) : new Date();

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  const handleShareWhatsApp = () => {
    const text = `🧾 *REÇU OFFICIEL DE COMMANDE — ${vendorName}*\n` +
      `--------------------------------\n` +
      `N° Reçu : ${receiptNumber}\n` +
      `Date : ${orderDate.toLocaleDateString("fr-FR")} à ${orderDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}\n` +
      `Client : ${order.clientName}\n\n` +
      `*ARTICLES :*\n` +
      order.items.map(it => `• ${it.qty}x ${it.name} — ${(it.price * it.qty).toLocaleString()} FCFA`).join("\n") +
      `\n\n*TOTAL PAYÉ : ${order.total.toLocaleString()} FCFA*\n` +
      `Paiement : ${order.paymentMethod.replace('_', ' ').toUpperCase()} (Validé ✅)\n` +
      `--------------------------------\n` +
      `Merci pour votre confiance !`;

    const encoded = encodeURIComponent(text);
    const phoneClean = order.clientId ? order.clientId.replace(/\D/g, "") : "";
    const url = phoneClean.length >= 8 
      ? `https://wa.me/${phoneClean}?text=${encoded}` 
      : `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <div>
              <p className="font-heading font-black text-xs uppercase tracking-wider">Reçu Officiel de Vente</p>
              <p className="text-[10px] text-gray-400 font-mono">{receiptNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-gray-100 transition-all shadow-sm"
              title="Imprimer le ticket"
            >
              <Printer size={13} />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 overflow-y-auto font-mono text-gray-900 space-y-5 bg-white">
          
          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-dashed border-gray-300 pb-5">
            <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl mx-auto flex items-center justify-center text-lg font-black font-heading mb-2">
              {vendorName.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="font-heading font-black text-lg uppercase tracking-tight text-gray-900 leading-tight">
              {vendorName}
            </h2>
            <p className="text-[11px] text-gray-500 font-sans">{vendorAddress}</p>
            <p className="text-[11px] text-gray-500 font-sans">Tél / WhatsApp : {vendorPhone}</p>
            
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-sans font-black uppercase tracking-wider">
                ✓ Vente Encaissée & Validée
              </span>
            </div>
          </div>

          {/* Details Metadata */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-sans border-b border-dashed border-gray-200 pb-4">
            <div>
              <p className="text-[9px] uppercase font-bold text-gray-400">N° Ticket</p>
              <p className="font-mono font-bold text-gray-900">{receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-gray-400">Date & Heure</p>
              <p className="font-bold text-gray-900">
                {orderDate.toLocaleDateString("fr-FR")} {orderDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-gray-400">Client</p>
              <p className="font-bold text-gray-900">{order.clientName || "Client Comptoir"}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-gray-400">Destination</p>
              <p className="font-bold text-gray-900 truncate max-w-[140px] ml-auto">{order.address || "Sur Place"}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200 pb-1">
              <span>Désignation</span>
              <span>Total</span>
            </div>

            <div className="space-y-2 text-xs">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="pr-2">
                    <p className="font-bold text-gray-900 leading-tight">
                      {it.qty}x {it.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-sans">
                      {it.price.toLocaleString()} F / unité
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 font-mono whitespace-nowrap">
                    {(it.price * it.qty).toLocaleString()} F
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="border-t-2 border-dashed border-gray-300 pt-3 space-y-1.5 font-sans">
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Frais de livraison :</span>
                <span className="font-mono">{order.deliveryFee.toLocaleString()} FCFA</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-1 border-t border-gray-200">
              <span className="font-heading font-black text-sm uppercase text-gray-900">Total Net Payé :</span>
              <span className="font-mono font-black text-xl text-primary">
                {order.total.toLocaleString()} FCFA
              </span>
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 pt-1">
              <span>Mode de règlement :</span>
              <span className="font-bold uppercase text-gray-800 font-mono">
                {order.paymentMethod.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* QR Code & Footer Verification */}
          <div className="border-t border-dashed border-gray-200 pt-4 flex flex-col items-center gap-2 text-center font-sans">
            <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
              <QRCodeSVG value={`https://oresto.app/r/${vendorProfile?.slug || "ticket"}?order=${order.id}`} size={70} />
            </div>
            <p className="text-[10px] font-bold text-gray-800">Merci de votre visite et à très bientôt !</p>
            <p className="text-[8px] text-gray-400 uppercase tracking-widest">Émis par Oresto Pro • 0% Commission</p>
          </div>

        </div>

        {/* Action Buttons at Bottom */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center gap-2 print:hidden">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <i className="fa-brands fa-whatsapp text-base"></i>
            <span>Envoyer au client</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-2xl font-sans font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Printer size={15} />
            <span>Imprimer ticket</span>
          </button>
        </div>

      </div>
    </div>
  );
}
