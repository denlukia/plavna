import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
import type { SuperForm } from 'sveltekit-superforms';
import type { TranslationInsert } from '$lib/features/i18n/parsers';

type CommonInputProps = {
	translationsForm?: SuperForm<TranslationInsert>['form'];
	translationsPrefix?: string;
	selectionStart?: number | null;
	selectionEnd?: number | null;
	currentLang?: SupportedLang;
};

type Input = HTMLInputAttributes & { type?: 'password' | 'text' | 'color' | 'email' };
type Textarea = HTMLTextareaAttributes & { type: 'textarea' };

export type InputProps = (Input | Textarea) & CommonInputProps;
