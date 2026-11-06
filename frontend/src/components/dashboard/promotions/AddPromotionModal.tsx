"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Tag, Upload, Search, CheckCircle2, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import { getCategories, getProductsList } from "@/lib/dashboard/data/product";
import { addPromotionAction } from "@/lib/dashboard/actions/dashboard/promotion";

type AddPromotionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface CategoryItem {
  id?: string;
  name: string;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
}

export function AddPromotionModal({ isOpen, onClose }: AddPromotionModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Toutes les catégories");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCategories().then((res) => {
        if (Array.isArray(res)) setCategories(res);
      });
      getProductsList().then((res) => {
        if (Array.isArray(res)) {
          setProducts(res);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      category === "Toutes les catégories" || p.category === category;
    const matchesSearch =
      productSearch.trim() === "" || p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const allFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p.id));

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Error compressing image:", error);
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    const filteredIds = filteredProducts.map((p) => p.id);
    if (checked) {
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    } else {
      setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("percentage", percentage);
      data.append("startDate", startDate);
      data.append("endDate", endDate);
      data.append("productIds", JSON.stringify(selectedProductIds));
      if (imageFile) {
        data.append("imageFile", imageFile);
      }

      const result = await addPromotionAction(data);
      if (result.success) {
        window.dispatchEvent(new CustomEvent("promotion-added"));
        router.refresh();
        setSuccessMessage("La promotion a été ajoutée avec succès !");
        setName("");
        setPercentage("");
        setStartDate("");
        setEndDate("");
        setImageFile(null);
        setImagePreview("");
        setSelectedProductIds([]);
        router.refresh();
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setErrorMessage(result.error || "Erreur lors de l'ajout de la promotion");
      }
    } catch (error) {
      console.error("Error submitting promotion:", error);
      setErrorMessage("Erreur lors de l'ajout de la promotion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-slate-200 relative">
        {successMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-rose-600 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">{errorMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Créer une promotion</h2>
              <p className="text-xs text-slate-600">Configurez votre offre commerciale et les produits concernés.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Nom de la promotion</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Soldes d'Hiver"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Pourcentage de réduction (%)</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="Ex: 20"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Date de début</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Date de fin</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE]"
              />
            </div>
          </div>

          {/* Image Banner Upload with Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Bannière / Image de la promotion</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-[#0475FE] transition-colors bg-white">
                <Upload className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">Télécharger une bannière</span>
                <span className="text-[10px] text-slate-500">PNG, JPG, WEBP jusqu&apos;à 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <div className="w-20 h-20 rounded-xl border border-slate-300 overflow-hidden relative bg-slate-100 flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Products selection section */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-2">Produits concernés</label>
            
            {/* Same line: Category dropdown (left), Search input (middle), Select all checkbox (right) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0475FE] shrink-0"
              >
                <option value="Toutes les catégories">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#0475FE] placeholder:text-slate-400"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 shrink-0">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0475FE] focus:ring-[#0475FE]"
                />
                <span>Tout sélectionner</span>
              </label>
            </div>

            {/* Products Checkbox List */}
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 space-y-2 bg-slate-50/50">
              {filteredProducts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Aucun produit trouvé.</p>
              ) : (
                filteredProducts.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  return (
                    <label
                      key={prod.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer text-xs text-slate-700 font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProductSelection(prod.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#0475FE] focus:ring-[#0475FE]"
                      />
                      <span className="truncate">{prod.name}</span>
                      <span className="ml-auto text-[10px] text-slate-400">Stock: {prod.stockQuantity}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#0475FE] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Ajout en cours..." : "Ajouter la promotion"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
