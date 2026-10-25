import { Router, Request, Response } from "express";
import {
  getProductsList,
  getProductPageStats,
  getTotalProductsWithEvolution,
  getFeaturedProductsStats,
  getStarProductsStats,
  getLowStockProductsStats,
  getTopSellingProducts,
  getFeaturedProductsList,
  getStarProductsList,
  getLowStockProductsList,
} from "../../../database/queries/dashboard/product";

const router = Router();

// Get all products list
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await getProductsList();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get product page statistics
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await getProductPageStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching product page stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats-full", async (_req: Request, res: Response) => {
  try {
    const total = await getTotalProductsWithEvolution();
    const featured = await getFeaturedProductsStats();
    const star = await getStarProductsStats();
    const lowStock = await getLowStockProductsStats();
    res.json({ total, featured, star, lowStock });
  } catch (error) {
    console.error("Error fetching full product stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/top", async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const topProducts = await getTopSellingProducts(limit);
    res.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured-list", async (_req: Request, res: Response) => {
  try {
    const featured = await getFeaturedProductsList();
    res.json(featured);
  } catch (error) {
    console.error("Error fetching featured products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/star-list", async (_req: Request, res: Response) => {
  try {
    const starProducts = await getStarProductsList();
    res.json(starProducts);
  } catch (error) {
    console.error("Error fetching star products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/low-stock-list", async (_req: Request, res: Response) => {
  try {
    const lowStock = await getLowStockProductsList();
    res.json(lowStock);
  } catch (error) {
    console.error("Error fetching low stock products list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
