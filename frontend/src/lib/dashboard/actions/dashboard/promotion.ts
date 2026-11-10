"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "../../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function addPromotionAction(formData: FormData) {
  try {
    const response = await fetchWithAuth(`${API_URL}/promotions`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to add promotion: ${response.statusText}`);
    }
    const promotion = await response.json();
    revalidatePath("/dashboard/promotions");
    return { success: true, promotion };
  } catch (error: unknown) {
    console.error("Error in addPromotionAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de l'ajout de la promotion";
    return { success: false, error: message };
  }
}

export async function deletePromotionAction(promotionId: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/promotions/${promotionId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to delete promotion: ${response.statusText}`);
    }
    revalidatePath("/dashboard/promotions");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in deletePromotionAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
    return { success: false, error: message };
  }
}

export async function togglePromotionVisibilityAction(promotionId: string, isVisible: boolean) {
  try {
    const response = await fetchWithAuth(`${API_URL}/promotions/${promotionId}/visibility`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isVisible }),
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to toggle promotion visibility: ${response.statusText}`);
    }
    revalidatePath("/dashboard/promotions");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in togglePromotionVisibilityAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la modification de la visibilité";
    return { success: false, error: message };
  }
}
