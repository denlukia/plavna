import { keys, sessions, users } from '../../schemas/db';
import { db } from '../db';
import { specificAdapter } from './adapter';
import { transformDatabaseKey, transformDatabaseSession, transformToSqliteValue } from './utils';
import { testAdapter } from '@lucia-auth/adapter-test';
import { type KeySchema, LuciaError, type SessionSchema, type UserSchema } from 'lucia-auth';

const queryHandler = {
	user: {
		get: async () => {
			return db.select().from(users).all();
		},
		insert: async (data: UserSchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(users).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(users).run();
		}
	},
	session: {
		get: async () => {
			const result = await db.select().from(sessions).all();
			return result.map(transformDatabaseSession);
		},
		insert: async (data: SessionSchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(sessions).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(sessions).run();
		}
	},
	key: {
		get: async () => {
			const results = await db.select().from(keys).all();
			return results.map(transformDatabaseKey);
		},
		insert: async (data: KeySchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(keys).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(keys).run();
		}
	}
};

const adapter = specificAdapter(db)(LuciaError);

export async function runTest() {
	await testAdapter(adapter, queryHandler);
}
