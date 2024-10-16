import type { PreviewFamiliesDict } from './types';

export function createPreviewFamiliesState(data: PreviewFamiliesDict) {
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

export type PreviewFamiliesState = ReturnType<typeof createPreviewFamiliesState>;
