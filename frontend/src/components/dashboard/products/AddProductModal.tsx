"use client";

import { useState } from "react";
import { X, Upload, Plus, Package } from "lucide-react";
import imageCompression from "browser-image-compression";
import { addProductAction } from "@/lib/dashboard/actions/dashboard/product";
import { ProductAddedSuccessAlert } from "./ProductAddedSuccessAlert";
import { ProductAddedErrorAlert } from "./ProductAddedErrorAlert";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Smartphones",
    price: "",
    stockQuantity: "",
    threshold: "10",
    sku: "",
    rating: "5.0",
    imageFile: null as File | null,
    imagePreview: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setFormData((prev) => ({
          ...prev,
          imageFile: compressedFile,
          imagePreview: URL.createObjectURL(compressedFile),
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stockQuantity", formData.stockQuantity);
      data.append("threshold", formData.threshold);
      data.append("sku", formData.sku);
      data.append("rating", formData.rating);
      if (formData.imageFile) {
        data.append("imageFile", formData.imageFile);
      }

      const result = await addProductAction(data);
      if (result.success && result.product) {
        window.dispatchEvent(
          new CustomEvent("product-added", { detail: result.product })
        );
        setSuccessMessage("Le produit a été ajouté avec succès !");
        setFormData({
          name: "",
          description: "",
          category: "Smartphones",
          price: "",
          stockQuantity: "",
          threshold: "10",
          sku: "",
          rating: "5.0",
          imageFile: null,
          imagePreview: "",
        });
      } else {
        setErrorMessage(result.error || "Erreur lors de l'ajout du produit");
      }
    } catch (error) {
      console.error("Error submitting add product:", error);
      setErrorMessage("Erreur lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 border border-slate-200 relative">
        {successMessage && (
          <ProductAddedSuccessAlert
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {errorMessage && (
          <ProductAddedErrorAlert
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0475FE] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Ajouter un nouveau produit</h2>
              <p className="text-xs text-slate-600">Remplissez les informations du produit pour {`l'inventaire`}.</p>
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
            {/* Nom */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Nom du produit</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: iPhone 15 Pro"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            {/* SKU / Code */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">SKU / Code produit</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ex: PRD-001"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE]"
              >
                <option value="Smartphones">Smartphones</option>
                <option value="Ordinateurs">Ordinateurs</option>
                <option value="Accessoires">Accessoires</option>
                <option value="Audio">Audio</option>
                <option value="Tablettes">Tablettes</option>
              </select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Prix (FCFA)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex: 450000"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Quantité en stock</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                placeholder="Ex: 25"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>

            {/* Threshold */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Seuil {`d'alerte`} stock</label>
              <input
                type="number"
                required
                min="0"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                placeholder="Ex: 5"
                className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du produit..."
              className="w-full px-3 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0475FE]/30 focus:border-[#0475FE] placeholder:text-slate-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Image du produit</label>
            <div className="flex items-center gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-[#0475FE] transition-colors bg-white">
                <Upload className="w-5 h-5 text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">Télécharger une image locale</span>
                <span className="text-[10px] text-slate-500">PNG, JPG, WEBP jusqu'à 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {formData.imagePreview && (
                <div className="w-20 h-20 rounded-xl border border-slate-300 overflow-hidden relative bg-slate-100 flex-shrink-0">
                  <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
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
              className="flex items-center gap-2 px-5 py-2 bg-[#0475FE] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Ajout..." : "Ajouter"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
