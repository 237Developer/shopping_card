"use server";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getClientStatsFull() {
  try {
    const response = await fetch(`${API_URL}/clients/stats-full`, {
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
