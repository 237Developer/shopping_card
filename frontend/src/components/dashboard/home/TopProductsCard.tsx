import Link from "next/link";
import { getTopProducts } from "@/lib/dashboard/data/home";
import { TrendingUp } from "lucide-react";
import { ProductImageThumbnail } from "./ProductImageThumbnail";

export async function TopProductsCard() {
  const topProducts = await getTopProducts(5);

  const getRankBadgeStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-400 text-white font-bold";
      case 1:
        return "bg-slate-200 text-slate-700 font-bold";
      case 2:
        return "bg-amber-600/80 text-white font-bold";
      default:
        return "bg-slate-100 text-slate-600 font-semibold";
    }
  };

  if (!topProducts || topProducts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Top produits</h2>
          <Link
            href="/dashboard/products"
            className="text-xs font-semibold text-[#0475FE] hover:underline"
          >
            Voir tout
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium">
          Aucun produit vendu ce mois-ci.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">Top produits</h2>
        <Link
          href="/dashboard/products"
          className="text-xs font-semibold text-[#0475FE] hover:underline"
        >
          Voir tout
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        {topProducts.map((product: { id: string; name: string; category?: string; imageUrl?: string | null; unitsSold: number; growth: string }, index: number) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-1.5 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* Rank */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${getRankBadgeStyle(
                  index
                )}`}
              >
                {index + 1}
              </div>

              {/* Thumbnail */}
              <ProductImageThumbnail
                imageUrl={product.imageUrl}
                alt={product.name}
                sizeClassName="w-10 h-10"
              />

              {/* Name & Category */}
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  {product.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700">
                {product.unitsSold} ventes
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-0.5">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                {product.growth}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
