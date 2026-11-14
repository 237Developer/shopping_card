import { Router } from "express";
import {
  getUsersListController,
  createUserController,
  deleteUserController,
  getRolesListController,
  updateRolePermissionsController,
} from "../../../controllers/dashboard/userController";
import { checkPermission } from "../../../middlewares/dashboard/auth/checkPermission";
import { PERMISSIONS } from "../../../constants/permissions";

const router = Router();

router.get(
  "/",
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getUsersListController,
);
router.post(
  "/",
  checkPermission(PERMISSIONS.MANAGE_USERS),
  createUserController,
);
router.delete(
  "/:id",
  checkPermission(PERMISSIONS.MANAGE_USERS),
  deleteUserController,
);
router.get(
  "/roles",
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getRolesListController,
);
router.patch(
  "/roles/:id/permissions",
  checkPermission(PERMISSIONS.MANAGE_USERS),
  updateRolePermissionsController,
);

export default router;
