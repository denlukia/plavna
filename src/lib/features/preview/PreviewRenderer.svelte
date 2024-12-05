<script lang="ts">
	import { page } from '$app/stores';

	import type { SectionProp } from '../section/types';
	import { getPreviewData } from './utils';

	type Props = {
		article: SectionProp['articles'][number];
	};
	let { article }: Props = $props();

	let familyId = $derived(article.meta.preview_family);
	let previewFamilies = $derived($page.data.previewFamiliesState?.value);
	let recordsTranslations = $derived($page.data.recordsTranslationsState?.value);
	let images = $derived($page.data.imagesState?.value);
	let user = $derived($page.data.user);

	let PreviewComponent = $derived(getComponentFromDict());

	function getComponentFromDict() {
		if (!previewFamilies) return null;
		if (!familyId) return null;
		if (!(familyId in previewFamilies)) return null;

		const previewFamilyObj = previewFamilies[familyId];
		if (!previewFamilyObj) return null;

		return previewFamilyObj.components.viewer;
	}
</script>

<!-- TODO: Edit title to represent loading on button click, add aria description -->
<span class="preview-renderer" role="button" tabindex="0">
	{#if PreviewComponent && !(PreviewComponent instanceof Promise)}
		<PreviewComponent data={getPreviewData(article, recordsTranslations, images, user, false)} />
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
