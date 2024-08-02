import type { ImageSelect } from '$lib/features/image/parsers';

export type PreparedImage = {
	id: ImageSelect['id'];
	src: string;
	alt: string;
	width: number | null;
	height: number | null;
	background: string | null;
};
