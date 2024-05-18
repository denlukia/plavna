type Optional<T> = T | null | undefined;

export type PreviewDataProp = {
	title_translation: Optional<string>;
	likes_count: number;
	prop_1: string | null;
	prop_2: string | null;
	translation_1: Optional<string>;
	translation_2: Optional<string>;
	img_1_src: Optional<string>;
	img_2_src: Optional<string>;
	publish_time: Date | null;
	tags: Optional<string>[];
	screenshot_src?: Optional<string>;
};
