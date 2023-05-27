import { type UserSchema, type SessionSchema, type KeySchema, LuciaError } from 'lucia-auth';
import { db } from '../db';
import { user, session, key } from '../schema';
import { specificAdapter } from './adapter';
import { transformDatabaseSession, transformDatabaseKey, transformToSqliteValue } from './utils';
import { testAdapter } from '@lucia-auth/adapter-test';

const queryHandler = {
	user: {
		get: async () => {
			return db.select().from(user).all();
		},
		insert: async (data: UserSchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(user).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(user).run();
		}
	},
	session: {
		get: async () => {
			const result = await db.select().from(session).all();
			return result.map(transformDatabaseSession);
		},
		insert: async (data: SessionSchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(session).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(session).run();
		}
	},
	key: {
		get: async () => {
			const results = await db.select().from(key).all();
			return results.map(transformDatabaseKey);
		},
		insert: async (data: KeySchema) => {
			const transformedData = transformToSqliteValue(data);
			await db.insert(key).values(transformedData).run();
		},
		clear: async () => {
			await db.delete(key).run();
		}
	}
};

const adapter = specificAdapter(db)(LuciaError);

export async function runTest() {
	await testAdapter(adapter, queryHandler);
}
