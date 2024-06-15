import { type Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

// type UniversalMouseEventHandler = MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
type AnchorAttrs = HTMLAnchorAttributes & {
	href: string;
};
type ButtonAttrs = HTMLButtonAttributes & {
	href?: never;
};

export type ButtonProps = (AnchorAttrs | ButtonAttrs) & {
	children?: Snippet;
	kind?: 'primary' | 'secondary' | 'prominent' | 'destructive';
	size?: 'body' | 'small';
	dataSvelteKitPreloadData?: HTMLAnchorAttributes['data-sveltekit-preload-data'];
	dataSvelteKitReload?: HTMLAnchorAttributes['data-sveltekit-reload'];
	href?: string;
	active?: boolean;
	imitatePressingOnClick?: boolean;
	isInInput?: boolean;
	ref?: HTMLAnchorElement | HTMLButtonElement | null;
	leadingIcon?: Snippet;
	trailingIcon?: Snippet;
};
