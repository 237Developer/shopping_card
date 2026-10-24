import Link from "next/link";
import { getRecentOrders } from "@/lib/dashboard/data/home";

export async function RecentOrdersCard() {
  const recentOrders = await getRecentOrders(5);

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "expédiée":
      case "expediee":
        return "bg-blue-50 text-blue-600 border border-blue-200/60";
      case "en_préparation":
      case "en préparation":
      case "en_preparation":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "payée":
      case "payee":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/60";
      case "livrée":
      case "livree":
        return "bg-purple-50 text-purple-600 border border-purple-200/60";
      case "annulée":
      case "annulee":
        return "bg-rose-50 text-rose-600 border border-rose-200/60";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">Dernières commandes</h2>
        <Link
          href="/dashboard/orders"
          className="text-xs font-semibold text-[#0475FE] hover:underline"
        >
          Voir tout
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 flex flex-col justify-center">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 px-2">Client</th>
              <th className="py-2 px-2">Date</th>
              <th className="py-2 px-2">Statut</th>
              <th className="py-2 pl-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
            {recentOrders.map((order: { id: string; orderNumber: string; customer: string; date: Date; status: string; totalAmount: number }) => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 pr-2 font-semibold text-slate-900 whitespace-nowrap">
                  {order.orderNumber}
                </td>
                <td className="py-2.5 px-2 text-slate-800 font-semibold truncate max-w-[120px]">
                  {order.customer}
                </td>
                <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">
                  {formatDate(order.date)}
                </td>
                <td className="py-2.5 px-2 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${getStatusBadgeStyle(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="py-2.5 pl-2 text-right font-bold text-slate-900 whitespace-nowrap">
                  {formatAmount(order.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
