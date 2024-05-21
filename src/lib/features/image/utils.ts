import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { User } from 'lucia';
import { imageSourceToEndpointKeyInUser } from '$lib/collections/constants';
import type { PreparedImage } from '$lib/design/types';

import type {
	ArticlePreviewImageFileFieldsAll,
	ArticlePreviewImageIdsFields
} from '../article/parsers';
import type { RecordsTranslations } from '../i18n/types';
import { getRecordTranslation } from '../i18n/utils';
import type { ImageSelect } from './parsers';
import type { ImagesDict } from './types';

export function decomposeImageField(field: keyof ArticlePreviewImageFileFieldsAll) {
	const parts = field.split('.');
	return {
		fieldNameWithIdPrefix: `${parts[0]}_id` as keyof ArticlePreviewImageIdsFields,
		lang: (parts[1] || null) as SupportedLang | null
	};
}

export function prepareImage(
	imageId: ImageSelect['id'] | null,
	user: User | null,
	images: ImagesDict | undefined,
	recordsTranslations: RecordsTranslations | undefined
): PreparedImage | null {
	if (!images || !recordsTranslations || !user || !imageId) {
		return null;
	}

	const image = images[imageId];
	if (!image || !image.source) {
		return null;
	}

	let path: string | null = null;
	const translationKey = image.path_translation_key;
	if (translationKey) {
		let translation = getRecordTranslation(translationKey, recordsTranslations);
		if (translation) {
			path = translation;
		}
	}
	if (!path) {
		path = image.path;
	}
	if (!path) {
		return null;
	}

	let endpointKey = imageSourceToEndpointKeyInUser[image.source];
	let endpoint = user[endpointKey];
	if (!endpoint) {
		return null;
	}

	const lastEndpointSymbol = endpoint[endpoint.length - 1];
	if (lastEndpointSymbol !== '/') {
		endpoint += '/';
	}

	const firstPathSymbol = path[0];
	if (firstPathSymbol === '/') {
		path = path.slice(1);
	}

	return {
		src: `${endpoint}${path}`,
		alt: '', // TODO: Store alt in DB
		background: image.background,
		height: image.height,
		width: image.width
	};
}
