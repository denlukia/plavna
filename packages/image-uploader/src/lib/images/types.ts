import type { getImageTypeAndSize } from '$lib/probe-image-size';
import type { imageMock } from '$lib/queue';

export type ImageSource = 'imagekit';

type SupportedLang = string | null;
type ImageId = typeof imageMock.$inferSelect.id;

export type ImgValidationConfig = {
	formats: string[];
	maxSizeMb: number;
};

export type ImageProviderRelatedActorData = {
	imagekit_public_key: string | null;
	imagekit_private_key: string | null;
	imagekit_url_endpoint: string | null;
};

export type ImageUploadConfig = {
	imageId: ImageId;
	lang: SupportedLang;
};

export type UploadResult = {
	path: string;
};

export type ImagePathUpdateOrDeletion = {
	record:
		| {
				id: ImageId;
				source: ImageSource;
				path: string;
				width: number;
				height: number;
				background: string | null;
		  }
		| { id: ImageId };
	lang: SupportedLang | null;
};

export type BaseUploadOptions = {
	fileName: string;
	folder: string;
};

export type Base64String = string;

export type ClientUploadCredentials = {
	signature: string;
	token: string;
	expire: number;
};

export type Provider = {
	type: ImageSource;
	data: ImageProviderRelatedActorData;
};

export type SizeAndType = NonNullable<ReturnType<typeof getImageTypeAndSize>>;

export type Uploader = (options: BaseUploadOptions) => Promise<UploadResult>;
