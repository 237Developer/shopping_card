import { db } from "../../../db";
import { users, roles } from "../../../schema";
import { eq } from "drizzle-orm";

export async function getUsersListQuery() {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      roleId: users.roleId,
      roleName: roles.name,
      permissions: roles.permissions,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id));

  return allUsers;
}
