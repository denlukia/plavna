import { ServerImageHandler } from '@denlukia/plavna-common';
import { json } from '@sveltejs/kit';

import type { ServerImageProvider } from '@denlukia/plavna-common/images/provider/server.js';

export type ImagekitAuthParams = ReturnType<ServerImageProvider['getAuthenticationParameters']>;

export const GET = async ({ locals }) => {
	const user = await locals.plavna.user.getOrThrow();
	const imageHandler = new ServerImageHandler();
	const provider = imageHandler.setupProvider(user);
	const authParams = provider.getAuthenticationParameters();

	return json(authParams);
};
