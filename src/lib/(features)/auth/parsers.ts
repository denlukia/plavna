import type { z } from 'zod';
import type { imageProviderUpdateFormSchema } from '$lib/server/collections/parsers';
import type { PartialNonNull } from '$lib/server/helpers/types';

import type { users } from './schemas';

// Types
export type User = typeof users.$inferSelect;
export type UserWithImagekit = PartialNonNull<
	User,
	'imagekit_private_key' | 'imagekit_public_key' | 'imagekit_url_endpoint'
>;
export type ImageProviderUpdateZod = typeof imageProviderUpdateFormSchema;
export type ImageProdiverUpdate = z.infer<typeof imageProviderUpdateFormSchema>;
