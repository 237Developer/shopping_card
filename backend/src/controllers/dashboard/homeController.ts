import { Request, Response } from "express";
import {
  getTopProducts,
  getLowStockProducts,
  getRecentOrders,
  getSalesEvolution,
  getTotalProducts,
  getTotalOrders,
  getTotalCustomers,
  getTotalRevenue,
  getTotalPromotions,
  SalesPeriod,
} from "../../database/queries/dashboard/home";

export async function getTopProductsController(req: Request, res: Response) {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getTopProducts(limitParam);
    res.json(products);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getLowStockProductsController(req: Request, res: Response) {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getLowStockProducts(limitParam);
    res.json(products);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getRecentOrdersController(req: Request, res: Response) {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const orders = await getRecentOrders(limitParam);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSalesEvolutionController(req: Request, res: Response) {
  try {
    const period = (req.query.period as SalesPeriod) || "7days";
    const evolution = await getSalesEvolution(period);
    res.json(evolution);
  } catch (error) {
    console.error("Error fetching sales evolution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTotalProductsController(_req: Request, res: Response) {
  try {
    const totals = await getTotalProducts();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTotalOrdersController(_req: Request, res: Response) {
  try {
    const totals = await getTotalOrders();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTotalCustomersController(_req: Request, res: Response) {
  try {
    const totals = await getTotalCustomers();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTotalRevenueController(_req: Request, res: Response) {
  try {
    const totals = await getTotalRevenue();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTotalPromotionsController(_req: Request, res: Response) {
  try {
    const totals = await getTotalPromotions();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total promotions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
