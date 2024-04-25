import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { SuperForm } from 'sveltekit-superforms';
import type { TranslationInsert } from '$lib/features/i18n/parsers';

type LanguagedInputProps = {
	translations?: SuperForm<TranslationInsert>['form'];
	translationsPrefix?: string;
};

type Input = HTMLInputAttributes & { type?: 'password' | 'text' | 'color' | 'email' };
type Textarea = HTMLTextareaAttributes & { type: 'textarea' };

export type InputProps = (Input | Textarea) & LanguagedInputProps;
