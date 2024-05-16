import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from '../collections/main-schema';

export const libsqlClient = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN
});
export const db = drizzle(libsqlClient, { schema });
export type Database = typeof db;
