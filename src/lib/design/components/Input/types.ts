import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { Snippet } from 'svelte';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { SuperForm } from 'sveltekit-superforms';
import type { TranslationInsert } from '$lib/features/i18n/parsers';

type CommonInputProps = {
	selectionStart?: number | null;
	selectionEnd?: number | null;
	restoreSelectionOnValueChange?: boolean;
	animateOnValueChange?: boolean;
	animateOnTypeChange?: boolean;
	leading?: Snippet;
	trailing?: Snippet;
};

type Input = HTMLInputAttributes & { type?: 'password' | 'text' | 'color' | 'email' };
type Textarea = HTMLTextareaAttributes & { type: 'textarea' };

export type InputProps = (Input | Textarea) & CommonInputProps;

export type TranslationsInputProps = InputProps & {
	form: SuperForm<TranslationInsert>['form'];
	prefix?: string;
	currentLang?: SupportedLang;
};
