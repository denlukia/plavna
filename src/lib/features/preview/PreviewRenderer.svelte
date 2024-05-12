<script lang="ts">
	import { page } from '$app/stores';

	import type { ArticleSelect } from '../article/parsers';

	type Props = {
		article: ArticleSelect;
	};

	let { article }: Props = $props();

	let familyId = $derived(article.preview_family);
	let staticComponent = $derived.by(() => {
		const previewFamilies = $page.data.previewFamilies;

		if (!previewFamilies) return null;
		if (!familyId) return null;
		if (!(familyId in previewFamilies)) return null;

		const previewFamilyObj = previewFamilies[familyId];
		if (!previewFamilyObj) return null;

		return previewFamilyObj.components['Static'];
	});
</script>

{#if staticComponent}
	<svelte:component this={staticComponent} {article} />
{:else}
	Static component not found
{/if}
