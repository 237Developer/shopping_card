"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "../../fetchWithAuth";

const API_URL = process.env.API_URL ?? "http://localhost:3001/api/dashboard";

export async function getUsersListAction() {
  try {
    const res = await fetchWithAuth(`${API_URL}/users`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.users || [];
  } catch (error) {
    console.error("Error in getUsersListAction:", error);
    return [];
  }
}

export async function getRolesListAction() {
  try {
    const res = await fetchWithAuth(`${API_URL}/users/roles`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch roles");
    const data = await res.json();
    return data.roles || [];
  } catch (error) {
    console.error("Error in getRolesListAction:", error);
    return [];
  }
}

export async function createUserAction(userData: { name: string; password: string; roleId: number }) {
  try {
    const res = await fetchWithAuth(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create user");
    }
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur";
    return { success: false, error: message };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const res = await fetchWithAuth(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete user");
    }
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur";
    return { success: false, error: message };
  }
}

export async function updateRolePermissionsAction(roleId: number, permissions: number) {
  try {
    const res = await fetchWithAuth(`${API_URL}/users/roles/${roleId}/permissions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
      cache: "no-store",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update permissions");
    }
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour des permissions";
    return { success: false, error: message };
  }
}
