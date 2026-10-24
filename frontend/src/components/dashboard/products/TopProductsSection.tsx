import Image from "next/image";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { getTopProducts } from "@/lib/dashboard/data/product";

interface TopProductItem {
  imageUrl: string | null;
  name: string;
  unitsSold: number;
  growth: string;
}

export async function TopProductsSection() {
  const topProducts: TopProductItem[] = await getTopProducts(5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
          <Trophy className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-800">Top 5 Produits (Ventes)</h2>
      </div>

      <div className="space-y-4">
        {topProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aucun produit vendu ce mois.</p>
        ) : (
          topProducts.map((product, idx) => {
            const isPositive = product.growth.startsWith("+");
            return (
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
                    <p className="text-[11px] text-slate-400">
                      {product.unitsSold} ventes ce mois
                    </p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{product.growth}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
