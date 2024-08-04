import type { ImageSelect } from '$lib/features/image/parsers';

export type ImagePathAndMeta = {
	id: ImageSelect['id'];
	src: string;
	alt: string | null;
	width: number | null;
	height: number | null;
	background: string | null;
};
