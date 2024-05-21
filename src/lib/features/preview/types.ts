import type { PreparedImage } from '$lib/design/types';

type Optional<T> = T | null | undefined;

export type PreviewDataProp = {
	title_translation: Optional<string>;
	likes_count: number;
	prop_1: string | null;
	prop_2: string | null;
	translation_1: Optional<string>;
	translation_2: Optional<string>;
	publish_time: Date | null;
	tags: Array<Optional<string>>;
	img_1: Optional<PreparedImage>;
	img_2: Optional<PreparedImage>;
	screenshot?: Optional<PreparedImage>;
};
