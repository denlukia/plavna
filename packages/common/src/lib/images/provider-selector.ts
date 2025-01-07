import { ImageProviderRelatedActorData } from './types';

export function selectProvider(actorData: ImageProviderRelatedActorData) {
	const { imagekit_public_key, imagekit_private_key, imagekit_url_endpoint } = actorData;
	if (imagekit_public_key && imagekit_private_key && imagekit_url_endpoint) {
		return {
			type: 'imagekit',
			data: { imagekit_public_key, imagekit_private_key, imagekit_url_endpoint },
			adaptedProviderData: {
				publicKey: imagekit_public_key,
				privateKey: imagekit_private_key,
				urlEndpoint: imagekit_url_endpoint
			}
		} as const;
	}

	return null;
}
