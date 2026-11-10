import { Router } from "express";
import {
  getClientStatsFullController,
  getPaginatedClientsController,
  sendClientMessageController,
} from "../../../controllers/dashboard/clientController";

const router = Router();

router.get("/stats-full", getClientStatsFullController);
router.get("/paginated", getPaginatedClientsController);
router.post("/send-message", sendClientMessageController);

export default router;
