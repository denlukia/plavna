<script lang="ts">
	import BezierEasing from 'bezier-easing';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import type { SectionProp } from '../section/types';
	import ArticlePreviewCell from './ArticlePreviewCell.svelte';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();

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
</GridContainer>

<style>
</style>
