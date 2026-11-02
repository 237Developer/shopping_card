import { ShoppingCart } from "lucide-react";

export function OrdersHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0475FE]">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Gestion des commandes
          </h1>
          <p className="text-xs text-gray-500">
            Suivez et gérez toutes les commandes de votre boutique.
          </p>
        </div>
      </div>
    </div>
  );
}
