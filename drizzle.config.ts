import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/collections/db.ts',
	out: './drizzle',
	breakpoints: true,
	driver: 'turso',
	dbCredentials: {
		// @ts-ignore
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	}
} satisfies Config;
