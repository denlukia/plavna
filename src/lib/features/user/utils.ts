import { eq } from 'drizzle-orm';
import { db } from '$lib/services/db';

import { safeUserData, type Actor, type User } from './parsers';
import { users } from './schema';

export async function getSafeUserData(
	username: Actor['username'] | undefined
): Promise<User | null> {
	if (!username) return null;
	const allData = await db.select().from(users).where(eq(users.username, username)).get();

	if (!allData) return null;

	const safeData = safeUserData.parse(allData);

	return safeData;
}
