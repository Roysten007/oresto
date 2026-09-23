import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Order } from "@/data/mockData";
import { getVendorSector } from "@/lib/vendorSector";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Utensils, 
  Hotel,
  Calendar,
  Star
} from "lucide-react";

export default function VendorStats() {
  const { vendorProfile, user } = useAuth();
  const [searchParams] = useSearchParams();
  const sectorQuery = searchParams.get("sector") || searchParams.get("type");
  const sector = getVendorSector(vendorProfile, sectorQuery);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const vendorId = vendorProfile?.id || user?.vendorId || user?.uid || "";

  useEffect(() => {
    if (!db || !vendorId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val } as Order))
          .filter(o => 
            o.vendorId === vendorId || 
            (user?.vendorId && o.vendorId === user.vendorId) ||
            (user?.uid && o.vendorId === user.uid)
          );
        setOrders(list);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [vendorId, user]);

  const validOrders = useMemo(() => orders.filter(o => o.status !== "cancelled"), [orders]);

  const stats = useMemo(() => {
    const totalOrders = validOrders.length;
    const totalRevenue = validOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Découpage hebdomadaire réel (7 derniers jours)
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];

      const dayOrders = validOrders.filter(o => o.date && o.date.startsWith(dayStr));

      weeklyData.push({
        day: dayNames[d.getDay()],
        orders: dayOrders.length,
        revenue: dayOrders.reduce((acc, o) => acc + (Number(o.total) || 0), 0)
      });
    }

    return { totalOrders, totalRevenue, avgOrder, weeklyData };
  }, [validOrders]);

  const primaryColor = sector === "hotel" ? "#4F46E5" : sector === "ecommerce" ? "#9333EA" : "#FF6B00";

  return (
    <div className="space-y-8 pb-16 font-sub">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-xs"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 tracking-tight">
              Statistiques &amp; Performance
            </h1>
            <p className="text-xs text-zinc-500 font-sub mt-0.5">
              Analyse en direct de vos ventes, paniers moyens et tendances Mobile Money
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-zinc-100 text-zinc-700 font-sub font-bold text-xs self-start sm:self-auto border border-zinc-200">
          7 derniers jours
        </span>
      </div>

      {/* 4 Cartes de métriques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">
              {sector === "hotel" ? "Total séjours" : sector === "ecommerce" ? "Total colis" : "Total commandes"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center text-xs">
              {sector === "hotel" ? <Hotel size={16} /> : sector === "ecommerce" ? <ShoppingBag size={16} /> : <Utensils size={16} />}
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {stats.totalOrders}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">Commandes validées</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Revenus nets</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {stats.totalRevenue.toLocaleString("fr-FR")} F
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">100% MoMo direct (0% comm)</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Panier moyen</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {stats.avgOrder.toLocaleString("fr-FR")} F
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">Par commande client</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-sub font-bold text-zinc-600">Note moyenne</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xs">
              <Star size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            {vendorProfile?.rating ? vendorProfile.rating.toFixed(1) : "5.0"}
          </p>
          <span className="text-[11px] text-zinc-400 font-sub">Satisfaction clients</span>
        </div>

      </div>

      {/* 2 Graphiques réels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graphique 1 : Volume de commandes */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-zinc-950">
              Volume de commandes (7 derniers jours)
            </h3>
            <span className="text-xs text-zinc-500 font-sub">Activité</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="orders" fill={primaryColor} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2 : Évolution des recettes */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-zinc-950">
              Évolution des recettes en FCFA
            </h3>
            <span className="text-xs text-zinc-500 font-sub">Chiffre d'affaires</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={primaryColor} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: primaryColor, strokeWidth: 2, stroke: "#fff" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
