import { db } from "$lib/services/db";
import { safeUserData, type SafeUserData, type User } from "./parsers";
import { users } from "./schema";

import { eq } from "drizzle-orm";

export async function getSafeUserData(username: User['username'] | undefined): Promise<SafeUserData|null> {
  if (!username) return null;
  const allData = await db.select().from(users).where(eq(users.username, username)).get();
  const safeData = safeUserData.parse(allData);

  return safeData;
}