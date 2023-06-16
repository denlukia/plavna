import { nestify } from './utils/objects';
import { z } from 'zod';

import type { SupportedLang } from './languages';
import type { UnionIncludesAll } from './utils/typing';

// Primitives
export const Id = z.number();
export const Translation = z.string().optional();
export const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g);

// Forms
const FormLanguages = z.object({
	uk: Translation,
	en: Translation
});
type FormLangs = z.infer<typeof FormLanguages>;
const keysCheck: UnionIncludesAll<keyof FormLangs, SupportedLang> = true;

export const PostEditForm = z.preprocess(
	nestify,
	z.object({
		id: Id.optional(),
		slug: Slug.optional(),
		titleTranslations: FormLanguages
	})
);
