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

export type InputProps = HTMLInputAttributes & { element?: 'input' };
export type TextareaProps = HTMLTextareaAttributes & { element: 'textarea' };

export type InputOrTextareaProps = (InputProps | TextareaProps) & CommonInputProps;
