"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

type ProductAddedErrorAlertProps = {
  message: string;
  onClose: () => void;
};

export function ProductAddedErrorAlert({ message, onClose }: ProductAddedErrorAlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 animate-bounce">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-xs font-bold">{message}</span>
    </div>
  );
}
