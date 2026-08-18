import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hotel,
  KeyRound,
  CalendarDays,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Plus,
  Bed,
  Users
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function DashboardHotel() {
  const { vendorProfile } = useAuth();
  const navigate = useNavigate();

  const rooms = [
    { id: "r1", name: "Chambre Prestige Deluxe", type: "Double", price: 35000, status: "occupied", guest: "Koffi Mensah", checkOut: "Demain 11h" },
    { id: "r2", name: "Suite Exécutive King", type: "Suite", price: 65000, status: "available", guest: null, checkOut: null },
    { id: "r3", name: "Chambre Standard Cosy", type: "Simple", price: 20000, status: "occupied", guest: "Clarisse Agbo", checkOut: "Aujourd'hui 12h" },
    { id: "r4", name: "Appartement Meublé 2 Pièces", type: "Appartement", price: 45000, status: "cleaning", guest: null, checkOut: null },
  ];

  return (
    <div className="space-y-8 pb-16 font-body">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-sm">
            <i className="fa-solid fa-hotel"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-2xl uppercase tracking-tight text-foreground">
                Tableau de Bord <span className="text-primary">Hôtel & Résidence</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider">
                Réception Ouverte
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-bold mt-0.5">
              {vendorProfile?.name || "Résidence La Paix"} • Gestion des réservations, nuitées et disponibilités
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => navigate("/vendor/catalogue")}
            className="px-4 py-2.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs flex items-center gap-2 border border-border"
          >
            <Plus size={14} /> Ajouter une chambre
          </button>

          <button
            onClick={() => window.open(`/r/${vendorProfile?.slug || "residence-la-paix"}`, '_blank')}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
          >
            <span>Voir la Vitrine Hôtel</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPIs Hôtel Dédiés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : Nuitées Encaissées */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Revenus Nuitées (7j)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-foreground">1 120 000 F</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
            <CheckCircle2 size={12} />
            <span>0% de commission d'agence</span>
          </div>
        </div>

        {/* KPI 2 : Taux d'Occupation */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Chambres Occupées</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-xs">
              <Bed size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-indigo-600">75% occupé</p>
          <span className="text-[10px] text-muted-foreground font-bold">3 chambres sur 4</span>
        </div>

        {/* KPI 3 : Arrivées / Check-in */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Arrivées Prévues</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xs">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-blue-600">2 arrivées</p>
          <span className="text-[10px] text-muted-foreground font-bold">Aujourd'hui à partir de 14h</span>
        </div>

        {/* KPI 4 : Chambres Libres */}
        <div className="p-5 rounded-3xl bg-card border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Chambres Disponibles</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-xs">
              <KeyRound size={16} />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-foreground">1 libre</p>
          <span className="text-[10px] text-muted-foreground font-bold">Prête à la location</span>
        </div>

      </div>

      {/* Planning des Chambres */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <h2 className="font-heading font-black text-base uppercase tracking-tight text-foreground flex items-center gap-2">
          <Bed className="text-indigo-600" size={18} />
          État des Chambres & Réservations en Direct
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map(room => (
            <div key={room.id} className="p-5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-sm text-foreground">{room.name}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground">({room.type})</span>
                </div>
                <p className="text-xs font-black text-primary">{room.price.toLocaleString()} F / nuitée</p>
                {room.guest && (
                  <p className="text-[11px] text-muted-foreground font-medium">
                    👤 Client : <strong>{room.guest}</strong> • Départ : {room.checkOut}
                  </p>
                )}
              </div>

              <div>
                {room.status === "occupied" && (
                  <span className="px-3 py-1 bg-red-500/10 text-red-600 font-bold text-[10px] rounded-xl">
                    Occupée
                  </span>
                )}
                {room.status === "available" && (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold text-[10px] rounded-xl">
                    ✓ Disponible
                  </span>
                )}
                {room.status === "cleaning" && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 font-bold text-[10px] rounded-xl">
                    🧹 Ménage
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
