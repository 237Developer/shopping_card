"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 shrink-0 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Search Bar */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Rechercher un produit, une commande..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0475FE]/20 focus:border-[#0475FE] transition-all"
        />
      </div>

      {/* Right User & Notification Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-10 h-10 rounded-full bg-[#0475FE] text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            JT
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <span>John Tross</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  );
}
