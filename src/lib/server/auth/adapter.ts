import type { Adapter, AdapterFunction } from 'lucia-auth';
import type { Database } from '../db';
import { user, session, key, type User, type Session, type Key } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { transformDatabaseKey, transformDatabaseSession, transformToSqliteValue } from './utils';

export const specificAdapter = (db: Database): AdapterFunction<Adapter> => {
	return (LuciaError) => {
		return {
			getUser: async (userId) => {
				const data = await db.select().from(user).where(eq(user.id, userId)).get();
				return data || null;
			},
			getSessionAndUserBySessionId: async (sessionId) => {
				const data = await db
					.select({ user: { ...user }, session: { ...session } })
					.from(session)
					.innerJoin(user, eq(user.id, session.user_id))
					.where(eq(session.id, sessionId))
					.get();
				return data || null;
			},
			getSession: async (sessionId) => {
				const data = await db.select().from(session).where(eq(session.id, sessionId)).get();
				return data || null;
			},
			getSessionsByUserId: async (userId) => {
				return db.select().from(session).where(eq(session.user_id, userId)).all();
			},
			setUser: async (userId, attributes, keyData) => {
				const userObj = { id: userId, ...attributes } as unknown as User;
				try {
					const userReturn = await db.transaction(async (tx) => {
						const { rows } = await tx.insert(user).values(userObj).returning().run();
						if (!rows) throw new TypeError('Unexpected query result');
						if (keyData) await tx.insert(key).values(transformToSqliteValue(keyData)).run();
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
				await db.delete(user).where(eq(user.id, userId)).run();
			},
			setSession: async (sessionData) => {
				try {
					await db
						.insert(session)
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
				await db.delete(session).where(eq(session.id, sessionId)).run();
			},
			deleteSessionsByUserId: async (userId) => {
				await db.delete(session).where(eq(session.user_id, userId)).run();
			},
			updateUserAttributes: async (userId, attributes) => {
				let { rows } = await db
					.update(user)
					.set(attributes)
					.where(eq(user.id, userId))
					.returning()
					.run();
				let result = rows[0] as unknown as User;
				return result;
			},
			setKey: async (keyData) => {
				try {
					await db.insert(key).values(transformToSqliteValue(keyData)).run();
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
				const data = await db.select().from(key).where(eq(key.id, keyId)).get();
				return transformDatabaseKey(data) || null;
			},
			getKeysByUserId: async (userId) => {
				const data = await db.select().from(key).where(eq(key.user_id, userId)).all();
				return data.map(transformDatabaseKey);
			},
			updateKeyPassword: async (keyId, hashedPassword) => {
				await db
					.update(key)
					.set({ hashed_password: hashedPassword })
					.where(eq(key.id, keyId))
					.run();
			},
			deleteKeysByUserId: async (userId) => {
				await db.delete(key).where(eq(key.user_id, userId)).run();
			},
			deleteNonPrimaryKey: async (keyId) => {
				await db
					.delete(key)
					.where(and(eq(key.id, keyId), eq(key.primary_key, Number(false))))
					.run();
			}
		};
	};
};
