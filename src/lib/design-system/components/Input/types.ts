import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';

type Common = { languaged?: boolean };

type Input = HTMLInputAttributes & { type?: 'password' | 'text' | 'color' | 'email' };
type Textarea = HTMLTextareaAttributes & { type: 'textarea' };

export type LanguagedInputProps = Common & (Input | Textarea);
