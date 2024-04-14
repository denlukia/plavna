import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';

export type UnionIncludesAll<T, U> = Exclude<U, T> extends never ? true : false;

export type RemoveNullValues<T> = {
	[K in keyof T as Exclude<T[K], null> extends never ? never : K]: T[K];
};

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

type RequiredNotNull<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type PartialNonNull<T, K extends keyof T> = T & RequiredNotNull<Pick<T, K>>;

export type TransactionContext = SQLiteTransaction<
	'async',
	ResultSet,
	typeof import('$lib/collections/main-schema'),
	ExtractTablesWithRelations<typeof import('$lib/collections/main-schema')>
>;
