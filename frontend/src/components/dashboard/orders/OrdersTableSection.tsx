"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  getPaginatedOrders,
  updateOrderStatusAction,
} from "@/lib/dashboard/actions/dashboard/order";
import {
  STATUS_OPTIONS,
  FREQUENCY_OPTIONS,
  SORT_OPTIONS,
} from "@/utils/orderConstants";
import { formatOrderDate, calculatePageNumbers } from "@/utils/orderHelpers";
import { FilterDropdown } from "./FilterDropdown";
import { StatusBadge } from "./StatusBadge";
import { OrderErrorModal } from "./OrderErrorModal";
import { OrderStatusConfirmModal } from "./OrderStatusConfirmModal";

interface OrderItem {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  orderPhone: string;
  orderName: string;
  customerEmail: string;
  deliveryLocation: string;
  totalAmount: string;
  rawTotalAmount: number;
  itemsCount: number;
}

const AVAILABLE_STATUSES = [
  { value: "en_attente", label: "En attente" },
  { value: "en_préparation", label: "En préparation" },
  { value: "expédiée", label: "Expédiée" },
  { value: "livrée", label: "Livrée" },
];

export function OrdersTableSection() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 800);
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [selectedFrequency, setSelectedFrequency] = useState(
    "Toutes les fréquences",
  );
  const [selectedSort, setSelectedSort] = useState("Plus récents");
  const [isLoading, setIsLoading] = useState(true);

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [openDropdownOrderId, setOpenDropdownOrderId] = useState<string | null>(
    null,
  );
  const [openActionDropdownOrderId, setOpenActionDropdownOrderId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    statusValue: string;
    statusLabel: string;
  } | null>(null);

  const requestIdRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownOrderId(null);
      }
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenActionDropdownOrderId(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const fetchOrders = useCallback(() => {
    const currentId = ++requestIdRef.current;
    getPaginatedOrders({
      page: currentPage,
      limit,
      status: selectedStatus,
      frequency: selectedFrequency,
      search: debouncedSearch,
      sortBy: selectedSort,
    })
      .then((res) => {
        if (currentId === requestIdRef.current) {
          if (res && res.orders) {
            setOrders(res.orders);
            setTotal(res.total);
            setTotalPages(res.totalPages || 1);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Erreur getPaginatedOrders:", err);
        if (currentId === requestIdRef.current) {
          setIsLoading(false);
        }
      });
  }, [
    currentPage,
    limit,
    selectedStatus,
    selectedFrequency,
    debouncedSearch,
    selectedSort,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const changeFilter = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
    setIsLoading(true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOpenDropdownOrderId(null);
    setUpdatingOrderId(orderId);

    const result = await updateOrderStatusAction(orderId, newStatus);
    setUpdatingOrderId(null);

    if (result.success) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: result.order?.status || newStatus }
            : order,
        ),
      );
    } else {
      setErrorMessage(
        result.error || "Erreur lors de la mise à jour du statut",
      );
    }
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible p-6 space-y-6">
      <OrderErrorModal
        isOpen={!!errorMessage}
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <FilterDropdown
            value={selectedStatus}
            options={STATUS_OPTIONS}
            onChange={changeFilter(setSelectedStatus)}
          />
          <FilterDropdown
            value={selectedFrequency}
            options={FREQUENCY_OPTIONS}
            onChange={changeFilter(setSelectedFrequency)}
          />
          <FilterDropdown
            value={selectedSort}
            options={SORT_OPTIONS}
            onChange={changeFilter(setSelectedSort)}
          />
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
              setIsLoading(true);
            }}
            className="text-gray-800 w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0475FE]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Commande</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Téléphone</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Montant</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-3 text-right w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Chargement des commandes...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const formattedDate = formatOrderDate(order.orderDate);
                const isUpdating = updatingOrderId === order.id;
                const isDropdownOpen = openDropdownOrderId === order.id;

                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      isUpdating
                        ? "opacity-50 pointer-events-none animate-pulse"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 whitespace-nowrap">
                          {order.orderName}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                          {order.customerEmail}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                      {order.orderPhone}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                      {order.totalAmount}
                    </td>
                    <td className="py-3 px-2">
                      <div
                        className="relative inline-block"
                        ref={isDropdownOpen ? dropdownRef : null}
                      >
                        <StatusBadge
                          status={order.status}
                          isOpen={isDropdownOpen}
                          onClick={() =>
                            setOpenDropdownOrderId(
                              isDropdownOpen ? null : order.id,
                            )
                          }
                        />

                        {isDropdownOpen && (
                          <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs">
                            {AVAILABLE_STATUSES.map((st) => (
                              <button
                                key={st.value}
                                type="button"
                                onClick={() => {
                                  setOpenDropdownOrderId(null);
                                  setPendingStatusChange({
                                    orderId: order.id,
                                    statusValue: st.value,
                                    statusLabel: st.label,
                                  });
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-700 flex items-center justify-between ${
                                  order.status === st.value
                                    ? "font-bold bg-gray-50 text-[#0475FE]"
                                    : ""
                                }`}
                              >
                                <span>{st.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center relative">
                      <div
                        className="relative inline-block"
                        ref={
                          openActionDropdownOrderId === order.id
                            ? actionDropdownRef
                            : null
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionDropdownOrderId(
                              openActionDropdownOrderId === order.id
                                ? null
                                : order.id,
                            )
                          }
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openActionDropdownOrderId === order.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs text-left">
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-gray-700"
                            >
                              Détail
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionDropdownOrderId(null);
                                setPendingStatusChange({
                                  orderId: order.id,
                                  statusValue: "annulée",
                                  statusLabel: "Annuler la commande",
                                });
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-red-600"
                            >
                              Annuler la commande
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">
          Affichage de {orders.length} sur {total} commandes
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                setIsLoading(true);
              }}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {calculatePageNumbers(currentPage, totalPages).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setCurrentPage(num);
                  setIsLoading(true);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  currentPage === num
                    ? "bg-[#0475FE] text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                setIsLoading(true);
              }}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <OrderStatusConfirmModal
        isOpen={!!pendingStatusChange}
        statusLabel={pendingStatusChange?.statusLabel || ""}
        isUpdating={updatingOrderId !== null}
        onCancel={() => setPendingStatusChange(null)}
        onConfirm={async () => {
          if (!pendingStatusChange) return;
          const { orderId, statusValue } = pendingStatusChange;
          setPendingStatusChange(null);
          await handleStatusChange(orderId, statusValue);
        }}
      />
    </div>
  );
}
