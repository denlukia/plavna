// import getPixels from 'get-pixels';
// import type { NdArray } from 'ndarray';

// import { ERRORS } from '../constants';
import { ImageHandler } from './base';
import type { SizeAndType } from '../types';

// imagekit-javascript in base class uses XHR for upload
// but Vercel Edge doesn't have it, so we try to polyfill it
import '../xhr-polyfill';

// TODO: get-pixels doesn't work in Vercel Edge,
// so we can look at executing color probe separately in Serverless function
// and use Sharp for that (to support more formats)
export class ServerImageHandler extends ImageHandler {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected async prepareForColorProbe(fileOrBuffer: File | Buffer, sizeAndType: SizeAndType) {
		// 	type Pixels = NdArray<Uint8Array>;

		// 	const pixelsPromise = new Promise<Pixels>((resolve, reject) => {
		// 		type Callback = (err: Error | null, pixels: Pixels) => void;
		// 		const callback: Callback = (err, pixels) => {
		// 			if (err) {
		// 				reject(err);
		// 			}
		// 			resolve(pixels);
		// 		};

		// 		if (fileOrBuffer instanceof File) {
		// 			fileOrBuffer.arrayBuffer().then((arrayBuffer) => {
		// 				const buffer = Buffer.from(arrayBuffer);
		// 				getPixels(buffer, sizeAndType.mime, callback);
		// 			});
		// 		} else {
		// 			getPixels(fileOrBuffer, sizeAndType.mime, callback);
		// 		}
		// 	});

		// 	try {
		// 		const pixels = await pixelsPromise;
		// 		const { width, height } = sizeAndType;
		// 		return {
		// 			width,
		// 			height,
		// 			data: Array.from(pixels.data)
		// 		};
		// 	} catch (err) {
		// 		console.error(err);
		// 		throw Error(ERRORS.COULDNT_GET_PIXELS_FOR_COLOR_PROBE);
		// 	}
		// }

		return null;
	}
}
