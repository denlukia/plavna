import type { SuperValidated } from 'sveltekit-superforms';

import type { TranslationSelect, TranslationUpdate } from './parsers';
import type { EN } from './translations/en';

export type SystemTranslationDict = {
	[k: string]: SystemTranslationDict | string;
};

type NestedKeyOfStringValuesOf<T extends SystemTranslationDict> = {
	[K in keyof T]: T[K] extends object // Check if the value is an object
		? // @ts-expect-error K is errored on possible Symbol
			// as a key and I can't show it that it'll be only a string
			`${K}.${NestedKeyOfStringValuesOf<T[K]>}`
		: // @ts-expect-error K is errored
			`${K}`;
}[keyof T];

type NestedKeyOfObjectValuesOf<T extends SystemTranslationDict> = {
	[K in keyof T]: T[K] extends object
		? // @ts-expect-error K is errored
			`${K}` | `${K}.${NestedKeyOfObjectValuesOf<T[K]>}`
		: never;
}[keyof T];

export type SystemTranslationKey = NestedKeyOfStringValuesOf<typeof EN>;
export type SystemTranslationSliceKey = NestedKeyOfObjectValuesOf<typeof EN>;

export type RecordsTranslationsDict = Record<TranslationSelect['key'], string>;

export type ImageInputsTranslationsDictValue = Omit<TranslationSelect, 'key' | 'user_id'>;

export type ImageInputsTranslationsDict = Record<
	TranslationSelect['key'],
	ImageInputsTranslationsDictValue
>;

export type TranslationFormsDict = Record<
	TranslationSelect['key'],
	SuperValidated<TranslationUpdate>
>;
