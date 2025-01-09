<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { TextSizes, TextTones } from './types';
	import { getGlobalTypographyClass } from './utils';

	type Props = {
		children: Snippet;
		size?: TextSizes;
		resetPadding?: boolean;
		tone?: TextTones;
		bold?: boolean;
		purpose?: 'interface' | 'markdown';
		style?: string;
	};

	let {
		size = 'body',
		tone = 'default',
		purpose = 'interface',
		children,
		resetPadding,
		bold,
		style
	}: Props = $props();

	let outline = $state(false);

	function onkeypress(e: KeyboardEvent) {
		if (e.metaKey && e.code === 'KeyG') {
			outline = !outline;
		}
	}
</script>

<svelte:window {onkeypress} />
<span
	class="text {getGlobalTypographyClass(purpose)} global-text-{size} tone-{tone} {bold
		? `global-text-strong`
		: ''}"
	class:outline
	class:reset-padding={resetPadding}
	{style}
>
	{@render children()}
</span>

<style>
	.text {
		margin: 0;
		display: inline-block;
		padding-inline: var(--text-padding-inline);
		word-break: break-word;
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
