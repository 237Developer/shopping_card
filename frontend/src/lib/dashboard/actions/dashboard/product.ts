"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "../../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function addProductAction(formData: FormData) {
  try {
    const response = await fetchWithAuth(`${API_URL}/products`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to add product: ${response.statusText}`);
    }
    const product = await response.json();
    revalidatePath("/dashboard/products");
    return { success: true, product };
  } catch (error: unknown) {
    console.error("Error in addProductAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de l'ajout du produit";
    return { success: false, error: message };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/products/${productId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to delete product: ${response.statusText}`);
    }
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in deleteProductAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
    return { success: false, error: message };
  }
}

export async function toggleProductVisibilityAction(productId: string, isActive: boolean) {
  try {
    const response = await fetchWithAuth(`${API_URL}/products/${productId}/visibility`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to toggle product visibility: ${response.statusText}`);
    }
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in toggleProductVisibilityAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la modification de la visibilité";
    return { success: false, error: message };
  }
}

export async function toggleProductStatusAction(productId: string, statusLabel: string, active: boolean) {
  try {
    const response = await fetchWithAuth(`${API_URL}/products/${productId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statusLabel, active }),
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update product status: ${response.statusText}`);
    }
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in toggleProductStatusAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la modification du statut";
    return { success: false, error: message };
  }
}
