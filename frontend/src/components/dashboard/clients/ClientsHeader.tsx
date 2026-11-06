import { Users } from "lucide-react";

export function ClientsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0475FE] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clients</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Retrouvez et gérez facilement les clients de votre boutique.
          </p>
        </div>
      </div>
    </div>
  );
}
