import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { translations } from '../i18n/schema';
import { tagSelectSchema } from '../tag/parsers';
import { sections, sectionsToTags } from './schema';

// Parsers
export const sectionSelectSchema = createSelectSchema(sections);
export const sectionInsertSchema = createSelectSchema(translations)
	.omit({ user_id: true, key: true })
	.extend({
		section_id: sectionSelectSchema.shape.id
	});
export const sectionUpdateSchema = createSelectSchema(translations).omit({ user_id: true }).extend({
	section_id: sectionSelectSchema.shape.id
});
export const sectionDeleteSchema = sectionUpdateSchema.pick({ section_id: true });

export const sectionToTagSelectSchema = createSelectSchema(sectionsToTags);
export const sectionToTagInsertSchema = createInsertSchema(sectionsToTags);

export const excludedTags = z.record(
	sectionSelectSchema.shape.id,
	z.array(tagSelectSchema.shape.id)
);

// Types
export type SectionSelect = z.infer<typeof sectionSelectSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;
export type SectionUpdate = z.infer<typeof sectionUpdateSchema>;
export type SectionDelete = z.infer<typeof sectionDeleteSchema>;

export type SectionToTagSelect = z.infer<typeof sectionToTagSelectSchema>;
export type SectionToTagInsert = z.infer<typeof sectionToTagInsertSchema>;

export type ExcludedTags = z.infer<typeof excludedTags>;
