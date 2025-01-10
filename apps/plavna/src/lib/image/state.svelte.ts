import type { ImagesDict } from './types';

export function createImagesState(data: ImagesDict) {
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

export type ImagesState = ReturnType<typeof createImagesState>;
