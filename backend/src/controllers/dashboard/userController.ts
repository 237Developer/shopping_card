import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/dashboard/auth/verifyToken";
import bcrypt from "bcrypt";
import {
  getUsersListQuery,
  createUserQuery,
  deleteUserQuery,
  getRolesListQuery,
  updateRolePermissionsQuery,
} from "../../database/queries/dashboard/user";

export async function getUsersListController(req: AuthenticatedRequest, res: Response) {
  try {
    const allUsers = await getUsersListQuery();
    res.json({ success: true, users: allUsers });
  } catch (error) {
    console.error("Error fetching users list:", error);
    res.status(500).json({ error: "Internal server error while fetching users" });
  }
}

export async function createUserController(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, password, roleId } = req.body;

    if (!name || !password || !roleId) {
      return res.status(400).json({ error: "Name, password, and roleId are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await createUserQuery(name, hashedPassword, Number(roleId));

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error while creating user" });
  }
}

export async function deleteUserController(req: AuthenticatedRequest, res: Response) {
  try {
    const rawId = req.params.id;
    const userId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await deleteUserQuery(userId);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error while deleting user" });
  }
}

export async function getRolesListController(req: AuthenticatedRequest, res: Response) {
  try {
    const allRoles = await getRolesListQuery();
    res.json({ success: true, roles: allRoles });
  } catch (error) {
    console.error("Error fetching roles list:", error);
    res.status(500).json({ error: "Internal server error while fetching roles" });
  }
}

export async function updateRolePermissionsController(req: AuthenticatedRequest, res: Response) {
  try {
    const roleId = Number(req.params.id);
    const { permissions } = req.body;

    if (isNaN(roleId) || permissions === undefined) {
      return res.status(400).json({ error: "Role ID and permissions bitmask are required" });
    }

    await updateRolePermissionsQuery(roleId, Number(permissions));

    res.json({ success: true, message: "Role permissions updated successfully" });
  } catch (error) {
    console.error("Error updating role permissions:", error);
    res.status(500).json({ error: "Internal server error while updating role permissions" });
  }
}
