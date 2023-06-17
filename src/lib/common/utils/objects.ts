export function nestify(arg: any): any {
	if (typeof arg !== 'object') {
		return arg;
	}

	const result: any = {};

	for (const key in arg) {
		if (arg.hasOwnProperty(key)) {
			const value = arg[key];
			const nestedKeys = key.split('.');
			let nestedObj = result;

			for (let i = 0; i < nestedKeys.length; i++) {
				const nestedKey = nestedKeys[i];

				if (!nestedObj.hasOwnProperty(nestedKey)) {
					nestedObj[nestedKey] = {};
				}

				if (i === nestedKeys.length - 1) {
					nestedObj[nestedKey] = value;
				} else {
					nestedObj = nestedObj[nestedKey];
				}
			}
		}
	}

	return result;
}

interface FlattenedObject {
	[key: string]: any;
}

export function flatify(obj: any, parentKey = '', result: FlattenedObject = {}): FlattenedObject {
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];
			const formattedKey = parentKey ? `${parentKey}.${key}` : key;

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				flatify(value, formattedKey, result);
			} else {
				result[formattedKey] = value;
			}
		}
	}

	return result;
}

export function addPrefixDotToKeys(obj: Record<string, any>, prefix: string): Record<string, any> {
	const prefixedObj = {} as Record<string, any>;

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const prefixedKey = `${prefix}.${key}`;
			prefixedObj[prefixedKey] = obj[key];
		}
	}

	return prefixedObj;
}
