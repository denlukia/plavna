import type { RemoveNullValues } from '$lib/features/common/types';

export function nestify<T extends object>(obj: T): any {
	const nestedObj = {} as any;

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];
			const keys = key.split('.');
			let tempObj = nestedObj;

			for (let i = 0; i < keys.length - 1; i++) {
				const nestedKey = keys[i];
				if (!(nestedKey in tempObj)) {
					tempObj[nestedKey] = {};
				}
				tempObj = tempObj[nestedKey];
			}

			const finalKey = keys[keys.length - 1];
			tempObj[finalKey as keyof typeof tempObj] = value;
		}
	}

	return nestedObj;
}
function isPlainObject(value: any) {
	if (
		typeof value !== 'object' ||
		value === null ||
		Array.isArray(value) ||
		value instanceof Date
	) {
		return false;
	}

	return Object.getPrototypeOf(value) === Object.prototype;
}
interface FlattenedObject {
	[key: string]: any;
}

export function flatify(obj: any, parentKey = '', result: FlattenedObject = {}): FlattenedObject {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];
			const formattedKey = parentKey ? `${parentKey}.${key}` : key;

			if (isPlainObject(value)) {
				flatify(value, formattedKey, result);
			} else {
				result[formattedKey] = value;
			}
		}
	}

	return result;
}

export function addPrefixDotToKeys<T extends object, P extends string>(
	obj: T,
	prefix: P
): {
	[K in keyof T as K extends string ? `${P}.${K}` : never]: T[K];
} {
	const prefixedObj = {} as any;

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const prefixedKey = `${prefix}.${key}`;
			prefixedObj[prefixedKey] = obj[key];
		}
	}

	return prefixedObj;
}

export function getNullAndDupFilter(fieldName: string) {
	return <T extends null | Record<string, any>>(
		obj: T,
		index: number,
		arr: T[]
	): obj is NonNullable<T> =>
		obj !== null && index === arr.findIndex((el) => el && el[fieldName] === obj[fieldName]);
}
const emptyStringToken = '__plavna_empty_string__';

export function tokenizeEmptyStrings(form: FormData) {
	const formCopy = new FormData();
	for (const [key, value] of form.entries()) {
		formCopy.set(key, value === '' ? emptyStringToken : value);
	}
	return formCopy;
}

export function detokenizeEmptyStrings<T extends Object>(obj: T): T {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			if (value === emptyStringToken) return [key, ''];
			return [key, value];
		})
	) as T;
}

export function removeNullValues<T extends Object>(obj: T) {
	return Object.fromEntries(
		Object.entries(obj).filter(([key, value]) => value !== null)
	) as RemoveNullValues<T>;
}

export function nonNull<T>(value: T): value is NonNullable<T> {
	return value !== null;
}

export function nonNullValueInEntry<T>(entry: [string, T]): entry is [string, NonNullable<T>] {
	return entry[1] !== null;
}

export function hasNonEmptyProperties<T extends Record<string, any>>(
	obj: T,
	properties: (keyof T)[]
) {
	for (const property in obj) {
		if (!properties.includes(property) && obj[property] !== undefined && obj[property] !== null) {
			return true;
		}
	}
	return false;
}

export function createAtLeastOnePropBeyondTheseIsNonEmptyChecker(
	ignoreKeys?: Array<string | number | symbol>
) {
	return (obj: Record<string | number | symbol, unknown>) =>
		Object.entries(obj)
			.filter(([key, _]) => !ignoreKeys || !ignoreKeys.includes(key))
			.some(([_, value]) => value !== undefined && value !== null);
}
export function mapRange(
	x: number,
	in_min: number,
	in_max: number,
	out_min: number,
	out_max: number
) {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
