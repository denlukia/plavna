<script lang="ts">
	import { page } from '$app/stores';

	import { getRecordTranslation } from '../i18n/utils';
	import type { SectionProp } from '../section/types';
	import type { PreviewDataProp } from './types';

	type Props = {
		article: SectionProp['articles'][number];
	};

	let { article }: Props = $props();

	let { meta, tags } = $derived(article);

	let familyId = $derived(article.meta.preview_family);
	let staticComponent = $derived.by(() => {
		const previewFamilies = $page.data.previewFamilies;

		if (!previewFamilies) return null;
		if (!familyId) return null;
		if (!(familyId in previewFamilies)) return null;

		const previewFamilyObj = previewFamilies[familyId];
		if (!previewFamilyObj) return null;

		return previewFamilyObj.components['Static'];
	});

	let recordsTranslations = $derived($page.data.recordsTranslations);

	function getPreviewData(article: SectionProp['articles'][number]): PreviewDataProp {
		let didntFind = "Didn't found translation";
		return {
			title_translation:
				getRecordTranslation(meta.title_translation_key, recordsTranslations) || didntFind,
			likes_count: meta.likes_count,
			prop_1: meta.preview_prop_1,
			prop_2: meta.preview_prop_2,
			translation_1:
				getRecordTranslation(meta.preview_translation_1_key, recordsTranslations) || didntFind,
			translation_2:
				getRecordTranslation(meta.preview_translation_2_key, recordsTranslations) || didntFind,
			publish_time: meta.publish_time,
			tags: tags.map(
				(tag) => getRecordTranslation(tag.name_translation_key, recordsTranslations) || didntFind
			),

			// TODO: Make image gathering fn
			img_1_src: '',
			img_2_src: '',
			screenshot_src: ''
		};
	}
</script>

{#if staticComponent}
	<svelte:component this={staticComponent} data={getPreviewData(article)} />
{:else}
	Static component not found
{/if}
