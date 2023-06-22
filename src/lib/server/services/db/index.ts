import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$env/static/private';
import * as schema from '../../schemas/db';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

export const libsqlClient = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
export const db = drizzle(libsqlClient, { schema });
export type Database = typeof db;

await migrate(db, { migrationsFolder: './drizzle' });
