import { ImageHandler } from '@plavna/image-uploader/images';
import type { NdArray, SizeAndType } from '@plavna/image-uploader/images';
import getPixels from 'get-pixels';

export class ServerImageHandler extends ImageHandler {
	protected async prepareForColorProbe(fileOrBuffer: File | Buffer, sizeAndType: SizeAndType) {
		type Pixels = NdArray<Uint8Array>;

		const pixelsPromise = new Promise<Pixels>((resolve, reject) => {
			type Callback = (err: Error | null, pixels: Pixels) => void;
			const callback: Callback = (err, pixels) => {
				if (err) {
					reject(err);
				}
				resolve(pixels);
			};

			if (fileOrBuffer instanceof File) {
				fileOrBuffer.arrayBuffer().then((arrayBuffer) => {
					const buffer = Buffer.from(arrayBuffer);
					getPixels(buffer, sizeAndType.mime, callback);
				});
			} else {
				getPixels(fileOrBuffer, sizeAndType.mime, callback);
			}
		});

		try {
			const pixels = await pixelsPromise;
			const { width, height } = sizeAndType;
			return {
				width,
				height,
				data: Array.from(pixels.data)
			};
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
