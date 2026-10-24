import { Calendar } from "lucide-react";

export function DashboardHeaderGreeting() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>Bonjour John</span>
          <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">
          Voici un aperçu de l'activité de votre boutique aujourd'hui.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm text-xs md:text-sm font-medium text-slate-700 self-start md:self-auto">
        <Calendar className="w-4 h-4 text-[#0475FE]" />
        <span>Mercredi 16 octobre 2025</span>
      </div>
    </div>
  );
}
