"use server";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getProductsList() {
  try {
    const url = `${API_URL}/products`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getProductsList:", error);
    return [];
  }
}

export async function getProductPageStats() {
  try {
    const url = `${API_URL}/products/stats`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch product stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getProductPageStats:", error);
    return { total: 0, active: 0, lowStock: 0, outOfStock: 0 };
  }
}

export async function getProductStatsFull() {
  try {
    const url = `${API_URL}/products/stats-full`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch full product stats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getProductStatsFull:", error);
    return {
      total: { total: 0, trend: 0 },
      featured: { total: 0, trend: 0 },
      star: { total: 0, trend: 0 },
      lowStock: { total: 0, trend: 0 },
    };
  }
}

export async function getTopProducts(limit = 5) {
  try {
    const url = `${API_URL}/products/top?limit=${limit}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch top products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getTopProducts:", error);
    return [];
  }
}

export async function getFeaturedProductsList() {
  try {
    const url = `${API_URL}/products/featured-list`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch featured products list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getFeaturedProductsList:", error);
    return [];
  }
}

export async function getStarProductsList() {
  try {
    const url = `${API_URL}/products/star-list`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch star products list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getStarProductsList:", error);
    return [];
  }
}

export async function getLowStockProductsList() {
  try {
    const url = `${API_URL}/products/low-stock-list`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch low stock products list: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getLowStockProductsList:", error);
    return [];
  }
}
