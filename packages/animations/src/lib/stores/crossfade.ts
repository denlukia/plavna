import type { Spring } from 'svelte/motion';
import { writable } from 'svelte/store';

export type CrossfadeStates = {
	[key: string]: {
		progress: Spring<number>;
		initializationTime: number;
		previewRef?: HTMLDivElement | undefined;
		finalRef?: HTMLDivElement | undefined;
		previewKeyframes?: Keyframe[];
		finalKeyframes?: Keyframe[];
	};
};

export const crossfadeStates = writable({} as CrossfadeStates);
