import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./verifyToken";

export function checkPermission(requiredPermissionBit: number) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user session found" });
    }

    // If role is admin or bitmask is 255, grant full access
    if (user.roleName === "admin" || user.permissions === 255) {
      return next();
    }

    const hasPermission = (user.permissions & requiredPermissionBit) === requiredPermissionBit;
    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden: You do not have the required permission to perform this action." });
    }

    next();
  };
}
