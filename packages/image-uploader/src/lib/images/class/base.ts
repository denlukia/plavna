import { extractColors } from 'extract-colors';
import ImageKit from 'imagekit-javascript';

import { BYTES_IN_MB, ERRORS, DEFAULT_IMAGEKIT_UPLOAD_CONFIG, PLAVNA_FOLDER } from '../constants';

import { getImageTypeAndSize } from '$lib/probe-image-size';
import {
	HSLToString,
	extractorConfig,
	finalColorToHSL,
	findOptimalColor
} from '$lib/images/colors';
import type {
	ImageProviderRelatedActorData,
	ImgValidationConfig,
	ImageUploadConfig,
	ImagePathUpdateOrDeletion,
	Uploader,
	Provider,
	SizeAndType,
	BaseUploadOptions,
	ClientUploadCredentials
} from '../types';
import { ACTOR_DATA_PARAM_NAME } from '$lib/constants';
import { selectProvider } from '../provider-selector';

export abstract class ImageHandler {
	protected file: File | null = null;
	protected buffer: Buffer | null = null;
	protected arrayBuffer: ArrayBuffer | null = null;
	protected sizeAndType: ReturnType<typeof getImageTypeAndSize> | null = null;
	protected colors: Awaited<ReturnType<typeof extractColors>> | null = null;
	protected bg: string | null = null;
	protected uploader: Uploader | null = null;

	public provider: Provider | null = null;

	public async setProviderAndUploader(
		imageProviderRelatedActorData: ImageProviderRelatedActorData,
		credentialsRequestPath: string
	) {
		const selectedUploader = selectProvider(imageProviderRelatedActorData);
		if (!selectedUploader) {
			throw Error(ERRORS.COULDNT_FIND_ANY_FULL_IMAGE_PROVIDER_CREDENTIALS);
		}

		// Add if selectedUploader.type on new providers
		if (!credentialsRequestPath) {
			throw Error(ERRORS.MISSING_CREDENTIALS_ENDPOINT);
		}

		const credentialsRequestURL = new URL(credentialsRequestPath);
		credentialsRequestURL.searchParams.set(
			ACTOR_DATA_PARAM_NAME,
			JSON.stringify(imageProviderRelatedActorData)
		);

		const res = await fetch(credentialsRequestURL);
		if (!res.ok) {
			throw Error(ERRORS.COULDNT_GET_CLIENT_UPLOAD_CREDENTIALS);
		}
		const credentials: ClientUploadCredentials = await res.json();
		const imagekit = new ImageKit(selectedUploader.adaptedProviderData);
		this.provider = selectedUploader;
		this.uploader = async (options: BaseUploadOptions) => {
			if (this.file instanceof File) {
				const result = await imagekit.upload({
					...options,
					...credentials,
					...DEFAULT_IMAGEKIT_UPLOAD_CONFIG,
					file: this.file
				});
				return { path: result.filePath };
			} else {
				throw Error('Image as File must be present');
			}
		};

		return this;
	}

	public async setImageFromEntry(entry: FormDataEntryValue, config: ImgValidationConfig) {
		// 1. Checking if entry is a file
		if (!(entry instanceof File) || !entry.size) {
			throw new Error(ERRORS.NO_FILE_IN_ENTRY);
		}

		// 2. Checking if file respects constraints
		const arrayBuffer = await new Response(entry).arrayBuffer();
		const sizeAndType = this.checkConstraintsAndGetSizeAndType(arrayBuffer, config);

		// 3. Getting color probe
		const prepared = await this.prepareForColorProbe(entry, sizeAndType);
		if (prepared) {
			const colors = await extractColors(prepared, extractorConfig);
			const bg = this.getBgFromColorProbe(colors);
			this.colors = colors;
			this.bg = bg;
		}

		// 3. Assigning to props if everything is ok
		this.file = entry;
		this.sizeAndType = sizeAndType;

		return this;
	}

	public async upload(config: ImageUploadConfig): Promise<ImagePathUpdateOrDeletion> {
		// 1. Validations
		if (!this.provider || !this.uploader) {
			throw Error(ERRORS.SET_UPLOADER_FROM_USER_FIRST);
		}
		if (!this.sizeAndType) {
			throw Error(ERRORS.FILE_NOT_SET);
		}
		if (!this.file && !this.buffer) {
			throw Error(ERRORS.FILE_NOT_SET);
		}
		// if (!this.bg) {
		// 	throw Error(ERRORS.FILE_NOT_SET);
		// }

		const { lang, imageId: id } = config;
		const folder = `${PLAVNA_FOLDER}/image-${id}/${lang || 'universal'}`;
		const fileName = 'original';
		const { width, height } = this.sizeAndType;
		const source = this.provider.type;

		const { path } = await this.uploader({ folder, fileName });

		return {
			record: {
				id,
				source,
				path,
				width,
				height,
				background: this.bg
			},
			lang
		};
	}

	protected getBgFromColorProbe(colorProbe: Awaited<ReturnType<typeof extractColors>>) {
		const finalColor = findOptimalColor(colorProbe.map((c) => finalColorToHSL(c)));
		if (!finalColor) {
			return null;
		}
		return HSLToString(finalColor);
	}

	protected checkConstraintsAndGetSizeAndType(
		arrayBuffer: ArrayBuffer,
		config: ImgValidationConfig
	) {
		if (arrayBuffer.byteLength >= config.maxSizeMb * BYTES_IN_MB) {
			throw Error(ERRORS.FILE_IS_TOO_BIG);
		}
		const probe = getImageTypeAndSize(arrayBuffer);
		if (!probe || !config.formats.includes(probe.mime)) {
			throw Error(ERRORS.UNSUPPORTED_IMAGE_TYPE);
		}
		return probe;
	}

	protected abstract prepareForColorProbe(
		fileOrBuffer: File | Buffer,
		sizeAndType: SizeAndType
	): Promise<
		| {
				width: number;
				height: number;
				data: number[];
		  }
		| HTMLImageElement
		| null
	>;
}
