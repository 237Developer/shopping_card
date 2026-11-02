"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddProductModal } from "./AddProductModal";

export function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#0475FE] text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Ajouter un produit</span>
      </button>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
