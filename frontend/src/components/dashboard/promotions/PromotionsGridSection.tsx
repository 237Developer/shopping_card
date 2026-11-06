"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useDebounce } from "use-debounce";
import { getPromotionsList } from "@/lib/dashboard/data/promotion";
import { deletePromotionAction, togglePromotionVisibilityAction } from "@/lib/dashboard/actions/dashboard/promotion";
import { PromotionCard } from "./PromotionCard";

interface PromotionItem {
  id: string;
  name: string;
  imageUrl?: string | null;
  percentage: number;
  startDate: string | Date;
  endDate: string | Date;
  isVisible: boolean;
  productsCount: number;
  status: string;
  createdAt: string | Date;
}

export function PromotionsGridSection() {
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [selectedSort, setSelectedSort] = useState("Récent");

  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    getPromotionsList()
      .then((res) => {
        if (Array.isArray(res)) {
          setPromotions(res);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // Listen for promotion added event
  useEffect(() => {
    function handlePromotionAdded(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const newPromo = customEvent.detail;
        setPromotions((prev) => [newPromo, ...prev]);
      }
    }
    window.addEventListener("promotion-added", handlePromotionAdded as EventListener);
    return () => {
      window.removeEventListener("promotion-added", handlePromotionAdded as EventListener);
    };
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deletePromotionAction(id);
    if (res.success) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(res.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    const res = await togglePromotionVisibilityAction(id, isVisible);
    if (res.success) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isVisible } : p))
      );
    } else {
      alert(res.error || "Erreur lors de la modification de la visibilité");
    }
  };

  // Filter and sort promotions
  const filteredPromotions = promotions.filter((promo) => {
    if (selectedStatus === "Promotions actives" && promo.status !== "active") return false;
    if (selectedStatus === "Programmées" && promo.status !== "programmée") return false;
    if (selectedStatus === "Terminées" && promo.status !== "terminée") return false;

    if (debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase();
      if (!promo.name.toLowerCase().includes(query)) return false;
    }

    return true;
  }).sort((a, b) => {
    const timeA = new Date(a.startDate).getTime();
    const timeB = new Date(b.startDate).getTime();

    if (selectedSort === "Ancien") {
      return timeA - timeB;
    }
    return timeB - timeA;
  });

  const statuses = ["Tous les statuts", "Promotions actives", "Programmées", "Terminées"];
  const sortOptions = ["Récent", "Ancien"];

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Status dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => setStatusOpen((o) => !o)}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-48 cursor-pointer"
          >
            <span>{selectedStatus}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
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

        {/* Sort dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-48 cursor-pointer"
          >
            <span>{selectedSort}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
              {sortOptions.map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => {
                    setSelectedSort(tp);
                    setSortOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-700 cursor-pointer ${selectedSort === tp ? "font-bold bg-slate-50 text-[#0475FE]" : ""}`}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une promotion..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0475FE] transition-colors"
          />
        </div>
      </div>

      {/* Grid or Empty */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-xs">
          Chargement des promotions...
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 text-xs">
          Aucune promotion trouvée.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <PromotionCard
              key={promo.id}
              promotion={promo}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  );
}
