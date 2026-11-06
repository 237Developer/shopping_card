import { Router } from "express";
import { getClientStatsFullController } from "../../../controllers/dashboard/clientController";

const router = Router();

router.get("/stats-full", getClientStatsFullController);

export default router;
