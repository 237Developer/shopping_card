"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { getPaginatedClients } from "@/lib/dashboard/data/client";
import { ClientMessageModal } from "./ClientMessageModal";

interface ClientItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalRevenue: string;
  rawTotalRevenue: number;
  lastOrderDate: string;
}

export function ClientsTableSection() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 1500);
  const [filter, setFilter] = useState("Tous les clients");
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<{
    clients: ClientItem[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>({
    clients: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientForMessage, setSelectedClientForMessage] = useState<{
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    getPaginatedClients({
      page: currentPage,
      limit: 8,
      filter,
      search: debouncedSearch,
    }).then((res) => {
      setData(res);
    });
  }, [currentPage, filter, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Controls Bar: Search & Filter Dropdown */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Rechercher un client..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
            />
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0475FE] cursor-pointer"
            >
              <option value="Tous les clients">Tous les clients</option>
              <option value="Clients actifs">Clients actifs</option>
              <option value="Clients inactifs">Clients inactifs</option>
              <option value="Les plus gros clients ce mois">
                Les plus gros clients ce mois
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Client</th>
                <th className="py-3.5 px-6">Téléphone</th>
                <th className="py-3.5 px-6">Commandes</th>
                <th className="py-3.5 px-6">Total dépensé</th>
                <th className="py-3.5 px-6">Dernière commande</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {data.clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-slate-400 font-normal"
                  >
                    Aucun client trouvé.
                  </td>
                </tr>
              ) : (
                data.clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">
                        {client.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                        {client.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{client.phone}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900 text-center">
                      {client.totalOrders}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {client.totalRevenue}
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-center">
                      {client.lastOrderDate}
                    </td>
                    <td className="py-4 px-6  flex justify-center items-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedClientForMessage({
                              name: client.name,
                              email: client.email,
                            })
                          }
                          title="Envoyer un message"
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Options"
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Affichage de {data.total === 0 ? 0 : (data.currentPage - 1) * 8 + 1}{" "}
            à {Math.min(data.currentPage * 8, data.total)} sur {data.total}{" "}
            clients
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={data.currentPage === 1}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    data.currentPage === num
                      ? "bg-[#0475FE] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {num}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, data.totalPages))
              }
              disabled={data.currentPage === data.totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ClientMessageModal
        isOpen={selectedClientForMessage !== null}
        client={selectedClientForMessage}
        onClose={() => setSelectedClientForMessage(null)}
      />
    </>
  );
}
