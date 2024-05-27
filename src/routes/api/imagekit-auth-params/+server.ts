import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { json } from '@sveltejs/kit';

export type ImagekitAuthParams = ReturnType<ServerImageHandler['getImageKitCredentials']>;

export const GET = async ({ locals: { actorService } }) => {
	const user = await actorService.getOrThrow();
	const authParams = new ServerImageHandler().getImageKitCredentials(user);

	return json(authParams);
};
