"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "../../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";


export async function getOrderStatsFull() {
  try {
    const response = await fetchWithAuth(`${API_URL}/orders/stats-full`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch order full stats");
    return await response.json();
  } catch (error) {
    console.error("Error in getOrderStatsFull:", error);
    return {
      totalOrders: { total: 0, trend: 0 },
      preparingOrders: { total: 0, trend: 0 },
      shippedOrders: { total: 0, trend: 0 },
      revenue: { total: 0, trend: 0 },
    };
  }
}

export async function getOrderSalesEvolution(period: string = "7days") {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/orders/sales-evolution?period=${period}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch order sales evolution");
    return await response.json();
  } catch (error) {
    console.error("Error in getOrderSalesEvolution:", error);
    return [];
  }
}

export async function getPaginatedOrders(
  params: {
    page?: number;
    limit?: number;
    status?: string;
    frequency?: string;
    search?: string;
    sortBy?: string;
  } = {},
) {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.status) query.set("status", params.status);
    if (params.frequency) query.set("frequency", params.frequency);
    if (params.search) query.set("search", params.search);
    if (params.sortBy) query.set("sortBy", params.sortBy);

    const response = await fetchWithAuth(
      `${API_URL}/orders/paginated?${query.toString()}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Failed to fetch paginated orders");
    return await response.json();
  } catch (error) {
    console.error("Error in getPaginatedOrders:", error);
    return { orders: [], total: 0, totalPages: 1, currentPage: 1 };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update order status: ${response.statusText}`);
    }
    const data = await response.json();
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
    return { success: true, order: data.order };
  } catch (error: unknown) {
    console.error("Error in updateOrderStatusAction:", error);
    const message = error instanceof Error ? error.message : "Erreur lors de la modification du statut de la commande";
    return { success: false, error: message };
  }
}
