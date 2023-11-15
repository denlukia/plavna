import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { json } from '@sveltejs/kit';

export type ImagekitAuthParams = ReturnType<ServerImageHandler['getImageKitCredentials']>;

export const GET = async ({ locals }) => {
	const user = await locals.plavna.user.getOrThrow();
	const imageHandler = new ServerImageHandler(null);
	const authParams = imageHandler.getImageKitCredentials(user);

	return json(authParams);
};
