import Image from "next/image";
import { Star } from "lucide-react";
import { getFeaturedProductsList } from "@/lib/dashboard/data/product";

interface FeaturedProductItem {
  imageUrl: string | null;
  name: string;
  amount: string;
}

export async function FeaturedProductsSection() {
  const featuredProducts: FeaturedProductItem[] = await getFeaturedProductsList();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-start">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
          <Star className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-800">Produits Vedettes</h2>
      </div>

      <div className="space-y-4">
        {featuredProducts.length === 0 ? (
          <p className="text-xs text-slate-400">Aucun produit vedette.</p>
        ) : (
          featuredProducts.map((product, idx) => (
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
                  <p className="text-[11px] text-slate-400">En vedette</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {product.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
