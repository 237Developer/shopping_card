"use client";

import { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { AddPromotionModal } from "./AddPromotionModal";

export function PromotionsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Gestion des promotions
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Créez, suivez et optimisez vos offres commerciales.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0475FE] text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Créer une promotion</span>
        </button>
      </div>

      <AddPromotionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
