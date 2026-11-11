import { Router } from "express";
import multer from "multer";
import {
  getPromotionStatsController,
  getPromotionsListController,
  createPromotionController,
  deletePromotionController,
  togglePromotionVisibilityController,
} from "../../../controllers/dashboard/promotionController";
import { checkPermission } from "../../../middlewares/dashboard/auth/checkPermission";
import { PERMISSIONS } from "../../../constants/permissions";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/stats", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getPromotionStatsController);
router.get("/list", checkPermission(PERMISSIONS.VIEW_DASHBOARD), getPromotionsListController);
router.post("/", checkPermission(PERMISSIONS.MANAGE_PROMOTIONS), upload.single("imageFile"), createPromotionController);
router.delete("/:id", checkPermission(PERMISSIONS.MANAGE_PROMOTIONS), deletePromotionController);
router.patch("/:id/visibility", checkPermission(PERMISSIONS.MANAGE_PROMOTIONS), togglePromotionVisibilityController);

export default router;
