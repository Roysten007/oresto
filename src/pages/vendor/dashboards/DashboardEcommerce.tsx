import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { Order, Product } from "@/data/mockData";
import {
  ShoppingBag,
  Package,
  Truck,
  DollarSign,
  Boxes,
  AlertTriangle,
  ExternalLink,
  Plus,
  Tag,
  CheckCircle2,
  TrendingUp,
  Receipt
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ReceiptModal from "@/components/orders/ReceiptModal";

export default function DashboardEcommerce() {
  const { vendorProfile, user } = useAuth();
  const navigate = useNavigate();
  const vendorId = vendorProfile?.id || user?.vendorId || "v_demo_shop";

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const sampleOrders: Order[] = [
    {
      id: "col_201",
      clientId: "u1",
      clientName: "Marc Dossou",
      vendorId,
      vendorName: vendorProfile?.name || "Ma Boutique Chic",
      items: [{ name: "Sneakers Streetwear Urban (T.42)", qty: 1, price: 18500 }],
      total: 18500,
      deliveryFee: 1500,
      status: "preparing",
      paymentMethod: "momo_mtn",
      address: "Cotonou, Cadjehoun Rue 12",
      date: new Date().toISOString()
    },
    {
      id: "col_202",
      clientId: "u2",
      clientName: "Sophie Tossou",
      vendorId,
      vendorName: vendorProfile?.name || "Ma Boutique Chic",
      items: [{ name: "Smartwatch Ultra Pro 4G", qty: 1, price: 29000 }],
      total: 29000,
      deliveryFee: 2000,
      status: "delivering",
      paymentMethod: "momo_moov",
      address: "Calavi, Arconville",
      date: new Date(Date.now() - 45 * 60000).toISOString()
    },
    {
      id: "col_203",
      clientId: "u3",
      clientName: "Carine Lawson",
      vendorId,
      vendorName: vendorProfile?.name || "Ma Boutique Chic",
      items: [{ name: "Robe Soirée Satin Prestige (M)", qty: 1, price: 15000 }],
      total: 15000,
      deliveryFee: 1500,
      status: "delivered",
      paymentMethod: "momo_mtn",
      address: "Porto-Novo, Avakpa",
      date: new Date(Date.now() - 120 * 60000).toISOString()
    }
  ];

  const sampleProducts: Product[] = [
    { id: "p1", vendorId, name: "Sneakers Streetwear Urban", price: 18500, originalPrice: 25000, category: "Chaussures", stock: 12, available: true, image: "" },
    { id: "p2", vendorId, name: "Smartwatch Ultra Pro 4G", price: 29000, originalPrice: 35000, category: "High-Tech", stock: 2, available: true, image: "" },
    { id: "p3", vendorId, name: "Robe Soirée Satin Prestige", price: 15000, category: "Vêtements", stock: 8, available: true, image: "" },
    { id: "p4", vendorId, name: "AirPods Pro Gen 2", price: 14000, category: "Accessoires", stock: 1, available: true, image: "" }
  ];

  useEffect(() => {
    if (!db || !vendorId) {
      setOrders(sampleOrders);
      setProducts(sampleProducts);
      setLoading(false);
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsubOrders = onValue(ordersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val } as Order))
          .filter(o => o.vendorId === vendorId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(list.length > 0 ? list : sampleOrders);
      } else {
        setOrders(sampleOrders);
      }
      setLoading(false);
    });

    const productsRef = ref(db, "products");
    const unsubProducts = onValue(productsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data)
          .map(k => ({ id: k, ...data[k] }))
          .filter(p => p.vendorId === vendorId);
        setProducts(list.length > 0 ? list : sampleProducts);
      } else {
        setProducts(sampleProducts);
      }
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, [vendorId]);

  const updateOrderStatus = async (orderId: string, newStatus: any) => {
    if (!db) return;
    try {
      await update(ref(db, `orders/${orderId}`), { status: newStatus });
      toast.success("Statut du colis mis à jour");
    } catch {
      toast.error("Erreur de mise à jour");
    }
  };

  const toPackOrders = orders.filter(o => o.status === "preparing" || o.status === "pending");
  const shippingOrders = orders.filter(o => o.status === "delivering");
  const lowStockItems = products.filter(p => (p.stock || 0) <= 3);

  const chartData = [
    { day: "Lun", articles: 8, revenue: 95000 },
    { day: "Mar", articles: 12, revenue: 140000 },
    { day: "Mer", articles: 15, revenue: 190000 },
    { day: "Jeu", articles: 11, revenue: 125000 },
    { day: "Ven", articles: 24, revenue: 310000 },
    { day: "Sam", articles: 32, revenue: 420000 },
    { day: "Dim", articles: 28, revenue: 360000 },
  ];

  return (
    <div className="space-y-8 pb-16 font-body">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl shadow-sm">
            <i className="fa-solid fa-bag-shopping"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-foreground">
                Tableau de Bord <span className="text-primary">E-Commerce</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider">
                Boutique Ouverte
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-0.5">
              {vendorProfile?.name || "Ma Boutique Chic"} • Gestion des ventes d'articles, expéditions et stocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/vendor/catalogue")}
            className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-2 border border-border"
          >
            <Plus size={14} /> Ajouter un produit
          </button>

          <button
            onClick={() => window.open(`/r/${vendorProfile?.slug || "ma-boutique-chic"}`, '_blank')}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
          >
            <span>Voir ma Boutique en ligne</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPIs E-Commerce Dédiés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Ventes Encaissées (7j) */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Ventes Boutique (7j)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-foreground">1 640 000 F</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 size={12} />
            <span>0% de commission prélevée</span>
          </div>
        </div>

        {/* KPI 2 : Colis à Expédier */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Colis à Préparer</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs">
              <Package size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-purple-600">{toPackOrders.length} colis</p>
          <span className="text-[10px] text-muted-foreground font-bold">À emballer pour départ</span>
        </div>

        {/* KPI 3 : En Cours d'Expédition */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">En Expédition</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs">
              <Truck size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-blue-600">{shippingOrders.length} livraisons</p>
          <span className="text-[10px] text-muted-foreground font-bold">Chez le transporteur</span>
        </div>

        {/* KPI 4 : Alertes Rupture de Stock */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Alertes Stock</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center text-xs">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-red-600">{lowStockItems.length} articles</p>
          <span className="text-[10px] text-red-600/80 font-bold">Stock critique (≤ 3 unités)</span>
        </div>

      </div>

      {/* Grid: Live Parcels Queue & Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Parcels to Dispatch */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-black text-base uppercase tracking-tight text-foreground flex items-center gap-2">
              <Package className="text-purple-600" size={18} />
              Colis & Expéditions en Cours
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              ● Paiements MoMo Reçus
            </span>
          </div>

          <div className="space-y-3">
            {orders.map(order => (
              <div 
                key={order.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-purple-300 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-900 text-white text-[10px] font-mono font-black">
                      #{order.id.slice(-4).toUpperCase()}
                    </span>
                    <span className="font-heading font-black text-sm text-foreground">
                      {order.clientName}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-xs text-foreground/80">
                    {order.items.map((it, idx) => (
                      <p key={idx} className="font-medium">
                        <strong>{it.qty}x</strong> {it.name}
                      </p>
                    ))}
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    📍 Adresse : <strong>{order.address}</strong> • MoMo validé
                  </p>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                  <span className="font-heading font-black text-base text-purple-600">
                    {order.total.toLocaleString()} FCFA
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setReceiptOrder(order)}
                      className="px-2.5 py-1 rounded-xl bg-muted hover:bg-black hover:text-white text-muted-foreground text-[10px] font-bold flex items-center gap-1 transition-all"
                      title="Générer & Télécharger le reçu / facture"
                    >
                      <Receipt size={11} />
                      <span>Reçu</span>
                    </button>

                    {order.status === "preparing" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivering")}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        Emballé ➔ Expédier
                      </button>
                    )}
                    {order.status === "delivering" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                      >
                        Marquer Livré ✓
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold">
                        ✓ Colis Livré
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 cols: Stock Alerts & Revenue Chart */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Low Stock Alerts */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-tight text-foreground flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={16} />
                Alertes Stock Critique
              </h3>
              <span className="text-[10px] font-bold text-red-500">{lowStockItems.length} alertes</span>
            </div>

            <div className="space-y-2 text-xs">
              {lowStockItems.map(item => (
                <div key={item.id} className="p-3 bg-red-50/50 rounded-2xl border border-red-150 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-[10px] text-gray-500">{item.category} • {item.price.toLocaleString()} F</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-500 text-white font-black text-[10px] rounded-xl">
                    Reste : {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Chart */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-sm uppercase tracking-tight text-foreground">
                Ventes E-Commerce (Semaine)
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground">7 jours</span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="ecomGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} fillOpacity={1} fill="url(#ecomGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Official Receipt Modal for Download & Print */}
      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          vendorProfile={vendorProfile}
          onClose={() => setReceiptOrder(null)}
        />
      )}

    </div>
  );
}
