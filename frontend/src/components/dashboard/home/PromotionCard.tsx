import Link from "next/link";
import { Headphones } from "lucide-react";

export function PromotionCard() {
  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between relative overflow-hidden h-full">
      {/* Background decorative blob / icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <Headphones className="w-48 h-48 text-emerald-300" />
      </div>

      <div className="relative z-10 space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Créez des promotions et attirez plus de clients !
          </h3>
          <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold text-xs flex-shrink-0">
            %
          </span>
        </div>
        <p className="text-xs text-emerald-100/80 max-w-sm">
          Mettez en avant vos produits avec des réductions et des offres spéciales.
        </p>
      </div>

      <div className="relative z-10 pt-2">
        <Link
          href="/dashboard/promotions"
          className="inline-block bg-[#0475FE] hover:bg-[#0360d4] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          Gérer les promotions
        </Link>
      </div>
    </div>
  );
}
