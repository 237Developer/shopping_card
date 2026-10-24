import { Router, Request, Response } from "express";
import {
  getTopProducts,
  getLowStockProducts,
  getRecentOrders,
  getSalesEvolution,
  getTotalProducts,
  getTotalOrders,
  getTotalCustomers,
  getTotalRevenue,
  SalesPeriod,
} from "../../../database/queries/dashboard/home";

const router = Router();

// Get top products (resource: products, filter/param: limit)
router.get("/products", async (req: Request, res: Response) => {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getTopProducts(limitParam);
    res.json(products);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get low stock products (resource: low-stock, filter/param: limit)
router.get("/low-stock", async (req: Request, res: Response) => {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const products = await getLowStockProducts(limitParam);
    res.json(products);
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get recent orders (resource: orders, filter/param: limit)
router.get("/orders", async (req: Request, res: Response) => {
  try {
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const orders = await getRecentOrders(limitParam);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get sales evolution (resource: sales-evolution, filter/param: period)
router.get("/sales-evolution", async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as SalesPeriod) || "7days";
    const evolution = await getSalesEvolution(period);
    res.json(evolution);
  } catch (error) {
    console.error("Error fetching sales evolution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total products (resource: totals/products)
router.get("/totals/products", async (_req: Request, res: Response) => {
  try {
    const totals = await getTotalProducts();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total orders (resource: totals/orders)
router.get("/totals/orders", async (_req: Request, res: Response) => {
  try {
    const totals = await getTotalOrders();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total customers (resource: totals/customers)
router.get("/totals/customers", async (_req: Request, res: Response) => {
  try {
    const totals = await getTotalCustomers();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get total revenue (resource: totals/revenue)
router.get("/totals/revenue", async (_req: Request, res: Response) => {
  try {
    const totals = await getTotalRevenue();
    res.json(totals);
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
