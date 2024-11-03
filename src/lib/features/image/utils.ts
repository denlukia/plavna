import type { SupportedLang } from '@denlukia/plavna-common/types';
import { imageSourceToEndpointKeyInUser } from '$lib/collections/constants';
import type { ImagePathAndMeta } from '$lib/design/types';

import type {
	ArticlePreviewImageFileFieldsAll,
	ArticlePreviewImageIdsFields
} from '../article/parsers';
import type { User } from '../auth/parsers';
import type { RecordsTranslationsDict } from '../i18n/types';
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

export function computeSrc(source: ImageSelect['source'], user: User | null, path: string | null) {
	if (!path || !source || !user) return null;

	const endpointKey = imageSourceToEndpointKeyInUser[source];
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

	return `${endpoint}${path}`;
}

export function getImagePathAndMeta(
	imageId: ImageSelect['id'] | null,
	user: User | null,
	images: ImagesDict | undefined,
	recordsTranslations: RecordsTranslationsDict | undefined
): ImagePathAndMeta | null {
	const image = imageId !== null && images && images[imageId];
	if (!image) {
		return null;
	}

	let path: string | null = image.path;
	const translationKey = image.path_translation_key;
	if (translationKey) {
		const pathFromTranslation = getRecordTranslation(translationKey, recordsTranslations) || null;
		if (pathFromTranslation) {
			path = pathFromTranslation;
		}
	}

	const src = computeSrc(image.source, user, path);
	if (!src) {
		return null;
	}

	const { background, height, width } = image;

	const result = {
		id: imageId,
		src,
		alt: null,
		background,
		height,
		width
	};

	return result;
}

export function getLanguagedName(name: string, lang?: SupportedLang | null) {
	return lang ? `${name}.${lang}` : name;
}

export function getLangFromLanguagedName(languagedName: string) {
	return languagedName.includes('.') ? (languagedName.split('.')[1] as SupportedLang) : null;
}

export function getImageById(
	id: ImageSelect['id'] | null | undefined,
	images: ImagesDict | undefined
) {
	if (!id) {
		return null;
	}
	const base = images?.[id];
	if (!base) {
		return null;
	}
	return { id, ...base };
}
