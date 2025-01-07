import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';
import type { PartialNonNull } from '$lib/features/common/types';

import type { imageProviderUpdateFormSchema } from '../image/validators';
import { table_users } from './schema';

// Types
export type Actor = typeof table_users.$inferSelect;
export type ActorWithImagekit = PartialNonNull<
	Actor,
	'imagekit_private_key' | 'imagekit_public_key' | 'imagekit_url_endpoint'
>;
export type ImageProviderUpdateZod = typeof imageProviderUpdateFormSchema;
export type ImageProviderUpdate = z.infer<typeof imageProviderUpdateFormSchema>;

export const safeUserData = createSelectSchema(table_users).pick({
	username: true,
	imagekit_url_endpoint: true
});
export type User = z.infer<typeof safeUserData>;

export const userSettingsFormSchema = createSelectSchema(table_users).pick({
	username: true
});
export type UserSettingsUpdate = z.infer<typeof userSettingsFormSchema>;
