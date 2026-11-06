import { Router } from "express";
import multer from "multer";
import {
  getPromotionStatsController,
  getPromotionsListController,
  createPromotionController,
  deletePromotionController,
  togglePromotionVisibilityController,
} from "../../../controllers/dashboard/promotionController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/stats", getPromotionStatsController);
router.get("/list", getPromotionsListController);
router.post("/", upload.single("imageFile"), createPromotionController);
router.delete("/:id", deletePromotionController);
router.patch("/:id/visibility", togglePromotionVisibilityController);

export default router;
