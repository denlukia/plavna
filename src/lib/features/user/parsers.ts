import type { z } from 'zod';
import type { PartialNonNull } from '$lib/features/common/types';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import type { imageProviderUpdateFormSchema } from '../image/parsers';
import { users } from './schema';

// Types
export type User = typeof users.$inferSelect;
export type UserWithImagekit = PartialNonNull<
	User,
	'imagekit_private_key' | 'imagekit_public_key' | 'imagekit_url_endpoint'
>;
export type ImageProviderUpdateZod = typeof imageProviderUpdateFormSchema;
export type ImageProviderUpdate = z.infer<typeof imageProviderUpdateFormSchema>;

export const safeUserData = createSelectSchema(users).pick({
	username:true,
	imagekit_url_endpoint: true,
});
export type SafeUserData = z.infer<typeof safeUserData>;


