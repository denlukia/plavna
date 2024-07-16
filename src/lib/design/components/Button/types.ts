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
	kind?:
		| 'primary'
		| 'secondary'
		| 'prominent'
		| 'destructive'
		| 'translucent'
		| 'translucent-destructive';
	size?: 'body' | 'small';
	placement?: 'default' | 'in-input' | 'in-tag';
	dataSvelteKitPreloadData?: HTMLAnchorAttributes['data-sveltekit-preload-data'];
	dataSvelteKitReload?: HTMLAnchorAttributes['data-sveltekit-reload'];
	href?: string;
	active?: boolean;
	imitatePressingOnClick?: boolean;
	isInInput?: boolean;
	ref?: HTMLAnchorElement | HTMLButtonElement | null;
	leading?: Snippet;
	trailing?: Snippet;
	customClass?: string;
	contentCustomClass?: string;
};
