import { Router } from "express";
import {
  getOrderStatsFullController,
  getOrderSalesEvolutionController,
  getPaginatedOrdersController,
  updateOrderStatusController,
} from "../../../controllers/dashboard/orderController";
import { validateOrderStatusTransition } from "../../../middlewares/dashboard/orders/validateOrderStatusTransition";

const router = Router();

router.get("/stats-full", getOrderStatsFullController);
router.get("/sales-evolution", getOrderSalesEvolutionController);
router.get("/paginated", getPaginatedOrdersController);
router.patch(
  "/:id/status",
  validateOrderStatusTransition,
  updateOrderStatusController,
);

export default router;
