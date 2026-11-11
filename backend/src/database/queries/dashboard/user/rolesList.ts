import { db } from "../../../db";
import { roles } from "../../../schema";

export async function getRolesListQuery() {
  const allRoles = await db.select().from(roles);
  return allRoles;
}
