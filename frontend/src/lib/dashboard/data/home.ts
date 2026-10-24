"use server";

import {
  SalesPeriod,
  SalesPoint,
} from "../placeholder-data";
import { MOCK_TOTAL_PROMOTIONS } from "../placeholder-data";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getTopProducts(limit?: number) {
  try {
    const url = `${API_URL}/home/products${limit !== undefined ? `?limit=${limit}` : ""}`;
    console.log("[DEBUG] Fetching top products from:", url);
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch top products: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("[DEBUG] Top products response data:", data);
    return data;
  } catch (error) {
    console.error("Error in getTopProducts:", error);
    return [];
  }
}

export async function getLowStockProducts(limit?: number) {
  try {
    const url = `${API_URL}/home/low-stock${limit !== undefined ? `?limit=${limit}` : ""}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch low stock products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getLowStockProducts:", error);
    return [];
  }
}

export async function getRecentOrders(limit?: number) {
  try {
    const url = `${API_URL}/home/orders${limit !== undefined ? `?limit=${limit}` : ""}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch recent orders: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map((order: { date: string | Date; [key: string]: unknown }) => ({
      ...order,
      date: new Date(order.date),
    }));
  } catch (error) {
    console.error("Error in getRecentOrders:", error);
    return [];
  }
}

export async function getSalesEvolution(
  period: SalesPeriod,
): Promise<SalesPoint[]> {
  try {
    const url = `${API_URL}/home/sales-evolution?period=${period}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch sales evolution: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getSalesEvolution:", error);
    return [];
  }
}

export async function getTotalProducts() {
  try {
    const response = await fetch(`${API_URL}/home/totals/products`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch total products");
    return await response.json();
  } catch (error) {
    console.error("Error in getTotalProducts:", error);
    return { total: 0, trend: 0 };
  }
}

export async function getTotalOrders() {
  try {
    const response = await fetch(`${API_URL}/home/totals/orders`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch total orders");
    return await response.json();
  } catch (error) {
    console.error("Error in getTotalOrders:", error);
    return { total: 0, trend: 0 };
  }
}

export async function getTotalCustomers() {
  try {
    const response = await fetch(`${API_URL}/home/totals/customers`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch total customers");
    return await response.json();
  } catch (error) {
    console.error("Error in getTotalCustomers:", error);
    return { total: 0, trend: 0 };
  }
}

export async function getTotalRevenue() {
  try {
    const response = await fetch(`${API_URL}/home/totals/revenue`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch total revenue");
    return await response.json();
  } catch (error) {
    console.error("Error in getTotalRevenue:", error);
    return { total: 0, trend: 0 };
  }
}

export async function getTotalPromotions() {
  return MOCK_TOTAL_PROMOTIONS;
}
