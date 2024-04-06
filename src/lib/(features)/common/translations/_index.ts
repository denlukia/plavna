import type {
	SystemTranslationDict,
	SystemTranslationKey,
	SystemTranslationSliceKey
} from './_types';
import { EN } from './en';
import { UK } from './uk';

const LANGUAGES = { en: EN, uk: UK } as const;

export function checkTranslationKey(key: SystemTranslationKey) {
	return key;
}

export function getSystemTranslationsSlice(
	key: SystemTranslationSliceKey | SystemTranslationSliceKey[],
	lang: string
) {
	if (!(lang in LANGUAGES)) {
		throw Error(`Language ${lang} not found`);
	}
	// @ts-expect-error we already checked that the key is present
	const LANGUAGE = LANGUAGES[lang] as SystemTranslationDict;
	const keys = Array.isArray(key) ? key : [key];

	const result = keys.reduce((acc, key) => {
		const keyset = key.split('.');
		const [head] = keyset;
		const slice = getSlice(keyset, LANGUAGE);
		return { ...acc, [head]: slice };
	}, {});
	console.log(result);
	return result;
}

function getSlice(keySet: string[], slice: SystemTranslationDict): SystemTranslationDict | string {
	if (keySet.length === 1) {
		const key = keySet[0];
		if (key in slice) {
			const value = slice[key];
			return value;
			// if (typeof value === 'string') {
			// 	return value;
			// } else if (value instanceof Object) {
			// 	return Object.fromEntries(
			// 		Object.entries(value).filter(([, value]) => typeof value === 'string')
			// 	);
			// } else {
			// 	throw Error('Value turned out to be neither string nor object');
			// }
		} else {
			throw Error('Key not found');
		}
	} else {
		const [head, ...tail] = keySet;
		const subSlice = slice[head];
		return {
			[head]: typeof subSlice === 'string' ? subSlice : getSlice(tail, subSlice)
		};
	}
}

export function getSystemTranslation(key: string, systemTranslations: SystemTranslationDict) {
	const keyset = key.split('.');
	let slice: SystemTranslationDict | string = { ...systemTranslations };

	for (const key of keyset) {
		if (typeof slice === 'object' && key in slice) {
			slice = slice[key];
		} else {
			return null;
		}
	}

	if (typeof slice === 'string') {
		return slice;
	} else {
		throw Error(`Translation ${key} is not a string`);
	}
}
