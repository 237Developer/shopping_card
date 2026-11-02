"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";

interface OrderStatusConfirmModalProps {
  isOpen: boolean;
  statusLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isUpdating?: boolean;
}

export function OrderStatusConfirmModal({
  isOpen,
  statusLabel,
  onConfirm,
  onCancel,
  isUpdating,
}: OrderStatusConfirmModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 border border-slate-200 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Confirmer le changement de statut
              </h3>
              <p className="text-xs text-slate-500">
                Nouveau statut :{" "}
                <span className="font-semibold text-slate-700">
                  {statusLabel}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-sm te text-red-600 leading-relaxed font-medium text-center">
            Cette action est irréversible, un message sera envoyé au client.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
            className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-5 py-2.5 bg-[#0475FE] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {isUpdating ? "Mise à jour..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
