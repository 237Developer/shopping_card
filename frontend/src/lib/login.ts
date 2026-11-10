"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !password) {
    return { error: "Identifiant ou mot de passe incorrect" };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { error: "Identifiant ou mot de passe incorrect" };
    }

    const data = await response.json();

    if (!data.success || !data.token) {
      return { error: "Identifiant ou mot de passe incorrect" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login action error:", error);
    return { error: "Identifiant ou mot de passe incorrect" };
  }
}
