import { db } from "../../../db";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";

export async function deleteUserQuery(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}
