import Image from "next/image";
import { Sparkles } from "lucide-react";
import { getStarProductsList } from "@/lib/dashboard/data/product";

interface StarProductItem {
  imageUrl: string | null;
  name: string;
  amount: string;
  stockQuantity: number;
  category: string;
  unitsSold: number;
}

export async function StarProductsSection() {
  const starProducts: StarProductItem[] = await getStarProductsList();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-800">Produits Star</h2>
      </div>

      <div className="space-y-4">
        {starProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aucun produit star.</p>
        ) : (
          starProducts.map((product, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-5"
            >

              <div className="flex items-center gap-3 min-w-0">
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
                <div className="min-w-0">
                  <h3 className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {product.category} • {product.unitsSold} ventes
                  </p>
                </div>
              </div>

              {/* Middle: Stock quantity */}
              <div className="flex justify-center">
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                  {product.stockQuantity} en stock
                </span>
              </div>

              {/* Right: Price */}
              <div className="flex justify-end">
                <span className="text-xs font-semibold text-slate-700">
                  {product.amount}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
