import { SUPPORTED_FORMATS } from '$lib/isomorphic/constants';
import type { SupportedLang } from '$lib/isomorphic/languages';
import type { ArticleSelect, ImageSelect, User } from '../collections/types';
import type { DeepPartial } from './typing';
import sizeOf from 'image-size';

type SupportedConfig = {
	formats: string[];
	maxSizeMb: number;
	maxDimensions: { width: number; height: number };
};

type ErrorMessages = {
	isFile: string;
	formats: string;
	maxSizeMb: string;
	maxDimentions: string;
};

export function isFilePresent(entry: FormDataEntryValue | null): entry is File {
	return Boolean(entry && entry instanceof File && entry.size);
}

export async function checkFileSupport(
	image: File,
	supported?: DeepPartial<SupportedConfig>,
	errorMessages?: Partial<ErrorMessages>
) {
	const defaultSupported = {
		formats: Object.keys(SUPPORTED_FORMATS),
		maxSizeMb: 0.25,
		maxDimensions: { width: 512, height: 512 }
	};

	const defaultErrorMessages = {
		isFile: 'Content of the field is not an image file.',
		formats: 'Unsupported file format. Only JPEG, PNG ans WEBP are allowed.',
		maxSizeMb: 'File size exceeds the maximum limit of 250KB.',
		maxDimensions: 'Image dimensions exceed the maximum limit of 512x512.'
	};

	if (!supported) supported = {};
	const finalSupported = {
		...defaultSupported,
		...supported,
		maxDimensions: {
			...defaultSupported.maxDimensions,
			...(supported.maxDimensions || {})
		}
	};
	const finalErrorMessages = { ...defaultErrorMessages, ...(errorMessages || {}) };
	const errors: string[] = [];

	let imageBuffer: Buffer | null = null;

	try {
		const imageArrayBuffer = await new Response(image as Blob).arrayBuffer();
		imageBuffer = Buffer.from(imageArrayBuffer);

		if (!finalSupported.formats.includes(image.type)) {
			errors.push(finalErrorMessages.formats);
		}

		const imageDimensions = await sizeOf(imageBuffer);
		if (
			imageDimensions.width &&
			imageDimensions.height &&
			(imageDimensions.width > finalSupported.maxDimensions.width ||
				imageDimensions.height > finalSupported.maxDimensions.height)
		) {
			errors.push(finalErrorMessages.maxDimensions);
		}

		if (image.size > finalSupported.maxSizeMb * 1024 * 1024) {
			errors.push(finalErrorMessages.maxSizeMb);
		}
	} catch {
		errors.push(finalErrorMessages.isFile);
	}

	if (errors.length === 0 && imageBuffer) {
		return { image: imageBuffer };
	} else return { errors };
}

export function createImagePathAndFilename({
	userId,
	isForPreviewTemplate,
	articleId,
	imageId,
	lang,
	name,
	format
}: {
	userId: User['id'];
	isForPreviewTemplate: boolean;
	articleId?: ArticleSelect['id'];
	imageId: ImageSelect['id'];
	lang?: SupportedLang;
	name?: string;
	format?: string;
}) {
	const userPart = `user-${userId}`;
	const articlePart = isForPreviewTemplate
		? 'preview-templates'
		: articleId
		? `article-${articleId}`
		: 'common';
	const imagePart = `image-${imageId}`;
	const langPart = lang ?? 'universal';
	const namePart = name ?? 'original';
	const formatPart = format ? '.' + format : '';

	return [`plavna/${userPart}/${articlePart}/${imagePart}/${langPart}`, `${namePart}${formatPart}`];
}

export function folderFromPath(path: string) {
	const sections = path.split('/');
	sections.pop();
	sections.pop();
	return sections.join('/');
}
