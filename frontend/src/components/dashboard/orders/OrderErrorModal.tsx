"use client";

import { useEffect, useRef } from "react";
import { XCircle, X } from "lucide-react";

interface OrderErrorModalProps {
  isOpen: boolean;
  message: string | null;
  onClose: () => void;
}

export function OrderErrorModal({
  isOpen,
  message,
  onClose,
}: OrderErrorModalProps) {
  const okBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        okBtnRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Action impossible
              </h3>
              <p className="text-xs text-slate-500">
                Modification du statut rejetée
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="bg-red-50/60 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-700 leading-relaxed font-medium text-center">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            ref={okBtnRef}
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
