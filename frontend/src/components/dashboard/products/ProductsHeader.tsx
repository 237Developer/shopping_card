import { Plus, Package } from "lucide-react";

export function ProductsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0475FE] flex items-center justify-center">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gestion des Produits</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consultez et gérez l'inventaire, les produits vedettes et les stocks faibles.
          </p>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0475FE] text-white text-xs font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-sm">
        <Plus className="w-4 h-4" />
        <span>Ajouter un produit</span>
      </button>
    </div>
  );
}
