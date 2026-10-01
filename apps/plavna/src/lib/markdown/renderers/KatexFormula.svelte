<script lang="ts">
	import { ScrollEdgeIndicator } from '@plavna/design/components';

	type Props = {
		html?: string;
	};

	let { html = '' }: Props = $props();

	let viewport: HTMLElement | null = $state(null);
	let display = $derived(html.includes('katex-display'));
</script>

{#if display}
	<ScrollEdgeIndicator
		bind:viewportRef={viewport}
		borderTop={false}
		borderBottom={false}
		class="formula-scroll"
	>
		<div class="formula-viewport" bind:this={viewport}>{@html html}</div>
	</ScrollEdgeIndicator>
{:else}
	{@html html}
{/if}

<style>
	:global(.formula-scroll) {
		flex: none;
	}

	.formula-viewport {
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.formula-viewport > :global(.katex-display) {
		max-width: none;
		overflow: visible;
		width: max-content;
	}
</style>
