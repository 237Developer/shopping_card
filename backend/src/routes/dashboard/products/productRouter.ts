import { Router } from "express";
import multer from "multer";
import {
  getProductsListController,
  getProductPageStatsController,
  getProductStatsFullController,
  getTopProductsController,
  getFeaturedProductsListController,
  getStarProductsListController,
  getLowStockProductsListController,
  getPaginatedProductsController,
  getCategoriesListController,
  deleteProductController,
  toggleProductVisibilityController,
  toggleProductStatusController,
  addProductController,
} from "../../../controllers/dashboard/productController";
import { checkPermission } from "../../../middlewares/dashboard/auth/checkPermission";
import { PERMISSIONS } from "../../../constants/permissions";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get(
  "/",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getProductsListController,
);
router.post(
  "/",
  checkPermission(PERMISSIONS.MANAGE_PRODUCTS),
  upload.single("imageFile"),
  addProductController,
);
router.get(
  "/stats",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getProductPageStatsController,
);
router.get(
  "/stats-full",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getProductStatsFullController,
);
router.get(
  "/top",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getTopProductsController,
);
router.get(
  "/featured-list",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getFeaturedProductsListController,
);
router.get(
  "/star-list",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getStarProductsListController,
);
router.get(
  "/low-stock-list",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getLowStockProductsListController,
);
router.get(
  "/paginated",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getPaginatedProductsController,
);
router.get(
  "/categories",
  checkPermission(PERMISSIONS.VIEW_DASHBOARD),
  getCategoriesListController,
);
router.delete(
  "/:id",
  checkPermission(PERMISSIONS.DELETE_PRODUCTS),
  deleteProductController,
);
router.patch(
  "/:id/visibility",
  checkPermission(PERMISSIONS.MANAGE_PRODUCTS),
  toggleProductVisibilityController,
);
router.patch(
  "/:id/status",
  checkPermission(PERMISSIONS.MANAGE_PRODUCTS),
  toggleProductStatusController,
);

export default router;
