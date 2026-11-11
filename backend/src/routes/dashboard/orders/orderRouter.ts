import { Router } from "express";
import {
  getOrderStatsFullController,
  getOrderSalesEvolutionController,
  getPaginatedOrdersController,
  updateOrderStatusController,
} from "../../../controllers/dashboard/orderController";
import { validateOrderStatusTransition } from "../../../middlewares/dashboard/orders/validateOrderStatusTransition";
import { checkPermission } from "../../../middlewares/dashboard/auth/checkPermission";
import { PERMISSIONS } from "../../../constants/permissions";

const router = Router();

router.get("/stats-full", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getOrderStatsFullController);
router.get("/sales-evolution", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getOrderSalesEvolutionController);
router.get("/paginated", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getPaginatedOrdersController);
router.patch(
  "/:id/status",
  checkPermission(PERMISSIONS.MANAGE_ORDERS),
  validateOrderStatusTransition,
  updateOrderStatusController,
);

export default router;
