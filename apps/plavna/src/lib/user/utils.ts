import { eq } from 'drizzle-orm';
import { db } from '$lib/db/db';

import { table_users } from './schema';
import { safeUserData, type Actor, type User } from './validators';

export async function getSafeUserData(
	username: Actor['username'] | undefined
): Promise<User | null> {
	if (!username) return null;
	const allData = await db
		.select()
		.from(table_users)
		.where(eq(table_users.username, username))
		.get();

	if (!allData) return null;

	const safeData = safeUserData.parse(allData);

	return safeData;
}
