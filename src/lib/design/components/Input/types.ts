import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

type CommonInputProps = {
	selectionStart?: number | null;
	selectionEnd?: number | null;
	restoreSelectionOnValueChange?: boolean;
	animateOnValueChange?: boolean;
	animateOnTypeChange?: boolean;
	leading?: Snippet;
	trailing?: Snippet;
};

export type InputProps = { textarea?: false } & HTMLInputAttributes;
export type TextareaProps = { textarea: true } & HTMLTextareaAttributes;

export type InputOrTextareaProps = CommonInputProps & (TextareaProps | InputProps);
