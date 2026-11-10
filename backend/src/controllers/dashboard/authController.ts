import { Request, Response } from "express";
import { db } from "../../database/db";
import { users, roles } from "../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginController(req: Request, res: Response) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        passwordHash: users.passwordHash,
        roleId: users.roleId,
        roleName: roles.name,
        permissions: roles.permissions,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.name, name));

    const userRecord = result[0];

    if (!userRecord) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const privateKeyB64 = process.env.JWT_PRIVATE_KEY_B64;
    if (!privateKeyB64) {
      return res.status(500).json({ error: "Server configuration error: missing private key" });
    }

    const privateKey = Buffer.from(privateKeyB64, "base64").toString("utf8");

    const tokenPayload = {
      id: userRecord.id,
      name: userRecord.name,
      roleId: userRecord.roleId,
      roleName: userRecord.roleName,
      permissions: userRecord.permissions,
    };

    const token = jwt.sign(tokenPayload, privateKey, { algorithm: "RS256" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        role: userRecord.roleName,
        permissions: userRecord.permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
}
