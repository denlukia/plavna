// TODO Put schema and type for that to plavna-common
export type ArticlePreviewScreenshotQuery = {
	width: string;
	height: string;
	lang: 'en' | 'uk';
	preview_prop_1: string | null;
	preview_prop_2: string | null;
	preview_translation_1: string | null;
	preview_translation_2: string | null;
	preview_image_1: string | null;
	preview_image_2: string | null;
};
