import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    roleId: number;
    permissions: number;
    roleName?: string;
  };
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const publicKeyB64 = process.env.JWT_PUBLIC_KEY_B64;
    if (!publicKeyB64) {
      return res.status(500).json({ error: "Server configuration error: missing public key" });
    }

    const publicKey = Buffer.from(publicKeyB64, "base64").toString("utf8");

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}
