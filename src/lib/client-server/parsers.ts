import { addPrefixDotToKeys } from './utils/objects';
import { z } from 'zod';

import type { SupportedLang } from './languages';
import type { UnionIncludesAll } from './utils/typing';

// Primitives
const postBase = {
	id: z.number().optional(),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g),
	published_at: z.date().nullable()
};
const langsBase = {
	_id: z.number().optional(),
	uk: z.string().optional(),
	en: z.string().optional()
};
const _: UnionIncludesAll<keyof typeof langsBase, SupportedLang> = true;

// Forms
const titleTransLangs = addPrefixDotToKeys(langsBase, 'title_translation');

export const PostFormParser = z.object(postBase).merge(z.object(titleTransLangs));
export const PostParser = z.object({ ...postBase, title_translation: z.object(langsBase) });
export const TranslaltionParser = z.object(langsBase);

export type PostSchema = z.infer<typeof PostParser>;
export type PostWithIdSchema = PostSchema & { id: number; title_translation: { _id: number } };
export type TranslationSchema = z.infer<typeof TranslaltionParser>;
