import { db } from "../../../db";
import { roles } from "../../../schema";
import { eq } from "drizzle-orm";

export async function updateRolePermissionsQuery(roleId: number, permissions: number) {
  await db
    .update(roles)
    .set({ permissions })
    .where(eq(roles.id, roleId));
}
