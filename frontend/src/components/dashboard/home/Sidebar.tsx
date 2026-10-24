"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  BarChart3,
  ShoppingBag,
  Crown,
} from "lucide-react";

const NAVIGATION_ITEMS = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Produits",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Commandes",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Promotions",
    href: "/dashboard/promotions",
    icon: Tags,
  },
  {
    name: "Statistiques",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const currentPathname = usePathname();

  return (
    <aside className="w-58 flex flex-col justify-between shrink-0 select-none bg-gradient-to-b from-[#111D32] to-[#0A172B] text-white h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand / Logo section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0677FA] flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white">
              ShopEasy
            </h1>
            <p className="text-xs text-[#94A3B8]">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="mt-6 px-4 space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-[#0475FE] text-white shadow-sm"
                    : "text-[#E2E8F0] hover:bg-white/5 hover:text-white"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom promotional banner inside sidebar */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/90 border border-white/5 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#0475FE]/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2 text-[#0677FA]">
          <Crown className="w-5 h-5 fill-[#0677FA]/20" />
        </div>
        <p className="text-xs font-medium text-white mb-1">
          Gérez votre boutique en toute simplicité.
        </p>
        <p className="text-[10px] text-[#94A3B8]">
          ShopEasy, plus proche de vos clients.
        </p>
      </div>
    </aside>
  );
}
