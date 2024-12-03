import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';

import type { RecordsTranslationsState } from './state.svelte';
import { EN } from './translations/en';
import { UK } from './translations/uk';
import type {
	RecordsTranslationsDict,
	SystemTranslationDict,
	SystemTranslationKey,
	SystemTranslationSliceKey
} from './types';
import type { TranslationSelect, TranslationUpdate } from './validators';

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

export function getSystemTranslation(
	key: SystemTranslationKey,
	systemTranslations: SystemTranslationDict
) {
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
export function getRecordTranslation(
	key: TranslationSelect['key'],
	recordsTranslations: RecordsTranslationsDict | undefined
) {
	return recordsTranslations?.[key];
}

export const defaultLang: SupportedLang = 'en';
export function isSupportedLang(lang: string): lang is SupportedLang {
	return supportedLangs.includes(lang as SupportedLang);
}

export function replaceEmptyWithNull(translation: TranslationUpdate) {
	return Object.fromEntries(
		Object.entries(translation).map(([key, value]) => {
			if (value === '') {
				return [key, null];
			}
			return [key, value];
		})
	);
}

export function getLang(lang: string | undefined): SupportedLang {
	// We can recieve string or undefined here because we rely on param matcher
	// to filter unsupported lang codes before any other code runs
	if (lang && isSupportedLang(lang)) {
		return lang;
	} else {
		return defaultLang;
	}
}
