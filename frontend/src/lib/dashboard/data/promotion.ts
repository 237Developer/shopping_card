"use server";

import { fetchWithAuth } from "../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getPromotionStats() {
  try {
    const url = `${API_URL}/promotions/stats`;
    const response = await fetchWithAuth(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch promotion stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getPromotionStats:", error);
    return {
      activePromotions: 0,
      expiredPromotions: 0,
      scheduledPromotions: 0,
      endingSoonPromotions: 0,
    };
  }
}

export async function getPromotionsList(filters?: { status?: string; search?: string; sort?: string }) {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "Tous les statuts") {
      params.append("status", filters.status);
    }
    if (filters?.search && filters.search.trim() !== "") {
      params.append("search", filters.search);
    }
    if (filters?.sort) {
      params.append("sort", filters.sort);
    }

    const url = `${API_URL}/promotions/list?${params.toString()}`;
    const response = await fetchWithAuth(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch promotions list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getPromotionsList:", error);
    return [];
  }
}
