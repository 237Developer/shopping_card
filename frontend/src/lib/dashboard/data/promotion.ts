"use server";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getPromotionStats() {
  try {
    const url = `${API_URL}/promotions/stats`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch promotion stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getPromotionStats:", error);
    return {
      activePromotions: 0,
      expiredPromotions: 0,
      endingSoonPromotions: 0,
    };
  }
}

export async function getPromotionsList() {
  try {
    const url = `${API_URL}/promotions/list`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch promotions list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getPromotionsList:", error);
    return [];
  }
}
