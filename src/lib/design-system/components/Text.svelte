<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		size?:
			| 'heading-1'
			| 'heading-2'
			| 'headline'
			| 'headline-short'
			| 'body'
			| 'body-short'
			| 'small'
			| 'small-short';
		children: Snippet;
		block?: boolean;
		bold?: boolean;
	};

	let { size = 'body', children, block = false, bold = false } = $props<Props>();

	let outline = $state(false);

	function onkeypress(e: KeyboardEvent) {
		if (e.metaKey && e.code === 'KeyG') {
			outline = !outline;
		}
	}
</script>

<svelte:window {onkeypress} />
<svelte:element
	this={block ? 'p' : 'span'}
	class={`text global-text-${size}`}
	class:outline
	class:global-text-bold={bold}
>
	{@render children()}
</svelte:element>

<style>
	.text {
		margin: 0;
		display: inline-block;
	}
	.outline {
		outline: 0.5px solid rgba(0, 128, 0, 0.5);
		outline-offset: -0.5px;
	}
</style>
