import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/collections/main-schema.ts',
	out: './migrations',
	breakpoints: true,
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
		authToken: process.env.DATABASE_AUTH_TOKEN
	},
	verbose: true,
	strict: true
} satisfies Config;
