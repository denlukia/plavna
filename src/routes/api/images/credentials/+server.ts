import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { json } from '@sveltejs/kit';

export type ImagekitAuthParams = ReturnType<ServerImageHandler['getImageKitCredentials']>;

export const GET = async ({ locals: { actorService } }) => {
	const actor = await actorService.getOrThrow();
	const authParams = new ServerImageHandler().getImageKitCredentials(actor);

	return json(authParams);
};
