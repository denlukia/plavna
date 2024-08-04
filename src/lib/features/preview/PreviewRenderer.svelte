<script lang="ts">
	import { page } from '$app/stores';
	import type { Component } from 'svelte';

	import { getRecordTranslation } from '../i18n/utils';
	import { getImagePathAndMeta } from '../image/utils';
	import type { SectionProp } from '../section/types';
	import { getPreviewComponent } from './enricher';
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

	let staticComponent = $derived(getComponentFromDict('static'));
	let dynamicComponent: Component<any> | null = $state(null);
	let dynamicComponentShown = $state(false);
	let loadDynamicButtonShown = $state(false);

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

	function onMouseEnterLeave(type: 'enter' | 'leave') {
		const showCondition = article.meta.preview_interactions_show_on;
		if (showCondition === 'hover') {
			dynamicComponentShown = type === 'enter' ? true : false;
		} else if (showCondition === 'click') {
			loadDynamicButtonShown = type === 'enter' ? true : false;
		}
	}

	$effect(() => {
		if (dynamicComponentShown && familyId) {
			getPreviewComponent(familyId, 'dynamic')
				.then((component) => {
					if (component) {
						dynamicComponent = component;
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	});
</script>

<!-- TODO: Edit title to represent loading on button click, add aria description -->
<span
	class="preview-renderer"
	role="button"
	tabindex="0"
	onmouseenter={() => onMouseEnterLeave('enter')}
	onmouseleave={() => onMouseEnterLeave('leave')}
>
	{#if dynamicComponentShown}
		{#if dynamicComponent}
			<svelte:component this={dynamicComponent} data={getPreviewData()} />
		{:else}
			Dynamic component not found
		{/if}
	{:else if staticComponent}
		<svelte:component this={staticComponent} data={getPreviewData()} />
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
