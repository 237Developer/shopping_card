"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = {
    name: "Admin",
    role: "admin",
    permissions: 255,
  };

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf8")
        );
        user = {
          name: payload.name || "Utilisateur",
          role: payload.roleName || payload.role || "admin",
          permissions: payload.permissions ?? 255,
        };
      }
    } catch (e) {
      console.error("Failed to decode token payload:", e);
    }
  }

  return user;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/dashboard-login");
}
