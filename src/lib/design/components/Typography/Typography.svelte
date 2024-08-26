<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { TextSizes, TextTones } from './types';

	type Props = {
		children: Snippet;
		size?: TextSizes;
		resetPadding?: boolean;
		tone?: TextTones;
		bold?: boolean;
	};

	let { size = 'body', tone = 'default', children, resetPadding, bold }: Props = $props();

	let outline = $state(false);

	function onkeypress(e: KeyboardEvent) {
		if (e.metaKey && e.code === 'KeyG') {
			outline = !outline;
		}
	}
</script>

<svelte:window {onkeypress} />
<span
	class="text global-text-{size} tone-{tone}"
	class:global-text-strong={bold}
	class:outline
	class:reset-padding={resetPadding}
>
	{@render children()}
</span>

<style>
	.text {
		margin: 0;
		display: inline-block;
		padding-inline: var(--text-padding-inline);
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

	.reset-padding {
		padding-block: 0;
	}
</style>
