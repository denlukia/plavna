<script lang="ts">
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import GridContainer from '$lib/design/components/Grid/GridContainer.svelte';

	import type { SectionProp } from '../section/types';
	import ArticlePreviewCell from './ArticlePreviewCell.svelte';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<GridContainer direction="column" withPaddingInline>
	{#each section.articles as article (article.meta.id)}
		<div
			class="animate-wrapper"
			animate:flip={{ duration: 300, easing: cubicInOut }}
			in:fade={{ duration: 200, delay: 100 }}
			out:fade={{ duration: 200 }}
		>
			<ArticlePreviewCell {article} />
		</div>
	{/each}
</GridContainer>

<style>
</style>
