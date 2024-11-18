<script lang="ts">
	import BezierEasing from 'bezier-easing';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import GridCell from '$lib/design/components/Grid/GridCell.svelte';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import type { SectionProp } from '../section/types';
	import ArticlePreviewCell from './ArticlePreviewCell.svelte';
	import LoadMore from './LoadMore.svelte';

	type Props = {
		section: SectionProp;
		theresMoreOlder: boolean;
		theresMoreNewer: boolean;
		onMoreArticlesTrigger: (triggerType: 'newer' | 'older') => void;
	};

	let { section, theresMoreNewer, theresMoreOlder, onMoreArticlesTrigger }: Props = $props();

	const easing = BezierEasing(0.25, 0, 0.25, 1);
</script>

<GridContainer direction="column" withPaddingInline>
	{#if theresMoreNewer}
		<GridCell rows={1} cols={1}>
			<LoadMore onLoadMore={() => onMoreArticlesTrigger('newer')} />
		</GridCell>
	{/if}
	{#each section.articles as article (article.meta.id)}
		<div
			class="animate-wrapper"
			animate:flip={{ duration: 500, easing: easing }}
			in:fade={{ duration: 300, delay: 200 }}
			out:fade={{ duration: 300 }}
		>
			<ArticlePreviewCell {article} />
		</div>
	{/each}
	{#if theresMoreOlder}
		<GridCell rows={1} cols={1}>
			<LoadMore onLoadMore={() => onMoreArticlesTrigger('older')} />
		</GridCell>
	{/if}
</GridContainer>

<style>
</style>
