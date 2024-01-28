import type { HTMLInputAttributes } from 'svelte/elements';

export type LanguagedInputProps = HTMLInputAttributes & {
	languaged?: boolean;
	type?: 'textarea' | 'password' | 'text' | 'color';
};
