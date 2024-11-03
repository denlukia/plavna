<script lang="ts">
	import { flip } from 'svelte/animate';
	import { expoInOut } from 'svelte/easing';
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
			animate:flip={{ duration: 800, easing: expoInOut }}
			in:fade={{ duration: 500, delay: 300 }}
			out:fade={{ duration: 500 }}
		>
			<ArticlePreviewCell {article} />
		</div>
	{/each}
</GridContainer>

<style>
</style>
