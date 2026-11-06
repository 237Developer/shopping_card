"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export function PromotionsFilterBar() {
  const [statusOpen, setStatusOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [selectedType, setSelectedType] = useState("Tous les types");
  const [searchQuery, setSearchQuery] = useState("");

  const statusRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const statuses = [
    "Tous les statuts",
    "Promotions actives",
    "Programmées",
    "Terminées",
    "Se termine dans 3 jours",
  ];
  const types = ["Tous les types", "Récent", "Ancien"];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
      {/* Status dropdown */}
      <div className="relative" ref={statusRef}>
        <button
          type="button"
          onClick={() => setStatusOpen((o) => !o)}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-48 cursor-pointer"
        >
          <span>{selectedStatus}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${statusOpen ? "rotate-180" : ""}`}
          />
        </button>
        {statusOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setSelectedStatus(st);
                  setStatusOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 cursor-pointer ${selectedStatus === st ? "font-bold bg-slate-50 text-[#0475FE]" : ""}`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Type dropdown */}
      <div className="relative" ref={typeRef}>
        <button
          type="button"
          onClick={() => setTypeOpen((o) => !o)}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-48 cursor-pointer"
        >
          <span>{selectedType}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${typeOpen ? "rotate-180" : ""}`}
          />
        </button>
        {typeOpen && (
          <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
            {types.map((tp) => (
              <button
                key={tp}
                type="button"
                onClick={() => {
                  setSelectedType(tp);
                  setTypeOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 cursor-pointer ${selectedType === tp ? "font-bold bg-slate-50 text-[#0475FE]" : ""}`}
              >
                {tp}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une promotion..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0475FE] transition-colors"
        />
      </div>
    </div>
  );
}
