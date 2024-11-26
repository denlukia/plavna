import type { ArticleSelect } from '../article/validators';
import type { RecordsTranslationsDict } from '../i18n/types';
import { getRecordTranslation } from '../i18n/utils';
import type { ImagesDict } from '../image/types';
import { getImagePathAndMeta } from '../image/utils';
import type { SectionProp } from '../section/types';
import type { User } from '../user/validators';
import { previewFamilies } from './families';
import type { PreviewFamiliesDict } from './families/types';
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

const previewDictEntryTemplate = {
	components: { viewer: null, editor: null }
};

export function getPreviewDictEntry(previewFamilyId: NonNullable<ArticleSelect['preview_family']>) {
	if (previewFamilyId === 'custom') {
		return [
			previewFamilyId,
			{
				...previewDictEntryTemplate
			}
		];
	}
	return [previewFamilyId, previewDictEntryTemplate];
}

export function getPreviewFamiliesDict(families: Array<ArticleSelect['preview_family']>) {
	return families.reduce<PreviewFamiliesDict>((acc, family) => {
		if (family !== null && !(family in acc)) {
			const foundFamily = previewFamilies.find((f) => f.id === family);
			if (!foundFamily) return acc;

			const name_translation_key = foundFamily.name_translation_key;
			acc[family] = { ...previewDictEntryTemplate, name_translation_key };
		}

		return acc;
	}, {});
}
