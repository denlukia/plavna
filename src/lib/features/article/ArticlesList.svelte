<script lang="ts">
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import type { SectionProp } from '../section/types';
	import ArticlePreviewCell from './ArticlePreviewCell.svelte';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<GridContainer direction="column">
	{#each section.articles as article (article.meta.id)}
		<ArticlePreviewCell {article} />
	{/each}
</GridContainer>

<style>
</style>
