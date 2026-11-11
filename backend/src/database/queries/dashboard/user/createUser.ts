import { db } from "../../../db";
import { users } from "../../../schema";

export async function createUserQuery(name: string, hashedPassword: string, roleId: number) {
  const [newUser] = await db
    .insert(users)
    .values({
      name,
      passwordHash: hashedPassword,
      roleId,
    })
    .returning({
      id: users.id,
      name: users.name,
      roleId: users.roleId,
    });

  return newUser;
}
