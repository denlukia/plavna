import { ACTOR_DATA_PARAM_NAME } from '@denlukia/plavna-common/constants';
import type { ImageProviderRelatedActorData } from '@denlukia/plavna-common/types';
import { json } from '@sveltejs/kit';
import ImageKit from 'imagekit';
import { ERRORS } from '$lib/collections/errors';

export const GET = async ({ locals: { actorService }, url }) => {
	let actorData: ImageProviderRelatedActorData | null = null;

	const actorDataString = url.searchParams.get(ACTOR_DATA_PARAM_NAME);
	if (actorDataString) {
		actorData = JSON.parse(actorDataString) as ImageProviderRelatedActorData;
	} else {
		actorData = await actorService.getOrThrow();
	}

	// TODO: Add image provider type check
	const { imagekit_public_key, imagekit_private_key, imagekit_url_endpoint } = actorData;
	if (imagekit_public_key && imagekit_private_key && imagekit_url_endpoint) {
		const imagekit = new ImageKit({
			publicKey: imagekit_public_key,
			privateKey: imagekit_private_key,
			urlEndpoint: imagekit_url_endpoint
		});
		return json(imagekit.getAuthenticationParameters());
	} else {
		throw Error(ERRORS.IMAGES.INVALID_PROVIDER_CREDS);
	}
};
