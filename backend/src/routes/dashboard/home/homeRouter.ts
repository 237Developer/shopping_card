import { Router } from "express";
import {
  getTopProductsController,
  getLowStockProductsController,
  getRecentOrdersController,
  getSalesEvolutionController,
  getTotalProductsController,
  getTotalOrdersController,
  getTotalCustomersController,
  getTotalRevenueController,
} from "../../../controllers/dashboard/homeController";

const router = Router();

router.get("/products", getTopProductsController);
router.get("/low-stock", getLowStockProductsController);
router.get("/orders", getRecentOrdersController);
router.get("/sales-evolution", getSalesEvolutionController);
router.get("/totals/products", getTotalProductsController);
router.get("/totals/orders", getTotalOrdersController);
router.get("/totals/customers", getTotalCustomersController);
router.get("/totals/revenue", getTotalRevenueController);

export default router;
