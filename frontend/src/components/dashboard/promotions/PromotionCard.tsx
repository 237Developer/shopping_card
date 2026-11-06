"use client";

import { Calendar, Package, Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

interface PromotionCardProps {
  promotion: {
    id: string;
    name: string;
    imageUrl?: string | null;
    percentage: number;
    startDate: string | Date;
    endDate: string | Date;
    isVisible: boolean;
    productsCount: number;
    status: string;
  };
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
}

export function PromotionCard({ promotion, onDelete, onToggleVisibility }: PromotionCardProps) {
  const formatDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case "programmée":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Programmée
          </span>
        );
      case "terminée":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Terminée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image Banner */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {promotion.imageUrl ? (
          <img
            src={promotion.imageUrl}
            alt={promotion.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            Aucune image
          </div>
        )}
        {/* Percentage Badge */}
        <div className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-xs px-2.5 py-1 rounded-xl shadow-sm">
          -{promotion.percentage}%
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {promotion.name}
            </h3>
            {getStatusBadge(promotion.status)}
          </div>

          <div className="space-y-1.5 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Du {formatDate(promotion.startDate)} au {formatDate(promotion.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{promotion.productsCount} produits concernés</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className={`w-2 h-2 rounded-full ${promotion.isVisible ? "bg-emerald-500" : "bg-slate-300"}`}></span>
            <span>{promotion.isVisible ? "Visible sur la boutique" : "Invisible sur la boutique"}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-[#0475FE] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleVisibility(promotion.id, !promotion.isVisible)}
              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
              title={promotion.isVisible ? "Rendre invisible" : "Rendre visible"}
            >
              {promotion.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(promotion.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
