import type { ImagePathAndMeta } from '@plavna/design/types';

type Optional<T> = T | null | undefined;

export type PreviewDataProp = {
	title_translation: Optional<string>;
	description_translation: Optional<string>;
	likes_count: number;
	prop_1: string | null;
	prop_2: string | null;
	prop_3: string | null;
	prop_4: string | null;
	cols: number;
	rows: number;
	publish_time: Date | null;
	viewing_in_article: boolean;
	translation_1: Optional<string>;
	translation_2: Optional<string>;
	tags: Array<Optional<string>>;
	img_1: Optional<ImagePathAndMeta>;
	img_2: Optional<ImagePathAndMeta>;
	screenshot?: Optional<ImagePathAndMeta>;
};

export const dynamicPreviewActivationConditions = ['hover', 'click'] as const;
