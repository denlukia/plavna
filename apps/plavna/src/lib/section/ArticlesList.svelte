<script lang="ts">
	import { GridContainer, InViewTrigger } from '@plavna/design/components';
	import BezierEasing from 'bezier-easing';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';

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
		/* height: 1px; We need it to overflow in the grid */
		width: calc(var(--size-main-grid-padding-inline) - var(--size-cell-gap));
		margin-top: calc(var(--size-cell-gap) * -1);
		margin-left: calc(var(--size-cell-gap) * -1);
	}
</style>
