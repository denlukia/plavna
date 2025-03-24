export function getResizedSrc(
	src: string,
	{ width, height }: { width?: number | null; height?: number | null }
) {
	if (!width && !height) return src;

	const retinaWidth = width ? width * 2 : null;
	const retinaHeight = height ? height * 2 : null;

	try {
		const url = new URL(src);
		if (url.hostname.includes('imagekit.io')) {
			const parts = url.pathname.split('/');

			const transformPrefix = 'tr:';
			const transformParts = [];
			if (retinaWidth) transformParts.push(`w-${retinaWidth}`);
			if (retinaHeight && !retinaWidth) transformParts.push(`h-${retinaHeight}`);
			const param = transformPrefix + transformParts.join(',');

			const index = parts.findIndex((part) => part.startsWith('tr:'));
			if (index !== -1) {
				parts[index] = param;
			} else {
				parts.splice(2, 0, param);
			}

			url.pathname = parts.join('/');
		}
		return url.toString();
	} catch (e: unknown) {
		console.error('Error getting resized image:', e);
		return src;
	}
}
