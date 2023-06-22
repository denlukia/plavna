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
