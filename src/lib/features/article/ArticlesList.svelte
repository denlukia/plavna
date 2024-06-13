<script lang="ts">
	import { MAX_ROWS_IN_SECTION } from '$lib/collections/constants';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import type { SectionProp } from '../section/types';
	import ArticlePreviewCell from './ArticlePreviewCell.svelte';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<GridContainer direction="column" maxRows={MAX_ROWS_IN_SECTION}>
	{#each section.articles as article (article.meta.id)}
		<ArticlePreviewCell {article} />
	{/each}
</GridContainer>

<style>
</style>
