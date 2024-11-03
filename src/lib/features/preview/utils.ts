import type { User } from '../auth/parsers';
import type { RecordsTranslationsDict } from '../i18n/types';
import { getRecordTranslation } from '../i18n/utils';
import type { ImagesDict } from '../image/types';
import { getImagePathAndMeta } from '../image/utils';
import type { SectionProp } from '../section/types';
import type { PreviewDataProp } from './types';

export function getPreviewData(
	article: SectionProp['articles'][number],
	recordsTranslations: RecordsTranslationsDict | undefined,
	images: ImagesDict | undefined,
	user: User | null
): PreviewDataProp {
	const { meta, tags } = article;
	return {
		title_translation: getRecordTranslation(meta.title_translation_key, recordsTranslations),
		description_translation: getRecordTranslation(
			meta.description_translation_key,
			recordsTranslations
		),
		likes_count: meta.likes_count,
		prop_1: meta.preview_prop_1,
		prop_2: meta.preview_prop_2,
		cols: meta.preview_columns,
		rows: meta.preview_rows,
		translation_1: getRecordTranslation(meta.preview_translation_1_key, recordsTranslations),
		translation_2: getRecordTranslation(meta.preview_translation_2_key, recordsTranslations),
		publish_time: meta.publish_time,
		tags: tags.map((tag) => getRecordTranslation(tag.name_translation_key, recordsTranslations)),

		img_1: getImagePathAndMeta(meta.preview_image_1_id, user, images, recordsTranslations),
		img_2: getImagePathAndMeta(meta.preview_image_2_id, user, images, recordsTranslations),
		screenshot: getImagePathAndMeta(
			meta.preview_screenshot_image_id,
			user,
			images,
			recordsTranslations
		)
	};
}
