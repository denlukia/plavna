import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schemas/db.ts',
	out: './drizzle',
	breakpoints: true,
	driver: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL,
		authToken: process.env.DATABASE_AUTH_TOKEN
	}
} satisfies Config;
