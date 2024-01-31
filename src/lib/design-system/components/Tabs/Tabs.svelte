<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		size?: 'body' | 'small';
	};

	let { children, size = 'body' } = $props<Props>();
</script>

<div class="tabs global-fix-overflow global-text-{size}" role="tablist">
	<!-- <div class="active-tab-bg"></div> -->
	{@render children()}
</div>

<style>
	/* General */
	.tabs {
		background: var(--color-tabs-bg);
		box-shadow: var(--shadow-tabs);
		display: flex;
	}

	/* Size-dependent */
	.tabs.global-text-body {
		border-radius: var(--size-tabs-body-border-radius);
		padding: var(--size-tabs-body-padding);
	}
	.tabs.global-text-small {
		border-radius: var(--size-tabs-small-border-radius);
		padding: var(--size-tabs-small-padding);
	}
	.tabs.global-text-body > :global(.tab-item) {
		border-radius: var(--size-tab-item-body-border-radius);
		padding-top: var(--size-tab-item-body-padding-top);
		padding-bottom: var(--size-tab-item-body-padding-bottom);
		padding-inline: var(--size-tab-item-body-padding-inline);
	}
	.tabs.global-text-small > :global(.tab-item) {
		border-radius: var(--size-tab-item-small-border-radius);
		padding-top: var(--size-tab-item-small-padding-top);
		padding-bottom: var(--size-tab-item-small-padding-bottom);
		padding-inline: var(--size-tab-item-small-padding-inline);
	}

	/* .active-tab-bg {
		
	} */
</style>
