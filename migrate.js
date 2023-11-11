import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

export const libsqlClient = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.DATABASE_AUTH_TOKEN
});
export const db = drizzle(libsqlClient);

try {
	await migrate(db, { migrationsFolder: './migrations' });
	console.log('Succesfully migrated');
} catch (e) {
	console.log('Failed to migrate: ', e);
}
