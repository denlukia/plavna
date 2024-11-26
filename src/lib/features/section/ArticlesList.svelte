<script lang="ts">
	import BezierEasing from 'bezier-easing';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import InViewTrigger from '../../design/components/InViewTrigger/InViewTrigger.svelte';
	import ArticlePreviewCell from '../article/ArticlePreviewCell.svelte';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
		onEndInView: () => Promise<void>;
		listenForEndInView: boolean;
	};

	let { section, onEndInView, listenForEndInView }: Props = $props();

	const easing = BezierEasing(0.25, 0, 0.25, 1);
</script>

<GridContainer direction="column" withPaddingInline>
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
	<div class="end-padder">
		{#if listenForEndInView}
			<InViewTrigger onInView={onEndInView} />
		{/if}
	</div>
</GridContainer>

<style>
	.end-padder {
		width: calc(var(--size-main-grid-padding-inline) - var(--size-cell-gap));
	}
</style>
