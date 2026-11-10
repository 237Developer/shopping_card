"use server";

import { fetchWithAuth } from "../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getClientStatsFull() {
  try {
    const response = await fetchWithAuth(`${API_URL}/clients/stats-full`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch client full stats");
    return await response.json();
  } catch (error) {
    console.error("Error in getClientStatsFull:", error);
    return {
      totalClients: { total: 0, trend: 0 },
      newClients: { total: 0, trend: 0 },
      activeClients: { total: 0, trend: 0 },
    };
  }
}

export async function getPaginatedClients({
  page = 1,
  limit = 8,
  filter,
  search,
}: {
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
} = {}) {
  try {
    const query = new URLSearchParams();
    query.set("page", page.toString());
    query.set("limit", limit.toString());
    if (filter) query.set("filter", filter);
    if (search) query.set("search", search);

    const response = await fetchWithAuth(`${API_URL}/clients/paginated?${query.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch paginated clients");
    return await response.json();
  } catch (error) {
    console.error("Error in getPaginatedClients:", error);
    return { clients: [], total: 0, totalPages: 1, currentPage: 1 };
  }
}
