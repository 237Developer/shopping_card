import Link from "next/link";
import { getLowStockProducts } from "@/lib/dashboard/data/home";
import { ProductImageThumbnail } from "./ProductImageThumbnail";

export async function LowStockProductsCard() {
  const lowStockProducts = await getLowStockProducts(5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">
          Produits en stock faible
        </h2>
        <Link
          href="/dashboard/products"
          className="text-xs font-semibold text-[#0475FE] hover:underline"
        >
          Voir tout
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 flex flex-col flex-start">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2 pr-2">Produit</th>
              <th className="py-2 px-2 text-center" translate="no">
                Stock
              </th>
              <th className="py-2 px-2 text-center" translate="no">
                Seuil
              </th>
              <th className="py-2 pl-2 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
            {lowStockProducts.map(
              (product: {
                id: string;
                name: string;
                imageUrl?: string | null;
                stockQuantity: number;
                threshold: number;
              }) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center space-x-2.5">
                      <ProductImageThumbnail
                        imageUrl={product.imageUrl}
                        alt={product.name}
                        sizeClassName="w-10 h-10"
                      />
                      <span className="font-bold text-slate-800 truncate max-w-[140px]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-rose-600">
                    {product.stockQuantity}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-500 font-medium">
                    {product.threshold}
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/60">
                      Stock faible
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
