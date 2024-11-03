import type { ServerImageHandler } from '@denlukia/plavna-common/images';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { SuperValidated } from 'sveltekit-superforms';
import { z } from 'zod';

import { articleSelectSchema } from '../article/parsers';
import { users } from '../auth/schema';
import { generateLanguagedFields } from '../common/parsers-utils';
import { images } from './schema';

// Images
export const imageFileField = z.optional(z.string());

export const imageSelectSchema = createSelectSchema(images);
export const imageInsertSchema = createInsertSchema(images);
export const imageInsertFormSchema = createInsertSchema(images).omit({
	user_id: true,
	path_translation_key: true
});
export const imageUpdateSchema = imageInsertSchema.partial().required({
	id: true
});
export const imageCreationFormSchema = z.object({
	is_account_common: z.boolean().optional(),
	article_id: articleSelectSchema.shape.id.optional()
});
export const imageUpdateFileFields = {
	image: imageFileField,
	delete_image: z.boolean().optional(),
	...generateLanguagedFields('image', imageFileField),
	...generateLanguagedFields('delete_image', z.boolean().optional())
};
export const imageUpdateFormSchema = imageSelectSchema
	.pick({ id: true })
	.extend(imageUpdateFileFields);
export const imageDeletionFormSchema = imageSelectSchema.pick({ id: true });

// TODO: Refine all slug schema to accept only valid slugs
// TODO: Refine url schema to accept only valid urls
// __UTILITY SCHEMAS__

export const imageProviderUpdateFormSchema = createSelectSchema(users).pick({
	imagekit_private_key: true,
	imagekit_public_key: true,
	imagekit_url_endpoint: true
});
export type ImageProviderSuperValidated = SuperValidated<
	z.infer<typeof imageProviderUpdateFormSchema>
>;

// Images
export type ImageSelect = z.infer<typeof imageSelectSchema>;
export type ImageInsertForm = z.infer<typeof imageInsertFormSchema>;
export type ImageUpdate = z.infer<typeof imageUpdateSchema>;
export type ImageUpdateForm = z.infer<typeof imageUpdateFormSchema>;
export type ImageUpdateFormZod = typeof imageUpdateFormSchema;
export type ImageCollectionItem = {
	form: SuperValidated<ImageUpdateForm>;
	meta: ImageSelect;
};
export type ImageUpdateFileFields = typeof imageUpdateFileFields;
export type ImageCreationForm = z.infer<typeof imageCreationFormSchema>;
export type ImagesCollection = {
	creation: SuperValidated<ImageCreationForm>;
	items: ImageCollectionItem[];
};
export type ImageUpdateImageHandlers = Record<keyof ImageUpdateFileFields, ServerImageHandler>;
