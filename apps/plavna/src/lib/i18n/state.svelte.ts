import type { RecordsTranslationsDict } from './types';

export function createRecordsTranslationsState(data: RecordsTranslationsDict) {
	let value = $state(data);

	return {
		get value() {
			return value;
		},
		set value(v) {
			value = v;
		}
	};
}

export type RecordsTranslationsState = ReturnType<typeof createRecordsTranslationsState>;
