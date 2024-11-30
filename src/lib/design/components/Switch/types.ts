import type { HTMLInputAttributes } from 'svelte/elements';

export type SwitchProps = HTMLInputAttributes & {
	checked?: boolean;
	purpose?: 'functional' | 'aesthetic';
};
