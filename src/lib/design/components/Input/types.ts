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

export type InputProps = HTMLInputAttributes & { type?: 'password' | 'text' | 'color' | 'email' };
export type TextareaProps = HTMLTextareaAttributes & { type: 'textarea' };

export type InputOrTextareaProps = (InputProps | TextareaProps) & CommonInputProps;
