import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schemas/db.ts',
	out: './drizzle',
	breakpoints: true
} satisfies Config;
