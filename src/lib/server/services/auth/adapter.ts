import { type Key, type Session, type User, keys, sessions, users } from '../../domain/db';
import { transformDatabaseKey, transformDatabaseSession, transformToSqliteValue } from './utils';
import { and, eq } from 'drizzle-orm';

import type { Database } from '../db';
import type { Adapter, AdapterFunction } from 'lucia-auth';

export const specificAdapter = (db: Database): AdapterFunction<Adapter> => {
	return (LuciaError) => {
		return {
			getUser: async (userId) => {
				const data = await db.select().from(users).where(eq(users.id, userId)).get();
				return data || null;
			},
			getSessionAndUserBySessionId: async (sessionId) => {
				const data = await db
					.select({ user: { ...users }, session: { ...sessions } })
					.from(sessions)
					.innerJoin(users, eq(users.id, sessions.user_id))
					.where(eq(sessions.id, sessionId))
					.get();
				return data || null;
			},
			getSession: async (sessionId) => {
				const data = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
				return data || null;
			},
			getSessionsByUserId: async (userId) => {
				return db.select().from(sessions).where(eq(sessions.user_id, userId)).all();
			},
			setUser: async (userId, attributes, keyData) => {
				const userObj = { id: userId, ...attributes } as unknown as User;
				try {
					const userReturn = await db.transaction(async (tx) => {
						const { rows } = await tx.insert(users).values(userObj).returning().run();
						if (!rows) throw new TypeError('Unexpected query result');
						if (keyData) await tx.insert(keys).values(transformToSqliteValue(keyData)).run();
						return rows[0] as unknown as User;
					});
					return userReturn;
				} catch (e) {
					const error = e as { message: string };
					if (error?.message.includes('PRIMARY KEY constraint failed')) {
						throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
					}
					throw e;
				}
			},
			deleteUser: async (userId) => {
				await db.delete(users).where(eq(users.id, userId)).run();
			},
			setSession: async (sessionData) => {
				try {
					await db
						.insert(sessions)
						.values(sessionData as Session)
						.run();
				} catch (e) {
					const error = e as { message: string };
					if (error?.message.includes('FOREIGN KEY constraint failed')) {
						throw new LuciaError('AUTH_INVALID_USER_ID');
					}
					if (error?.message.includes('PRIMARY KEY constraint failed')) {
						throw new LuciaError('AUTH_DUPLICATE_SESSION_ID');
					}
					throw e;
				}
			},
			deleteSession: async (sessionId) => {
				await db.delete(sessions).where(eq(sessions.id, sessionId)).run();
			},
			deleteSessionsByUserId: async (userId) => {
				await db.delete(sessions).where(eq(sessions.user_id, userId)).run();
			},
			updateUserAttributes: async (userId, attributes) => {
				let { rows } = await db
					.update(users)
					.set(attributes)
					.where(eq(users.id, userId))
					.returning()
					.run();
				let result = rows[0] as unknown as User;
				return result;
			},
			setKey: async (keyData) => {
				try {
					await db.insert(keys).values(transformToSqliteValue(keyData)).run();
				} catch (e) {
					const error = e as { message: string };
					if (error?.message.includes('FOREIGN KEY constraint failed')) {
						throw new LuciaError('AUTH_INVALID_USER_ID');
					}
					if (error?.message.includes('PRIMARY KEY constraint failed')) {
						throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
					}
					throw e;
				}
			},
			getKey: async (keyId) => {
				const data = await db.select().from(keys).where(eq(keys.id, keyId)).get();
				return transformDatabaseKey(data) || null;
			},
			getKeysByUserId: async (userId) => {
				const data = await db.select().from(keys).where(eq(keys.user_id, userId)).all();
				return data.map(transformDatabaseKey);
			},
			updateKeyPassword: async (keyId, hashedPassword) => {
				await db
					.update(keys)
					.set({ hashed_password: hashedPassword })
					.where(eq(keys.id, keyId))
					.run();
			},
			deleteKeysByUserId: async (userId) => {
				await db.delete(keys).where(eq(keys.user_id, userId)).run();
			},
			deleteNonPrimaryKey: async (keyId) => {
				await db
					.delete(keys)
					.where(and(eq(keys.id, keyId), eq(keys.primary_key, Number(false))))
					.run();
			}
		};
	};
};
