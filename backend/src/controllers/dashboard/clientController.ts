import { Request, Response } from "express";
import {
  getTotalClients,
  getNewClientsThisMonth,
  getActiveClients,
} from "../../database/queries/dashboard/client/clientStats";

export async function getClientStatsFullController(
  _req: Request,
  res: Response,
) {
  try {
    const totalClients = await getTotalClients();
    const newClients = await getNewClientsThisMonth();
    const activeClients = await getActiveClients();

    res.json({
      totalClients,
      newClients,
      activeClients,
    });
  } catch (error) {
    console.error("Error fetching client full stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
