import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import { translations } from '$lib/server/collections/db-schema';

import { sections } from './schemas';

// Parsers
export const sectionSelectSchema = createSelectSchema(sections);
export const sectionInsertSchema = createInsertSchema(sections);
export const sectionUpdateSchema = createSelectSchema(translations).omit({ user_id: true }).extend({
	section_id: sectionSelectSchema.shape.id
});
export const sectionDeleteSchema = sectionSelectSchema.pick({ id: true });

// Types
export type SectionSelect = z.infer<typeof sectionSelectSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;
export type SectionUpdate = z.infer<typeof sectionUpdateSchema>;
export type SectionDelete = z.infer<typeof sectionDeleteSchema>;
