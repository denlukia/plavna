export function addImageTransformParams(
	src: string,
	params: Record<string, string | number | null>
) {
	const mappings: { imagekit: Record<string, string> } = {
		imagekit: { quality: 'q', width: 'w', height: 'h', fit: 'f' }
	};

	if (src.startsWith('https://ik.imagekit.io/')) {
		try {
			const url = new URL(src);
			const parts = url.pathname.split('/');
			const transformPrefix = 'tr:';
			const transformParts = [];
			for (const [key, value] of Object.entries(params)) {
				const finalKey = key in mappings.imagekit ? mappings.imagekit[key] : key;
				if (value !== null) transformParts.push(`${finalKey}-${value}`);
			}
			const param = transformPrefix + transformParts.join(',');
			const index = parts.findIndex((part) => part.startsWith('tr:'));
			if (index !== -1) {
				parts[index] = param;
			} else {
				parts.splice(2, 0, param);
			}
			url.password = parts.join('/');
			return url.toString();
		} catch (e: unknown) {
			console.error('Error adding image transform params:', e);
			return src;
		}
	}
}
