<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TextSizes } from './types';

	type Props = {
		size?: TextSizes;
		children: Snippet;
		block?: boolean;
		bold?: boolean;
		tone?: 'default' | 'additional' | 'danger';
	};

	let { size = 'body', tone = 'default', children, block = false, bold = false } = $props<Props>();

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
	class="text global-text-{size} tone-{tone}"
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

	.tone-additional {
		color: var(--color-text-additional);
	}
	.tone-danger {
		color: var(--color-text-danger);
	}
</style>
