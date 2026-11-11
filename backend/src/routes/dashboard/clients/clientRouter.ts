import { Router } from "express";
import {
  getClientStatsFullController,
  getPaginatedClientsController,
  sendClientMessageController,
} from "../../../controllers/dashboard/clientController";
import { checkPermission } from "../../../middlewares/dashboard/auth/checkPermission";
import { PERMISSIONS } from "../../../constants/permissions";

const router = Router();

router.get("/stats-full", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getClientStatsFullController);
router.get("/paginated", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getPaginatedClientsController);
router.post("/send-message", checkPermission(PERMISSIONS.MANAGE_CLIENTS), sendClientMessageController);

export default router;
