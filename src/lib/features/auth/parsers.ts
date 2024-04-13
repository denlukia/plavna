import type { z } from 'zod';
import type { PartialNonNull } from '$lib/features/common/types';

import type { imageProviderUpdateFormSchema } from '../image/parsers';
import type { users } from './schemas';

// Types
export type User = typeof users.$inferSelect;
export type UserWithImagekit = PartialNonNull<
	User,
	'imagekit_private_key' | 'imagekit_public_key' | 'imagekit_url_endpoint'
>;
export type ImageProviderUpdateZod = typeof imageProviderUpdateFormSchema;
export type ImageProviderUpdate = z.infer<typeof imageProviderUpdateFormSchema>;
