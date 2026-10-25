import Image from "next/image";
import { AlertTriangle } from "lucide-react";
import { getLowStockProductsList } from "@/lib/dashboard/data/product";

interface LowStockProductItem {
  imageUrl: string | null;
  name: string;
  amount: string;
  remainingStock: number;
}

export async function LowStockProductsSection() {
  const lowStockProducts: LowStockProductItem[] = await getLowStockProductsList();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-800">Produits en Stock Faible</h2>
      </div>

      <div className="space-y-4">
        {lowStockProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aucun produit en stock faible.</p>
        ) : (
          lowStockProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-rose-500 font-medium">
                    Restant : {product.remainingStock} • <span className="text-slate-600">{product.amount}</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-rose-50 text-rose-600 rounded-lg">
                Faible
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
