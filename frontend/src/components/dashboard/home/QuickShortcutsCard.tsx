import Link from "next/link";
import { PlusCircle, ShoppingCart, Tag, BarChart3 } from "lucide-react";

export function QuickShortcutsCard() {
  const shortcuts = [
    {
      title: "Ajouter un produit",
      href: "/dashboard/products",
      icon: PlusCircle,
      color: "text-[#0475FE]",
      bg: "bg-blue-50/80 border-blue-100",
    },
    {
      title: "Voir les commandes",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-50/80 border-purple-100",
    },
    {
      title: "Créer une promo",
      href: "/dashboard/promotions",
      icon: Tag,
      color: "text-amber-600",
      bg: "bg-amber-50/80 border-amber-100",
    },
    {
      title: "Voir les statistiques",
      href: "/dashboard/statistics",
      icon: BarChart3,
      color: "text-emerald-600",
      bg: "bg-emerald-50/80 border-emerald-100",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
      <h3 className="text-base font-bold text-slate-800 mb-4">Raccourcis</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link
              key={shortcut.title}
              href={shortcut.href}
              className={`p-4 rounded-xl border ${shortcut.bg} hover:shadow-md transition-all flex flex-col items-center text-center group`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-2.5 ${shortcut.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                {shortcut.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
