import {
	getTableColumns,
	getTableName,
	sql,
	type AnyColumn,
	type ChangeColumnTableName
} from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

type DedupedObject<T extends Record<string, unknown>> = {
	[K in keyof T]: Array<T[K]>;
};

export function dedupeQueryResult<T extends Record<string, unknown>>(
	drizzleQuery: { _: { selectedFields: Record<string, unknown> } },
	drizzleResult: Array<T>,
	dublicationCheckers: Partial<{
		[K in keyof T]: (a: T[K], b: T[K]) => boolean;
	}> = {}
): DedupedObject<T> {
	const result: Partial<DedupedObject<T>> = {};
	for (const key in drizzleQuery._.selectedFields) {
		const k = key as keyof T;
		result[k] = [];
	}

	drizzleResult.forEach((item) => {
		Object.keys(item).forEach((key) => {
			const k = key as keyof T;
			if (!result[k]) {
				result[k] = [];
			}

			const defaultChecker = (a: T[keyof T], b: T[keyof T]) => {
				if (
					typeof a === 'object' &&
					typeof b === 'object' &&
					a !== null &&
					b !== null &&
					'id' in a &&
					'id' in b
				)
					return a.id === b.id;

				return JSON.stringify(a) === JSON.stringify(b);
			};

			const subObject = item[k];
			const selectedChecker = dublicationCheckers[k] || defaultChecker;
			const isAlreadyAdded = result[k]!.some((existingItem) =>
				selectedChecker(existingItem, subObject)
			);

			if (!isAlreadyAdded) {
				result[k]!.push(subObject);
			}
		});
	});

	return result as DedupedObject<T>;
}

type ColumnAlias<T extends AnyColumn> = ChangeColumnTableName<T, string, 'sqlite'>;

type ColumnAliases<T extends SQLiteTable> = {
	[K in keyof T['_']['columns']]: ColumnAlias<T['_']['columns'][K]>;
};

// TODO: Document this
export function getTableColumnAliases<T extends SQLiteTable>(
	table: T
	// keysToAlias: (keyof T['_']['columns'])[]
): ColumnAliases<T> {
	const name = getTableName(table);
	return Object.fromEntries(
		Object.entries(getTableColumns(table)).map(([key, column]) => {
			// if (!keysToAlias.includes(key as keyof T['_']['columns'])) {
			// 	return [key, column];
			// }
			return [
				key,
				sql<number>`${table}.${sql.identifier(key)}`
					.mapWith(column.mapFromDriverValue)
					.as(`${name}_${key}`)
			];
		})
	) as unknown as ColumnAliases<T>;
}
