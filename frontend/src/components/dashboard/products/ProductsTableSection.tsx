"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import {
  getPaginatedProducts,
  getCategories,
} from "@/lib/dashboard/data/product";
import { deleteProductAction, toggleProductVisibilityAction, toggleProductStatusAction } from "@/lib/dashboard/actions/dashboard/product";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/products/ProductsTableSkeleton";

interface ProductItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string;
  imageUrl: string | null;
  stockQuantity: number;
  threshold: number;
  isActive: boolean;
  price: string;
  rawPrice: number;
  createdAt: string;
  unitsSold: number;
  isStar: boolean;
  isFeatured: boolean;
}

interface CategoryItem {
  id: string;
  name: string;
}

export function ProductsTableSection() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState(
    "Toutes les catégories",
  );
  const [selectedStatus, setSelectedStatus] = useState("Tous les statuts");
  const [sortBy, setSortBy] = useState("plus récents");
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      if (openDropdownId !== null) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdownId]);

  // Fetch categories on mount
  useEffect(() => {
    getCategories().then((res) => {
      if (Array.isArray(res)) {
        setCategories(res);
      }
    });
  }, []);

  // Listen for product added event to update state in place
  useEffect(() => {
    function handleProductAdded(e: Event) {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        const newProduct = customEvent.detail;
        setProducts((prev) => {
          const updated = [newProduct, ...prev];
          if (updated.length > limit) {
            updated.pop();
          }
          return updated;
        });
        setTotal((prev) => prev + 1);
      }
    }
    window.addEventListener("product-added", handleProductAdded as EventListener);
    return () => {
      window.removeEventListener("product-added", handleProductAdded as EventListener);
    };
  }, [limit]);

  // Fetch products when page, category, status, debouncedSearch, or sortBy changes
  useEffect(() => {
    const currentId = ++requestIdRef.current;
    
    getPaginatedProducts({
      page: currentPage,
      limit,
      category: selectedCategory,
      status: selectedStatus,
      search: debouncedSearch,
      sortBy,
    })
      .then((res) => {
        if (currentId === requestIdRef.current) {
          if (res && res.products) {
            setProducts(res.products);
            setTotal(res.total);
            setTotalPages(res.totalPages || 1);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (currentId === requestIdRef.current) {
          setIsLoading(false);
        }
      });
  }, [currentPage, selectedCategory, selectedStatus, debouncedSearch, sortBy]);

  // Pagination page numbers (max 5 pages visible)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Top filters bar: Search, Category, Status, Sort */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
              setIsLoading(true);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0475FE] text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
              setIsLoading(true);
            }}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#0475FE]"
          >
            <option value="Toutes les catégories">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
              setIsLoading(true);
            }}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#0475FE]"
          >
            <option value="Tous les statuts">Tous les statuts</option>
            <option value="en stock">En stock</option>
            <option value="faible">Stock faible</option>
            <option value="visible">Visible</option>
            <option value="pas visible">Pas visible</option>
            <option value="en vedette">En vedette</option>
            <option value="star">Star</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
              setIsLoading(true);
            }}
            className="px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#0475FE]"
          >
            <option value="plus récents">Plus récents</option>
            <option value="plus vendue">Plus vendus</option>
            <option value="en stock">En stock (Max)</option>
            <option value="en stock faible">Stock faible (Min)</option>
          </select>
        </div>
      </div>

      {/* Table section */}
      {isLoading ? (
        <ProductsTableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4 whitespace-nowrap">Code</th>
                <th className="py-3 px-4 whitespace-nowrap">Catégorie</th>
                <th className="py-3 px-4 whitespace-nowrap">Prix</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Stock</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Ventes ce mois</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Aucun produit trouvé.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLowStock =
                    product.stockQuantity <= product.threshold;
                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        deletingProductId === product.id ? "opacity-50 grayscale pointer-events-none" : ""
                      }`}
                    >
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-normal">
                            {product.isActive ? "Visible" : "Masqué"}
                          </p>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {product.code}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                        {product.price}
                      </td>

                      {/* Stock colored */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            isLowStock
                              ? "bg-rose-50 text-rose-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {product.stockQuantity} en stock
                        </span>
                      </td>

                      {/* Units sold this month */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700 whitespace-nowrap">
                        {product.unitsSold}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-400">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === product.id ? null : product.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {openDropdownId === product.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-left text-xs"
                              >
                                <button
                                  onClick={async () => {
                                    setOpenDropdownId(null);
                                    const newStatus = !product.isActive;
                                    const res = await toggleProductVisibilityAction(product.id, newStatus);
                                    if (res.success) {
                                      setProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, isActive: newStatus } : p))
                                      );
                                    } else {
                                      alert(res.error || "Erreur");
                                    }
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                                >
                                  {product.isActive ? "Rendre invisible" : "Rendre visible"}
                                </button>
                                <button
                                  onClick={async () => {
                                    setOpenDropdownId(null);
                                    const newStar = !product.isStar;
                                    const res = await toggleProductStatusAction(product.id, "star", newStar);
                                    if (res.success) {
                                      setProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, isStar: newStar } : p))
                                      );
                                    } else {
                                      alert(res.error || "Erreur");
                                    }
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                                >
                                  {product.isStar ? "Retirer des stars" : "Rendre star"}
                                </button>
                                <button
                                  onClick={async () => {
                                    setOpenDropdownId(null);
                                    const newFeatured = !product.isFeatured;
                                    const res = await toggleProductStatusAction(product.id, "en vedette", newFeatured);
                                    if (res.success) {
                                      setProducts((prev) =>
                                        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: newFeatured } : p))
                                      );
                                    } else {
                                      alert(res.error || "Erreur");
                                    }
                                  }}
                                  className="w-full px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                                >
                                  {product.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer / Pagination & Count info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Affichage de {products.length} sur {total} produits
        </p>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                setIsLoading(true);
              }}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => {
                  setCurrentPage(num);
                  setIsLoading(true);
                }}
                className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                  currentPage === num
                    ? "bg-[#0475FE] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                setIsLoading(true);
              }}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setProductToDelete(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-800">Confirmation de suppression</h3>
            <p className="text-xs text-slate-600">
              Voulez-vous supprimer le produit <span className="font-semibold text-slate-800">{productToDelete.name}</span> ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                autoFocus
                onClick={async () => {
                  const id = productToDelete.id;
                  setProductToDelete(null);
                  setDeletingProductId(id);
                  const result = await deleteProductAction(id);
                  if (result.success) {
                    setProducts((prev) => prev.filter((p) => p.id !== id));
                    setTotal((prev) => Math.max(0, prev - 1));
                  } else {
                    alert(result.error || "Erreur lors de la suppression");
                  }
                  setDeletingProductId(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
