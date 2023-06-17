import { addPrefixDotToKeys, nestify } from './utils/objects';
import { z } from 'zod';

import type { SupportedLang } from './languages';
import type { UnionIncludesAll } from './utils/typing';

// Primitives
export const Id = z.number();
export const Translation = z.string().optional();
export const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/g);

// Forms

const langsTemplate = {
	_id: Id,
	uk: Translation,
	en: Translation
};
const _: UnionIncludesAll<keyof typeof langsTemplate, SupportedLang> = true;
const titleTransLangs = addPrefixDotToKeys(langsTemplate, 'title_translation');

export const PostSchema = z
	.object({
		id: Id.optional(),
		slug: Slug.optional()
	})
	.merge(z.object(titleTransLangs));
