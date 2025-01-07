import { ImageHandler } from './base';

export class ClientImageHandler extends ImageHandler {
	protected async prepareForColorProbe(file: File) {
		const img = new Image();
		const dataURL = URL.createObjectURL(file);
		img.src = dataURL;
		await new Promise((resolve, reject) => {
			img.onload = resolve;
			img.onerror = reject;
		});
		return img;
	}
}
