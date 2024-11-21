import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { atLeastOneTranslationRefiner } from '../i18n/parsers';
import { table_translations } from '../i18n/schema';
import { table_sections, table_sectionsToTags } from './schema';

// Parsers
export const sectionSelectSchema = createSelectSchema(table_sections);
const sectionInsertBase = createSelectSchema(table_translations).omit({
	user_id: true,
	key: true
});
export const sectionInsertSchema = sectionInsertBase.refine(...atLeastOneTranslationRefiner);
const sectionIdentifierObject = {
	section_id: sectionSelectSchema.shape.id
};
export const sectionUpdateSchema = sectionInsertBase
	.extend(sectionIdentifierObject)
	.refine(...atLeastOneTranslationRefiner);

export const sectionDeleteSchema = z.object(sectionIdentifierObject);

export const sectionToTagSelectSchema = createSelectSchema(table_sectionsToTags);
export const sectionToTagInsertSchema = createInsertSchema(table_sectionsToTags);

// Types
export type SectionSelect = z.infer<typeof sectionSelectSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;
export type SectionUpdate = z.infer<typeof sectionUpdateSchema>;
export type SectionDelete = z.infer<typeof sectionDeleteSchema>;

export type SectionToTagSelect = z.infer<typeof sectionToTagSelectSchema>;
export type SectionToTagInsert = z.infer<typeof sectionToTagInsertSchema>;
