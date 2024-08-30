<script lang="ts">
	import { page } from '$app/stores';

	import { getRecordTranslation } from '../i18n/utils';
	import { getImagePathAndMeta } from '../image/utils';
	import type { SectionProp } from '../section/types';
	import type { PreviewComponentType } from './families/types';
	import type { PreviewDataProp } from './types';

	type Props = {
		article: SectionProp['articles'][number];
	};
	let { article }: Props = $props();

	let { meta, tags } = $derived(article);
	let familyId = $derived(article.meta.preview_family);
	let previewFamilies = $derived($page.data.previewFamilies);
	let recordsTranslations = $derived($page.data.recordsTranslations);
	let images = $derived($page.data.images || {});

	let PreviewComponent = $derived(getComponentFromDict('viewer'));

	function getComponentFromDict(type: PreviewComponentType) {
		if (!previewFamilies) return null;
		if (!familyId) return null;
		if (!(familyId in previewFamilies)) return null;

		const previewFamilyObj = previewFamilies[familyId];
		if (!previewFamilyObj) return null;

		return previewFamilyObj.components[type];
	}

	function getPreviewData(): PreviewDataProp {
		return {
			title_translation: getRecordTranslation(meta.title_translation_key, recordsTranslations),
			likes_count: meta.likes_count,
			prop_1: meta.preview_prop_1,
			prop_2: meta.preview_prop_2,
			cols: meta.preview_columns,
			rows: meta.preview_rows,
			translation_1: getRecordTranslation(meta.preview_translation_1_key, recordsTranslations),
			translation_2: getRecordTranslation(meta.preview_translation_2_key, recordsTranslations),
			publish_time: meta.publish_time,
			tags: tags.map((tag) => getRecordTranslation(tag.name_translation_key, recordsTranslations)),

			img_1: getImagePathAndMeta(
				meta.preview_image_1_id,
				$page.data.actor,
				images,
				recordsTranslations
			),
			img_2: getImagePathAndMeta(
				meta.preview_image_2_id,
				$page.data.actor,
				images,
				recordsTranslations
			),
			screenshot: getImagePathAndMeta(
				meta.preview_screenshot_image_id,
				$page.data.actor,
				images,
				recordsTranslations
			)
		};
	}
</script>

<!-- TODO: Edit title to represent loading on button click, add aria description -->
<span class="preview-renderer" role="button" tabindex="0">
	{#if PreviewComponent && !(PreviewComponent instanceof Promise)}
		<PreviewComponent data={getPreviewData()} />
	{:else}
		static component not found
	{/if}
</span>

<style>
	.preview-renderer {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
